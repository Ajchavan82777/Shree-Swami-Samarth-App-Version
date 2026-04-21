"""Tests for /api/reports/summary and /api/reports/testimonials"""


# ── Summary ───────────────────────────────────────────────────────────────────

def test_reports_summary_requires_auth(client):
    assert client.get('/api/reports/summary').status_code == 401


def test_reports_summary_returns_200(client, auth_headers):
    assert client.get('/api/reports/summary', headers=auth_headers).status_code == 200


def test_reports_summary_has_revenue(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    assert 'revenue' in data
    rev = data['revenue']
    assert 'total_collected' in rev
    assert 'pending' in rev
    assert 'grand_total' in rev


def test_reports_summary_revenue_collected_correct(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    # Seeded advance_paid: 43575 + 548625 + 100000 = 692200
    assert data['revenue']['total_collected'] == 692200


def test_reports_summary_revenue_pending_correct(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    # Seeded balance_due: 43575 + 0 + 228650 = 272225
    assert data['revenue']['pending'] == 272225


def test_reports_summary_has_invoices_breakdown(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    assert 'invoices' in data
    inv = data['invoices']
    assert 'paid' in inv
    assert 'partial' in inv
    assert 'unpaid' in inv
    assert 'total' in inv


def test_reports_summary_invoices_counts_correct(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    inv = data['invoices']
    assert inv['paid'] == 1      # SSS-INV-502
    assert inv['partial'] == 2   # SSS-INV-501, SSS-INV-503
    assert inv['unpaid'] == 0
    assert inv['total'] == 3


def test_reports_summary_has_bookings_by_type(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    assert 'bookings_by_type' in data
    assert isinstance(data['bookings_by_type'], dict)


def test_reports_summary_bookings_by_type_correct(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    bbt = data['bookings_by_type']
    assert bbt.get('corporate') == 2   # bookings 302, 303
    assert bbt.get('wedding') == 1     # booking 301


def test_reports_summary_has_inquiry_by_status(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    assert 'inquiry_by_status' in data
    assert isinstance(data['inquiry_by_status'], dict)


def test_reports_summary_inquiry_by_status_correct(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    ibs = data['inquiry_by_status']
    assert ibs.get('new') == 2
    assert ibs.get('confirmed') == 2
    assert ibs.get('quoted') == 1
    assert ibs.get('contacted') == 1


def test_reports_summary_has_top_packages(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    assert 'top_packages' in data
    assert isinstance(data['top_packages'], list)


def test_reports_summary_has_totals(client, auth_headers):
    data = client.get('/api/reports/summary', headers=auth_headers).get_json()
    assert data['total_customers'] == 5
    assert data['total_corporate_leads'] == 4
    assert data['total_staff'] == 5


# ── Testimonials ──────────────────────────────────────────────────────────────

def test_testimonials_no_auth_required(client):
    assert client.get('/api/reports/testimonials').status_code == 200


def test_testimonials_returns_all_seeded(client):
    data = client.get('/api/reports/testimonials').get_json()
    assert len(data) == 5


def test_testimonials_have_required_fields(client):
    data = client.get('/api/reports/testimonials').get_json()
    for t in data:
        assert 'name' in t
        assert 'rating' in t
        assert 'text' in t


def test_testimonials_ratings_are_valid(client):
    data = client.get('/api/reports/testimonials').get_json()
    for t in data:
        assert 1 <= t['rating'] <= 5
