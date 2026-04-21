from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list, json_val

packages_bp = Blueprint("packages", __name__)


@packages_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    category = request.args.get("category")
    sql = "SELECT * FROM packages WHERE 1=1"
    params = []
    if category:
        sql += " AND category = %s"; params.append(category)
    sql += " ORDER BY id"
    with get_db() as cur:
        cur.execute(sql, params)
        return jsonify(rows_to_list(cur.fetchall()))


@packages_bp.route("/public", methods=["GET"])
def get_public():
    category = request.args.get("category")
    sql = "SELECT * FROM packages WHERE active = TRUE"
    params = []
    if category:
        sql += " AND category = %s"; params.append(category)
    sql += " ORDER BY featured DESC, id"
    with get_db() as cur:
        cur.execute(sql, params)
        return jsonify(rows_to_list(cur.fetchall()))


@packages_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM packages WHERE id = %s", (id,))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@packages_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d = request.get_json() or {}
    with get_db() as cur:
        cur.execute("""
            INSERT INTO packages
                (name, category, price_per_person, min_persons,
                 description, inclusions, featured, active)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
        """, (
            d.get("name"), d.get("category"),
            d.get("price_per_person", 0), d.get("min_persons", 1),
            d.get("description"),
            json_val(d.get("inclusions", [])),
            d.get("featured", False), d.get("active", True),
        ))
        row = row_to_dict(cur.fetchone())
    return jsonify(row), 201


@packages_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d = request.get_json() or {}
    allowed = {"name","category","price_per_person","min_persons","description","featured","active"}
    sets = {k: v for k, v in d.items() if k in allowed}
    if "inclusions" in d:
        sets["inclusions"] = json_val(d["inclusions"])
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    cols = ", ".join(f"{k} = %s" for k in sets)
    with get_db() as cur:
        cur.execute(f"UPDATE packages SET {cols} WHERE id = %s RETURNING *",
                    (*sets.values(), id))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@packages_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    with get_db() as cur:
        cur.execute("DELETE FROM packages WHERE id = %s RETURNING id", (id,))
        if not cur.fetchone():
            return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
