-- Simple SQL queries to filter contacts

-- 1. List all contacts from Varna
SELECT * FROM public.contacts 
WHERE town = 'Varna';

-- 2. List all contacts without a town and without an email
SELECT * FROM public.contacts 
WHERE town IS NULL AND email IS NULL;

-- 3. List all contacts which mention "ski" (as a substring in comments)
SELECT * FROM public.contacts 
WHERE comments ILIKE '%ski%';

-- 4. List all contacts which have a phone number from Bulgaria (+359 ...)
SELECT * FROM public.contacts 
WHERE phone LIKE '+359%';

-- 5. List all contacts (name, town, phone, email), order by towns alphabetically
SELECT name, town, phone, email 
FROM public.contacts 
ORDER BY town ASC;

-- 6. List all contacts from Sofia, Plovdiv, or Varna
SELECT * FROM public.contacts 
WHERE town IN ('Sofia', 'Plovdiv', 'Varna');

-- 7. Find all contacts with Gmail accounts grouped by town (Ordered by town)
-- Note: "Grouped by" for listing individual records usually implies sorting. 
-- If you meant counting/aggregating, use GROUP BY with COUNT().
SELECT * FROM public.contacts 
WHERE email ILIKE '%@gmail.com'
ORDER BY town;
