from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.store import db, next_id, now, find_by_id, find_index

staff_bp = Blueprint("staff", __name__)

@staff_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    return jsonify(db["staff"])

@staff_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    item = find_by_id("staff", id)
    if not item: return jsonify({"message": "Not found"}), 404
    return jsonify(item)

@staff_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    item = {**data, "id": next_id("staff"), "active": True, "created_at": now()}
    db["staff"].append(item)
    return jsonify(item), 201

@staff_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    idx = find_index("staff", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["staff"][idx].update(request.get_json())
    return jsonify(db["staff"][idx])

@staff_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    idx = find_index("staff", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["staff"].pop(idx)
    return jsonify({"message": "Deleted"})
