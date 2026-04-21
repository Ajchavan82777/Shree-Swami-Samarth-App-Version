from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

corporate_bp = Blueprint("corporate", __name__)


@corporate_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("status")
    query  = get_sb().table("corporate_leads").select("*")
    if status:
        query = query.eq("status", status)
    result = query.order("created_at", desc=True).execute()
    return jsonify(result.data)


@corporate_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    result = get_sb().table("corporate_leads").select("*").eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@corporate_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d   = request.get_json() or {}
    row = {
        "company_name": d.get("company_name"), "contact_name": d.get("contact_name"),
        "email": d.get("email"), "phone": d.get("phone"), "city": d.get("city"),
        "employees": d.get("employees"), "service_type": d.get("service_type"),
        "monthly_value": d.get("monthly_value"), "status": d.get("status", "prospect"),
        "contract_start": d.get("contract_start"), "contract_end": d.get("contract_end"),
        "billing_cycle": d.get("billing_cycle", "monthly"), "notes": d.get("notes"),
    }
    result = get_sb().table("corporate_leads").insert(row).execute()
    return jsonify(result.data[0]), 201


@corporate_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d       = request.get_json() or {}
    allowed = {
        "company_name", "contact_name", "email", "phone", "city", "employees",
        "service_type", "monthly_value", "status", "contract_start",
        "contract_end", "billing_cycle", "notes",
    }
    sets = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    result = get_sb().table("corporate_leads").update(sets).eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@corporate_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    result = get_sb().table("corporate_leads").delete().eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
