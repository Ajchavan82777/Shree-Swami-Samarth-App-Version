from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

bookings_bp = Blueprint("bookings", __name__)


def _d(v):
    return v if v else None


@bookings_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("status")
    query  = get_sb().table("bookings").select("*")
    if status:
        query = query.eq("status", status)
    result = query.order("event_date", desc=True).execute()
    return jsonify(result.data)


@bookings_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    result = get_sb().table("bookings").select("*").eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@bookings_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d   = request.get_json() or {}
    row = {
        "inquiry_id": d.get("inquiry_id"), "customer_id": d.get("customer_id"),
        "customer_name": d.get("customer_name"), "event_type": d.get("event_type"),
        "package_id": d.get("package_id"), "package_name": d.get("package_name"),
        "event_date": _d(d.get("event_date")), "event_end_date": _d(d.get("event_end_date")), "venue": d.get("venue"),
        "guest_count": d.get("guest_count"), "meal_preference": d.get("meal_preference"),
        "status": d.get("status", "confirmed"),
        "assigned_staff": d.get("assigned_staff", []),
        "total_amount": d.get("total_amount", 0),
        "advance_paid": d.get("advance_paid", 0),
        "balance_due": d.get("balance_due", 0),
        "notes": d.get("notes"),
    }
    result = get_sb().table("bookings").insert(row).execute()
    return jsonify(result.data[0]), 201


@bookings_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d       = request.get_json() or {}
    allowed = {
        "inquiry_id", "customer_id", "customer_name", "event_type", "package_id",
        "package_name", "event_date", "event_end_date", "venue", "guest_count", "meal_preference",
        "status", "assigned_staff", "total_amount", "advance_paid", "balance_due", "notes",
    }
    sets = {k: v for k, v in d.items() if k in allowed}
    for df in ("event_date", "event_end_date"):
        if df in sets:
            sets[df] = _d(sets[df])
    if not sets:
        return jsonify({"message": "Nothing to update"}), 400
    result = get_sb().table("bookings").update(sets).eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@bookings_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    result = get_sb().table("bookings").delete().eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
