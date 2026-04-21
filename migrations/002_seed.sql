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
INSERT INTO testimonials (name, company, role, rating, text) VALUES
('Kavita Nair',    'Tech Mahindra',  'HR Manager',           5, 'Shree Swami Samarth has been our trusted catering partner for over a year. Their daily meal service is hygienic, timely, and delicious. Our employees absolutely love it!'),
('Deepika Rao',    NULL,             'Bride',                5, 'Our wedding catering was absolutely perfect! Every dish was restaurant quality and the service was impeccable. Highly recommend for weddings!'),
('Ravi Shetty',    'Infosys BPM',   'Operations Head',      5, 'Professional, punctual, and palate-pleasing! Their corporate buffets for our office events always receive great feedback. True hospitality experts.'),
('Manish Gupta',   NULL,             'Client',               4, 'Organized our anniversary party with them. The food quality and live counters were exceptional. Will definitely book again for future events.'),
('Dr. Suresh Patil','XLRI Institute','Conference Coordinator',5,'They managed catering for our 2-day national conference flawlessly. Timely service, quality food, and professional staff. Outstanding!');
