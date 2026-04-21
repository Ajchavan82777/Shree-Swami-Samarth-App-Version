from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.db import get_sb
from datetime import date, timedelta

dashboard_bp = Blueprint("dashboard", __name__)


def get_period_range(period):
    """Return (start_date_iso, end_date_iso) for the requested period, or (None, None) for 'all'."""
    today = date.today()
    if period == "today":
        return today.isoformat(), today.isoformat()
    elif period == "week":
        start = today - timedelta(days=today.weekday())
        return start.isoformat(), today.isoformat()
    elif period == "month":
        return today.replace(day=1).isoformat(), today.isoformat()
    elif period == "year":
        return today.replace(month=1, day=1).isoformat(), today.isoformat()
    return None, None  # all


@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def get_dashboard():
    today  = date.today().isoformat()
    sb     = get_sb()
    period = request.args.get("period", "all")
    start, _end = get_period_range(period)

    # ── Summary counts (period-aware) ────────────────────────────────────────

    inq_q = sb.table("inquiries").select("id", count="exact")
    if start:
        inq_q = inq_q.gte("created_at", start + "T00:00:00")
    total_inquiries = inq_q.execute().count or 0

    # corporate_leads has no created_at filter (kept unfiltered for period view)
    corporate_leads = sb.table("corporate_leads").select("id", count="exact").execute().count or 0

    bkg_q = sb.table("bookings").select("id", count="exact")
    if start:
        bkg_q = bkg_q.gte("created_at", start + "T00:00:00")
    total_bookings = bkg_q.execute().count or 0

    upcoming_count = (
        sb.table("bookings").select("id", count="exact")
        .gte("event_date", today).neq("status", "cancelled").execute().count or 0
    )

    # ── Invoice summary (period-aware) ───────────────────────────────────────

    inv_all_q = sb.table("invoices").select("id, advance_paid, balance_due, payment_status")
    if start:
        inv_all_q = inv_all_q.gte("created_at", start + "T00:00:00")
    inv_all_data = inv_all_q.execute().data

    total_invoices   = len(inv_all_data)
    paid_invoices    = sum(1 for r in inv_all_data if r.get("payment_status") == "paid")
    unpaid_invoices  = sum(1 for r in inv_all_data if r.get("payment_status") in ("unpaid", "partial"))
    pending_amount   = sum(float(r.get("balance_due") or 0) for r in inv_all_data if r.get("payment_status") in ("unpaid", "partial"))
    total_revenue    = sum(float(r.get("advance_paid") or 0) for r in inv_all_data)

    # ── Quotation count (period-aware) ───────────────────────────────────────

    quot_q = sb.table("quotations").select("id", count="exact")
    if start:
        quot_q = quot_q.gte("created_at", start + "T00:00:00")
    try:
        total_quotations = quot_q.execute().count or 0
    except Exception:
        total_quotations = 0

    # ── Recent / upcoming (always unfiltered, last 5 / next 5) ───────────────

    recent_inquiries = (
        sb.table("inquiries").select("*")
        .order("created_at", desc=True).limit(5).execute().data
    )
    recent_invoices = (
        sb.table("invoices").select("*")
        .order("created_at", desc=True).limit(5).execute().data
    )
    upcoming_events = (
        sb.table("bookings").select("*")
        .gte("event_date", today).neq("status", "cancelled")
        .order("event_date").limit(5).execute().data
    )

    # ── All events for calendar (past 6 months + future) ────────────────────

    from datetime import date as _d
    cal_start = (_d.today().replace(day=1) - timedelta(days=180)).isoformat()
    all_events = (
        sb.table("bookings")
        .select("id, event_date, event_end_date, customer_name, event_type, status, venue, total_amount")
        .gte("event_date", cal_start)
        .order("event_date").limit(500).execute().data
    )

    # ── Pipeline status counts (replaces 3 separate frontend API calls) ──────

    def count_by(rows, field):
        c = {}
        for r in rows:
            v = r.get(field) or "unknown"
            c[v] = c.get(v, 0) + 1
        return c

    inq_all  = sb.table("inquiries").select("status").execute().data or []
    inv_stat = sb.table("invoices").select("payment_status").execute().data or []
    bk_all   = sb.table("bookings").select("status").execute().data or []

    pipeline = {
        "inquiry_status": count_by(inq_all,  "status"),
        "invoice_status": count_by(inv_stat, "payment_status"),
        "booking_status": count_by(bk_all,   "status"),
        "total_inquiries_all": len(inq_all),
        "total_invoices_all":  len(inv_stat),
        "total_bookings_all":  len(bk_all),
    }

    return jsonify({
        "summary": {
            "total_inquiries":  total_inquiries,
            "corporate_leads":  corporate_leads,
            "total_bookings":   total_bookings,
            "upcoming_events":  upcoming_count,
            "pending_amount":   pending_amount,
            "total_revenue":    total_revenue,
            "total_invoices":   total_invoices,
            "paid_invoices":    paid_invoices,
            "unpaid_invoices":  unpaid_invoices,
            "total_quotations": total_quotations,
        },
        "recent_inquiries": recent_inquiries,
        "recent_invoices":  recent_invoices,
        "upcoming_events":  upcoming_events,
        "all_events":       all_events,
        "pipeline":         pipeline,
        "period":           period,
    })
