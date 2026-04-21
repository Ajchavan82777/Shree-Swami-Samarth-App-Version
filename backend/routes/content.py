from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

content_bp = Blueprint("content", __name__)


@content_bp.route("/public", methods=["GET"])
def get_public():
    result = get_sb().table("site_content").select("section, key, value").order("section").order("sort_order").order("key").execute()
    out = {}
    for row in result.data:
        s = row["section"]
        if s not in out:
            out[s] = {}
        out[s][row["key"]] = row["value"]
    return jsonify(out)


@content_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    result = get_sb().table("site_content").select("*").order("section").order("sort_order").order("key").execute()
    return jsonify(result.data)


@content_bp.route("/batch", methods=["POST"])
@jwt_required()
def save_batch():
    items = request.get_json() or []
    sb    = get_sb()
    for item in items:
        section = item.get("section")
        key     = item.get("key")
        value   = item.get("value", "")
        if not section or not key:
            continue
        sb.table("site_content").upsert(
            {"section": section, "key": key, "value": value},
            on_conflict="section,key",
        ).execute()
    return jsonify({"message": "Saved"})


@content_bp.route("/<section>/<key>", methods=["PUT"])
@jwt_required()
def update_one(section, key):
    value  = (request.get_json() or {}).get("value", "")
    result = get_sb().table("site_content").upsert(
        {"section": section, "key": key, "value": value},
        on_conflict="section,key",
    ).execute()
    return jsonify(result.data[0] if result.data else {})
