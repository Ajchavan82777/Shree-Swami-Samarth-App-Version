from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list

content_bp = Blueprint("content", __name__)


@content_bp.route("/public", methods=["GET"])
def get_public():
    """Returns all content as nested {section: {key: value}} — no auth required."""
    with get_db() as cur:
        cur.execute("""
            SELECT section, key, value FROM site_content
            ORDER BY section, sort_order, key
        """)
        rows = cur.fetchall()
    result = {}
    for row in rows:
        s = row["section"]
        if s not in result:
            result[s] = {}
        result[s][row["key"]] = row["value"]
    return jsonify(result)


@content_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    with get_db() as cur:
        cur.execute("SELECT * FROM site_content ORDER BY section, sort_order, key")
        return jsonify(rows_to_list(cur.fetchall()))


@content_bp.route("/batch", methods=["POST"])
@jwt_required()
def save_batch():
    """Upsert a list of {section, key, value} items."""
    items = request.get_json() or []
    with get_db() as cur:
        for item in items:
            section = item.get("section")
            key = item.get("key")
            value = item.get("value", "")
            if not section or not key:
                continue
            cur.execute("""
                INSERT INTO site_content (section, key, value, updated_at)
                VALUES (%s, %s, %s, NOW())
                ON CONFLICT (section, key) DO UPDATE
                SET value = EXCLUDED.value, updated_at = NOW()
            """, (section, key, value))
    return jsonify({"message": "Saved"})


@content_bp.route("/<section>/<key>", methods=["PUT"])
@jwt_required()
def update_one(section, key):
    value = (request.get_json() or {}).get("value", "")
    with get_db() as cur:
        cur.execute("""
            INSERT INTO site_content (section, key, value, updated_at)
            VALUES (%s, %s, %s, NOW())
            ON CONFLICT (section, key) DO UPDATE
            SET value = EXCLUDED.value, updated_at = NOW()
            RETURNING *
        """, (section, key, value))
        row = row_to_dict(cur.fetchone())
    return jsonify(row)
