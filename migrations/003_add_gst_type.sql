-- Run this in Supabase SQL Editor to add gst_type column to existing invoices table
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS gst_type VARCHAR(20) DEFAULT 'sgst_cgst';
