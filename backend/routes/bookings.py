from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list, json_val

bookings_bp = Blueprint("bookings", __name__)


@bookings_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("status")
    sql = "SELECT * FROM bookings WHERE 1=1"
    params = []
    if status:
        sql += " AND status = %s"; params.append(status)
    sql += " ORDER BY event_date DESC"
    with get_db() as cur:
        cur.execute(sql, params)
        return jsonify(rows_to_list(cur.fetchall()))


@bookings_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM bookings WHERE id = %s", (id,))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@bookings_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d = request.get_json() or {}
    with get_db() as cur:
        cur.execute("""
            INSERT INTO bookings
                (inquiry_id, customer_id, customer_name, event_type,
                 package_id, package_name, event_date, venue, guest_count,
                 meal_preference, status, assigned_staff,
                 total_amount, advance_paid, balance_due, notes)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
        """, (
            d.get("inquiry_id"), d.get("customer_id"), d.get("customer_name"),
            d.get("event_type"), d.get("package_id"), d.get("package_name"),
            d.get("event_date"), d.get("venue"), d.get("guest_count"),
            d.get("meal_preference"), d.get("status", "confirmed"),
            json_val(d.get("assigned_staff", [])),
            d.get("total_amount", 0), d.get("advance_paid", 0),
            d.get("balance_due", 0), d.get("notes"),
        ))
        row = row_to_dict(cur.fetchone())
    return jsonify(row), 201


@bookings_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d = request.get_json() or {}
    allowed = {
        "inquiry_id","customer_id","customer_name","event_type","package_id",
        "package_name","event_date","venue","guest_count","meal_preference",
        "status","total_amount","advance_paid","balance_due","notes",
    }
    sets = {k: v for k, v in d.items() if k in allowed}
    if "assigned_staff" in d:
        sets["assigned_staff"] = json_val(d["assigned_staff"])
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    cols = ", ".join(f"{k} = %s" for k in sets)
    with get_db() as cur:
        cur.execute(f"UPDATE bookings SET {cols} WHERE id = %s RETURNING *",
                    (*sets.values(), id))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@bookings_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    with get_db() as cur:
        cur.execute("DELETE FROM bookings WHERE id = %s RETURNING id", (id,))
        if not cur.fetchone():
            return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
