from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list

inquiries_bp = Blueprint("inquiries", __name__)


@inquiries_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status       = request.args.get("status")
    is_corporate = request.args.get("is_corporate")
    sql = "SELECT * FROM inquiries WHERE 1=1"
    params = []
    if status:
        sql += " AND status = %s"; params.append(status)
    if is_corporate == "true":
        sql += " AND is_corporate = TRUE"
    sql += " ORDER BY created_at DESC"
    with get_db() as cur:
        cur.execute(sql, params)
        return jsonify(rows_to_list(cur.fetchall()))


@inquiries_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM inquiries WHERE id = %s", (id,))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@inquiries_bp.route("/", methods=["POST"])
def create():
    d = request.get_json() or {}
    is_corporate = d.get("event_type") == "corporate"
    with get_db() as cur:
        cur.execute("""
            INSERT INTO inquiries
                (name, email, phone, company_name, event_type, service_type,
                 event_date, venue, guest_count, budget_range, meal_preference,
                 notes, status, is_corporate)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
        """, (
            d.get("name"), d.get("email"), d.get("phone"),
            d.get("company_name"), d.get("event_type"), d.get("service_type"),
            d.get("event_date"), d.get("venue"), d.get("guest_count"),
            d.get("budget_range"), d.get("meal_preference"),
            d.get("notes"), "new", is_corporate,
        ))
        row = row_to_dict(cur.fetchone())
    return jsonify(row), 201


@inquiries_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d = request.get_json() or {}
    allowed = {
        "name","email","phone","company_name","event_type","service_type",
        "event_date","venue","guest_count","budget_range","meal_preference",
        "notes","status","is_corporate",
    }
    sets = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    cols = ", ".join(f"{k} = %s" for k in sets)
    with get_db() as cur:
        cur.execute(f"UPDATE inquiries SET {cols} WHERE id = %s RETURNING *",
                    (*sets.values(), id))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@inquiries_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    with get_db() as cur:
        cur.execute("DELETE FROM inquiries WHERE id = %s RETURNING id", (id,))
        if not cur.fetchone():
            return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
