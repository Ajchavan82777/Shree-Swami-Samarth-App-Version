from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.db import get_sb

quotations_bp = Blueprint("quotations", __name__)


def _d(v):
    """Convert empty string / falsy value to None for DATE columns."""
    return v if v else None


def _calc(items, discount, tax_rate):
    subtotal   = sum(i.get("total", i.get("qty", 0) * i.get("rate", 0)) for i in items)
    taxable    = max(subtotal - discount, 0)
    tax_amount = round(taxable * tax_rate / 100, 2)
    total      = round(taxable + tax_amount, 2)
    return subtotal, tax_amount, total


@quotations_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    result = get_sb().table("quotations").select("*").order("created_at", desc=True).execute()
    return jsonify(result.data)


@quotations_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_one(id):
    result = get_sb().table("quotations").select("*").eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify(result.data[0])


@quotations_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    d        = request.get_json() or {}
    items    = d.get("items", [])
    discount = float(d.get("discount", 0))
    tax_rate = float(d.get("tax_rate", 5))
    subtotal, tax_amount, total = _calc(items, discount, tax_rate)
    row = {
        "inquiry_id":    d.get("inquiry_id"),
        "customer_name": d.get("customer_name"),
        "company_name":  d.get("company_name"),
        "email":         d.get("email"),
        "phone":         d.get("phone"),
        "event_type":    d.get("event_type"),
        "event_date":    _d(d.get("event_date")),
        "venue":         d.get("venue"),
        "quote_date":    _d(d.get("quote_date")),
        "valid_until":   _d(d.get("valid_until")),
        "gst_type":      d.get("gst_type", "sgst_cgst"),
        "items":         items,
        "subtotal":      subtotal,
        "discount":      discount,
        "tax_rate":      tax_rate,
        "tax_amount":    tax_amount,
        "total":         total,
        "notes":         d.get("notes"),
        "status":        d.get("status", "draft"),
    }
    result = get_sb().table("quotations").insert(row).execute()
    return jsonify(result.data[0]), 201


@quotations_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update(id):
    existing_r = get_sb().table("quotations").select("*").eq("id", id).execute()
    if not existing_r.data:
        return jsonify({"message": "Not found"}), 404
    existing = existing_r.data[0]

    d        = request.get_json() or {}
    items    = d.get("items",    existing["items"])
    discount = float(d.get("discount", existing["discount"]))
    tax_rate = float(d.get("tax_rate",  existing["tax_rate"]))
    subtotal, tax_amount, total = _calc(items, discount, tax_rate)

    allowed = {"inquiry_id", "customer_name", "company_name", "email",
               "phone", "event_type", "venue", "notes", "status", "gst_type"}
    sets = {k: v for k, v in d.items() if k in allowed}
    # Handle date fields explicitly to convert empty strings to None
    for df in ("event_date", "quote_date", "valid_until"):
        if df in d:
            sets[df] = _d(d[df])
    sets.update({
        "items": items, "subtotal": subtotal, "discount": discount,
        "tax_rate": tax_rate, "tax_amount": tax_amount, "total": total,
    })
    result = get_sb().table("quotations").update(sets).eq("id", id).execute()
    return jsonify(result.data[0])


@quotations_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    result = get_sb().table("quotations").delete().eq("id", id).execute()
    if not result.data:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"message": "Deleted"})


@quotations_bp.route("/<int:id>/convert", methods=["POST"])
@jwt_required()
def convert_to_invoice(id):
    q_r = get_sb().table("quotations").select("*").eq("id", id).execute()
    if not q_r.data:
        return jsonify({"message": "Not found"}), 404
    q = q_r.data[0]

    advance  = float((request.get_json() or {}).get("advance_paid", 0))
    balance  = round(float(q["total"]) - advance, 2)
    p_status = "paid" if balance <= 0 else ("partial" if advance > 0 else "unpaid")

    from datetime import date
    inv_row = {
        "quotation_id": id, "customer_name": q["customer_name"],
        "company_name": q.get("company_name"), "email": q.get("email"),
        "event_type": q.get("event_type"), "event_date": q.get("event_date"),
        "items": q["items"], "subtotal": q["subtotal"], "discount": q["discount"],
        "tax_rate": q["tax_rate"], "tax_amount": q["tax_amount"],
        "grand_total": q["total"], "advance_paid": advance,
        "balance_due": balance, "payment_status": p_status,
        "invoice_date": date.today().isoformat(), "notes": q.get("notes"),
    }
    inv_r = get_sb().table("invoices").insert(inv_row).execute()
    get_sb().table("quotations").update({"status": "converted"}).eq("id", id).execute()
    return jsonify(inv_r.data[0]), 201
