-- Run in Supabase SQL Editor after 003_add_gst_type.sql

-- Role permissions table: stores which pages each role can access
CREATE TABLE IF NOT EXISTS role_permissions (
    id          SERIAL PRIMARY KEY,
    role_name   VARCHAR(100) NOT NULL,
    permissions JSONB        NOT NULL DEFAULT '{}',
    description TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE(role_name)
);

-- Insert default roles
INSERT INTO role_permissions (role_name, permissions, description) VALUES
('admin', '{"dashboard":true,"invoices":true,"quotations":true,"inquiries":true,"bookings":true,"customers":true,"packages":true,"staff":true,"corporate":true,"reports":true,"content":true,"settings":true,"roles":true}', 'Full access to everything'),
('manager', '{"dashboard":true,"invoices":true,"quotations":true,"inquiries":true,"bookings":true,"customers":true,"packages":true,"staff":false,"corporate":true,"reports":true,"content":false,"settings":false,"roles":false}', 'Manages day-to-day operations'),
('staff', '{"dashboard":true,"invoices":false,"quotations":true,"inquiries":true,"bookings":true,"customers":true,"packages":true,"staff":false,"corporate":false,"reports":false,"content":false,"settings":false,"roles":false}', 'Basic staff access'),
('viewer', '{"dashboard":true,"invoices":false,"quotations":false,"inquiries":true,"bookings":true,"customers":true,"packages":true,"staff":false,"corporate":false,"reports":true,"content":false,"settings":false,"roles":false}', 'Read-only viewer')
ON CONFLICT (role_name) DO NOTHING;
