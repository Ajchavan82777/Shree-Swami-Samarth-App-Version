from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

packages_bp = Blueprint("packages", __name__)


@packages_bp.route("/public", methods=["GET"])
def get_public():
    category = request.args.get("category")
    query    = get_sb().table("packages").select("*").eq("active", True)
    if category:
        query = query.eq("category", category)
    result = query.order("featured", desc=True).order("id").execute()
    return jsonify(result.data)


@packages_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    category = request.args.get("category")
    query    = get_sb().table("packages").select("*")
    if category:
        query = query.eq("category", category)
    result = query.order("id").execute()
    return jsonify(result.data)


@packages_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    result = get_sb().table("packages").select("*").eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@packages_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d   = request.get_json() or {}
    row = {
        "name": d.get("name"), "category": d.get("category"),
        "price_per_person": d.get("price_per_person", 0),
        "min_persons": d.get("min_persons", 1),
        "description": d.get("description"),
        "inclusions": d.get("inclusions", []),
        "featured": d.get("featured", False),
        "active": d.get("active", True),
    }
    result = get_sb().table("packages").insert(row).execute()
    return jsonify(result.data[0]), 201


@packages_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d       = request.get_json() or {}
    allowed = {"name", "category", "price_per_person", "min_persons",
               "description", "inclusions", "featured", "active"}
    sets = {k: v for k, v in d.items() if k in allowed}
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    result = get_sb().table("packages").update(sets).eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@packages_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    result = get_sb().table("packages").delete().eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
