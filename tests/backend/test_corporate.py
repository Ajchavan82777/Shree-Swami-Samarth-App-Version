"""Tests for /api/corporate CRUD"""

NEW_LEAD = {
    'company_name': 'Test Corp Ltd',
    'contact_name': 'John Doe',
    'email': 'john@testcorp.com',
    'phone': '9000000003',
    'city': 'Pune',
    'employees': 100,
    'service_type': 'Daily Meal Plan',
    'monthly_value': 30000
}

# ── List ─────────────────────────────────────────────────────────────────────

def test_list_corporate_requires_auth(client):
    assert client.get('/api/corporate/').status_code == 401


def test_list_corporate_returns_200(client, auth_headers):
    assert client.get('/api/corporate/', headers=auth_headers).status_code == 200


def test_list_corporate_returns_all_seeded(client, auth_headers):
    data = client.get('/api/corporate/', headers=auth_headers).get_json()
    assert len(data) == 4


def test_list_corporate_filter_by_active_status(client, auth_headers):
    data = client.get('/api/corporate/?status=active', headers=auth_headers).get_json()
    assert all(l['status'] == 'active' for l in data)
    assert len(data) == 2


def test_list_corporate_filter_by_prospect_status(client, auth_headers):
    data = client.get('/api/corporate/?status=prospect', headers=auth_headers).get_json()
    assert len(data) == 1
    assert data[0]['company_name'] == 'Bajaj Auto Ltd'


def test_list_corporate_filter_by_negotiation_status(client, auth_headers):
    data = client.get('/api/corporate/?status=negotiation', headers=auth_headers).get_json()
    assert len(data) == 1
    assert data[0]['company_name'] == 'Wipro Technologies'


# ── Get single ───────────────────────────────────────────────────────────────

def test_get_corporate_by_id_returns_200(client, auth_headers):
    assert client.get('/api/corporate/201', headers=auth_headers).status_code == 200


def test_get_corporate_returns_correct_data(client, auth_headers):
    data = client.get('/api/corporate/201', headers=auth_headers).get_json()
    assert data['id'] == 201
    assert data['company_name'] == 'Tech Mahindra Ltd'


def test_get_corporate_not_found_returns_404(client, auth_headers):
    assert client.get('/api/corporate/9999', headers=auth_headers).status_code == 404


def test_get_corporate_requires_auth(client):
    assert client.get('/api/corporate/201').status_code == 401


# ── Create ───────────────────────────────────────────────────────────────────

def test_create_corporate_returns_201(client, auth_headers):
    resp = client.post('/api/corporate/', json=NEW_LEAD, headers=auth_headers)
    assert resp.status_code == 201


def test_create_corporate_has_id(client, auth_headers):
    data = client.post('/api/corporate/', json=NEW_LEAD, headers=auth_headers).get_json()
    assert 'id' in data


def test_create_corporate_default_status_prospect(client, auth_headers):
    data = client.post('/api/corporate/', json=NEW_LEAD, headers=auth_headers).get_json()
    assert data['status'] == 'prospect'


def test_create_corporate_has_created_at(client, auth_headers):
    data = client.post('/api/corporate/', json=NEW_LEAD, headers=auth_headers).get_json()
    assert 'created_at' in data


def test_create_corporate_appears_in_list(client, auth_headers):
    client.post('/api/corporate/', json=NEW_LEAD, headers=auth_headers)
    data = client.get('/api/corporate/', headers=auth_headers).get_json()
    assert len(data) == 5


def test_create_corporate_requires_auth(client):
    assert client.post('/api/corporate/', json=NEW_LEAD).status_code == 401


# ── Update ───────────────────────────────────────────────────────────────────

def test_update_corporate_returns_200(client, auth_headers):
    resp = client.put('/api/corporate/201', json={'status': 'negotiation'}, headers=auth_headers)
    assert resp.status_code == 200


def test_update_corporate_persists_change(client, auth_headers):
    client.put('/api/corporate/201', json={'monthly_value': 99999}, headers=auth_headers)
    data = client.get('/api/corporate/201', headers=auth_headers).get_json()
    assert data['monthly_value'] == 99999


def test_update_corporate_not_found_returns_404(client, auth_headers):
    assert client.put('/api/corporate/9999', json={'status': 'active'}, headers=auth_headers).status_code == 404


def test_update_corporate_requires_auth(client):
    assert client.put('/api/corporate/201', json={'status': 'active'}).status_code == 401


# ── Delete ───────────────────────────────────────────────────────────────────

def test_delete_corporate_returns_200(client, auth_headers):
    assert client.delete('/api/corporate/201', headers=auth_headers).status_code == 200


def test_delete_corporate_removes_from_list(client, auth_headers):
    client.delete('/api/corporate/201', headers=auth_headers)
    assert client.get('/api/corporate/201', headers=auth_headers).status_code == 404


def test_delete_corporate_not_found_returns_404(client, auth_headers):
    assert client.delete('/api/corporate/9999', headers=auth_headers).status_code == 404


def test_delete_corporate_requires_auth(client):
    assert client.delete('/api/corporate/201').status_code == 401
