-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Allow users to select their own contacts
DROP POLICY IF EXISTS "Users can view their own contacts" ON public.contacts;
CREATE POLICY "Users can view their own contacts" ON public.contacts
FOR SELECT USING (auth.uid() = user_id);

-- 2. Allow users to insert their own contacts
DROP POLICY IF EXISTS "Users can insert their own contacts" ON public.contacts;
CREATE POLICY "Users can insert their own contacts" ON public.contacts
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Allow users to update their own contacts
DROP POLICY IF EXISTS "Users can update their own contacts" ON public.contacts;
CREATE POLICY "Users can update their own contacts" ON public.contacts
FOR UPDATE USING (auth.uid() = user_id);

-- 4. Allow users to delete their own contacts
DROP POLICY IF EXISTS "Users can delete their own contacts" ON public.contacts;
CREATE POLICY "Users can delete their own contacts" ON public.contacts
FOR DELETE USING (auth.uid() = user_id);