from flask import Blueprint, jsonify
from datetime import datetime
from models.db import get_db

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health():
    db_ok = False
    try:
        with get_db() as cur:
            cur.execute("SELECT 1")
            db_ok = True
    except Exception:
        pass

    return jsonify({
        "status": "ok" if db_ok else "degraded",
        "db": "connected" if db_ok else "unreachable",
        "service": "Shree Swami Samarth Food and Hospitality Services API",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
    }), 200
