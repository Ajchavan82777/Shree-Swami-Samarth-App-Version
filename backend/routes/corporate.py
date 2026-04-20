from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.store import db, next_id, now, find_by_id, find_index

corporate_bp = Blueprint("corporate", __name__)

@corporate_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("status")
    items = db["corporate_leads"]
    if status:
        items = [i for i in items if i["status"] == status]
    return jsonify(sorted(items, key=lambda x: x["created_at"], reverse=True))

@corporate_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    item = find_by_id("corporate_leads", id)
    if not item: return jsonify({"message": "Not found"}), 404
    return jsonify(item)

@corporate_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    item = {**data, "id": next_id("corporate"), "status": data.get("status", "prospect"), "created_at": now()}
    db["corporate_leads"].append(item)
    return jsonify(item), 201

@corporate_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    idx = find_index("corporate_leads", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["corporate_leads"][idx].update(request.get_json())
    return jsonify(db["corporate_leads"][idx])

@corporate_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    idx = find_index("corporate_leads", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["corporate_leads"].pop(idx)
    return jsonify({"message": "Deleted"})
