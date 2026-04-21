from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import check_password_hash
from models.db import get_db, row_to_dict

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")

    with get_db() as cur:
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = row_to_dict(cur.fetchone())

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
