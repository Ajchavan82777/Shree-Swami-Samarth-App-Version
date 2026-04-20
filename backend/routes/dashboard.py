from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.store import db
from datetime import datetime, date

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def get_dashboard():
    today = date.today().isoformat()
    
    total_inquiries = len(db["inquiries"])
    corporate_leads = len(db["corporate_leads"])
    total_bookings = len(db["bookings"])
    
    upcoming = [b for b in db["bookings"] if b.get("event_date", "") >= today and b["status"] != "cancelled"]
    pending_invoices = [i for i in db["invoices"] if i["payment_status"] in ["unpaid", "partial"]]
    pending_amount = sum(i["balance_due"] for i in pending_invoices)
    
    total_revenue = sum(i["advance_paid"] for i in db["invoices"])
    
    recent_inquiries = sorted(db["inquiries"], key=lambda x: x["created_at"], reverse=True)[:5]
    recent_invoices = sorted(db["invoices"], key=lambda x: x["created_at"], reverse=True)[:5]
    
    return jsonify({
        "summary": {
            "total_inquiries": total_inquiries,
            "corporate_leads": corporate_leads,
            "total_bookings": total_bookings,
            "upcoming_events": len(upcoming),
            "pending_amount": pending_amount,
            "total_revenue": total_revenue,
        },
        "recent_inquiries": recent_inquiries,
        "recent_invoices": recent_invoices,
        "upcoming_events": upcoming[:5],
    })
