-- Add 'town' column to contacts table
-- It will be null (empty) for existing records by default
ALTER TABLE public.contacts
ADD COLUMN town text;
