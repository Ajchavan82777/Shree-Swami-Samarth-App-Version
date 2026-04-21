from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

roles_bp = Blueprint("roles", __name__)

# ---------------------------------------------------------------------------
# GET /roles/  — list all roles (public within admin portal)
# ---------------------------------------------------------------------------
@roles_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    result = (
        get_sb()
        .table("role_permissions")
        .select("*")
        .order("role_name")
        .execute()
    )
    return jsonify(result.data)


# ---------------------------------------------------------------------------
# GET /roles/<role_name>  — fetch a single role
# ---------------------------------------------------------------------------
@roles_bp.route("/<string:role_name>", methods=["GET"])
@jwt_required()
def get_one(role_name):
    result = (
        get_sb()
        .table("role_permissions")
        .select("*")
        .eq("role_name", role_name)
        .single()
        .execute()
    )
    if not result.data:
        return jsonify({"message": "Role not found"}), 404
    return jsonify(result.data)


# ---------------------------------------------------------------------------
# POST /roles/  — create a new role
# ---------------------------------------------------------------------------
@roles_bp.route("/", methods=["POST"])
@jwt_required()
def create_role():
    body = request.get_json(silent=True) or {}

    role_name = (body.get("role_name") or "").strip()
    if not role_name:
        return jsonify({"message": "role_name is required"}), 400

    permissions = body.get("permissions", {})
    if not isinstance(permissions, dict):
        return jsonify({"message": "permissions must be an object"}), 400

    description = body.get("description", "")

    # Guard against duplicates before hitting the DB unique constraint
    existing = (
        get_sb()
        .table("role_permissions")
        .select("id")
        .eq("role_name", role_name)
        .execute()
    )
    if existing.data:
        return jsonify({"message": f"Role '{role_name}' already exists"}), 409

    result = (
        get_sb()
        .table("role_permissions")
        .insert({
            "role_name":   role_name,
            "permissions": permissions,
            "description": description,
        })
        .execute()
    )
    return jsonify(result.data[0] if result.data else {}), 201


# ---------------------------------------------------------------------------
# PUT /roles/<role_name>  — update permissions (and optionally description)
# ---------------------------------------------------------------------------
@roles_bp.route("/<string:role_name>", methods=["PUT"])
@jwt_required()
def update_role(role_name):
    body = request.get_json(silent=True) or {}

    update_payload = {}

    if "permissions" in body:
        if not isinstance(body["permissions"], dict):
            return jsonify({"message": "permissions must be an object"}), 400
        update_payload["permissions"] = body["permissions"]

    if "description" in body:
        update_payload["description"] = body["description"]

    if not update_payload:
        return jsonify({"message": "Nothing to update"}), 400

    # Verify the role exists first
    existing = (
        get_sb()
        .table("role_permissions")
        .select("id")
        .eq("role_name", role_name)
        .execute()
    )
    if not existing.data:
        return jsonify({"message": "Role not found"}), 404

    result = (
        get_sb()
        .table("role_permissions")
        .update(update_payload)
        .eq("role_name", role_name)
        .execute()
    )
    return jsonify(result.data[0] if result.data else {})


# ---------------------------------------------------------------------------
# DELETE /roles/<role_name>  — delete a role ('admin' is protected)
# ---------------------------------------------------------------------------
@roles_bp.route("/<string:role_name>", methods=["DELETE"])
@jwt_required()
def delete_role(role_name):
    if role_name.lower() == "admin":
        return jsonify({"message": "The 'admin' role cannot be deleted"}), 403

    existing = (
        get_sb()
        .table("role_permissions")
        .select("id")
        .eq("role_name", role_name)
        .execute()
    )
    if not existing.data:
        return jsonify({"message": "Role not found"}), 404

    get_sb().table("role_permissions").delete().eq("role_name", role_name).execute()
    return jsonify({"message": f"Role '{role_name}' deleted successfully"})
