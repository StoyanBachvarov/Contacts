-- Insert new batch of contacts
INSERT INTO public.contacts (name, email, phone, town, comments)
VALUES
  ('Petar Kirov', 'petar.kirov96@gmail.com', NULL, 'Varna', NULL),
  ('Petar Stoyanov', 'petar.st@gmail.com', NULL, 'Plovdiv', 'Bansko ski 2023'),
  ('Didi Hristova', 'dddhhh@gmail.com', NULL, 'Sofia', NULL),
  ('Yana Petrova', 'yanka@abv.bg', NULL, 'Varna', NULL),
  ('Stela Petrova', 'stell@gmail.com', NULL, 'Pleven', 'a crazy ski party girl'),
  ('Todor Kirov', 'tosheto_bansko@gmail.com', NULL, 'Bansko', NULL),
  ('Drummer17', NULL, NULL, NULL, 'Telegram: drummer17special'),
  ('Pesho.new', NULL, NULL, NULL, 'Telegram: alien983673'),
  ('Mimi.special', NULL, NULL, NULL, 'Signal: @mimitomimito, Bansko ski 2023'),
  ('Stela Petrova', 'stell@gmail.com', NULL, 'Pleven', NULL), -- Duplicate entry as requested? I'll include it.
  ('Jan Kamiński', 'jankkk@gmail.com', NULL, 'Gdańsk', NULL),
  ('Ivan Petrovski', NULL, '+389 72 345 678', 'Skopje', NULL),
  ('Alex Radzinski', NULL, '+1 416 555 0284', NULL, 'My ski partner from Canada');
