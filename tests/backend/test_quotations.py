"""Tests for /api/quotations CRUD + convert-to-invoice"""

NEW_QUOTATION = {
    'customer_name': 'Quote Test Customer',
    'email': 'quote@example.com',
    'event_type': 'corporate',
    'event_date': '2025-10-01',
    'items': [
        {'description': 'Catering Service', 'qty': 100, 'rate': 200, 'total': 20000},
        {'description': 'Extra Setup',      'qty': 1,   'rate': 5000, 'total': 5000},
    ],
    'discount': 1000,
    'tax_rate': 5,
    'notes': 'Test quotation'
}
# Expected math: subtotal=25000, taxable=(25000-1000)=24000, tax=24000*5%=1200, total=24000+1200=25200

# ── List ─────────────────────────────────────────────────────────────────────

def test_list_quotations_requires_auth(client):
    assert client.get('/api/quotations/').status_code == 401


def test_list_quotations_returns_200(client, auth_headers):
    assert client.get('/api/quotations/', headers=auth_headers).status_code == 200


def test_list_quotations_returns_all_seeded(client, auth_headers):
    data = client.get('/api/quotations/', headers=auth_headers).get_json()
    assert len(data) == 2


# ── Get single ───────────────────────────────────────────────────────────────

def test_get_quotation_by_id_returns_200(client, auth_headers):
    assert client.get('/api/quotations/401', headers=auth_headers).status_code == 200


def test_get_quotation_returns_correct_data(client, auth_headers):
    data = client.get('/api/quotations/401', headers=auth_headers).get_json()
    assert data['id'] == 401
    assert data['customer_name'] == 'Anil Pawar'


def test_get_quotation_not_found_returns_404(client, auth_headers):
    assert client.get('/api/quotations/9999', headers=auth_headers).status_code == 404


# ── Create ───────────────────────────────────────────────────────────────────

def test_create_quotation_returns_201(client, auth_headers):
    resp = client.post('/api/quotations/', json=NEW_QUOTATION, headers=auth_headers)
    assert resp.status_code == 201


def test_create_quotation_status_is_draft(client, auth_headers):
    data = client.post('/api/quotations/', json=NEW_QUOTATION, headers=auth_headers).get_json()
    assert data['status'] == 'draft'


def test_create_quotation_calculates_subtotal(client, auth_headers):
    data = client.post('/api/quotations/', json=NEW_QUOTATION, headers=auth_headers).get_json()
    assert data['subtotal'] == 25000


def test_create_quotation_calculates_tax_amount(client, auth_headers):
    data = client.post('/api/quotations/', json=NEW_QUOTATION, headers=auth_headers).get_json()
    # (25000 - 1000) * 5 / 100 = 1200
    assert data['tax_amount'] == 1200.0


def test_create_quotation_calculates_total(client, auth_headers):
    data = client.post('/api/quotations/', json=NEW_QUOTATION, headers=auth_headers).get_json()
    # 25000 - 1000 + 1200 = 25200
    assert data['total'] == 25200.0


def test_create_quotation_zero_discount(client, auth_headers):
    payload = {**NEW_QUOTATION, 'discount': 0, 'items': [
        {'description': 'Service', 'qty': 10, 'rate': 100, 'total': 1000}
    ]}
    data = client.post('/api/quotations/', json=payload, headers=auth_headers).get_json()
    assert data['subtotal'] == 1000
    assert data['tax_amount'] == 50.0   # 1000 * 5%
    assert data['total'] == 1050.0


def test_create_quotation_has_created_at(client, auth_headers):
    data = client.post('/api/quotations/', json=NEW_QUOTATION, headers=auth_headers).get_json()
    assert 'created_at' in data


def test_create_quotation_requires_auth(client):
    assert client.post('/api/quotations/', json=NEW_QUOTATION).status_code == 401


# ── Update ───────────────────────────────────────────────────────────────────

def test_update_quotation_returns_200(client, auth_headers):
    resp = client.put('/api/quotations/401', json={'status': 'sent'}, headers=auth_headers)
    assert resp.status_code == 200


def test_update_quotation_recalculates_totals(client, auth_headers):
    payload = {
        'items': [{'description': 'Updated Item', 'qty': 50, 'rate': 100, 'total': 5000}],
        'discount': 0,
        'tax_rate': 10
    }
    data = client.put('/api/quotations/401', json=payload, headers=auth_headers).get_json()
    assert data['subtotal'] == 5000
    assert data['tax_amount'] == 500.0
    assert data['total'] == 5500.0


def test_update_quotation_not_found_returns_404(client, auth_headers):
    assert client.put('/api/quotations/9999', json={}, headers=auth_headers).status_code == 404


# ── Delete ───────────────────────────────────────────────────────────────────

def test_delete_quotation_returns_200(client, auth_headers):
    assert client.delete('/api/quotations/401', headers=auth_headers).status_code == 200


def test_delete_quotation_removes_from_list(client, auth_headers):
    client.delete('/api/quotations/401', headers=auth_headers)
    assert client.get('/api/quotations/401', headers=auth_headers).status_code == 404


def test_delete_quotation_not_found_returns_404(client, auth_headers):
    assert client.delete('/api/quotations/9999', headers=auth_headers).status_code == 404


# ── Convert to Invoice ───────────────────────────────────────────────────────

def test_convert_quotation_returns_201(client, auth_headers):
    resp = client.post('/api/quotations/401/convert', headers=auth_headers)
    assert resp.status_code == 201


def test_convert_quotation_creates_invoice_number(client, auth_headers):
    data = client.post('/api/quotations/401/convert', headers=auth_headers).get_json()
    assert data['invoice_number'].startswith('SSS-INV-')


def test_convert_quotation_sets_payment_status_unpaid(client, auth_headers):
    data = client.post('/api/quotations/401/convert', headers=auth_headers).get_json()
    assert data['payment_status'] == 'unpaid'
    assert data['advance_paid'] == 0
    assert data['balance_due'] == data['grand_total']


def test_convert_quotation_marks_quotation_converted(client, auth_headers):
    client.post('/api/quotations/401/convert', headers=auth_headers)
    q = client.get('/api/quotations/401', headers=auth_headers).get_json()
    assert q['status'] == 'converted'


def test_convert_quotation_not_found_returns_404(client, auth_headers):
    assert client.post('/api/quotations/9999/convert', headers=auth_headers).status_code == 404


def test_convert_quotation_requires_auth(client):
    assert client.post('/api/quotations/401/convert').status_code == 401
