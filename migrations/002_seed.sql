-- ============================================================
--  SHREE SWAMI SAMARTH CATERING APP
--  Migration 002 — Seed Data
--  Run AFTER 001_schema.sql
--  Admin login: admin@shreeswamisamarthfoods.demo / Admin@123
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
INSERT INTO users (name, email, password, role) VALUES (
    'Admin User',
    'admin@shreeswamisamarthfoods.demo',
    'scrypt:32768:8:1$K31HSuMTta9X2Bea$47a539739c96b9590576012c02e2b1723010dc457596f177e8badc8795d6d6bde9b292ac1b405061b8eee623ab3336b228fbb58c15a4992886d96e97cc9e18de',
    'admin'
);

-- ── Packages ─────────────────────────────────────────────────
INSERT INTO packages (name, category, price_per_person, min_persons, description, inclusions, featured, active) VALUES
('Corporate Daily Meal Plan',   'corporate', 150,  25, 'Balanced daily office meals with breakfast, lunch & evening snacks',              '["Breakfast","Lunch (2 sabzi, dal, rice, roti)","Evening Snacks","Beverages"]', TRUE,  TRUE),
('Executive Lunch Service',     'corporate', 350,  10, 'Premium executive lunch with multi-course meal for leadership teams',             '["Welcome Drink","Soup","4 Main Courses","Dessert","Tea/Coffee"]',             TRUE,  TRUE),
('Office Buffet Package',       'corporate', 450,  50, 'Full buffet for office celebrations, product launches, team events',             '["Welcome Drinks","Starters (veg/non-veg)","Main Course Buffet","Desserts","Live Counter"]', TRUE, TRUE),
('Wedding Platinum Package',    'wedding',   800, 100, 'Complete wedding catering with live counters and premium service',               '["Welcome Drinks","Starters","Main Course (12 items)","Biryani Counter","Desserts","Pan Counter"]', TRUE, TRUE),
('Wedding Gold Package',        'wedding',   550,  75, 'Elegant wedding catering package for mid-size celebrations',                    '["Welcome Drinks","Starters (6 items)","Main Course (8 items)","Desserts"]',  FALSE, TRUE),
('Conference Catering',         'corporate', 200,  20, 'Professional conference and meeting catering service',                          '["Morning Tea/Coffee","Breakfast","Lunch","Afternoon Snacks","Beverages"]',   FALSE, TRUE),
('Birthday & Social Event',     'events',    400,  30, 'Customized catering for birthday parties and social gatherings',                '["Snacks","Main Course","Birthday Cake Setup","Desserts","Beverages"]',        FALSE, TRUE),
('Pantry & Snack Service',      'corporate',  80,  20, 'Daily office pantry service with healthy snacks and beverages',                 '["Morning Snacks","Evening Snacks","Tea/Coffee (unlimited)","Fresh Juice"]',   FALSE, TRUE);

-- ── Staff ─────────────────────────────────────────────────────
INSERT INTO staff (name, role, phone, email, specialization, experience_years, active) VALUES
('Rajesh Patil',  'Head Chef',           '9876543210', 'rajesh@sss.demo', 'Maharashtrian & North Indian',    12, TRUE),
('Suresh Kumar',  'Sous Chef',           '9876543211', 'suresh@sss.demo', 'South Indian & Continental',       8, TRUE),
('Meena Sharma',  'Event Coordinator',   '9876543212', 'meena@sss.demo',  'Wedding & Corporate Events',       6, TRUE),
('Anand Joshi',   'Operations Manager',  '9876543213', 'anand@sss.demo',  'Logistics & Delivery',            10, TRUE),
('Priya Desai',   'Billing Executive',   '9876543214', 'priya@sss.demo',  'Accounts & Invoicing',             4, TRUE);

-- ── Customers ────────────────────────────────────────────────
INSERT INTO customers (name, email, phone, type, company, city, total_bookings, total_spent) VALUES
('Ramesh Mehta',        'ramesh@example.com',              '9123456781', 'individual', NULL,                 'Pune',   3, 125000),
('Sunita Kapoor',       'sunita@example.com',              '9123456782', 'individual', NULL,                 'Mumbai', 1,  45000),
('Tech Mahindra HR',    'hr@techmahindra.example.com',     '9123456783', 'corporate',  'Tech Mahindra Ltd',  'Pune',  12, 840000),
('Vijay Sharma',        'vijay@example.com',               '9123456784', 'individual', NULL,                 'Nashik', 2,  85000),
('Infosys Campus HR',   'admin@infosys.example.com',       '9123456785', 'corporate',  'Infosys BPM',        'Pune',   8, 620000);

-- ── Corporate Leads ──────────────────────────────────────────
INSERT INTO corporate_leads (company_name, contact_name, email, phone, city, employees, service_type, monthly_value, status, contract_start, contract_end, billing_cycle, notes) VALUES
('Tech Mahindra Ltd',  'Kavita Nair',      'kavita.nair@tm.example.com',      '9234567890', 'Pune',       500,  'Daily Meal Plan',                75000,  'active',      '2024-01-01', '2024-12-31', 'monthly', 'Long-term client, very satisfied'),
('Infosys BPM',        'Ravi Shetty',      'ravi.shetty@infosys.example.com', '9234567891', 'Pune',       800,  'Daily Meal + Buffet Events',     120000, 'active',      '2024-02-01', '2025-01-31', 'monthly', 'High-value account'),
('Wipro Technologies', 'Sunil Jain',       'sunil.jain@wipro.example.com',    '9234567892', 'Pune',       300,  'Conference & Executive Lunch',    45000, 'negotiation', NULL,         NULL,         'monthly', 'In discussion, demo scheduled'),
('Bajaj Auto Ltd',     'Pradeep Kulkarni', 'pradeep@bajaj.example.com',       '9234567893', 'Aurangabad', 1200, 'Bulk Employee Meal Service',     180000, 'prospect',    NULL,         NULL,         'monthly', 'Huge opportunity, needs detailed proposal');

-- ── Inquiries ────────────────────────────────────────────────
INSERT INTO inquiries (name, email, phone, company_name, event_type, service_type, event_date, venue, guest_count, budget_range, meal_preference, notes, status, is_corporate) VALUES
('Anil Pawar',    'anil@example.com',     '9345678901', 'Pawar & Sons Pvt Ltd',     'corporate', 'Daily Meal Plan',            '2024-05-15', 'Shivajinagar, Pune',         150, '15000-20000/month', 'veg',   'Looking for long-term office meal subscription', 'quoted',    TRUE),
('Deepika Rao',   'deepika@example.com',  '9345678902', NULL,                        'wedding',   'Wedding Platinum Package',   '2024-06-20', 'Ganesh Mahal, Nashik',       400, '3-4 lakhs',         'mixed', 'Full wedding catering including rituals food',    'confirmed', FALSE),
('HR Manager',    'hr@xlri.example.com',  '9345678903', 'XLRI Jamshedpur Campus',   'corporate', 'Conference Catering',        '2024-05-10', 'XLRI Campus',                200, '40000-50000',       'veg',   'Annual conference, 2-day event',                  'confirmed', TRUE),
('Manish Gupta',  'manish@example.com',   '9345678904', NULL,                        'event',     'Birthday & Social Event',    '2024-05-25', 'Koregaon Park, Pune',         80, '30000-40000',       'mixed', '25th anniversary party, needs live counters',     'new',       FALSE),
('Sneha Joshi',   'sneha@example.com',    '9345678905', 'MindTree Consulting',       'corporate', 'Office Buffet Package',      '2024-05-20', 'Baner, Pune',                120, '50000-60000',       'veg',   'Team building day event catering',                'contacted', TRUE),
('Rohit Singh',   'rohit@example.com',    '9345678906', NULL,                        'wedding',   'Wedding Gold Package',       '2024-07-15', 'Shri Palace Banquet, Mumbai', 250, '1.5-2 lakhs',       'mixed', 'Reception dinner only',                          'new',       FALSE);

-- ── Bookings (reference customer/inquiry/package by row order) ─
-- customers:  1=Ramesh, 2=Sunita, 3=TechMahindra, 4=Vijay, 5=Infosys
-- inquiries:  1=Anil,   2=Deepika, 3=HR Mgr, 4=Manish, 5=Sneha, 6=Rohit
-- packages:   1=Corp Daily, 2=Exec Lunch, 3=Office Buffet, 4=Wedding Plat, 5=Wedding Gold, 6=Conference, 7=Birthday, 8=Pantry
-- staff:      1=Rajesh, 2=Suresh, 3=Meena, 4=Anand, 5=Priya

INSERT INTO bookings (inquiry_id, customer_id, customer_name, event_type, package_id, package_name, event_date, venue, guest_count, meal_preference, status, assigned_staff, total_amount, advance_paid, balance_due, notes)
SELECT
    i.id, c.id, 'Deepika Rao', 'wedding', p.id, 'Wedding Platinum Package',
    '2024-06-20', 'Ganesh Mahal, Nashik', 400, 'mixed', 'confirmed',
    '[1,2,3]'::jsonb, 320000, 96000, 224000, 'Full wedding catering'
FROM inquiries i, customers c, packages p
WHERE i.email='deepika@example.com' AND c.email='sunita@example.com' AND p.name='Wedding Platinum Package';

INSERT INTO bookings (inquiry_id, customer_id, customer_name, event_type, package_id, package_name, event_date, venue, guest_count, meal_preference, status, assigned_staff, total_amount, advance_paid, balance_due, notes)
SELECT
    i.id, c.id, 'XLRI Campus HR', 'corporate', p.id, 'Conference Catering',
    '2024-05-10', 'XLRI Campus, Jamshedpur', 200, 'veg', 'confirmed',
    '[2,4]'::jsonb, 48000, 24000, 24000, '2-day conference'
FROM inquiries i, customers c, packages p
WHERE i.email='hr@xlri.example.com' AND c.email='hr@techmahindra.example.com' AND p.name='Conference Catering';

INSERT INTO bookings (inquiry_id, customer_id, customer_name, event_type, package_id, package_name, event_date, venue, guest_count, meal_preference, status, assigned_staff, total_amount, advance_paid, balance_due, notes)
SELECT
    NULL, c.id, 'Tech Mahindra HR', 'corporate', p.id, 'Corporate Daily Meal Plan',
    '2024-05-01', 'Tech Mahindra Office, Pune', 150, 'mixed', 'ongoing',
    '[1,4]'::jsonb, 22500, 22500, 0, 'Monthly recurring - May 2024'
FROM customers c, packages p
WHERE c.email='hr@techmahindra.example.com' AND p.name='Corporate Daily Meal Plan';

-- ── Quotations ───────────────────────────────────────────────
INSERT INTO quotations (inquiry_id, customer_name, company_name, email, event_type, event_date, items, subtotal, discount, tax_rate, tax_amount, total, notes, status)
SELECT
    i.id, 'Anil Pawar', 'Pawar & Sons Pvt Ltd', 'anil@example.com',
    'corporate', '2024-05-15',
    '[{"description":"Corporate Daily Meal Plan","qty":150,"rate":150,"total":22500},{"description":"Evening Snacks Extra","qty":150,"rate":30,"total":4500}]'::jsonb,
    27000, 2000, 5, 1250, 26250,
    'Valid for 15 days. Prices may vary with guest count changes.', 'sent'
FROM inquiries i WHERE i.email='anil@example.com';

INSERT INTO quotations (inquiry_id, customer_name, company_name, email, event_type, event_date, items, subtotal, discount, tax_rate, tax_amount, total, notes, status)
SELECT
    i.id, 'HR Manager', 'XLRI Campus', 'hr@xlri.example.com',
    'corporate', '2024-05-10',
    '[{"description":"Conference Catering - Day 1","qty":200,"rate":200,"total":40000},{"description":"Conference Catering - Day 2","qty":200,"rate":200,"total":40000},{"description":"Welcome Kit & Special Setup","qty":1,"rate":5000,"total":5000}]'::jsonb,
    85000, 5000, 5, 4000, 84000,
    'Includes setup and service charges.', 'converted'
FROM inquiries i WHERE i.email='hr@xlri.example.com';

-- ── Invoices ─────────────────────────────────────────────────
-- invoice_number is auto-set by trigger to SSS-INV-{id}

INSERT INTO invoices (booking_id, customer_name, company_name, email, phone, event_type, event_date, venue, items, subtotal, discount, tax_rate, tax_amount, grand_total, advance_paid, balance_due, payment_status, invoice_date, due_date, notes)
SELECT
    b.id, 'XLRI Campus HR', 'XLRI Jamshedpur', 'hr@xlri.example.com', '9345678903',
    'Conference Catering', '2024-05-10', 'XLRI Campus, Jamshedpur',
    '[{"description":"Conference Catering - Day 1 (200 pax)","qty":200,"rate":200,"total":40000},{"description":"Conference Catering - Day 2 (200 pax)","qty":200,"rate":200,"total":40000},{"description":"Welcome Kit & Special Setup","qty":1,"rate":5000,"total":5000},{"description":"Service Charges","qty":1,"rate":3000,"total":3000}]'::jsonb,
    88000, 5000, 5, 4150, 87150, 43575, 43575, 'partial', '2024-04-07', '2024-05-15',
    'Balance due within 7 days of event completion.'
FROM bookings b
JOIN inquiries i ON i.id = b.inquiry_id
WHERE i.email = 'hr@xlri.example.com';

INSERT INTO invoices (booking_id, customer_name, company_name, email, phone, event_type, event_date, venue, items, subtotal, discount, tax_rate, tax_amount, grand_total, advance_paid, balance_due, payment_status, invoice_date, due_date, notes)
SELECT
    b.id, 'Tech Mahindra HR', 'Tech Mahindra Ltd', 'hr@techmahindra.example.com', '9123456783',
    'Corporate Daily Meal Plan', '2024-05-01', 'Tech Mahindra Office, Shivajinagar',
    '[{"description":"Daily Meal Plan - May 2024 (150 pax x 22 days)","qty":3300,"rate":150,"total":495000},{"description":"Special Festive Meal - Labour Day","qty":150,"rate":250,"total":37500}]'::jsonb,
    532500, 10000, 5, 26125, 548625, 548625, 0, 'paid', '2024-05-02', '2024-05-10',
    'Thank you for your continued partnership.'
FROM bookings b
WHERE b.customer_name = 'Tech Mahindra HR' AND b.status = 'ongoing';

INSERT INTO invoices (booking_id, customer_name, company_name, email, phone, event_type, event_date, venue, items, subtotal, discount, tax_rate, tax_amount, grand_total, advance_paid, balance_due, payment_status, invoice_date, due_date, notes)
SELECT
    b.id, 'Deepika Rao', NULL, 'deepika@example.com', '9345678902',
    'Wedding Catering', '2024-06-20', 'Ganesh Mahal, Nashik',
    '[{"description":"Wedding Platinum Package (400 pax)","qty":400,"rate":750,"total":300000},{"description":"Live Counters (Pasta, Dosa, Chat)","qty":3,"rate":5000,"total":15000},{"description":"Decoration & Floral Setup","qty":1,"rate":8000,"total":8000}]'::jsonb,
    323000, 10000, 5, 15650, 328650, 100000, 228650, 'partial', '2024-03-25', '2024-06-20',
    'Balance to be cleared on event day.'
FROM bookings b
JOIN inquiries i ON i.id = b.inquiry_id
WHERE i.email = 'deepika@example.com';

-- ── Payments ─────────────────────────────────────────────────
INSERT INTO payments (invoice_id, invoice_number, amount, mode, date, reference, notes)
SELECT i.id, i.invoice_number, 43575, 'NEFT', '2024-04-08', 'TXN20240408001', 'Advance payment'
FROM invoices i WHERE i.customer_name = 'XLRI Campus HR';

INSERT INTO payments (invoice_id, invoice_number, amount, mode, date, reference, notes)
SELECT i.id, i.invoice_number, 548625, 'RTGS', '2024-05-03', 'TXN20240503002', 'Full payment'
FROM invoices i WHERE i.customer_name = 'Tech Mahindra HR';

INSERT INTO payments (invoice_id, invoice_number, amount, mode, date, reference, notes)
SELECT i.id, i.invoice_number, 100000, 'Cheque', '2024-03-26', 'CHQ00123456', 'Booking advance'
FROM invoices i WHERE i.customer_name = 'Deepika Rao';

-- ── Testimonials ─────────────────────────────────────────────
INSERT INTO testimonials (name, company, role, rating, text, approved) VALUES
('Kavita Nair',    'Tech Mahindra',  'HR Manager',            5, 'Shree Swami Samarth has been our trusted catering partner for over a year. Their daily meal service is hygienic, timely, and delicious. Our employees absolutely love it!', TRUE),
('Deepika Rao',    NULL,             'Bride',                 5, 'Our wedding catering was absolutely perfect! Every dish was restaurant quality and the service was impeccable. Highly recommend for weddings!', TRUE),
('Ravi Shetty',    'Infosys BPM',   'Operations Head',       5, 'Professional, punctual, and palate-pleasing! Their corporate buffets for our office events always receive great feedback. True hospitality experts.', TRUE),
('Manish Gupta',   NULL,             'Client',                4, 'Organized our anniversary party with them. The food quality and live counters were exceptional. Will definitely book again for future events.', TRUE),
('Dr. Suresh Patil','XLRI Institute','Conference Coordinator',5, 'They managed catering for our 2-day national conference flawlessly. Timely service, quality food, and professional staff. Outstanding!', TRUE);

-- ── Site Content (CMS defaults) ───────────────────────────────
INSERT INTO site_content (section, key, label, value, type, sort_order) VALUES
-- Hero
('hero','badge',              'Badge Text',           'Est. 2010 • Vikhroli, Mumbai',                                                                                    'text',     1),
('hero','tagline',            'Main Headline',        'Premium Catering Crafted with Care',                                                                              'text',     2),
('hero','description',        'Sub Description',      'Corporate meals, wedding feasts, and special events — we bring exceptional food and hospitality to every occasion.','textarea', 3),
('hero','stat_events',        'Events Count',         '5000+',   'text',  4),
('hero','stat_events_label',  'Events Label',         'Events Served',   'text',  5),
('hero','stat_clients',       'Clients Count',        '500+',    'text',  6),
('hero','stat_clients_label', 'Clients Label',        'Happy Clients',   'text',  7),
('hero','stat_years',         'Years Count',          '14+',     'text',  8),
('hero','stat_years_label',   'Years Label',          'Years Experience','text',  9),
('hero','stat_menu',          'Menu Items Count',     '50+',     'text', 10),
('hero','stat_menu_label',    'Menu Items Label',     'Menu Items',      'text', 11),

-- Contact
('contact','phone',         'Phone Number',  '+91 98765 43210',                       'text',     1),
('contact','email',         'Email Address', 'info@shreeswamisamarthfoods.com',        'text',     2),
('contact','address',       'Address',       'Vikhroli, Mumbai – 400083, Maharashtra', 'textarea', 3),
('contact','hours_weekday', 'Weekday Hours', 'Mon–Sat: 8 AM – 8 PM',                  'text',     4),
('contact','hours_weekend', 'Weekend Hours', 'Sun: 9 AM – 5 PM',                      'text',     5),

-- Company
('company','name',           'Full Company Name',      'Shree Swami Samarth Food and Hospitality Services',                                                                                        'text',     1),
('company','short_name',     'Short Name',             'SSS Foods',                                                                                                                               'text',     2),
('company','tagline',        'Company Tagline',        'Serving with Love & Hygiene since 2010',                                                                                                  'text',     3),
('company','gstin',          'GSTIN Number',           '27XXXXX1234X1Z5',                                                                                                                         'text',     4),
('company','description',    'Company Description',    'Premium catering solutions for corporate offices, weddings, and special events across Mumbai & Maharashtra since 2010. Founded by Devendra Kamble.', 'textarea', 5),
('company','invoice_prefix', 'Invoice Number Prefix',  'SSS-INV-',                                                                                                                               'text',     6),
('company','tax_rate',       'Default Tax Rate (%)',   '5',                                                                                                                                       'text',     7),
('company','due_days',       'Invoice Due Days',       '15',                                                                                                                                      'text',     8),

-- About
('about','story',        'Company Story',     'Founded in 2010 by Devendra Kamble in Vikhroli, Mumbai, Shree Swami Samarth Food and Hospitality Services has grown into a trusted name for corporate offices, weddings, and events across Maharashtra. Over 14 years we have served 5000+ events and 500+ satisfied clients.', 'textarea', 1),
('about','founded_year', 'Founded Year',      '2010',            'text',     2),
('about','founder',      'Founder Name',      'Devendra Kamble', 'text',     3),
('about','location',     'Location',          'Vikhroli, Mumbai','text',     4),
('about','mission',      'Mission Statement', 'To deliver authentic flavors, professional service, and memorable dining experiences for every event — big or small.', 'textarea', 5),
('about','values',       'Core Values',       '[{"icon":"🛡️","title":"Hygiene First","text":"FSSAI certified kitchen with regular audits"},{"icon":"🍛","title":"Authentic Flavors","text":"Recipes rooted in tradition, cooked with care"},{"icon":"🤝","title":"Professional Service","text":"Courteous staff, on-time delivery, always"},{"icon":"♻️","title":"Zero-Waste","text":"Responsible kitchen, minimal waste"},{"icon":"⏰","title":"Always Reliable","text":"We show up every single time"},{"icon":"⭐","title":"Client Satisfaction","text":"Your happiness is our measure of success"}]', 'json', 6),

-- Services
('services','items','Service Cards','[{"icon":"🏢","title":"Corporate Catering","description":"Daily meal plans, executive lunches, conference catering and bulk employee meals for offices.","link":"/corporate-catering"},{"icon":"💒","title":"Wedding Catering","description":"Memorable wedding feasts with multi-course menus, live counters and impeccable service.","link":"/wedding-catering"},{"icon":"🎉","title":"Event Catering","description":"Birthdays, anniversaries, social gatherings — we cater every celebration perfectly.","link":"/event-catering"},{"icon":"📦","title":"Custom Packages","description":"Bespoke menus crafted to your taste, dietary needs and event size.","link":"/packages"}]','json',1),

-- Why Choose Us
('why_us','items','Why Choose Us','[{"icon":"✅","title":"FSSAI Certified","text":"Fully licensed and compliant with all food safety standards."},{"icon":"⏰","title":"Always On Time","text":"99% on-time delivery record across 5000+ events served."},{"icon":"👨‍🍳","title":"Expert Chefs","text":"Team of experienced chefs with 10+ years of expertise."},{"icon":"🏆","title":"14+ Years Experience","text":"Trusted by 500+ clients across Maharashtra and beyond."},{"icon":"📈","title":"Scalable Service","text":"From 25 to 5000 guests — we handle any scale with ease."},{"icon":"🍽️","title":"Custom Menus","text":"Jain, vegan, diabetic, and all diet preferences accommodated."}]','json',1),

-- Booking Steps
('steps','items','Booking Steps','[{"icon":"📝","title":"Submit Inquiry","description":"Fill our simple form with your event details and preferences."},{"icon":"💬","title":"Get Custom Quote","description":"Our team prepares a detailed, tailored quotation within 24 hours."},{"icon":"✅","title":"Confirm Booking","description":"Review, approve and secure your date with advance payment."},{"icon":"🎉","title":"Enjoy Your Event","description":"Relax while our team delivers flawless catering at your venue."}]','json',1),

-- Corporate
('corporate','pricing','Pricing Plans','[{"plan":"Daily Meal Plan","price":"₹150","unit":"/person/day"},{"plan":"Executive Lunch","price":"₹350","unit":"/person"},{"plan":"Office Buffet","price":"₹450","unit":"/person"},{"plan":"Conference Catering","price":"₹200","unit":"/person"}]','json',1),
('corporate','benefits','Benefits List','["Timely delivery — always","FSSAI compliant kitchen","Monthly GST-ready invoices","Dedicated account manager","Custom menu planning","Diet-inclusive options","Scalable to any team size","Festive special meal plans"]','json',2),

-- FAQ
('faq','items','FAQ Items','[{"q":"What is the minimum guest count?","a":"Our minimum is 25 persons for most packages. Some premium packages require 50+. Contact us to discuss smaller groups."},{"q":"Do you provide Jain and vegan options?","a":"Yes! We cater to Jain, vegan, diabetic-friendly, and all dietary preferences. Please mention this when booking."},{"q":"How far in advance should I book?","a":"For weddings: 2–3 months. Corporate events: 2–4 weeks. Recurring office meals: 1 week. Early booking ensures date availability."},{"q":"Do you handle outdoor events?","a":"Yes, we provide full setup for outdoor venues including equipment, serving staff, and logistics."},{"q":"Is GST billing available for corporates?","a":"Absolutely. We provide GST-compliant invoices for all corporate clients. Our GSTIN is available on request."},{"q":"What areas do you serve?","a":"We primarily serve Mumbai, Pune, Nashik, and nearby Maharashtra districts. Contact us for outstation events."},{"q":"Can we do a food tasting before booking?","a":"Yes, we offer tasting sessions for wedding bookings above Rs 1 lakh. Corporate clients can request a sample meal tray."},{"q":"What payment methods do you accept?","a":"We accept cash, bank transfer (NEFT/RTGS), UPI, and cheque payments."}]','json',1),

-- Gallery
('gallery','items','Gallery Items','[{"emoji":"🍽️","title":"Corporate Buffet Setup","category":"corporate","image":""},{"emoji":"💒","title":"Wedding Reception","category":"wedding","image":""},{"emoji":"🫓","title":"Live Dosa Counter","category":"events","image":""},{"emoji":"🥗","title":"Executive Lunch","category":"corporate","image":""},{"emoji":"🍱","title":"Festive Thali","category":"events","image":""},{"emoji":"🌸","title":"Wedding Mandap Catering","category":"wedding","image":""},{"emoji":"🥘","title":"Office Daily Meals","category":"corporate","image":""},{"emoji":"☕","title":"Conference Tea Break","category":"corporate","image":""},{"emoji":"🎂","title":"Birthday Celebration","category":"events","image":""}]','json',1),

-- Footer
('footer','description','Footer Description','Premium catering solutions for corporate offices, weddings, and special events across Mumbai & Maharashtra since 2010. Founded by Devendra Kamble.','textarea',1),
('footer','copyright',  'Copyright Text',    '© 2024 Shree Swami Samarth Food and Hospitality Services. All rights reserved.','text',2);
