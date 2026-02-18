-- Add user_id column to contacts table to associate contacts with specific users

ALTER TABLE public.contacts
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Optional: If you want to enable Row Level Security (RLS) later, this user_id will be crucial.
-- For now, existing contacts will have NULL user_id. 
-- You might want to assign them to a specific user or leave them as global/public depending on your app logic.
