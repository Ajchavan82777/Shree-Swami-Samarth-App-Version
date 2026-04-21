"""Tests for /api/customers CRUD"""

NEW_CUSTOMER = {
    'name': 'New Test Customer',
    'email': 'newcust@example.com',
    'phone': '9000000002',
    'type': 'individual',
    'city': 'Pune'
}

# ── List ─────────────────────────────────────────────────────────────────────

def test_list_customers_requires_auth(client):
    assert client.get('/api/customers/').status_code == 401


def test_list_customers_returns_200(client, auth_headers):
    assert client.get('/api/customers/', headers=auth_headers).status_code == 200


def test_list_customers_returns_all_seeded(client, auth_headers):
    data = client.get('/api/customers/', headers=auth_headers).get_json()
    assert len(data) == 5


def test_list_customers_returns_list(client, auth_headers):
    data = client.get('/api/customers/', headers=auth_headers).get_json()
    assert isinstance(data, list)


# ── Get single ───────────────────────────────────────────────────────────────

def test_get_customer_by_id_returns_200(client, auth_headers):
    assert client.get('/api/customers/101', headers=auth_headers).status_code == 200


def test_get_customer_returns_correct_data(client, auth_headers):
    data = client.get('/api/customers/101', headers=auth_headers).get_json()
    assert data['id'] == 101
    assert data['name'] == 'Ramesh Mehta'


def test_get_customer_not_found_returns_404(client, auth_headers):
    assert client.get('/api/customers/9999', headers=auth_headers).status_code == 404


def test_get_customer_requires_auth(client):
    assert client.get('/api/customers/101').status_code == 401


# ── Create ───────────────────────────────────────────────────────────────────

def test_create_customer_returns_201(client, auth_headers):
    resp = client.post('/api/customers/', json=NEW_CUSTOMER, headers=auth_headers)
    assert resp.status_code == 201


def test_create_customer_has_id(client, auth_headers):
    data = client.post('/api/customers/', json=NEW_CUSTOMER, headers=auth_headers).get_json()
    assert 'id' in data


def test_create_customer_has_created_at(client, auth_headers):
    data = client.post('/api/customers/', json=NEW_CUSTOMER, headers=auth_headers).get_json()
    assert 'created_at' in data


def test_create_customer_has_zero_bookings(client, auth_headers):
    data = client.post('/api/customers/', json=NEW_CUSTOMER, headers=auth_headers).get_json()
    assert data['total_bookings'] == 0


def test_create_customer_has_zero_spent(client, auth_headers):
    data = client.post('/api/customers/', json=NEW_CUSTOMER, headers=auth_headers).get_json()
    assert data['total_spent'] == 0


def test_create_customer_appears_in_list(client, auth_headers):
    client.post('/api/customers/', json=NEW_CUSTOMER, headers=auth_headers)
    data = client.get('/api/customers/', headers=auth_headers).get_json()
    assert len(data) == 6


def test_create_customer_requires_auth(client):
    assert client.post('/api/customers/', json=NEW_CUSTOMER).status_code == 401


# ── Update ───────────────────────────────────────────────────────────────────

def test_update_customer_returns_200(client, auth_headers):
    resp = client.put('/api/customers/101', json={'city': 'Mumbai'}, headers=auth_headers)
    assert resp.status_code == 200


def test_update_customer_persists_change(client, auth_headers):
    client.put('/api/customers/101', json={'city': 'Nagpur'}, headers=auth_headers)
    data = client.get('/api/customers/101', headers=auth_headers).get_json()
    assert data['city'] == 'Nagpur'


def test_update_customer_not_found_returns_404(client, auth_headers):
    assert client.put('/api/customers/9999', json={'city': 'X'}, headers=auth_headers).status_code == 404


def test_update_customer_requires_auth(client):
    assert client.put('/api/customers/101', json={'city': 'X'}).status_code == 401


# ── Delete ───────────────────────────────────────────────────────────────────

def test_delete_customer_returns_200(client, auth_headers):
    assert client.delete('/api/customers/101', headers=auth_headers).status_code == 200


def test_delete_customer_removes_from_list(client, auth_headers):
    client.delete('/api/customers/101', headers=auth_headers)
    assert client.get('/api/customers/101', headers=auth_headers).status_code == 404


def test_delete_customer_not_found_returns_404(client, auth_headers):
    assert client.delete('/api/customers/9999', headers=auth_headers).status_code == 404


def test_delete_customer_requires_auth(client):
    assert client.delete('/api/customers/101').status_code == 401
