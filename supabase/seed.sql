insert into teams (name, department, description)
values
  ('Mechanical Design', 'Mechanical Design', 'Mechanical engineering and CAD workflows'),
  ('EE Design', 'EE Design', 'Electrical and electronics design'),
  ('Purchase', 'Purchase', 'Vendor, quotation, and purchase order tracking'),
  ('Software', 'Software', 'Controls, firmware, and application software'),
  ('Installation', 'Installation', 'Site installation and commissioning'),
  ('Planning', 'Planning', 'Project planning and scheduling'),
  ('Production', 'Production', 'Manufacturing and assembly execution'),
  ('QA/QC', 'QA/QC', 'Quality assurance and quality control')
on conflict do nothing;
