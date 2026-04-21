from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

staff_bp = Blueprint("staff", __name__)


@staff_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    role   = request.args.get("role")
    query  = get_sb().table("staff").select("*")
    if role:
        query = query.eq("role", role)
    result = query.order("name").execute()
    return jsonify(result.data)


@staff_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    result = get_sb().table("staff").select("*").eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@staff_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d   = request.get_json() or {}
    row = {
        "name": d.get("name"), "role": d.get("role"),
        "phone": d.get("phone"), "email": d.get("email"),
        "active": d.get("active", True),
    }
    result = get_sb().table("staff").insert(row).execute()
    return jsonify(result.data[0]), 201


@staff_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d       = request.get_json() or {}
    allowed = {"name", "role", "phone", "email", "active"}
    sets    = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    result = get_sb().table("staff").update(sets).eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@staff_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    result = get_sb().table("staff").delete().eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
