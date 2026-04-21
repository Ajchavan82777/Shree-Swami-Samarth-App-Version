-- ============================================================
--  SHREE SWAMI SAMARTH CATERING APP
--  Migration 001 — Initial Schema
--  Run this in: Supabase SQL Editor  OR  psql
-- ============================================================

-- ── Drop existing tables (safe re-run) ──────────────────────
DROP TABLE IF EXISTS payments         CASCADE;
DROP TABLE IF EXISTS invoices         CASCADE;
DROP TABLE IF EXISTS quotations       CASCADE;
DROP TABLE IF EXISTS bookings         CASCADE;
DROP TABLE IF EXISTS corporate_leads  CASCADE;
DROP TABLE IF EXISTS inquiries        CASCADE;
DROP TABLE IF EXISTS packages         CASCADE;
DROP TABLE IF EXISTS staff            CASCADE;
DROP TABLE IF EXISTS customers        CASCADE;
DROP TABLE IF EXISTS testimonials     CASCADE;
DROP TABLE IF EXISTS users            CASCADE;

-- ── Drop triggers/functions ──────────────────────────────────
DROP FUNCTION IF EXISTS set_invoice_number() CASCADE;

-- ============================================================
--  TABLES
-- ============================================================

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(50)  NOT NULL DEFAULT 'admin',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE customers (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(50),
    type            VARCHAR(50)  NOT NULL DEFAULT 'individual',
    company         VARCHAR(255),
    city            VARCHAR(255),
    total_bookings  INTEGER      NOT NULL DEFAULT 0,
    total_spent     NUMERIC(14,2) NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE packages (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    category         VARCHAR(100) NOT NULL,
    price_per_person NUMERIC(10,2) NOT NULL DEFAULT 0,
    min_persons      INTEGER      NOT NULL DEFAULT 1,
    description      TEXT,
    inclusions       JSONB        NOT NULL DEFAULT '[]',
    featured         BOOLEAN      NOT NULL DEFAULT FALSE,
    active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE staff (
    id                SERIAL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    role              VARCHAR(255) NOT NULL,
    phone             VARCHAR(50),
    email             VARCHAR(255),
    specialization    VARCHAR(255),
    experience_years  INTEGER DEFAULT 0,
    active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inquiries (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    email            VARCHAR(255),
    phone            VARCHAR(50),
    company_name     VARCHAR(255),
    event_type       VARCHAR(100),
    service_type     VARCHAR(255),
    event_date       DATE,
    venue            VARCHAR(255),
    guest_count      INTEGER,
    budget_range     VARCHAR(255),
    meal_preference  VARCHAR(100),
    notes            TEXT,
    status           VARCHAR(50) NOT NULL DEFAULT 'new',
    is_corporate     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE corporate_leads (
    id             SERIAL PRIMARY KEY,
    company_name   VARCHAR(255) NOT NULL,
    contact_name   VARCHAR(255),
    email          VARCHAR(255),
    phone          VARCHAR(50),
    city           VARCHAR(255),
    employees      INTEGER,
    service_type   VARCHAR(255),
    monthly_value  NUMERIC(12,2),
    status         VARCHAR(50) NOT NULL DEFAULT 'prospect',
    contract_start DATE,
    contract_end   DATE,
    billing_cycle  VARCHAR(100) DEFAULT 'monthly',
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
    id             SERIAL PRIMARY KEY,
    inquiry_id     INTEGER REFERENCES inquiries(id)  ON DELETE SET NULL,
    customer_id    INTEGER REFERENCES customers(id)  ON DELETE SET NULL,
    customer_name  VARCHAR(255),
    event_type     VARCHAR(100),
    package_id     INTEGER REFERENCES packages(id)   ON DELETE SET NULL,
    package_name   VARCHAR(255),
    event_date     DATE,
    venue          VARCHAR(255),
    guest_count    INTEGER,
    meal_preference VARCHAR(100),
    status         VARCHAR(50)  NOT NULL DEFAULT 'confirmed',
    assigned_staff JSONB        NOT NULL DEFAULT '[]',
    total_amount   NUMERIC(14,2) DEFAULT 0,
    advance_paid   NUMERIC(14,2) DEFAULT 0,
    balance_due    NUMERIC(14,2) DEFAULT 0,
    notes          TEXT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE quotations (
    id             SERIAL PRIMARY KEY,
    inquiry_id     INTEGER REFERENCES inquiries(id) ON DELETE SET NULL,
    customer_name  VARCHAR(255),
    company_name   VARCHAR(255),
    email          VARCHAR(255),
    event_type     VARCHAR(100),
    event_date     DATE,
    items          JSONB        NOT NULL DEFAULT '[]',
    subtotal       NUMERIC(14,2) DEFAULT 0,
    discount       NUMERIC(14,2) DEFAULT 0,
    tax_rate       NUMERIC(5,2)  DEFAULT 5,
    tax_amount     NUMERIC(14,2) DEFAULT 0,
    total          NUMERIC(14,2) DEFAULT 0,
    notes          TEXT,
    status         VARCHAR(50)  NOT NULL DEFAULT 'draft',
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE invoices (
    id              SERIAL PRIMARY KEY,
    invoice_number  VARCHAR(100) UNIQUE,
    booking_id      INTEGER REFERENCES bookings(id)   ON DELETE SET NULL,
    quotation_id    INTEGER REFERENCES quotations(id) ON DELETE SET NULL,
    customer_name   VARCHAR(255),
    company_name    VARCHAR(255),
    email           VARCHAR(255),
    phone           VARCHAR(50),
    event_type      VARCHAR(255),
    event_date      DATE,
    venue           VARCHAR(255),
    items           JSONB         NOT NULL DEFAULT '[]',
    subtotal        NUMERIC(14,2) DEFAULT 0,
    discount        NUMERIC(14,2) DEFAULT 0,
    tax_rate        NUMERIC(5,2)  DEFAULT 5,
    tax_amount      NUMERIC(14,2) DEFAULT 0,
    grand_total     NUMERIC(14,2) DEFAULT 0,
    advance_paid    NUMERIC(14,2) DEFAULT 0,
    balance_due     NUMERIC(14,2) DEFAULT 0,
    payment_status  VARCHAR(50)   NOT NULL DEFAULT 'unpaid',
    invoice_date    DATE,
    due_date        DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Auto-generate SSS-INV-{id} invoice number on insert
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := 'SSS-INV-' || NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW EXECUTE FUNCTION set_invoice_number();

CREATE TABLE payments (
    id              SERIAL PRIMARY KEY,
    invoice_id      INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    invoice_number  VARCHAR(100),
    amount          NUMERIC(14,2) NOT NULL,
    mode            VARCHAR(100),
    date            DATE,
    reference       VARCHAR(255),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE testimonials (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    company     VARCHAR(255),
    role        VARCHAR(255),
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text        TEXT    NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  INDEXES
-- ============================================================

CREATE INDEX idx_customers_email         ON customers(email);
CREATE INDEX idx_customers_created_at    ON customers(created_at DESC);

CREATE INDEX idx_inquiries_status        ON inquiries(status);
CREATE INDEX idx_inquiries_is_corporate  ON inquiries(is_corporate);
CREATE INDEX idx_inquiries_event_date    ON inquiries(event_date);
CREATE INDEX idx_inquiries_created_at    ON inquiries(created_at DESC);

CREATE INDEX idx_corporate_status        ON corporate_leads(status);
CREATE INDEX idx_corporate_created_at    ON corporate_leads(created_at DESC);

CREATE INDEX idx_bookings_status         ON bookings(status);
CREATE INDEX idx_bookings_event_date     ON bookings(event_date);
CREATE INDEX idx_bookings_customer_id    ON bookings(customer_id);

CREATE INDEX idx_quotations_status       ON quotations(status);
CREATE INDEX idx_quotations_created_at   ON quotations(created_at DESC);

CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX idx_invoices_created_at     ON invoices(created_at DESC);

CREATE INDEX idx_payments_invoice_id     ON payments(invoice_id);

CREATE INDEX idx_packages_category       ON packages(category);
CREATE INDEX idx_packages_active         ON packages(active);

CREATE INDEX idx_staff_active            ON staff(active);
