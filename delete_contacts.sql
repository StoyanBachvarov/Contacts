-- Delete contacts script

-- 1. Delete contact Petar Nikolov (using case-insensitive matching and trimming)
DELETE FROM public.contacts
WHERE TRIM(name) ILIKE 'Petar Nikolov' 
   OR TRIM(email) ILIKE 'petar.nikolov@abv.bg';

-- 2. Delete contact d.angelov@proton.me from Veliko Tarnovo
DELETE FROM public.contacts
WHERE email = 'd.angelov@proton.me' AND town = 'Veliko Tarnovo';
