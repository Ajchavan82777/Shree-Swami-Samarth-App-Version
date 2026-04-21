from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

customers_bp = Blueprint("customers", __name__)


@customers_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    result = get_sb().table("customers").select("*").order("created_at", desc=True).execute()
    return jsonify(result.data)


@customers_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    result = get_sb().table("customers").select("*").eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@customers_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d   = request.get_json() or {}
    row = {
        "name": d.get("name"), "email": d.get("email"), "phone": d.get("phone"),
        "type": d.get("type", "individual"), "company": d.get("company"),
        "city": d.get("city"), "total_bookings": d.get("total_bookings", 0),
        "total_spent": d.get("total_spent", 0),
    }
    result = get_sb().table("customers").insert(row).execute()
    return jsonify(result.data[0]), 201


@customers_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d       = request.get_json() or {}
    allowed = {"name", "email", "phone", "type", "company", "city", "total_bookings", "total_spent"}
    sets    = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    result = get_sb().table("customers").update(sets).eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@customers_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    result = get_sb().table("customers").delete().eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
