-- Update script for specific contact changes

-- 1. Add a comment for Stoyan Vasilev: "father of Radi"
-- Note: This appends to existing comments. If you want to replace, remove the concatenation.
UPDATE public.contacts
SET comments = CASE 
    WHEN comments IS NULL OR comments = '' THEN 'father of Radi'
    ELSE comments || ', father of Radi'
    END
WHERE name = 'Stoyan Vasilev';

-- 2. Change Georgi Stoyanov's data -> Tel. +49 176 98765432, moved to Berlin
UPDATE public.contacts
SET phone = '+49 176 98765432',
    town = 'Berlin'
WHERE name = 'Georgi Stoyanov';

-- 3. Delete the email for Desislava Ivanova
UPDATE public.contacts
SET email = NULL
WHERE name = 'Desislava Ivanova';

-- 4. Remove phone number and email from contact Elena Georgieva
UPDATE public.contacts
SET phone = NULL,
    email = NULL
WHERE name = 'Elena Georgieva';
