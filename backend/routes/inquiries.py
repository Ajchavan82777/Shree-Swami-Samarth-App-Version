from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

inquiries_bp = Blueprint("inquiries", __name__)


@inquiries_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status       = request.args.get("status")
    is_corporate = request.args.get("is_corporate")
    query        = get_sb().table("inquiries").select("*")
    if status:
        query = query.eq("status", status)
    if is_corporate == "true":
        query = query.eq("is_corporate", True)
    result = query.order("created_at", desc=True).execute()
    return jsonify(result.data)


@inquiries_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    result = get_sb().table("inquiries").select("*").eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@inquiries_bp.route("/", methods=["POST"])
def create():
    d            = request.get_json() or {}
    is_corporate = d.get("event_type") == "corporate"
    row = {
        "name": d.get("name"), "email": d.get("email"), "phone": d.get("phone"),
        "company_name": d.get("company_name"), "event_type": d.get("event_type"),
        "service_type": d.get("service_type"), "event_date": d.get("event_date"),
        "venue": d.get("venue"), "guest_count": d.get("guest_count"),
        "budget_range": d.get("budget_range"), "meal_preference": d.get("meal_preference"),
        "notes": d.get("notes"), "status": "new", "is_corporate": is_corporate,
    }
    result = get_sb().table("inquiries").insert(row).execute()
    return jsonify(result.data[0]), 201


@inquiries_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d       = request.get_json() or {}
    allowed = {
        "name", "email", "phone", "company_name", "event_type", "service_type",
        "event_date", "venue", "guest_count", "budget_range", "meal_preference",
        "notes", "status", "is_corporate",
    }
    sets = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    result = get_sb().table("inquiries").update(sets).eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@inquiries_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    result = get_sb().table("inquiries").delete().eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
