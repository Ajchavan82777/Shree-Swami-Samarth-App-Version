from flask import Blueprint, jsonify
from datetime import datetime
from models.db import get_sb

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health():
    db_ok = False
    try:
        get_sb().table("users").select("id").limit(1).execute()
        db_ok = True
    except Exception:
        pass

    return jsonify({
        "status":    "ok" if db_ok else "degraded",
        "db":        "connected" if db_ok else "unreachable",
        "service":   "Shree Swami Samarth Food and Hospitality Services API",
        "timestamp": datetime.now().isoformat(),
        "version":   "2.0.0",
    }), 200
