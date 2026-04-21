from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb
from datetime import date

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def get_dashboard():
    today = date.today().isoformat()
    sb    = get_sb()

    total_inquiries = sb.table("inquiries").select("id", count="exact").execute().count or 0
    corporate_leads = sb.table("corporate_leads").select("id", count="exact").execute().count or 0
    total_bookings  = sb.table("bookings").select("id", count="exact").execute().count or 0

    upcoming_count = (
        sb.table("bookings").select("id", count="exact")
        .gte("event_date", today).neq("status", "cancelled").execute().count or 0
    )

    inv_pending    = sb.table("invoices").select("balance_due").in_("payment_status", ["unpaid", "partial"]).execute()
    pending_amount = sum(float(r.get("balance_due") or 0) for r in inv_pending.data)

    inv_all       = sb.table("invoices").select("advance_paid").execute()
    total_revenue = sum(float(r.get("advance_paid") or 0) for r in inv_all.data)

    recent_inquiries = sb.table("inquiries").select("*").order("created_at", desc=True).limit(5).execute().data
    recent_invoices  = sb.table("invoices").select("*").order("created_at", desc=True).limit(5).execute().data
    upcoming_events  = (
        sb.table("bookings").select("*")
        .gte("event_date", today).neq("status", "cancelled")
        .order("event_date").limit(5).execute().data
    )

    return jsonify({
        "summary": {
            "total_inquiries": total_inquiries,
            "corporate_leads": corporate_leads,
            "total_bookings":  total_bookings,
            "upcoming_events": upcoming_count,
            "pending_amount":  pending_amount,
            "total_revenue":   total_revenue,
        },
        "recent_inquiries": recent_inquiries,
        "recent_invoices":  recent_invoices,
        "upcoming_events":  upcoming_events,
    })
