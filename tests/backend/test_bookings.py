"""Tests for /api/bookings CRUD"""

NEW_BOOKING = {
    'customer_name': 'Test Booking Customer',
    'event_type': 'wedding',
    'event_date': '2025-09-10',
    'venue': 'Test Hall, Pune',
    'guest_count': 200,
    'meal_preference': 'veg',
    'package_name': 'Wedding Gold Package',
    'total_amount': 110000,
    'advance_paid': 30000,
    'balance_due': 80000
}

# ── List ─────────────────────────────────────────────────────────────────────

def test_list_bookings_requires_auth(client):
    assert client.get('/api/bookings/').status_code == 401


def test_list_bookings_returns_200(client, auth_headers):
    assert client.get('/api/bookings/', headers=auth_headers).status_code == 200


def test_list_bookings_returns_all_seeded(client, auth_headers):
    data = client.get('/api/bookings/', headers=auth_headers).get_json()
    assert len(data) == 3


def test_list_bookings_filter_by_confirmed(client, auth_headers):
    data = client.get('/api/bookings/?status=confirmed', headers=auth_headers).get_json()
    assert all(b['status'] == 'confirmed' for b in data)
    assert len(data) == 2


def test_list_bookings_filter_by_ongoing(client, auth_headers):
    data = client.get('/api/bookings/?status=ongoing', headers=auth_headers).get_json()
    assert len(data) == 1
    assert data[0]['id'] == 303


# ── Get single ───────────────────────────────────────────────────────────────

def test_get_booking_by_id_returns_200(client, auth_headers):
    assert client.get('/api/bookings/301', headers=auth_headers).status_code == 200


def test_get_booking_returns_correct_data(client, auth_headers):
    data = client.get('/api/bookings/301', headers=auth_headers).get_json()
    assert data['id'] == 301
    assert data['customer_name'] == 'Deepika Rao'
    assert data['event_type'] == 'wedding'


def test_get_booking_not_found_returns_404(client, auth_headers):
    assert client.get('/api/bookings/9999', headers=auth_headers).status_code == 404


def test_get_booking_requires_auth(client):
    assert client.get('/api/bookings/301').status_code == 401


# ── Create ───────────────────────────────────────────────────────────────────

def test_create_booking_returns_201(client, auth_headers):
    resp = client.post('/api/bookings/', json=NEW_BOOKING, headers=auth_headers)
    assert resp.status_code == 201


def test_create_booking_has_id(client, auth_headers):
    data = client.post('/api/bookings/', json=NEW_BOOKING, headers=auth_headers).get_json()
    assert 'id' in data


def test_create_booking_default_status_confirmed(client, auth_headers):
    data = client.post('/api/bookings/', json=NEW_BOOKING, headers=auth_headers).get_json()
    assert data['status'] == 'confirmed'


def test_create_booking_has_created_at(client, auth_headers):
    data = client.post('/api/bookings/', json=NEW_BOOKING, headers=auth_headers).get_json()
    assert 'created_at' in data


def test_create_booking_appears_in_list(client, auth_headers):
    client.post('/api/bookings/', json=NEW_BOOKING, headers=auth_headers)
    data = client.get('/api/bookings/', headers=auth_headers).get_json()
    assert len(data) == 4


def test_create_booking_requires_auth(client):
    assert client.post('/api/bookings/', json=NEW_BOOKING).status_code == 401


# ── Update ───────────────────────────────────────────────────────────────────

def test_update_booking_returns_200(client, auth_headers):
    resp = client.put('/api/bookings/301', json={'status': 'completed'}, headers=auth_headers)
    assert resp.status_code == 200


def test_update_booking_persists_change(client, auth_headers):
    client.put('/api/bookings/301', json={'guest_count': 450}, headers=auth_headers)
    data = client.get('/api/bookings/301', headers=auth_headers).get_json()
    assert data['guest_count'] == 450


def test_update_booking_not_found_returns_404(client, auth_headers):
    assert client.put('/api/bookings/9999', json={'status': 'confirmed'}, headers=auth_headers).status_code == 404


def test_update_booking_requires_auth(client):
    assert client.put('/api/bookings/301', json={'status': 'confirmed'}).status_code == 401


# ── Delete ───────────────────────────────────────────────────────────────────

def test_delete_booking_returns_200(client, auth_headers):
    assert client.delete('/api/bookings/301', headers=auth_headers).status_code == 200


def test_delete_booking_removes_from_list(client, auth_headers):
    client.delete('/api/bookings/301', headers=auth_headers)
    assert client.get('/api/bookings/301', headers=auth_headers).status_code == 404


def test_delete_booking_not_found_returns_404(client, auth_headers):
    assert client.delete('/api/bookings/9999', headers=auth_headers).status_code == 404


def test_delete_booking_requires_auth(client):
    assert client.delete('/api/bookings/301').status_code == 401
