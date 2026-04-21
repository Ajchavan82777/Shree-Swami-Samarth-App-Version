-- Migration 006 — Add event_end_date to bookings for multi-day event support
-- Run in Supabase SQL Editor

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS event_end_date DATE;
