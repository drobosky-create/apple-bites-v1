-- Seed automation rules for the Apple Bites ecosystem

INSERT INTO automation_rules (id, name, enabled, spec, created_at, updated_at)
VALUES 
-- Rule 1: Auto-assign and create task when lead becomes qualified
('rule-auto-qualified', 'Auto-assign and task on Qualified', 'true', 
'{
  "on":"lead.updated",
  "if":[{"path":"after.status","op":"eq","value":"qualified"}],
  "do":[
    {"type":"assignOwner","value":"auto"},
    {"type":"createTask","title":"Discovery Call","dueIn":"P3D"}
  ]
}'::jsonb, NOW(), NOW()),

-- Rule 2: Send webhook when lead is won
('rule-webhook-won', 'Webhook on Won', 'true',
'{
  "on":"lead.updated",
  "if":[{"path":"after.status","op":"eq","value":"won"}],
  "do":[
    {"type":"webhook","url":"https://example.com/crm/hook"},
    {"type":"createTask","title":"Onboarding Process","dueIn":"P1D"}
  ]
}'::jsonb, NOW(), NOW()),

-- Rule 3: Create follow-up task for new leads
('rule-new-lead-follow', 'New Lead Follow-up', 'true',
'{
  "on":"lead.created",
  "if":[],
  "do":[
    {"type":"createTask","title":"Initial Outreach","dueIn":"P1D"},
    {"type":"email","to":"sales@meritage-partners.com","subject":"New Lead Created","text":"A new lead has been created and requires attention."}
  ]
}'::jsonb, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
  spec = EXCLUDED.spec,
  updated_at = NOW();