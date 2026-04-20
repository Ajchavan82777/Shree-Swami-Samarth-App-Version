"""
In-memory data store for demo purposes.
In production, replace with PostgreSQL/MySQL.
"""
from datetime import datetime

# All data stored in memory
db = {
    "users": [],
    "inquiries": [],
    "customers": [],
    "corporate_leads": [],
    "bookings": [],
    "quotations": [],
    "invoices": [],
    "packages": [],
    "staff": [],
    "payments": [],
    "testimonials": [],
}

# Counters
_counters = {
    "inquiry": 1000,
    "customer": 100,
    "corporate": 200,
    "booking": 300,
    "quotation": 400,
    "invoice": 500,
    "staff": 10,
}

def next_id(entity):
    _counters[entity] += 1
    return _counters[entity]

def now():
    return datetime.now().isoformat()

def find_by_id(collection, id):
    return next((x for x in db[collection] if x["id"] == id), None)

def find_index(collection, id):
    for i, x in enumerate(db[collection]):
        if x["id"] == id:
            return i
    return -1
