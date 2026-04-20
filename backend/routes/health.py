from flask import Blueprint, jsonify
from datetime import datetime

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Shree Swami Samarth Food and Hospitality Services API",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })
