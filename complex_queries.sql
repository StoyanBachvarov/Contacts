-- Complex SQL queries for contacts analysis

-- 1. Find all contacts with the same first name (Grouped by First Name)
-- splitting by space and taking the first part
SELECT 
    split_part(name, ' ', 1) AS first_name,
    string_agg(name, ', ') AS contact_names
FROM public.contacts
GROUP BY split_part(name, ' ', 1)
HAVING count(*) > 1 -- Optional: remove this line to see all first names
ORDER BY first_name;

-- 2. List all towns and the number of contacts for each town
-- Treating NULL town as [Unknown]
SELECT 
    COALESCE(town, '[Unknown]') AS town_name,
    COUNT(*) AS contact_count
FROM public.contacts
GROUP BY town_name
ORDER BY contact_count DESC;

-- 3. List contacts with incomplete information (missing phone OR email)
SELECT 
    name,
    phone,
    email,
    CASE 
        WHEN phone IS NULL AND email IS NULL THEN 'No contact info'
        WHEN phone IS NULL THEN 'Missing phone'
        WHEN email IS NULL THEN 'Missing email'
    END AS missing_data
FROM public.contacts
WHERE phone IS NULL OR email IS NULL;

-- 4. List all email domains, along with contacts
SELECT 
    substring(email from position('@' in email) + 1) AS domain,
    COUNT(*) AS contacts_count,
    string_agg(name, ', ' ORDER BY name ASC) AS contact_names
FROM public.contacts
WHERE email IS NOT NULL
GROUP BY domain
ORDER BY contacts_count DESC;

-- 5. Find contacts per town, with rank and percentages
-- Includes [Unknown] for NULL towns
WITH town_stats AS (
    SELECT 
        COALESCE(town, '[Unknown]') AS town_name,
        COUNT(*) as town_count,
        string_agg(name, ', ' ORDER BY name ASC) as contact_list
    FROM public.contacts
    GROUP BY town_name
),
total_stats AS (
    SELECT COUNT(*) as total_contacts FROM public.contacts
)
SELECT 
    t.town_name,
    RANK() OVER (ORDER BY t.town_count DESC) as rank,
    ROUND((t.town_count::numeric / ts.total_contacts::numeric) * 100, 2) || '%' as percentage,
    t.town_count,
    t.contact_list
FROM town_stats t, total_stats ts
ORDER BY t.town_count DESC;
