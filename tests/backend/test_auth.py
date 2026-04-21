"""Tests for POST /api/auth/login and GET /api/auth/me"""


# ── Login ────────────────────────────────────────────────────────────────────

def test_login_valid_credentials_returns_200(client):
    resp = client.post('/api/auth/login', json={
        'email': 'admin@shreeswamisamarthfoods.demo',
        'password': 'Admin@123'
    })
    assert resp.status_code == 200


def test_login_returns_token(client):
    resp = client.post('/api/auth/login', json={
        'email': 'admin@shreeswamisamarthfoods.demo',
        'password': 'Admin@123'
    })
    data = resp.get_json()
    assert 'token' in data
    assert len(data['token']) > 10


def test_login_returns_user_object(client):
    data = client.post('/api/auth/login', json={
        'email': 'admin@shreeswamisamarthfoods.demo',
        'password': 'Admin@123'
    }).get_json()
    user = data['user']
    assert user['email'] == 'admin@shreeswamisamarthfoods.demo'
    assert user['role'] == 'admin'
    assert 'id' in user
    assert 'name' in user
    assert 'password' not in user


def test_login_email_is_case_insensitive(client):
    resp = client.post('/api/auth/login', json={
        'email': 'ADMIN@SHREESWAMISAMARTHFOODS.DEMO',
        'password': 'Admin@123'
    })
    assert resp.status_code == 200


def test_login_wrong_password_returns_401(client):
    resp = client.post('/api/auth/login', json={
        'email': 'admin@shreeswamisamarthfoods.demo',
        'password': 'wrongpassword'
    })
    assert resp.status_code == 401


def test_login_wrong_email_returns_401(client):
    resp = client.post('/api/auth/login', json={
        'email': 'nobody@example.com',
        'password': 'Admin@123'
    })
    assert resp.status_code == 401


def test_login_missing_password_returns_401(client):
    resp = client.post('/api/auth/login', json={
        'email': 'admin@shreeswamisamarthfoods.demo'
    })
    assert resp.status_code == 401


def test_login_missing_email_returns_401(client):
    resp = client.post('/api/auth/login', json={'password': 'Admin@123'})
    assert resp.status_code == 401


def test_login_empty_body_returns_401(client):
    resp = client.post('/api/auth/login', json={})
    assert resp.status_code == 401


def test_login_error_message_present(client):
    data = client.post('/api/auth/login', json={
        'email': 'bad@bad.com', 'password': 'bad'
    }).get_json()
    assert 'message' in data


# ── /me ──────────────────────────────────────────────────────────────────────

def test_me_with_valid_token_returns_200(client, auth_headers):
    resp = client.get('/api/auth/me', headers=auth_headers)
    assert resp.status_code == 200


def test_me_returns_identity(client, auth_headers):
    data = client.get('/api/auth/me', headers=auth_headers).get_json()
    assert data['email'] == 'admin@shreeswamisamarthfoods.demo'
    assert data['role'] == 'admin'


def test_me_without_token_returns_401(client):
    resp = client.get('/api/auth/me')
    assert resp.status_code == 401


def test_me_with_invalid_token_returns_401(client):
    resp = client.get('/api/auth/me', headers={
        'Authorization': 'Bearer this.is.not.a.valid.token'
    })
    assert resp.status_code == 401
