"""Tests for /api/inquiries CRUD"""

NEW_INQUIRY = {
    'name': 'Test Person',
    'email': 'test@example.com',
    'phone': '9000000001',
    'event_type': 'wedding',
    'service_type': 'Wedding Gold Package',
    'event_date': '2025-08-15',
    'venue': 'Test Venue, Pune',
    'guest_count': 100,
    'budget_range': '50000-60000',
    'meal_preference': 'veg',
    'notes': 'Test inquiry'
}

# ── List ─────────────────────────────────────────────────────────────────────

def test_list_inquiries_requires_auth(client):
    assert client.get('/api/inquiries/').status_code == 401


def test_list_inquiries_returns_200(client, auth_headers):
    assert client.get('/api/inquiries/', headers=auth_headers).status_code == 200


def test_list_inquiries_returns_all_seeded(client, auth_headers):
    data = client.get('/api/inquiries/', headers=auth_headers).get_json()
    assert len(data) == 6


def test_list_inquiries_filter_by_status_new(client, auth_headers):
    data = client.get('/api/inquiries/?status=new', headers=auth_headers).get_json()
    assert all(i['status'] == 'new' for i in data)
    assert len(data) == 2  # ids 1004, 1006 are "new"


def test_list_inquiries_filter_by_status_confirmed(client, auth_headers):
    data = client.get('/api/inquiries/?status=confirmed', headers=auth_headers).get_json()
    assert all(i['status'] == 'confirmed' for i in data)


def test_list_inquiries_filter_corporate(client, auth_headers):
    data = client.get('/api/inquiries/?is_corporate=true', headers=auth_headers).get_json()
    assert all(i['is_corporate'] is True for i in data)


# ── Get single ───────────────────────────────────────────────────────────────

def test_get_inquiry_by_id_returns_200(client, auth_headers):
    assert client.get('/api/inquiries/1001', headers=auth_headers).status_code == 200


def test_get_inquiry_returns_correct_data(client, auth_headers):
    data = client.get('/api/inquiries/1001', headers=auth_headers).get_json()
    assert data['id'] == 1001
    assert data['name'] == 'Anil Pawar'


def test_get_inquiry_not_found_returns_404(client, auth_headers):
    assert client.get('/api/inquiries/9999', headers=auth_headers).status_code == 404


def test_get_inquiry_requires_auth(client):
    assert client.get('/api/inquiries/1001').status_code == 401


# ── Create ───────────────────────────────────────────────────────────────────

def test_create_inquiry_returns_201(client, auth_headers):
    resp = client.post('/api/inquiries/', json=NEW_INQUIRY, headers=auth_headers)
    assert resp.status_code == 201


def test_create_inquiry_has_id(client, auth_headers):
    data = client.post('/api/inquiries/', json=NEW_INQUIRY, headers=auth_headers).get_json()
    assert 'id' in data


def test_create_inquiry_has_status_new(client, auth_headers):
    data = client.post('/api/inquiries/', json=NEW_INQUIRY, headers=auth_headers).get_json()
    assert data['status'] == 'new'


def test_create_inquiry_has_created_at(client, auth_headers):
    data = client.post('/api/inquiries/', json=NEW_INQUIRY, headers=auth_headers).get_json()
    assert 'created_at' in data


def test_create_corporate_inquiry_sets_is_corporate(client, auth_headers):
    payload = {**NEW_INQUIRY, 'event_type': 'corporate', 'company_name': 'Test Corp'}
    data = client.post('/api/inquiries/', json=payload, headers=auth_headers).get_json()
    assert data['is_corporate'] is True


def test_create_non_corporate_inquiry_sets_is_corporate_false(client, auth_headers):
    data = client.post('/api/inquiries/', json=NEW_INQUIRY, headers=auth_headers).get_json()
    assert data['is_corporate'] is False


def test_create_inquiry_appears_in_list(client, auth_headers):
    client.post('/api/inquiries/', json=NEW_INQUIRY, headers=auth_headers)
    data = client.get('/api/inquiries/', headers=auth_headers).get_json()
    assert len(data) == 7


def test_create_inquiry_public_no_auth_needed(client):
    # POST /api/inquiries/ is a public contact-form endpoint — no auth required
    assert client.post('/api/inquiries/', json=NEW_INQUIRY).status_code == 201


# ── Update ───────────────────────────────────────────────────────────────────

def test_update_inquiry_returns_200(client, auth_headers):
    resp = client.put('/api/inquiries/1001', json={'status': 'contacted'}, headers=auth_headers)
    assert resp.status_code == 200


def test_update_inquiry_persists_change(client, auth_headers):
    client.put('/api/inquiries/1001', json={'status': 'cancelled'}, headers=auth_headers)
    data = client.get('/api/inquiries/1001', headers=auth_headers).get_json()
    assert data['status'] == 'cancelled'


def test_update_inquiry_not_found_returns_404(client, auth_headers):
    assert client.put('/api/inquiries/9999', json={'status': 'new'}, headers=auth_headers).status_code == 404


def test_update_inquiry_requires_auth(client):
    assert client.put('/api/inquiries/1001', json={'status': 'new'}).status_code == 401


# ── Delete ───────────────────────────────────────────────────────────────────

def test_delete_inquiry_returns_200(client, auth_headers):
    assert client.delete('/api/inquiries/1001', headers=auth_headers).status_code == 200


def test_delete_inquiry_removes_from_list(client, auth_headers):
    client.delete('/api/inquiries/1001', headers=auth_headers)
    assert client.get('/api/inquiries/1001', headers=auth_headers).status_code == 404


def test_delete_inquiry_not_found_returns_404(client, auth_headers):
    assert client.delete('/api/inquiries/9999', headers=auth_headers).status_code == 404


def test_delete_inquiry_requires_auth(client):
    assert client.delete('/api/inquiries/1001').status_code == 401
