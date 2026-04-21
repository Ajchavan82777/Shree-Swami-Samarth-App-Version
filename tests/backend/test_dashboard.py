"""Tests for GET /api/dashboard/"""


def test_dashboard_requires_auth(client):
    resp = client.get('/api/dashboard/')
    assert resp.status_code == 401


def test_dashboard_returns_200(client, auth_headers):
    resp = client.get('/api/dashboard/', headers=auth_headers)
    assert resp.status_code == 200


def test_dashboard_has_summary_key(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'summary' in data


def test_dashboard_has_total_inquiries(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'total_inquiries' in data['summary']
    assert data['summary']['total_inquiries'] == 6


def test_dashboard_has_corporate_leads(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'corporate_leads' in data['summary']
    assert data['summary']['corporate_leads'] == 4


def test_dashboard_has_total_bookings(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'total_bookings' in data['summary']
    assert data['summary']['total_bookings'] == 3


def test_dashboard_has_pending_amount(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'pending_amount' in data['summary']
    assert isinstance(data['summary']['pending_amount'], (int, float))


def test_dashboard_has_total_revenue(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'total_revenue' in data['summary']
    assert isinstance(data['summary']['total_revenue'], (int, float))


def test_dashboard_has_recent_inquiries(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'recent_inquiries' in data
    assert isinstance(data['recent_inquiries'], list)
    assert len(data['recent_inquiries']) <= 5


def test_dashboard_has_recent_invoices(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'recent_invoices' in data
    assert isinstance(data['recent_invoices'], list)
    assert len(data['recent_invoices']) <= 5


def test_dashboard_has_upcoming_events(client, auth_headers):
    data = client.get('/api/dashboard/', headers=auth_headers).get_json()
    assert 'upcoming_events' in data
    assert isinstance(data['upcoming_events'], list)
