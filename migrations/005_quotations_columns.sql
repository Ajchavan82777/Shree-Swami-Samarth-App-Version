-- Migration 005 — Add missing columns to quotations table
-- Run in Supabase SQL Editor

ALTER TABLE quotations
  ADD COLUMN IF NOT EXISTS phone            VARCHAR(50),
  ADD COLUMN IF NOT EXISTS venue            VARCHAR(255),
  ADD COLUMN IF NOT EXISTS quote_date       DATE,
  ADD COLUMN IF NOT EXISTS valid_until      DATE,
  ADD COLUMN IF NOT EXISTS gst_type         VARCHAR(20)  DEFAULT 'sgst_cgst',
  ADD COLUMN IF NOT EXISTS quotation_number VARCHAR(100);

-- Auto-generate SSS-QUO-{id} quotation number on insert
CREATE OR REPLACE FUNCTION set_quotation_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quotation_number IS NULL OR NEW.quotation_number = '' THEN
        NEW.quotation_number := 'SSS-QUO-' || NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_quotation_number ON quotations;
CREATE TRIGGER trg_quotation_number
    BEFORE INSERT ON quotations
    FOR EACH ROW EXECUTE FUNCTION set_quotation_number();

-- Backfill quotation_number for existing rows
UPDATE quotations
SET quotation_number = 'SSS-QUO-' || id
WHERE quotation_number IS NULL;
