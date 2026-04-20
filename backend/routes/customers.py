from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.store import db, next_id, now, find_by_id, find_index

customers_bp = Blueprint("customers", __name__)

@customers_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    return jsonify(sorted(db["customers"], key=lambda x: x["created_at"], reverse=True))

@customers_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    item = find_by_id("customers", id)
    if not item: return jsonify({"message": "Not found"}), 404
    return jsonify(item)

@customers_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    item = {**data, "id": next_id("customer"), "total_bookings": 0, "total_spent": 0, "created_at": now()}
    db["customers"].append(item)
    return jsonify(item), 201

@customers_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    idx = find_index("customers", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["customers"][idx].update(request.get_json())
    return jsonify(db["customers"][idx])

@customers_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    idx = find_index("customers", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["customers"].pop(idx)
    return jsonify({"message": "Deleted"})
