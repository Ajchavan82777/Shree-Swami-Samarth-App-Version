"""Tests for /api/staff CRUD"""

NEW_STAFF = {
    'name': 'Test Chef',
    'role': 'Junior Chef',
    'phone': '9000000099',
    'email': 'testchef@sss.demo',
    'specialization': 'Punjabi & Mughlai',
    'experience_years': 3
}

# ── List ─────────────────────────────────────────────────────────────────────

def test_list_staff_requires_auth(client):
    assert client.get('/api/staff/').status_code == 401


def test_list_staff_returns_200(client, auth_headers):
    assert client.get('/api/staff/', headers=auth_headers).status_code == 200


def test_list_staff_returns_all_seeded(client, auth_headers):
    data = client.get('/api/staff/', headers=auth_headers).get_json()
    assert len(data) == 5


def test_list_staff_returns_list(client, auth_headers):
    data = client.get('/api/staff/', headers=auth_headers).get_json()
    assert isinstance(data, list)


# ── Get single ───────────────────────────────────────────────────────────────

def test_get_staff_by_id_returns_200(client, auth_headers):
    assert client.get('/api/staff/1', headers=auth_headers).status_code == 200


def test_get_staff_returns_correct_data(client, auth_headers):
    data = client.get('/api/staff/1', headers=auth_headers).get_json()
    assert data['id'] == 1
    assert data['name'] == 'Rajesh Patil'
    assert data['role'] == 'Head Chef'


def test_get_staff_not_found_returns_404(client, auth_headers):
    assert client.get('/api/staff/9999', headers=auth_headers).status_code == 404


def test_get_staff_requires_auth(client):
    assert client.get('/api/staff/1').status_code == 401


# ── Create ───────────────────────────────────────────────────────────────────

def test_create_staff_returns_201(client, auth_headers):
    resp = client.post('/api/staff/', json=NEW_STAFF, headers=auth_headers)
    assert resp.status_code == 201


def test_create_staff_has_id(client, auth_headers):
    data = client.post('/api/staff/', json=NEW_STAFF, headers=auth_headers).get_json()
    assert 'id' in data


def test_create_staff_active_by_default(client, auth_headers):
    data = client.post('/api/staff/', json=NEW_STAFF, headers=auth_headers).get_json()
    assert data['active'] is True


def test_create_staff_has_created_at(client, auth_headers):
    data = client.post('/api/staff/', json=NEW_STAFF, headers=auth_headers).get_json()
    assert 'created_at' in data


def test_create_staff_appears_in_list(client, auth_headers):
    client.post('/api/staff/', json=NEW_STAFF, headers=auth_headers)
    data = client.get('/api/staff/', headers=auth_headers).get_json()
    assert len(data) == 6


def test_create_staff_requires_auth(client):
    assert client.post('/api/staff/', json=NEW_STAFF).status_code == 401


# ── Update ───────────────────────────────────────────────────────────────────

def test_update_staff_returns_200(client, auth_headers):
    resp = client.put('/api/staff/1', json={'experience_years': 15}, headers=auth_headers)
    assert resp.status_code == 200


def test_update_staff_persists_change(client, auth_headers):
    client.put('/api/staff/1', json={'role': 'Executive Chef'}, headers=auth_headers)
    data = client.get('/api/staff/1', headers=auth_headers).get_json()
    assert data['role'] == 'Executive Chef'


def test_update_staff_deactivate(client, auth_headers):
    client.put('/api/staff/1', json={'active': False}, headers=auth_headers)
    data = client.get('/api/staff/1', headers=auth_headers).get_json()
    assert data['active'] is False


def test_update_staff_not_found_returns_404(client, auth_headers):
    assert client.put('/api/staff/9999', json={'role': 'X'}, headers=auth_headers).status_code == 404


def test_update_staff_requires_auth(client):
    assert client.put('/api/staff/1', json={'role': 'X'}).status_code == 401


# ── Delete ───────────────────────────────────────────────────────────────────

def test_delete_staff_returns_200(client, auth_headers):
    assert client.delete('/api/staff/1', headers=auth_headers).status_code == 200


def test_delete_staff_removes_from_list(client, auth_headers):
    client.delete('/api/staff/1', headers=auth_headers)
    assert client.get('/api/staff/1', headers=auth_headers).status_code == 404


def test_delete_staff_not_found_returns_404(client, auth_headers):
    assert client.delete('/api/staff/9999', headers=auth_headers).status_code == 404


def test_delete_staff_requires_auth(client):
    assert client.delete('/api/staff/1').status_code == 401
