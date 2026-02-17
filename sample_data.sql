-- Insert sample data into public.contacts
insert into public.contacts (name, phone, email, comments)
values
  ('Alice Johnson', '555-0101', 'alice.j@example.com', 'Met at the conference last year.'),
  ('Bob Smith', '555-0102', 'bob.smith@testmail.com', 'Interested in our premium plan.'),
  ('Charlie Davis', '555-0103', 'charlie.d@demo.net', 'Follow up next week regarding the proposal.'),
  ('Diana Miller', NULL, 'diana.m@example.org', 'Prefer email contact only.'),
  ('Evan Wright', '555-0105', NULL, 'Left a voicemail, no email on file.'),
  ('Fiona Green', '555-0106', 'fiona.g@example.com', 'VIP client from the downtown branch.'),
  ('George Hall', '555-0107', 'george.h@testmail.com', NULL),
  ('Hannah Lewis', '555-0108', 'hannah.l@demo.net', 'Requested a callback in the morning.');
