from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list

staff_bp = Blueprint("staff", __name__)


@staff_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    role = request.args.get("role")
    sql = "SELECT * FROM staff WHERE 1=1"
    params = []
    if role:
        sql += " AND role = %s"; params.append(role)
    sql += " ORDER BY name"
    with get_db() as cur:
        cur.execute(sql, params)
        return jsonify(rows_to_list(cur.fetchall()))


@staff_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM staff WHERE id = %s", (id,))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@staff_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d = request.get_json() or {}
    with get_db() as cur:
        cur.execute("""
            INSERT INTO staff (name, role, phone, email, active)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
        """, (
            d.get("name"), d.get("role"),
            d.get("phone"), d.get("email"),
            d.get("active", True),
        ))
        row = row_to_dict(cur.fetchone())
    return jsonify(row), 201


@staff_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d = request.get_json() or {}
    allowed = {"name", "role", "phone", "email", "active"}
    sets = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    cols = ", ".join(f"{k} = %s" for k in sets)
    with get_db() as cur:
        cur.execute(f"UPDATE staff SET {cols} WHERE id = %s RETURNING *",
                    (*sets.values(), id))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@staff_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    with get_db() as cur:
        cur.execute("DELETE FROM staff WHERE id = %s RETURNING id", (id,))
        if not cur.fetchone():
            return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
