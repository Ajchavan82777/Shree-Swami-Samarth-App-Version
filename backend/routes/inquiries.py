from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.store import db, next_id, now, find_by_id, find_index

inquiries_bp = Blueprint("inquiries", __name__)

@inquiries_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("status")
    is_corporate = request.args.get("is_corporate")
    items = db["inquiries"]
    if status:
        items = [i for i in items if i["status"] == status]
    if is_corporate == "true":
        items = [i for i in items if i.get("is_corporate")]
    return jsonify(sorted(items, key=lambda x: x["created_at"], reverse=True))

@inquiries_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    item = find_by_id("inquiries", id)
    if not item:
        return jsonify({"message": "Not found"}), 404
    return jsonify(item)

@inquiries_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    item = {
        "id": next_id("inquiry"),
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "company_name": data.get("company_name"),
        "event_type": data.get("event_type"),
        "service_type": data.get("service_type"),
        "event_date": data.get("event_date"),
        "venue": data.get("venue"),
        "guest_count": data.get("guest_count"),
        "budget_range": data.get("budget_range"),
        "meal_preference": data.get("meal_preference"),
        "notes": data.get("notes"),
        "status": "new",
        "is_corporate": data.get("event_type") == "corporate",
        "created_at": now(),
    }
    db["inquiries"].append(item)
    return jsonify(item), 201

@inquiries_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    idx = find_index("inquiries", id)
    if idx == -1:
        return jsonify({"message": "Not found"}), 404
    data = request.get_json()
    db["inquiries"][idx].update(data)
    return jsonify(db["inquiries"][idx])

@inquiries_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    idx = find_index("inquiries", id)
    if idx == -1:
        return jsonify({"message": "Not found"}), 404
    db["inquiries"].pop(idx)
    return jsonify({"message": "Deleted"})
