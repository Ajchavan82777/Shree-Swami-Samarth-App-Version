"""
Shree Swami Samarth Food and Hospitality Services
Backend API Server
"""
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

# Config
app.config["JWT_SECRET_KEY"] = "sss-foods-secret-2024-demo"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
app.config["SECRET_KEY"] = "sss-demo-secret"

jwt = JWTManager(app)

# Import and register blueprints
from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.inquiries import inquiries_bp
from routes.customers import customers_bp
from routes.corporate import corporate_bp
from routes.bookings import bookings_bp
from routes.quotations import quotations_bp
from routes.invoices import invoices_bp
from routes.packages import packages_bp
from routes.staff import staff_bp
from routes.reports import reports_bp
from routes.health import health_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
app.register_blueprint(inquiries_bp, url_prefix="/api/inquiries")
app.register_blueprint(customers_bp, url_prefix="/api/customers")
app.register_blueprint(corporate_bp, url_prefix="/api/corporate")
app.register_blueprint(bookings_bp, url_prefix="/api/bookings")
app.register_blueprint(quotations_bp, url_prefix="/api/quotations")
app.register_blueprint(invoices_bp, url_prefix="/api/invoices")
app.register_blueprint(packages_bp, url_prefix="/api/packages")
app.register_blueprint(staff_bp, url_prefix="/api/staff")
app.register_blueprint(reports_bp, url_prefix="/api/reports")
app.register_blueprint(health_bp, url_prefix="/api")

if __name__ == "__main__":
    # Seed demo data on startup
    from seed.seeder import seed_all
    seed_all()
    app.run(debug=True, port=5000, host="0.0.0.0")
