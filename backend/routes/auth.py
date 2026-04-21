from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import check_password_hash, generate_password_hash
from models.db import get_sb

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data     = request.get_json() or {}
    email    = data.get("email", "").lower().strip()
    password = data.get("password", "")

    result = get_sb().table("users").select("*").eq("email", email).execute()
    user   = result.data[0] if result.data else None

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(user["id"]),
        additional_claims={"email": user["email"], "name": user["name"], "role": user["role"]},
    )
    return jsonify({
        "token": token,
        "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]},
    })


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    claims = get_jwt()
    return jsonify({
        "id":    int(get_jwt_identity()),
        "email": claims.get("email"),
        "name":  claims.get("name"),
        "role":  claims.get("role"),
    })


# ─── User management ──────────────────────────────────────────────────────────

def _safe_user(u):
    """Return user dict without the password field."""
    return {k: v for k, v in u.items() if k != "password"}


@auth_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    result = get_sb().table("users").select("id, name, email, role, created_at").order("created_at").execute()
    return jsonify(result.data)


@auth_bp.route("/users", methods=["POST"])
@jwt_required()
def create_user():
    data     = request.get_json() or {}
    name     = (data.get("name") or "").strip()
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role     = data.get("role") or ""

    if not name or not email or not password or not role:
        return jsonify({"message": "name, email, password and role are required"}), 400

    sb = get_sb()

    # Check email uniqueness
    existing = sb.table("users").select("id").eq("email", email).execute()
    if existing.data:
        return jsonify({"message": "A user with that email already exists"}), 409

    new_user = sb.table("users").insert({
        "name":     name,
        "email":    email,
        "password": generate_password_hash(password),
        "role":     role,
    }).execute()

    return jsonify(_safe_user(new_user.data[0])), 201


@auth_bp.route("/users/<int:uid>", methods=["PUT"])
@jwt_required()
def update_user(uid):
    data = request.get_json() or {}
    sb   = get_sb()

    existing = sb.table("users").select("*").eq("id", uid).execute()
    if not existing.data:
        return jsonify({"message": "User not found"}), 404

    payload = {}
    if "name" in data and (data["name"] or "").strip():
        payload["name"] = data["name"].strip()
    if "role" in data and data["role"]:
        payload["role"] = data["role"]
    if "password" in data and (data["password"] or "").strip():
        payload["password"] = generate_password_hash(data["password"].strip())

    if not payload:
        return jsonify({"message": "Nothing to update"}), 400

    updated = sb.table("users").update(payload).eq("id", uid).execute()
    return jsonify(_safe_user(updated.data[0]))


@auth_bp.route("/users/<int:uid>", methods=["DELETE"])
@jwt_required()
def delete_user(uid):
    current_id = int(get_jwt_identity())
    if uid == current_id:
        return jsonify({"message": "You cannot delete your own account"}), 403

    sb = get_sb()
    existing = sb.table("users").select("id").eq("id", uid).execute()
    if not existing.data:
        return jsonify({"message": "User not found"}), 404

    sb.table("users").delete().eq("id", uid).execute()
    return jsonify({"message": "Deleted"})
