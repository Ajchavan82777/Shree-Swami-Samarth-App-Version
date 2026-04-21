from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list

corporate_bp = Blueprint("corporate", __name__)


@corporate_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("status")
    sql = "SELECT * FROM corporate_leads WHERE 1=1"
    params = []
    if status:
        sql += " AND status = %s"; params.append(status)
    sql += " ORDER BY created_at DESC"
    with get_db() as cur:
        cur.execute(sql, params)
        return jsonify(rows_to_list(cur.fetchall()))


@corporate_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM corporate_leads WHERE id = %s", (id,))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@corporate_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d = request.get_json() or {}
    with get_db() as cur:
        cur.execute("""
            INSERT INTO corporate_leads
                (company_name, contact_name, email, phone, city, employees,
                 service_type, monthly_value, status, contract_start,
                 contract_end, billing_cycle, notes)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
        """, (
            d.get("company_name"), d.get("contact_name"), d.get("email"),
            d.get("phone"), d.get("city"), d.get("employees"),
            d.get("service_type"), d.get("monthly_value"),
            d.get("status", "prospect"),
            d.get("contract_start"), d.get("contract_end"),
            d.get("billing_cycle", "monthly"), d.get("notes"),
        ))
        row = row_to_dict(cur.fetchone())
    return jsonify(row), 201


@corporate_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d = request.get_json() or {}
    allowed = {
        "company_name","contact_name","email","phone","city","employees",
        "service_type","monthly_value","status","contract_start",
        "contract_end","billing_cycle","notes",
    }
    sets = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    cols = ", ".join(f"{k} = %s" for k in sets)
    with get_db() as cur:
        cur.execute(f"UPDATE corporate_leads SET {cols} WHERE id = %s RETURNING *",
                    (*sets.values(), id))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@corporate_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    with get_db() as cur:
        cur.execute("DELETE FROM corporate_leads WHERE id = %s RETURNING id", (id,))
        if not cur.fetchone():
            return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
