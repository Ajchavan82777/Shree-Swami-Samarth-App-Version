from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb
from collections import Counter

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/summary", methods=["GET"])
@jwt_required()
def summary():
    sb = get_sb()

    inv_data = sb.table("invoices").select("payment_status, advance_paid, balance_due, grand_total").execute().data
    total_collected = sum(float(r.get("advance_paid") or 0) for r in inv_data)
    pending         = sum(float(r.get("balance_due")  or 0) for r in inv_data)
    grand_total_sum = sum(float(r.get("grand_total")  or 0) for r in inv_data)
    inv_counts      = dict(Counter(r.get("payment_status", "unpaid") for r in inv_data))

    booking_data    = sb.table("bookings").select("event_type, package_name").execute().data
    bookings_by_type = dict(Counter(b.get("event_type", "other") for b in booking_data))
    pkg_counts       = Counter(b["package_name"] for b in booking_data if b.get("package_name"))
    top_packages     = [{"name": k, "count": v} for k, v in pkg_counts.most_common(10)]

    inq_data          = sb.table("inquiries").select("status").execute().data
    inquiry_by_status = dict(Counter(i.get("status", "new") for i in inq_data))

    total_customers       = sb.table("customers").select("id", count="exact").execute().count or 0
    total_corporate_leads = sb.table("corporate_leads").select("id", count="exact").execute().count or 0
    total_staff           = sb.table("staff").select("id", count="exact").execute().count or 0

    return jsonify({
        "revenue": {
            "total_collected": total_collected,
            "pending":         pending,
            "grand_total":     grand_total_sum,
        },
        "invoices": {
            "paid":    inv_counts.get("paid",    0),
            "partial": inv_counts.get("partial", 0),
            "unpaid":  inv_counts.get("unpaid",  0),
            "total":   len(inv_data),
        },
        "bookings_by_type":      bookings_by_type,
        "inquiry_by_status":     inquiry_by_status,
        "top_packages":          top_packages,
        "total_customers":       total_customers,
        "total_corporate_leads": total_corporate_leads,
        "total_staff":           total_staff,
    })


@reports_bp.route("/testimonials", methods=["GET"])
def testimonials():
    result = get_sb().table("testimonials").select("*").eq("approved", True).order("created_at", desc=True).execute()
    return jsonify(result.data)
