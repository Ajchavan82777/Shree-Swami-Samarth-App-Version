from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list

customers_bp = Blueprint("customers", __name__)


@customers_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    with get_db() as cur:
        cur.execute("SELECT * FROM customers ORDER BY created_at DESC")
        return jsonify(rows_to_list(cur.fetchall()))


@customers_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM customers WHERE id = %s", (id,))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@customers_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d = request.get_json() or {}
    with get_db() as cur:
        cur.execute("""
            INSERT INTO customers (name, email, phone, type, company, city, total_bookings, total_spent)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
        """, (
            d.get("name"), d.get("email"), d.get("phone"),
            d.get("type", "individual"), d.get("company"), d.get("city"),
            d.get("total_bookings", 0), d.get("total_spent", 0),
        ))
        row = row_to_dict(cur.fetchone())
    return jsonify(row), 201


@customers_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d = request.get_json() or {}
    allowed = {"name", "email", "phone", "type", "company", "city", "total_bookings", "total_spent"}
    sets = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    cols = ", ".join(f"{k} = %s" for k in sets)
    with get_db() as cur:
        cur.execute(f"UPDATE customers SET {cols} WHERE id = %s RETURNING *",
                    (*sets.values(), id))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@customers_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    with get_db() as cur:
        cur.execute("DELETE FROM customers WHERE id = %s RETURNING id", (id,))
        if not cur.fetchone():
            return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
