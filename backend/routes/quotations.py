from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.store import db, next_id, now, find_by_id, find_index

quotations_bp = Blueprint("quotations", __name__)

@quotations_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    return jsonify(sorted(db["quotations"], key=lambda x: x["created_at"], reverse=True))

@quotations_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    item = find_by_id("quotations", id)
    if not item: return jsonify({"message": "Not found"}), 404
    return jsonify(item)

@quotations_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    items = data.get("items", [])
    subtotal = sum(i.get("total", 0) for i in items)
    discount = data.get("discount", 0)
    tax_rate = data.get("tax_rate", 5)
    tax_amount = round((subtotal - discount) * tax_rate / 100, 2)
    total = subtotal - discount + tax_amount
    item = {
        **data,
        "id": next_id("quotation"),
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "total": total,
        "status": "draft",
        "created_at": now()
    }
    db["quotations"].append(item)
    return jsonify(item), 201

@quotations_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    idx = find_index("quotations", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    data = request.get_json()
    items = data.get("items", db["quotations"][idx].get("items", []))
    subtotal = sum(i.get("total", 0) for i in items)
    discount = data.get("discount", 0)
    tax_rate = data.get("tax_rate", 5)
    tax_amount = round((subtotal - discount) * tax_rate / 100, 2)
    total = subtotal - discount + tax_amount
    data.update({"subtotal": subtotal, "tax_amount": tax_amount, "total": total})
    db["quotations"][idx].update(data)
    return jsonify(db["quotations"][idx])

@quotations_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    idx = find_index("quotations", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["quotations"].pop(idx)
    return jsonify({"message": "Deleted"})

@quotations_bp.route("/<int:id>/convert", methods=["POST"])
@jwt_required()
def convert_to_invoice(id):
    q = find_by_id("quotations", id)
    if not q: return jsonify({"message": "Not found"}), 404
    inv_id = next_id("invoice")
    invoice = {
        "id": inv_id,
        "invoice_number": f"SSS-INV-{inv_id}",
        "quotation_id": id,
        "customer_name": q["customer_name"],
        "company_name": q.get("company_name"),
        "email": q["email"],
        "event_type": q["event_type"],
        "event_date": q["event_date"],
        "items": q["items"],
        "subtotal": q["subtotal"],
        "discount": q["discount"],
        "tax_rate": q["tax_rate"],
        "tax_amount": q["tax_amount"],
        "grand_total": q["total"],
        "advance_paid": 0,
        "balance_due": q["total"],
        "payment_status": "unpaid",
        "invoice_date": now()[:10],
        "notes": q.get("notes", ""),
        "created_at": now()
    }
    db["invoices"].append(invoice)
    idx = find_index("quotations", id)
    db["quotations"][idx]["status"] = "converted"
    return jsonify(invoice), 201
