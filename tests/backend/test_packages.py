"""Tests for /api/packages CRUD (GET endpoints are public; write endpoints require auth)"""

NEW_PACKAGE = {
    'name': 'Test Banquet Package',
    'category': 'events',
    'price_per_person': 500,
    'min_persons': 50,
    'description': 'Test package for automated tests',
    'inclusions': ['Starters', 'Main Course', 'Desserts'],
    'featured': False
}

# ── List (public) ─────────────────────────────────────────────────────────────

def test_list_packages_no_auth_required(client):
    assert client.get('/api/packages/').status_code == 200


def test_list_packages_returns_all_seeded(client):
    data = client.get('/api/packages/').get_json()
    assert len(data) == 8


def test_list_packages_filter_by_corporate(client):
    data = client.get('/api/packages/?category=corporate').get_json()
    assert all(p['category'] == 'corporate' for p in data)
    assert len(data) == 5  # 5 corporate packages seeded


def test_list_packages_filter_by_wedding(client):
    data = client.get('/api/packages/?category=wedding').get_json()
    assert all(p['category'] == 'wedding' for p in data)
    assert len(data) == 2


def test_list_packages_filter_by_events(client):
    data = client.get('/api/packages/?category=events').get_json()
    assert all(p['category'] == 'events' for p in data)
    assert len(data) == 1


# ── Public active list ────────────────────────────────────────────────────────

def test_public_packages_no_auth_required(client):
    assert client.get('/api/packages/public').status_code == 200


def test_public_packages_returns_only_active(client):
    data = client.get('/api/packages/public').get_json()
    assert all(p['active'] is True for p in data)


# ── Get single (public) ───────────────────────────────────────────────────────

def test_get_package_by_id_no_auth_required(client):
    assert client.get('/api/packages/1').status_code == 200


def test_get_package_returns_correct_data(client):
    data = client.get('/api/packages/1').get_json()
    assert data['id'] == 1
    assert data['name'] == 'Corporate Daily Meal Plan'
    assert data['category'] == 'corporate'


def test_get_package_not_found_returns_404(client):
    assert client.get('/api/packages/9999').status_code == 404


# ── Create ───────────────────────────────────────────────────────────────────

def test_create_package_returns_201(client, auth_headers):
    resp = client.post('/api/packages/', json=NEW_PACKAGE, headers=auth_headers)
    assert resp.status_code == 201


def test_create_package_has_id(client, auth_headers):
    data = client.post('/api/packages/', json=NEW_PACKAGE, headers=auth_headers).get_json()
    assert 'id' in data


def test_create_package_active_by_default(client, auth_headers):
    data = client.post('/api/packages/', json=NEW_PACKAGE, headers=auth_headers).get_json()
    assert data['active'] is True


def test_create_package_has_created_at(client, auth_headers):
    data = client.post('/api/packages/', json=NEW_PACKAGE, headers=auth_headers).get_json()
    assert 'created_at' in data


def test_create_package_appears_in_list(client, auth_headers):
    client.post('/api/packages/', json=NEW_PACKAGE, headers=auth_headers)
    data = client.get('/api/packages/').get_json()
    assert len(data) == 9


def test_create_package_requires_auth(client):
    assert client.post('/api/packages/', json=NEW_PACKAGE).status_code == 401


# ── Update ───────────────────────────────────────────────────────────────────

def test_update_package_returns_200(client, auth_headers):
    resp = client.put('/api/packages/1', json={'price_per_person': 175}, headers=auth_headers)
    assert resp.status_code == 200


def test_update_package_persists_change(client, auth_headers):
    client.put('/api/packages/1', json={'price_per_person': 200}, headers=auth_headers)
    data = client.get('/api/packages/1').get_json()
    assert data['price_per_person'] == 200


def test_update_package_deactivate(client, auth_headers):
    client.put('/api/packages/1', json={'active': False}, headers=auth_headers)
    data = client.get('/api/packages/1').get_json()
    assert data['active'] is False


def test_update_package_not_found_returns_404(client, auth_headers):
    assert client.put('/api/packages/9999', json={}, headers=auth_headers).status_code == 404


def test_update_package_requires_auth(client):
    assert client.put('/api/packages/1', json={'price_per_person': 200}).status_code == 401


# ── Delete ───────────────────────────────────────────────────────────────────

def test_delete_package_returns_200(client, auth_headers):
    assert client.delete('/api/packages/1', headers=auth_headers).status_code == 200


def test_delete_package_removes_from_list(client, auth_headers):
    client.delete('/api/packages/1', headers=auth_headers)
    assert client.get('/api/packages/1').status_code == 404


def test_delete_package_not_found_returns_404(client, auth_headers):
    assert client.delete('/api/packages/9999', headers=auth_headers).status_code == 404


def test_delete_package_requires_auth(client):
    assert client.delete('/api/packages/1').status_code == 401
