"""Tests for GET /api/health"""


def test_health_returns_200(client):
    resp = client.get('/api/health')
    assert resp.status_code == 200


def test_health_status_ok(client):
    data = client.get('/api/health').get_json()
    assert data['status'] == 'ok'


def test_health_has_service_name(client):
    data = client.get('/api/health').get_json()
    assert 'service' in data
    assert len(data['service']) > 0


def test_health_has_timestamp(client):
    data = client.get('/api/health').get_json()
    assert 'timestamp' in data


def test_health_has_version(client):
    data = client.get('/api/health').get_json()
    assert data['version'] == '1.0.0'


def test_health_no_auth_required(client):
    # Health endpoint must be publicly accessible
    resp = client.get('/api/health')
    assert resp.status_code != 401
