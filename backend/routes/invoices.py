from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

invoices_bp = Blueprint("invoices", __name__)


def _d(v):
    """Return None for empty/falsy date strings so Postgres DATE column accepts them."""
    return v if v else None


def _payment_status(advance, grand_total):
    if advance <= 0:
        return "unpaid"
    if advance >= grand_total:
        return "paid"
    return "partial"


def _calc_totals(items, discount, tax_rate, advance):
    subtotal = sum(i.get("total", i.get("qty", 0) * i.get("rate", 0)) for i in items)
    taxable  = max(subtotal - discount, 0)
    tax_amt  = round(taxable * tax_rate / 100, 2)
    grand    = round(taxable + tax_amt, 2)
    balance  = round(grand - advance, 2)
    return subtotal, tax_amt, grand, balance, _payment_status(advance, grand)


@invoices_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    status = request.args.get("payment_status")
    query  = get_sb().table("invoices").select("*")
    if status:
        query = query.eq("payment_status", status)
    result = query.order("created_at", desc=True).execute()
    return jsonify(result.data)


@invoices_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    result = get_sb().table("invoices").select("*").eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@invoices_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d        = request.get_json() or {}
    items    = d.get("items", [])
    discount = float(d.get("discount", 0))
    tax_rate = float(d.get("tax_rate", 5))
    advance  = float(d.get("advance_paid", 0))
    subtotal, tax_amt, grand, balance, p_status = _calc_totals(items, discount, tax_rate, advance)

    row = {
        "booking_id": d.get("booking_id"), "quotation_id": d.get("quotation_id"),
        "customer_name": d.get("customer_name"), "company_name": d.get("company_name"),
        "email": d.get("email"), "phone": d.get("phone"),
        "event_type": d.get("event_type"), "event_date": _d(d.get("event_date")),
        "venue": d.get("venue"), "items": items,
        "subtotal": subtotal, "discount": discount, "tax_rate": tax_rate,
        "tax_amount": tax_amt, "grand_total": grand,
        "advance_paid": advance, "balance_due": balance,
        "payment_status": p_status, "invoice_date": _d(d.get("invoice_date")),
        "due_date": _d(d.get("due_date")), "notes": d.get("notes"),
        "gst_type": d.get("gst_type"),
    }
    result = get_sb().table("invoices").insert(row).execute()
    return jsonify(result.data[0]), 201


@invoices_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    existing_r = get_sb().table("invoices").select("*").eq("id", id).execute()
    if not existing_r.data:
        return jsonify({"message": "Not found"}), 404
    existing = existing_r.data[0]

    d        = request.get_json() or {}
    items    = d.get("items",    existing["items"])
    discount = float(d.get("discount", existing["discount"]))
    tax_rate = float(d.get("tax_rate",  existing["tax_rate"]))
    advance  = float(d.get("advance_paid", existing["advance_paid"]))
    subtotal, tax_amt, grand, balance, p_status = _calc_totals(items, discount, tax_rate, advance)

    allowed = {"customer_name", "company_name", "email", "phone", "event_type",
               "event_date", "venue", "invoice_date", "due_date", "notes", "gst_type"}
    date_keys = {"event_date", "invoice_date", "due_date"}
    sets = {k: (_d(v) if k in date_keys else v) for k, v in d.items() if k in allowed}
    sets.update({
        "items": items, "subtotal": subtotal, "discount": discount,
        "tax_rate": tax_rate, "tax_amount": tax_amt, "grand_total": grand,
        "advance_paid": advance, "balance_due": balance, "payment_status": p_status,
    })
    result = get_sb().table("invoices").update(sets).eq("id", id).execute()
    return jsonify(result.data[0])


@invoices_bp.route("/<int:id>/payment", methods=["POST"])
@jwt_required()
def record_payment(id):
    d      = request.get_json() or {}
    amount = float(d.get("amount", 0))
    if amount <= 0:
        return jsonify({"message": "Amount must be positive"}), 400

    inv_r = get_sb().table("invoices").select("*").eq("id", id).execute()
    if not inv_r.data:
        return jsonify({"message": "Not found"}), 404
    inv = inv_r.data[0]

    new_advance = round(float(inv["advance_paid"]) + amount, 2)
    new_balance = round(float(inv["grand_total"]) - new_advance, 2)
    p_status    = _payment_status(new_advance, float(inv["grand_total"]))

    get_sb().table("invoices").update({
        "advance_paid": new_advance, "balance_due": new_balance, "payment_status": p_status,
    }).eq("id", id).execute()

    payment_row = {
        "invoice_id": id, "invoice_number": inv.get("invoice_number"),
        "amount": amount, "mode": d.get("mode"),
        "date": d.get("date"), "reference": d.get("reference"), "notes": d.get("notes"),
    }
    pay_r    = get_sb().table("payments").insert(payment_row).execute()
    updated  = get_sb().table("invoices").select("*").eq("id", id).execute()
    return jsonify({"invoice": updated.data[0], "payment": pay_r.data[0]})


@invoices_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    result = get_sb().table("invoices").delete().eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})
