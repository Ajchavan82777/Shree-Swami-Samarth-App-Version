"""Tests for /api/invoices CRUD + payment recording"""

NEW_INVOICE = {
    'customer_name': 'Invoice Test Customer',
    'email': 'inv@example.com',
    'event_type': 'corporate',
    'event_date': '2025-11-01',
    'items': [
        {'description': 'Catering Day 1', 'qty': 100, 'rate': 300, 'total': 30000},
        {'description': 'Catering Day 2', 'qty': 100, 'rate': 300, 'total': 30000},
    ],
    'discount': 2000,
    'tax_rate': 5
}
# subtotal=60000, taxable=58000, tax=2900, grand_total=60900

# ── List ─────────────────────────────────────────────────────────────────────

def test_list_invoices_requires_auth(client):
    assert client.get('/api/invoices/').status_code == 401


def test_list_invoices_returns_200(client, auth_headers):
    assert client.get('/api/invoices/', headers=auth_headers).status_code == 200


def test_list_invoices_returns_all_seeded(client, auth_headers):
    data = client.get('/api/invoices/', headers=auth_headers).get_json()
    assert len(data) == 3


def test_list_invoices_filter_paid(client, auth_headers):
    data = client.get('/api/invoices/?status=paid', headers=auth_headers).get_json()
    assert all(i['payment_status'] == 'paid' for i in data)
    assert len(data) == 1


def test_list_invoices_filter_partial(client, auth_headers):
    data = client.get('/api/invoices/?status=partial', headers=auth_headers).get_json()
    assert all(i['payment_status'] == 'partial' for i in data)
    assert len(data) == 2


def test_list_invoices_filter_unpaid(client, auth_headers):
    data = client.get('/api/invoices/?status=unpaid', headers=auth_headers).get_json()
    assert len(data) == 0   # no unpaid invoices seeded


# ── Get single ───────────────────────────────────────────────────────────────

def test_get_invoice_by_id_returns_200(client, auth_headers):
    assert client.get('/api/invoices/501', headers=auth_headers).status_code == 200


def test_get_invoice_returns_correct_data(client, auth_headers):
    data = client.get('/api/invoices/501', headers=auth_headers).get_json()
    assert data['id'] == 501
    assert data['invoice_number'] == 'SSS-INV-501'
    assert data['payment_status'] == 'partial'


def test_get_invoice_not_found_returns_404(client, auth_headers):
    assert client.get('/api/invoices/9999', headers=auth_headers).status_code == 404


# ── Create ───────────────────────────────────────────────────────────────────

def test_create_invoice_returns_201(client, auth_headers):
    resp = client.post('/api/invoices/', json=NEW_INVOICE, headers=auth_headers)
    assert resp.status_code == 201


def test_create_invoice_number_format(client, auth_headers):
    data = client.post('/api/invoices/', json=NEW_INVOICE, headers=auth_headers).get_json()
    assert data['invoice_number'].startswith('SSS-INV-')


def test_create_invoice_calculates_subtotal(client, auth_headers):
    data = client.post('/api/invoices/', json=NEW_INVOICE, headers=auth_headers).get_json()
    assert data['subtotal'] == 60000


def test_create_invoice_calculates_tax(client, auth_headers):
    data = client.post('/api/invoices/', json=NEW_INVOICE, headers=auth_headers).get_json()
    # (60000 - 2000) * 5% = 2900
    assert data['tax_amount'] == 2900.0


def test_create_invoice_calculates_grand_total(client, auth_headers):
    data = client.post('/api/invoices/', json=NEW_INVOICE, headers=auth_headers).get_json()
    # 60000 - 2000 + 2900 = 60900
    assert data['grand_total'] == 60900.0


def test_create_invoice_status_unpaid_when_no_advance(client, auth_headers):
    payload = {**NEW_INVOICE, 'advance_paid': 0}
    data = client.post('/api/invoices/', json=payload, headers=auth_headers).get_json()
    assert data['payment_status'] == 'unpaid'
    assert data['balance_due'] == data['grand_total']


def test_create_invoice_status_partial_when_partial_advance(client, auth_headers):
    payload = {**NEW_INVOICE, 'advance_paid': 30000}
    data = client.post('/api/invoices/', json=payload, headers=auth_headers).get_json()
    assert data['payment_status'] == 'partial'
    assert data['balance_due'] == data['grand_total'] - 30000


def test_create_invoice_status_paid_when_full_advance(client, auth_headers):
    # Use items with known total, then set advance_paid >= grand_total
    payload = {
        'customer_name': 'Full Pay Customer',
        'email': 'fp@example.com',
        'event_type': 'corporate',
        'event_date': '2025-12-01',
        'items': [{'description': 'Service', 'qty': 10, 'rate': 100, 'total': 1000}],
        'discount': 0,
        'tax_rate': 0,
        'advance_paid': 1000
    }
    data = client.post('/api/invoices/', json=payload, headers=auth_headers).get_json()
    assert data['payment_status'] == 'paid'
    assert data['balance_due'] == 0


def test_create_invoice_requires_auth(client):
    assert client.post('/api/invoices/', json=NEW_INVOICE).status_code == 401


# ── Update ───────────────────────────────────────────────────────────────────

def test_update_invoice_returns_200(client, auth_headers):
    resp = client.put('/api/invoices/501', json={'notes': 'Updated notes'}, headers=auth_headers)
    assert resp.status_code == 200


def test_update_invoice_persists_change(client, auth_headers):
    client.put('/api/invoices/501', json={'notes': 'New note'}, headers=auth_headers)
    data = client.get('/api/invoices/501', headers=auth_headers).get_json()
    assert data['notes'] == 'New note'


def test_update_invoice_recalculates_balance_due(client, auth_headers):
    # Fully pay invoice 501 (grand_total=87150) via update
    client.put('/api/invoices/501', json={'advance_paid': 87150}, headers=auth_headers)
    data = client.get('/api/invoices/501', headers=auth_headers).get_json()
    assert data['balance_due'] == 0
    assert data['payment_status'] == 'paid'


def test_update_invoice_not_found_returns_404(client, auth_headers):
    assert client.put('/api/invoices/9999', json={}, headers=auth_headers).status_code == 404


# ── Record Payment ────────────────────────────────────────────────────────────

def test_record_payment_returns_200(client, auth_headers):
    resp = client.post('/api/invoices/501/payment', json={
        'amount': 10000,
        'mode': 'NEFT',
        'date': '2025-05-01'
    }, headers=auth_headers)
    assert resp.status_code == 200


def test_record_payment_increases_advance_paid(client, auth_headers):
    original = client.get('/api/invoices/501', headers=auth_headers).get_json()['advance_paid']
    client.post('/api/invoices/501/payment', json={'amount': 5000}, headers=auth_headers)
    data = client.get('/api/invoices/501', headers=auth_headers).get_json()
    assert data['advance_paid'] == original + 5000


def test_record_payment_decreases_balance_due(client, auth_headers):
    original = client.get('/api/invoices/501', headers=auth_headers).get_json()['balance_due']
    client.post('/api/invoices/501/payment', json={'amount': 5000}, headers=auth_headers)
    data = client.get('/api/invoices/501', headers=auth_headers).get_json()
    assert data['balance_due'] == original - 5000


def test_record_full_payment_sets_status_paid(client, auth_headers):
    inv = client.get('/api/invoices/501', headers=auth_headers).get_json()
    client.post('/api/invoices/501/payment', json={'amount': inv['balance_due']}, headers=auth_headers)
    updated = client.get('/api/invoices/501', headers=auth_headers).get_json()
    assert updated['payment_status'] == 'paid'
    assert updated['balance_due'] == 0


def test_record_payment_returns_payment_record(client, auth_headers):
    resp = client.post('/api/invoices/501/payment', json={
        'amount': 1000, 'mode': 'Cash', 'reference': 'REF001'
    }, headers=auth_headers).get_json()
    payment = resp['payment']
    assert payment['amount'] == 1000
    assert payment['mode'] == 'Cash'
    assert payment['reference'] == 'REF001'
    assert payment['invoice_id'] == 501


def test_record_payment_not_found_returns_404(client, auth_headers):
    assert client.post('/api/invoices/9999/payment', json={'amount': 100}, headers=auth_headers).status_code == 404


def test_record_payment_requires_auth(client):
    assert client.post('/api/invoices/501/payment', json={'amount': 100}).status_code == 401


# ── Delete ───────────────────────────────────────────────────────────────────

def test_delete_invoice_returns_200(client, auth_headers):
    assert client.delete('/api/invoices/501', headers=auth_headers).status_code == 200


def test_delete_invoice_removes_from_list(client, auth_headers):
    client.delete('/api/invoices/501', headers=auth_headers)
    assert client.get('/api/invoices/501', headers=auth_headers).status_code == 404


def test_delete_invoice_not_found_returns_404(client, auth_headers):
    assert client.delete('/api/invoices/9999', headers=auth_headers).status_code == 404
