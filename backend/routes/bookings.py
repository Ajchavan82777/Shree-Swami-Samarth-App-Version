from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.store import db, next_id, now, find_by_id, find_index

bookings_bp = Blueprint("bookings", __name__)

@bookings_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("status")
    items = db["bookings"]
    if status:
        items = [i for i in items if i["status"] == status]
    return jsonify(sorted(items, key=lambda x: x.get("event_date", ""), reverse=True))

@bookings_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    item = find_by_id("bookings", id)
    if not item: return jsonify({"message": "Not found"}), 404
    return jsonify(item)

@bookings_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    item = {**data, "id": next_id("booking"), "status": data.get("status", "confirmed"), "created_at": now()}
    db["bookings"].append(item)
    return jsonify(item), 201

@bookings_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    idx = find_index("bookings", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["bookings"][idx].update(request.get_json())
    return jsonify(db["bookings"][idx])

@bookings_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    idx = find_index("bookings", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["bookings"].pop(idx)
    return jsonify({"message": "Deleted"})
