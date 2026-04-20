"""
Demo seed data for Shree Swami Samarth Food and Hospitality Services
Admin: admin@shreeswamisamarthfoods.demo / Admin@123
"""
from werkzeug.security import generate_password_hash
from models.store import db
from datetime import datetime, timedelta
import random

def seed_all():
    if db["users"]:
        return  # Already seeded
    
    print("🌱 Seeding demo data...")
    _seed_users()
    _seed_packages()
    _seed_staff()
    _seed_customers()
    _seed_corporate_leads()
    _seed_inquiries()
    _seed_bookings()
    _seed_quotations()
    _seed_invoices()
    _seed_testimonials()
    print("✅ Demo data seeded successfully!")
    print("   Admin: admin@shreeswamisamarthfoods.demo / Admin@123")

def _seed_users():
    db["users"] = [
        {
            "id": 1,
            "name": "Admin User",
            "email": "admin@shreeswamisamarthfoods.demo",
            "password": generate_password_hash("Admin@123"),
            "role": "admin",
            "created_at": "2024-01-01T00:00:00"
        }
    ]

def _seed_packages():
    db["packages"] = [
        {"id": 1, "name": "Corporate Daily Meal Plan", "category": "corporate", "price_per_person": 150,
         "min_persons": 25, "description": "Balanced daily office meals with breakfast, lunch & evening snacks",
         "inclusions": ["Breakfast", "Lunch (2 sabzi, dal, rice, roti)", "Evening Snacks", "Beverages"],
         "featured": True, "active": True},
        {"id": 2, "name": "Executive Lunch Service", "category": "corporate", "price_per_person": 350,
         "min_persons": 10, "description": "Premium executive lunch with multi-course meal for leadership teams",
         "inclusions": ["Welcome Drink", "Soup", "4 Main Courses", "Dessert", "Tea/Coffee"],
         "featured": True, "active": True},
        {"id": 3, "name": "Office Buffet Package", "category": "corporate", "price_per_person": 450,
         "min_persons": 50, "description": "Full buffet for office celebrations, product launches, team events",
         "inclusions": ["Welcome Drinks", "Starters (veg/non-veg)", "Main Course Buffet", "Desserts", "Live Counter"],
         "featured": True, "active": True},
        {"id": 4, "name": "Wedding Platinum Package", "category": "wedding", "price_per_person": 800,
         "min_persons": 100, "description": "Complete wedding catering with live counters and premium service",
         "inclusions": ["Welcome Drinks", "Starters", "Main Course (12 items)", "Biryani Counter", "Desserts", "Pan Counter"],
         "featured": True, "active": True},
        {"id": 5, "name": "Wedding Gold Package", "category": "wedding", "price_per_person": 550,
         "min_persons": 75, "description": "Elegant wedding catering package for mid-size celebrations",
         "inclusions": ["Welcome Drinks", "Starters (6 items)", "Main Course (8 items)", "Desserts"],
         "featured": False, "active": True},
        {"id": 6, "name": "Conference Catering", "category": "corporate", "price_per_person": 200,
         "min_persons": 20, "description": "Professional conference and meeting catering service",
         "inclusions": ["Morning Tea/Coffee", "Breakfast", "Lunch", "Afternoon Snacks", "Beverages"],
         "featured": False, "active": True},
        {"id": 7, "name": "Birthday & Social Event", "category": "events", "price_per_person": 400,
         "min_persons": 30, "description": "Customized catering for birthday parties and social gatherings",
         "inclusions": ["Snacks", "Main Course", "Birthday Cake Setup", "Desserts", "Beverages"],
         "featured": False, "active": True},
        {"id": 8, "name": "Pantry & Snack Service", "category": "corporate", "price_per_person": 80,
         "min_persons": 20, "description": "Daily office pantry service with healthy snacks and beverages",
         "inclusions": ["Morning Snacks", "Evening Snacks", "Tea/Coffee (unlimited)", "Fresh Juice"],
         "featured": False, "active": True},
    ]

def _seed_staff():
    db["staff"] = [
        {"id": 1, "name": "Rajesh Patil", "role": "Head Chef", "phone": "9876543210", "email": "rajesh@sss.demo",
         "specialization": "Maharashtrian & North Indian", "experience_years": 12, "active": True},
        {"id": 2, "name": "Suresh Kumar", "role": "Sous Chef", "phone": "9876543211", "email": "suresh@sss.demo",
         "specialization": "South Indian & Continental", "experience_years": 8, "active": True},
        {"id": 3, "name": "Meena Sharma", "role": "Event Coordinator", "phone": "9876543212", "email": "meena@sss.demo",
         "specialization": "Wedding & Corporate Events", "experience_years": 6, "active": True},
        {"id": 4, "name": "Anand Joshi", "role": "Operations Manager", "phone": "9876543213", "email": "anand@sss.demo",
         "specialization": "Logistics & Delivery", "experience_years": 10, "active": True},
        {"id": 5, "name": "Priya Desai", "role": "Billing Executive", "phone": "9876543214", "email": "priya@sss.demo",
         "specialization": "Accounts & Invoicing", "experience_years": 4, "active": True},
    ]

def _seed_customers():
    db["customers"] = [
        {"id": 101, "name": "Ramesh Mehta", "email": "ramesh@example.com", "phone": "9123456781",
         "type": "individual", "city": "Pune", "total_bookings": 3, "total_spent": 125000, "created_at": "2024-01-15T10:00:00"},
        {"id": 102, "name": "Sunita Kapoor", "email": "sunita@example.com", "phone": "9123456782",
         "type": "individual", "city": "Mumbai", "total_bookings": 1, "total_spent": 45000, "created_at": "2024-02-01T10:00:00"},
        {"id": 103, "name": "Tech Mahindra HR", "email": "hr@techmahindra.example.com", "phone": "9123456783",
         "type": "corporate", "company": "Tech Mahindra Ltd", "city": "Pune", "total_bookings": 12, "total_spent": 840000, "created_at": "2023-06-01T10:00:00"},
        {"id": 104, "name": "Vijay Sharma", "email": "vijay@example.com", "phone": "9123456784",
         "type": "individual", "city": "Nashik", "total_bookings": 2, "total_spent": 85000, "created_at": "2024-03-10T10:00:00"},
        {"id": 105, "name": "Infosys Campus HR", "email": "admin@infosys.example.com", "phone": "9123456785",
         "type": "corporate", "company": "Infosys BPM", "city": "Pune", "total_bookings": 8, "total_spent": 620000, "created_at": "2023-09-01T10:00:00"},
    ]

def _seed_corporate_leads():
    db["corporate_leads"] = [
        {"id": 201, "company_name": "Tech Mahindra Ltd", "contact_name": "Kavita Nair",
         "email": "kavita.nair@tm.example.com", "phone": "9234567890", "city": "Pune",
         "employees": 500, "service_type": "Daily Meal Plan", "monthly_value": 75000,
         "status": "active", "contract_start": "2024-01-01", "contract_end": "2024-12-31",
         "billing_cycle": "monthly", "notes": "Long-term client, very satisfied", "created_at": "2023-12-15T10:00:00"},
        {"id": 202, "company_name": "Infosys BPM", "contact_name": "Ravi Shetty",
         "email": "ravi.shetty@infosys.example.com", "phone": "9234567891", "city": "Pune",
         "employees": 800, "service_type": "Daily Meal + Buffet Events", "monthly_value": 120000,
         "status": "active", "contract_start": "2024-02-01", "contract_end": "2025-01-31",
         "billing_cycle": "monthly", "notes": "High-value account", "created_at": "2024-01-20T10:00:00"},
        {"id": 203, "company_name": "Wipro Technologies", "contact_name": "Sunil Jain",
         "email": "sunil.jain@wipro.example.com", "phone": "9234567892", "city": "Pune",
         "employees": 300, "service_type": "Conference & Executive Lunch", "monthly_value": 45000,
         "status": "negotiation", "contract_start": None, "contract_end": None,
         "billing_cycle": "monthly", "notes": "In discussion, demo scheduled", "created_at": "2024-04-01T10:00:00"},
        {"id": 204, "company_name": "Bajaj Auto Ltd", "contact_name": "Pradeep Kulkarni",
         "email": "pradeep@bajaj.example.com", "phone": "9234567893", "city": "Aurangabad",
         "employees": 1200, "service_type": "Bulk Employee Meal Service", "monthly_value": 180000,
         "status": "prospect", "contract_start": None, "contract_end": None,
         "billing_cycle": "monthly", "notes": "Huge opportunity, needs detailed proposal", "created_at": "2024-04-10T10:00:00"},
    ]

def _seed_inquiries():
    statuses = ["new", "contacted", "quoted", "confirmed", "cancelled"]
    types = ["corporate", "wedding", "event", "general"]
    
    db["inquiries"] = [
        {"id": 1001, "name": "Anil Pawar", "email": "anil@example.com", "phone": "9345678901",
         "company_name": "Pawar & Sons Pvt Ltd", "event_type": "corporate", "service_type": "Daily Meal Plan",
         "event_date": "2024-05-15", "venue": "Shivajinagar, Pune", "guest_count": 150,
         "budget_range": "15000-20000/month", "meal_preference": "veg",
         "notes": "Looking for long-term office meal subscription", "status": "quoted",
         "created_at": "2024-04-01T09:00:00", "is_corporate": True},
        {"id": 1002, "name": "Deepika Rao", "email": "deepika@example.com", "phone": "9345678902",
         "company_name": None, "event_type": "wedding", "service_type": "Wedding Platinum Package",
         "event_date": "2024-06-20", "venue": "Ganesh Mahal, Nashik", "guest_count": 400,
         "budget_range": "3-4 lakhs", "meal_preference": "mixed",
         "notes": "Full wedding catering including rituals food", "status": "confirmed",
         "created_at": "2024-03-20T10:00:00", "is_corporate": False},
        {"id": 1003, "name": "HR Manager", "email": "hr@xlri.example.com", "phone": "9345678903",
         "company_name": "XLRI Jamshedpur Campus", "event_type": "corporate", "service_type": "Conference Catering",
         "event_date": "2024-05-10", "venue": "XLRI Campus", "guest_count": 200,
         "budget_range": "40000-50000", "meal_preference": "veg",
         "notes": "Annual conference, 2-day event", "status": "confirmed",
         "created_at": "2024-04-05T11:00:00", "is_corporate": True},
        {"id": 1004, "name": "Manish Gupta", "email": "manish@example.com", "phone": "9345678904",
         "company_name": None, "event_type": "event", "service_type": "Birthday & Social Event",
         "event_date": "2024-05-25", "venue": "Koregaon Park, Pune", "guest_count": 80,
         "budget_range": "30000-40000", "meal_preference": "mixed",
         "notes": "25th anniversary party, needs live counters", "status": "new",
         "created_at": "2024-04-12T14:00:00", "is_corporate": False},
        {"id": 1005, "name": "Sneha Joshi", "email": "sneha@example.com", "phone": "9345678905",
         "company_name": "MindTree Consulting", "event_type": "corporate", "service_type": "Office Buffet Package",
         "event_date": "2024-05-20", "venue": "Baner, Pune", "guest_count": 120,
         "budget_range": "50000-60000", "meal_preference": "veg",
         "notes": "Team building day event catering", "status": "contacted",
         "created_at": "2024-04-10T09:30:00", "is_corporate": True},
        {"id": 1006, "name": "Rohit Singh", "email": "rohit@example.com", "phone": "9345678906",
         "company_name": None, "event_type": "wedding", "service_type": "Wedding Gold Package",
         "event_date": "2024-07-15", "venue": "Shri Palace Banquet, Mumbai", "guest_count": 250,
         "budget_range": "1.5-2 lakhs", "meal_preference": "mixed",
         "notes": "Reception dinner only", "status": "new",
         "created_at": "2024-04-13T16:00:00", "is_corporate": False},
    ]

def _seed_bookings():
    db["bookings"] = [
        {"id": 301, "inquiry_id": 1002, "customer_id": 102, "customer_name": "Deepika Rao",
         "event_type": "wedding", "package_id": 4, "package_name": "Wedding Platinum Package",
         "event_date": "2024-06-20", "venue": "Ganesh Mahal, Nashik", "guest_count": 400,
         "meal_preference": "mixed", "status": "confirmed", "assigned_staff": [1, 2, 3],
         "total_amount": 320000, "advance_paid": 96000, "balance_due": 224000,
         "notes": "Full wedding catering", "created_at": "2024-03-25T10:00:00"},
        {"id": 302, "inquiry_id": 1003, "customer_id": 103, "customer_name": "XLRI Campus HR",
         "event_type": "corporate", "package_id": 6, "package_name": "Conference Catering",
         "event_date": "2024-05-10", "venue": "XLRI Campus, Jamshedpur", "guest_count": 200,
         "meal_preference": "veg", "status": "confirmed", "assigned_staff": [2, 4],
         "total_amount": 48000, "advance_paid": 24000, "balance_due": 24000,
         "notes": "2-day conference", "created_at": "2024-04-06T10:00:00"},
        {"id": 303, "inquiry_id": None, "customer_id": 103, "customer_name": "Tech Mahindra HR",
         "event_type": "corporate", "package_id": 1, "package_name": "Corporate Daily Meal Plan",
         "event_date": "2024-05-01", "venue": "Tech Mahindra Office, Pune", "guest_count": 150,
         "meal_preference": "mixed", "status": "ongoing", "assigned_staff": [1, 4],
         "total_amount": 22500, "advance_paid": 22500, "balance_due": 0,
         "notes": "Monthly recurring - May 2024", "created_at": "2024-04-28T10:00:00"},
    ]

def _seed_quotations():
    db["quotations"] = [
        {"id": 401, "inquiry_id": 1001, "customer_name": "Anil Pawar",
         "company_name": "Pawar & Sons Pvt Ltd", "email": "anil@example.com",
         "event_type": "corporate", "event_date": "2024-05-15",
         "items": [
             {"description": "Corporate Daily Meal Plan", "qty": 150, "rate": 150, "total": 22500},
             {"description": "Evening Snacks Extra", "qty": 150, "rate": 30, "total": 4500},
         ],
         "subtotal": 27000, "discount": 2000, "tax_rate": 5, "tax_amount": 1250,
         "total": 26250, "notes": "Valid for 15 days. Prices may vary with guest count changes.",
         "status": "sent", "created_at": "2024-04-03T10:00:00"},
        {"id": 402, "inquiry_id": 1003, "customer_name": "HR Manager",
         "company_name": "XLRI Campus", "email": "hr@xlri.example.com",
         "event_type": "corporate", "event_date": "2024-05-10",
         "items": [
             {"description": "Conference Catering - Day 1", "qty": 200, "rate": 200, "total": 40000},
             {"description": "Conference Catering - Day 2", "qty": 200, "rate": 200, "total": 40000},
             {"description": "Welcome Kit & Special Setup", "qty": 1, "rate": 5000, "total": 5000},
         ],
         "subtotal": 85000, "discount": 5000, "tax_rate": 5, "tax_amount": 4000,
         "total": 84000, "notes": "Includes setup and service charges.",
         "status": "converted", "created_at": "2024-04-07T10:00:00"},
    ]

def _seed_invoices():
    db["invoices"] = [
        {"id": 501, "invoice_number": "SSS-INV-501", "booking_id": 302,
         "customer_name": "XLRI Campus HR", "company_name": "XLRI Jamshedpur",
         "email": "hr@xlri.example.com", "phone": "9345678903",
         "event_type": "Conference Catering", "event_date": "2024-05-10",
         "venue": "XLRI Campus, Jamshedpur",
         "items": [
             {"description": "Conference Catering - Day 1 (200 pax)", "qty": 200, "rate": 200, "total": 40000},
             {"description": "Conference Catering - Day 2 (200 pax)", "qty": 200, "rate": 200, "total": 40000},
             {"description": "Welcome Kit & Special Setup", "qty": 1, "rate": 5000, "total": 5000},
             {"description": "Service Charges", "qty": 1, "rate": 3000, "total": 3000},
         ],
         "subtotal": 88000, "discount": 5000, "tax_rate": 5, "tax_amount": 4150,
         "grand_total": 87150, "advance_paid": 43575, "balance_due": 43575,
         "payment_status": "partial", "invoice_date": "2024-04-07",
         "due_date": "2024-05-15", "notes": "Balance due within 7 days of event completion.",
         "created_at": "2024-04-07T11:00:00"},
        {"id": 502, "invoice_number": "SSS-INV-502", "booking_id": 303,
         "customer_name": "Tech Mahindra HR", "company_name": "Tech Mahindra Ltd",
         "email": "hr@techmahindra.example.com", "phone": "9123456783",
         "event_type": "Corporate Daily Meal Plan", "event_date": "2024-05-01",
         "venue": "Tech Mahindra Office, Shivajinagar",
         "items": [
             {"description": "Daily Meal Plan - May 2024 (150 pax × 22 days)", "qty": 3300, "rate": 150, "total": 495000},
             {"description": "Special Festive Meal - Labour Day", "qty": 150, "rate": 250, "total": 37500},
         ],
         "subtotal": 532500, "discount": 10000, "tax_rate": 5, "tax_amount": 26125,
         "grand_total": 548625, "advance_paid": 548625, "balance_due": 0,
         "payment_status": "paid", "invoice_date": "2024-05-02",
         "due_date": "2024-05-10", "notes": "Thank you for your continued partnership.",
         "created_at": "2024-05-02T09:00:00"},
        {"id": 503, "invoice_number": "SSS-INV-503", "booking_id": 301,
         "customer_name": "Deepika Rao", "company_name": None,
         "email": "deepika@example.com", "phone": "9345678902",
         "event_type": "Wedding Catering", "event_date": "2024-06-20",
         "venue": "Ganesh Mahal, Nashik",
         "items": [
             {"description": "Wedding Platinum Package (400 pax)", "qty": 400, "rate": 750, "total": 300000},
             {"description": "Live Counters (Pasta, Dosa, Chat)", "qty": 3, "rate": 5000, "total": 15000},
             {"description": "Decoration & Floral Setup", "qty": 1, "rate": 8000, "total": 8000},
         ],
         "subtotal": 323000, "discount": 10000, "tax_rate": 5, "tax_amount": 15650,
         "grand_total": 328650, "advance_paid": 100000, "balance_due": 228650,
         "payment_status": "partial", "invoice_date": "2024-03-25",
         "due_date": "2024-06-20", "notes": "Balance to be cleared on event day.",
         "created_at": "2024-03-25T12:00:00"},
    ]
    
    db["payments"] = [
        {"id": 1, "invoice_id": 501, "invoice_number": "SSS-INV-501", "amount": 43575,
         "mode": "NEFT", "date": "2024-04-08", "reference": "TXN20240408001", "notes": "Advance payment"},
        {"id": 2, "invoice_id": 502, "invoice_number": "SSS-INV-502", "amount": 548625,
         "mode": "RTGS", "date": "2024-05-03", "reference": "TXN20240503002", "notes": "Full payment"},
        {"id": 3, "invoice_id": 503, "invoice_number": "SSS-INV-503", "amount": 100000,
         "mode": "Cheque", "date": "2024-03-26", "reference": "CHQ00123456", "notes": "Booking advance"},
    ]

def _seed_testimonials():
    db["testimonials"] = [
        {"id": 1, "name": "Kavita Nair", "company": "Tech Mahindra", "role": "HR Manager",
         "rating": 5, "text": "Shree Swami Samarth has been our trusted catering partner for over a year. Their daily meal service is hygienic, timely, and delicious. Our employees absolutely love it!"},
        {"id": 2, "name": "Deepika Rao", "company": None, "role": "Bride",
         "rating": 5, "text": "Our wedding catering was absolutely perfect! Every dish was restaurant quality and the service was impeccable. Highly recommend for weddings!"},
        {"id": 3, "name": "Ravi Shetty", "company": "Infosys BPM", "role": "Operations Head",
         "rating": 5, "text": "Professional, punctual, and palate-pleasing! Their corporate buffets for our office events always receive great feedback. True hospitality experts."},
        {"id": 4, "name": "Manish Gupta", "company": None, "role": "Client",
         "rating": 4, "text": "Organized our anniversary party with them. The food quality and live counters were exceptional. Will definitely book again for future events."},
        {"id": 5, "name": "Dr. Suresh Patil", "company": "XLRI Institute", "role": "Conference Coordinator",
         "rating": 5, "text": "They managed catering for our 2-day national conference flawlessly. Timely service, quality food, and professional staff. Outstanding!"},
    ]
