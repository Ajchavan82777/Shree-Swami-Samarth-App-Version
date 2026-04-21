from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, rows_to_list
from datetime import date

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def get_dashboard():
    today = date.today().isoformat()
    with get_db() as cur:
        cur.execute("SELECT COUNT(*) AS n FROM inquiries")
        total_inquiries = cur.fetchone()["n"]

        cur.execute("SELECT COUNT(*) AS n FROM corporate_leads")
        corporate_leads = cur.fetchone()["n"]

        cur.execute("SELECT COUNT(*) AS n FROM bookings")
        total_bookings = cur.fetchone()["n"]

        cur.execute("""
            SELECT COUNT(*) AS n FROM bookings
            WHERE event_date >= %s AND status != 'cancelled'
        """, (today,))
        upcoming_count = cur.fetchone()["n"]

        cur.execute("""
            SELECT COALESCE(SUM(balance_due), 0) AS n FROM invoices
            WHERE payment_status IN ('unpaid', 'partial')
        """)
        pending_amount = float(cur.fetchone()["n"])

        cur.execute("SELECT COALESCE(SUM(advance_paid), 0) AS n FROM invoices")
        total_revenue = float(cur.fetchone()["n"])

        cur.execute("""
            SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5
        """)
        recent_inquiries = rows_to_list(cur.fetchall())

        cur.execute("""
            SELECT * FROM invoices ORDER BY created_at DESC LIMIT 5
        """)
        recent_invoices = rows_to_list(cur.fetchall())

        cur.execute("""
            SELECT * FROM bookings
            WHERE event_date >= %s AND status != 'cancelled'
            ORDER BY event_date ASC LIMIT 5
        """, (today,))
        upcoming_events = rows_to_list(cur.fetchall())

    return jsonify({
        "summary": {
            "total_inquiries": total_inquiries,
            "corporate_leads": corporate_leads,
            "total_bookings": total_bookings,
            "upcoming_events": upcoming_count,
            "pending_amount": pending_amount,
            "total_revenue": total_revenue,
        },
        "recent_inquiries": recent_inquiries,
        "recent_invoices": recent_invoices,
        "upcoming_events": upcoming_events,
    })
