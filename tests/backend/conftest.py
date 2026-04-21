"""
Shared pytest fixtures for all backend tests.
Resets and re-seeds the in-memory store before every test so each
test starts with a clean, known state.
"""
import sys
import os
import pytest

# Make the backend package importable from any working directory
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

import models.store as store_module
from app import app as flask_app


@pytest.fixture(scope='session')
def app():
    flask_app.config['TESTING'] = True
    flask_app.config['WTF_CSRF_ENABLED'] = False
    yield flask_app


@pytest.fixture(autouse=True)
def reset_store():
    """Clear all collections and re-seed before every individual test."""
    for key in list(store_module.db.keys()):
        store_module.db[key].clear()

    store_module._counters.update({
        "inquiry":   1000,
        "customer":  100,
        "corporate": 200,
        "booking":   300,
        "quotation": 400,
        "invoice":   500,
        "staff":     10,
    })

    from seed.seeder import seed_all
    seed_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    """Return Authorization header with a valid admin JWT token."""
    resp = client.post('/api/auth/login', json={
        'email': 'admin@shreeswamisamarthfoods.demo',
        'password': 'Admin@123'
    })
    assert resp.status_code == 200, f"Login failed: {resp.get_json()}"
    token = resp.get_json()['token']
    return {'Authorization': f'Bearer {token}'}
