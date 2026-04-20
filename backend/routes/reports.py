from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.store import db

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/summary", methods=["GET"])
@jwt_required()
def summary():
    invoices = db["invoices"]
    bookings = db["bookings"]
    inquiries = db["inquiries"]
    
    total_revenue = sum(i.get("advance_paid", 0) for i in invoices)
    pending_revenue = sum(i.get("balance_due", 0) for i in invoices)
    paid_count = len([i for i in invoices if i["payment_status"] == "paid"])
    partial_count = len([i for i in invoices if i["payment_status"] == "partial"])
    unpaid_count = len([i for i in invoices if i["payment_status"] == "unpaid"])

    by_type = {}
    for b in bookings:
        t = b.get("event_type", "other")
        by_type[t] = by_type.get(t, 0) + 1

    inquiry_status = {}
    for i in inquiries:
        s = i.get("status", "new")
        inquiry_status[s] = inquiry_status.get(s, 0) + 1

    top_packages = {}
    for b in bookings:
        p = b.get("package_name", "Unknown")
        top_packages[p] = top_packages.get(p, 0) + 1
    top_packages = [{"name": k, "count": v} for k, v in sorted(top_packages.items(), key=lambda x: -x[1])]

    return jsonify({
        "revenue": {
            "total_collected": total_revenue,
            "pending": pending_revenue,
            "grand_total": total_revenue + pending_revenue,
        },
        "invoices": {
            "paid": paid_count,
            "partial": partial_count,
            "unpaid": unpaid_count,
            "total": len(invoices),
        },
        "bookings_by_type": by_type,
        "inquiry_by_status": inquiry_status,
        "top_packages": top_packages,
        "total_customers": len(db["customers"]),
        "total_corporate_leads": len(db["corporate_leads"]),
        "total_staff": len(db["staff"]),
    })

@reports_bp.route("/testimonials", methods=["GET"])
def testimonials():
    return jsonify(db["testimonials"])
