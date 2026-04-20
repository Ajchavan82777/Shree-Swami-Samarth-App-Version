from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.store import db, next_id, now, find_by_id, find_index

invoices_bp = Blueprint("invoices", __name__)

@invoices_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("status")
    items = db["invoices"]
    if status:
        items = [i for i in items if i["payment_status"] == status]
    return jsonify(sorted(items, key=lambda x: x["created_at"], reverse=True))

@invoices_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    item = find_by_id("invoices", id)
    if not item: return jsonify({"message": "Not found"}), 404
    return jsonify(item)

@invoices_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    data = request.get_json()
    items = data.get("items", [])
    subtotal = sum(i.get("total", 0) for i in items)
    discount = data.get("discount", 0)
    tax_rate = data.get("tax_rate", 5)
    tax_amount = round((subtotal - discount) * tax_rate / 100, 2)
    grand_total = subtotal - discount + tax_amount
    advance_paid = data.get("advance_paid", 0)
    inv_id = next_id("invoice")
    invoice = {
        **data,
        "id": inv_id,
        "invoice_number": f"SSS-INV-{inv_id}",
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "grand_total": grand_total,
        "advance_paid": advance_paid,
        "balance_due": grand_total - advance_paid,
        "payment_status": "unpaid" if advance_paid == 0 else ("paid" if advance_paid >= grand_total else "partial"),
        "invoice_date": data.get("invoice_date", now()[:10]),
        "created_at": now()
    }
    db["invoices"].append(invoice)
    return jsonify(invoice), 201

@invoices_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    idx = find_index("invoices", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    data = request.get_json()
    db["invoices"][idx].update(data)
    # Recalculate balance
    inv = db["invoices"][idx]
    balance = inv["grand_total"] - inv.get("advance_paid", 0)
    inv["balance_due"] = max(0, balance)
    if inv.get("advance_paid", 0) >= inv["grand_total"]:
        inv["payment_status"] = "paid"
    elif inv.get("advance_paid", 0) > 0:
        inv["payment_status"] = "partial"
    else:
        inv["payment_status"] = "unpaid"
    return jsonify(inv)

@invoices_bp.route("/<int:id>/payment", methods=["POST"])
@jwt_required()
def record_payment(id):
    idx = find_index("invoices", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    data = request.get_json()
    amount = data.get("amount", 0)
    inv = db["invoices"][idx]
    inv["advance_paid"] = inv.get("advance_paid", 0) + amount
    inv["balance_due"] = max(0, inv["grand_total"] - inv["advance_paid"])
    if inv["balance_due"] == 0:
        inv["payment_status"] = "paid"
    elif inv["advance_paid"] > 0:
        inv["payment_status"] = "partial"
    payment = {
        "id": len(db["payments"]) + 1,
        "invoice_id": id,
        "invoice_number": inv["invoice_number"],
        "amount": amount,
        "mode": data.get("mode", "Cash"),
        "date": data.get("date", now()[:10]),
        "reference": data.get("reference", ""),
        "notes": data.get("notes", ""),
    }
    db["payments"].append(payment)
    return jsonify({"invoice": inv, "payment": payment})

@invoices_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    idx = find_index("invoices", id)
    if idx == -1: return jsonify({"message": "Not found"}), 404
    db["invoices"].pop(idx)
    return jsonify({"message": "Deleted"})
