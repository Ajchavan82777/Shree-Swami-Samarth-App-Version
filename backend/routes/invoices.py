from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_db, row_to_dict, rows_to_list, json_val

invoices_bp = Blueprint("invoices", __name__)


def _payment_status(advance, grand_total):
    if advance <= 0:
        return "unpaid"
    if advance >= grand_total:
        return "paid"
    return "partial"


@invoices_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("payment_status")
    sql = "SELECT * FROM invoices WHERE 1=1"
    params = []
    if status:
        sql += " AND payment_status = %s"; params.append(status)
    sql += " ORDER BY created_at DESC"
    with get_db() as cur:
        cur.execute(sql, params)
        return jsonify(rows_to_list(cur.fetchall()))


@invoices_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    with get_db() as cur:
        cur.execute("SELECT * FROM invoices WHERE id = %s", (id,))
        row = row_to_dict(cur.fetchone())
    if not row:
        return jsonify({"message": "Not found"}), 404
    return jsonify(row)


@invoices_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d         = request.get_json() or {}
    items     = d.get("items", [])
    subtotal  = sum(i.get("total", i.get("qty", 0) * i.get("rate", 0)) for i in items)
    discount  = float(d.get("discount", 0))
    tax_rate  = float(d.get("tax_rate", 5))
    taxable   = max(subtotal - discount, 0)
    tax_amt   = round(taxable * tax_rate / 100, 2)
    grand     = round(taxable + tax_amt, 2)
    advance   = float(d.get("advance_paid", 0))
    balance   = round(grand - advance, 2)
    p_status  = _payment_status(advance, grand)

    with get_db() as cur:
        cur.execute("""
            INSERT INTO invoices
                (booking_id, quotation_id, customer_name, company_name, email,
                 phone, event_type, event_date, venue, items, subtotal,
                 discount, tax_rate, tax_amount, grand_total, advance_paid,
                 balance_due, payment_status, invoice_date, due_date, notes)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
        """, (
            d.get("booking_id"), d.get("quotation_id"),
            d.get("customer_name"), d.get("company_name"),
            d.get("email"), d.get("phone"), d.get("event_type"),
            d.get("event_date"), d.get("venue"),
            json_val(items), subtotal, discount, tax_rate,
            tax_amt, grand, advance, balance, p_status,
            d.get("invoice_date"), d.get("due_date"), d.get("notes"),
        ))
        row = row_to_dict(cur.fetchone())
    return jsonify(row), 201


@invoices_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    d = request.get_json() or {}
    with get_db() as cur:
        cur.execute("SELECT * FROM invoices WHERE id = %s", (id,))
        existing = row_to_dict(cur.fetchone())
    if not existing:
        return jsonify({"message": "Not found"}), 404

    items    = d.get("items",     existing["items"])
    discount = float(d.get("discount", existing["discount"]))
    tax_rate = float(d.get("tax_rate",  existing["tax_rate"]))
    subtotal = sum(i.get("total", i.get("qty", 0) * i.get("rate", 0)) for i in items)
    taxable  = max(subtotal - discount, 0)
    tax_amt  = round(taxable * tax_rate / 100, 2)
    grand    = round(taxable + tax_amt, 2)
    advance  = float(d.get("advance_paid", existing["advance_paid"]))
    balance  = round(grand - advance, 2)
    p_status = _payment_status(advance, grand)

    allowed = {"customer_name","company_name","email","phone","event_type",
               "event_date","venue","invoice_date","due_date","notes"}
    sets = {k: v for k, v in d.items() if k in allowed}
    sets.update({
        "items": json_val(items), "subtotal": subtotal, "discount": discount,
        "tax_rate": tax_rate, "tax_amount": tax_amt, "grand_total": grand,
        "advance_paid": advance, "balance_due": balance,
        "payment_status": p_status,
    })
    cols = ", ".join(f"{k} = %s" for k in sets)
    with get_db() as cur:
        cur.execute(f"UPDATE invoices SET {cols} WHERE id = %s RETURNING *",
                    (*sets.values(), id))
        row = row_to_dict(cur.fetchone())
    return jsonify(row)


@invoices_bp.route("/<int:id>/payment", methods=["POST"])
@jwt_required()
def record_payment(id):
    d = request.get_json() or {}
    amount = float(d.get("amount", 0))
    if amount <= 0:
        return jsonify({"message": "Amount must be positive"}), 400

    with get_db() as cur:
        cur.execute("SELECT * FROM invoices WHERE id = %s", (id,))
        inv = row_to_dict(cur.fetchone())
    if not inv:
        return jsonify({"message": "Not found"}), 404

    new_advance = round(float(inv["advance_paid"]) + amount, 2)
    new_balance = round(float(inv["grand_total"]) - new_advance, 2)
    p_status    = _payment_status(new_advance, float(inv["grand_total"]))

    with get_db() as cur:
        cur.execute("""
            UPDATE invoices
            SET advance_paid = %s, balance_due = %s, payment_status = %s
            WHERE id = %s
        """, (new_advance, new_balance, p_status, id))
        cur.execute("""
            INSERT INTO payments (invoice_id, invoice_number, amount, mode, date, reference, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            id, inv["invoice_number"], amount,
            d.get("mode"), d.get("date"), d.get("reference"), d.get("notes"),
        ))
        payment = row_to_dict(cur.fetchone())
        cur.execute("SELECT * FROM invoices WHERE id = %s", (id,))
        updated = row_to_dict(cur.fetchone())
    return jsonify({"invoice": updated, "payment": payment})


@invoices_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    with get_db() as cur:
        cur.execute("DELETE FROM invoices WHERE id = %s RETURNING id", (id,))
        if not cur.fetchone():
            return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
