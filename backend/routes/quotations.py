from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list, json_val

quotations_bp = Blueprint("quotations", __name__)


def _calc(items, discount, tax_rate):
    subtotal   = sum(i.get("total", i.get("qty", 0) * i.get("rate", 0)) for i in items)
    taxable    = max(subtotal - discount, 0)
    tax_amount = round(taxable * tax_rate / 100, 2)
    total      = round(taxable + tax_amount, 2)
    return subtotal, tax_amount, total


@quotations_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    with get_db() as cur:
        cur.execute("SELECT * FROM quotations ORDER BY created_at DESC")
        return jsonify(rows_to_list(cur.fetchall()))


@quotations_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM quotations WHERE id = %s", (id,))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@quotations_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d        = request.get_json() or {}
    items    = d.get("items", [])
    discount = float(d.get("discount", 0))
    tax_rate = float(d.get("tax_rate", 5))
    subtotal, tax_amount, total = _calc(items, discount, tax_rate)
    with get_db() as cur:
        cur.execute("""
            INSERT INTO quotations
                (inquiry_id, customer_name, company_name, email, event_type,
                 event_date, items, subtotal, discount, tax_rate, tax_amount,
                 total, notes, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
        """, (
            d.get("inquiry_id"), d.get("customer_name"), d.get("company_name"),
            d.get("email"), d.get("event_type"), d.get("event_date"),
            json_val(items), subtotal, discount, tax_rate, tax_amount, total,
            d.get("notes"), d.get("status", "draft"),
        ))
        row = row_to_dict(cur.fetchone())
    return jsonify(row), 201


@quotations_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d = request.get_json() or {}
    with get_db() as cur:
        cur.execute("SELECT * FROM quotations WHERE id = %s", (id,))
        existing = row_to_dict(cur.fetchone())
    if not existing:
        return jsonify({"message": "Not found"}), 404

    items    = d.get("items",    existing["items"])
    discount = float(d.get("discount", existing["discount"]))
    tax_rate = float(d.get("tax_rate",  existing["tax_rate"]))
    subtotal, tax_amount, total = _calc(items, discount, tax_rate)

    allowed = {"inquiry_id","customer_name","company_name","email","event_type","event_date","notes","status"}
    sets = {k: v for k, v in d.items() if k in allowed}
    sets.update({"items": json_val(items), "subtotal": subtotal,
                 "discount": discount, "tax_rate": tax_rate,
                 "tax_amount": tax_amount, "total": total})

    cols = ", ".join(f"{k} = %s" for k in sets)
    with get_db() as cur:
        cur.execute(f"UPDATE quotations SET {cols} WHERE id = %s RETURNING *",
                    (*sets.values(), id))
        row = row_to_dict(cur.fetchone())
    return jsonify(row)


@quotations_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    with get_db() as cur:
        cur.execute("DELETE FROM quotations WHERE id = %s RETURNING id", (id,))
        if not cur.fetchone():
            return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})


@quotations_bp.route("/<int:id>/convert", methods=["POST"])
@jwt_required()
def convert_to_invoice(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM quotations WHERE id = %s", (id,))
        q = row_to_dict(cur.fetchone())
    if not q:
        return jsonify({"message": "Not found"}), 404

    advance  = float((request.get_json() or {}).get("advance_paid", 0))
    balance  = round(float(q["total"]) - advance, 2)
    p_status = "paid" if balance <= 0 else ("partial" if advance > 0 else "unpaid")

    with get_db() as cur:
        cur.execute("""
            INSERT INTO invoices
                (quotation_id, customer_name, company_name, email,
                 event_type, event_date, items, subtotal, discount,
                 tax_rate, tax_amount, grand_total, advance_paid,
                 balance_due, payment_status, invoice_date, notes)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,CURRENT_DATE,%s)
            RETURNING *
        """, (
            id, q["customer_name"], q["company_name"], q["email"],
            q["event_type"], q["event_date"],
            json_val(q["items"]), q["subtotal"], q["discount"],
            q["tax_rate"], q["tax_amount"], q["total"],
            advance, balance, p_status, q.get("notes"),
        ))
        invoice = row_to_dict(cur.fetchone())
        cur.execute("UPDATE quotations SET status = 'converted' WHERE id = %s", (id,))
    return jsonify(invoice), 201
