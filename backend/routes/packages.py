from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.store import db, next_id, now, find_by_id, find_index

packages_bp = Blueprint("packages", __name__)

@packages_bp.route("/", methods=["GET"])
def get_all():
    category = request.args.get("category")
    items = db["packages"]
    if category:
        items = [p for p in items if p["category"] == category]
    return jsonify(items)

@packages_bp.route("/public", methods=["GET"])
def get_public():
    return jsonify([p for p in db["packages"] if p.get("active")])

@packages_bp.route("/<int:id>", methods=["GET"])
def get_one(id):
    item = find_by_id("packages", id)
    if not item: return jsonify({"message": "Not found"}), 404
    return jsonify(item)

@packages_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    item = {**data, "id": next_id("inquiry"), "active": True, "created_at": now()}
    db["packages"].append(item)
    return jsonify(item), 201

@packages_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    idx = find_index("packages", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["packages"][idx].update(request.get_json())
    return jsonify(db["packages"][idx])

@packages_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    idx = find_index("packages", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["packages"].pop(idx)
    return jsonify({"message": "Deleted"})
