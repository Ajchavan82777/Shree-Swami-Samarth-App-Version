from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, rows_to_list

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/summary", methods=["GET"])
@jwt_required()
def summary():
    with get_db() as cur:
        cur.execute("""
            SELECT
                COALESCE(SUM(advance_paid), 0)  AS total_collected,
                COALESCE(SUM(balance_due),  0)  AS pending,
                COALESCE(SUM(grand_total),  0)  AS grand_total_sum
            FROM invoices
        """)
        rev = cur.fetchone()

        cur.execute("""
            SELECT payment_status, COUNT(*) AS cnt
            FROM invoices GROUP BY payment_status
        """)
        inv_rows = cur.fetchall()
        inv_counts = {r["payment_status"]: r["cnt"] for r in inv_rows}

        cur.execute("""
            SELECT event_type, COUNT(*) AS cnt
            FROM bookings GROUP BY event_type
        """)
        bookings_by_type = {r["event_type"]: r["cnt"] for r in cur.fetchall()}

        cur.execute("""
            SELECT status, COUNT(*) AS cnt
            FROM inquiries GROUP BY status
        """)
        inquiry_by_status = {r["status"]: r["cnt"] for r in cur.fetchall()}

        cur.execute("""
            SELECT package_name AS name, COUNT(*) AS count
            FROM bookings WHERE package_name IS NOT NULL
            GROUP BY package_name ORDER BY count DESC LIMIT 10
        """)
        top_packages = rows_to_list(cur.fetchall())

        cur.execute("SELECT COUNT(*) AS n FROM customers")
        total_customers = cur.fetchone()["n"]

        cur.execute("SELECT COUNT(*) AS n FROM corporate_leads")
        total_corporate_leads = cur.fetchone()["n"]

        cur.execute("SELECT COUNT(*) AS n FROM staff")
        total_staff = cur.fetchone()["n"]

    return jsonify({
        "revenue": {
            "total_collected": float(rev["total_collected"]),
            "pending":         float(rev["pending"]),
            "grand_total":     float(rev["grand_total_sum"]),
        },
        "invoices": {
            "paid":    inv_counts.get("paid",    0),
            "partial": inv_counts.get("partial", 0),
            "unpaid":  inv_counts.get("unpaid",  0),
            "total":   sum(inv_counts.values()),
        },
        "bookings_by_type":    bookings_by_type,
        "inquiry_by_status":   inquiry_by_status,
        "top_packages":        top_packages,
        "total_customers":     total_customers,
        "total_corporate_leads": total_corporate_leads,
        "total_staff":         total_staff,
    })


@reports_bp.route("/testimonials", methods=["GET"])
def testimonials():
    with get_db() as cur:
        cur.execute("""
            SELECT * FROM testimonials
            WHERE approved = TRUE ORDER BY created_at DESC
        """)
        return jsonify(rows_to_list(cur.fetchall()))
