BEGIN;

SELECT plan(13);

-- Test 1-2: Audit log is immutable
SELECT has_table('audit_log', 'Debe existir la tabla audit_log');

-- Attempting to update or delete should fail (REVOKE checks or triggers)
-- pgTAP table_privs allows us to check
SELECT table_privs_are(
  'public', 'audit_log', 'authenticated', ARRAY['INSERT', 'SELECT'],
  'Rol authenticated solo puede hacer INSERT y SELECT en audit_log'
);

SELECT table_privs_are(
  'public', 'audit_log', 'anon', ARRAY[]::text[],
  'Rol anon no tiene permisos sobre audit_log'
);

-- Test 3: Signatures exist
SELECT has_table('signatures', 'Debe existir la tabla signatures');

-- Test 4: RLS is enabled on critical tables
SELECT is_empty(
  $$ SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false $$,
  'Todas las tablas en public deben tener RLS activado'
);

-- Test 5-8: SOD function exists and throws appropriately
SELECT has_function('check_sod', ARRAY['text', 'text', 'uuid', 'text'], 'Función check_sod debe existir');

-- Insert fake profile
INSERT INTO auth.users (id) VALUES ('00000000-0000-0000-0000-000000000001');
INSERT INTO profiles (id, full_name, short_signature) VALUES ('00000000-0000-0000-0000-000000000001', 'Test User', 'T. User');

-- Insert an execution signature
INSERT INTO signatures (user_id, record_table, record_id, meaning, record_hash)
VALUES ('00000000-0000-0000-0000-000000000001', 'dummy_table', 'dummy-1', 'ejecuto', 'testhash');

-- Try to verify the same record
SELECT throws_matching(
  $$ SELECT check_sod('dummy_table', 'dummy-1', '00000000-0000-0000-0000-000000000001', 'verifico'); $$,
  'SOD_VIOLATION',
  'Un usuario no puede verificar lo que ejecutó'
);

-- Try to execute a different record (should pass)
SELECT lives_ok(
  $$ SELECT check_sod('dummy_table', 'dummy-2', '00000000-0000-0000-0000-000000000001', 'verifico'); $$,
  'Un usuario puede verificar un registro diferente al que ejecutó'
);

-- Insert a verification signature
INSERT INTO signatures (user_id, record_table, record_id, meaning, record_hash)
VALUES ('00000000-0000-0000-0000-000000000001', 'dummy_table', 'dummy-2', 'verifico', 'testhash');

-- Try to approve the same record
SELECT throws_matching(
  $$ SELECT check_sod('dummy_table', 'dummy-2', '00000000-0000-0000-0000-000000000001', 'aprobo'); $$,
  'SOD_VIOLATION',
  'Un usuario no puede aprobar lo que verificó'
);

-- Test 9: Lock trigger exists
SELECT has_function('block_locked_records', 'Función block_locked_records debe existir');

-- Test 10: Sign_record function
SELECT has_function('sign_record', ARRAY['text', 'text', 'text', 'text', 'text'], 'Función sign_record debe existir');

SELECT * FROM finish();
ROLLBACK;
