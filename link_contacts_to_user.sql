-- 1. Add user_id column if it doesn't exist
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Update existing contacts to belong to a specific user
-- REPLACE 'YOUR_USER_ID_HERE' with your actual User UUID from Supabase Dashboard > Authentication
-- Example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
UPDATE public.contacts
SET user_id = 'YOUR_USER_ID_HERE'
WHERE user_id IS NULL;

-- 3. (Optional) Make user_id mandatory for future contacts
-- Only run this AFTER all existing rows have a user_id
-- ALTER TABLE public.contacts ALTER COLUMN user_id SET NOT NULL;
