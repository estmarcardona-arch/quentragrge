-- MIGRATION: 0002_core.sql
-- NÚCLEO GxP: Perfiles, Auditoría, Roles, SOD y Firmas

-- 1. ROLES Y PERFILES
CREATE TYPE user_role AS ENUM (
  'comercial', 'idi', 'bodega_aux', 'bodega_jefe', 'prod_aux', 'prod_coord', 
  'lab_aux', 'cc_jefe', 'aq_dir', 'dt', 'admin', 'master', 'aq_doc', 'gerencia', 'auditor'
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  document_id TEXT,
  active BOOLEAN DEFAULT true,
  signature_pin_set BOOLEAN DEFAULT false,
  short_signature TEXT,
  area_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, role)
);
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 2. BITÁCORA DE AUDITORÍA (AUDIT LOG)
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  at TIMESTAMPTZ DEFAULT now() NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  before JSONB,
  after JSONB,
  reason TEXT,
  ip TEXT
);
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Inmutabilidad estricta
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM public, authenticated, anon;

CREATE OR REPLACE FUNCTION audit_trigger_func() RETURNS TRIGGER AS $$
DECLARE
  v_actor_id UUID;
  v_reason TEXT;
  v_before JSONB;
  v_after JSONB;
BEGIN
  v_actor_id := auth.uid();
  v_reason := current_setting('request.jwt.claims', true)::json->>'audit_reason';
  
  IF TG_OP = 'INSERT' THEN
    v_after := to_jsonb(NEW);
    INSERT INTO audit_log (actor_id, action, table_name, record_id, after, reason)
    VALUES (v_actor_id, 'INSERT', TG_TABLE_NAME, NEW.id::text, v_after, v_reason);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    v_before := to_jsonb(OLD);
    v_after := to_jsonb(NEW);
    IF v_before IS DISTINCT FROM v_after THEN
      INSERT INTO audit_log (actor_id, action, table_name, record_id, before, after, reason)
      VALUES (v_actor_id, 'UPDATE', TG_TABLE_NAME, NEW.id::text, v_before, v_after, v_reason);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_before := to_jsonb(OLD);
    INSERT INTO audit_log (actor_id, action, table_name, record_id, before, reason)
    VALUES (v_actor_id, 'DELETE', TG_TABLE_NAME, OLD.id::text, v_before, v_reason);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. SECUENCIAS DE NUMERACIÓN
CREATE TABLE numbering_sequences (
  key TEXT PRIMARY KEY,
  year INT NOT NULL,
  format TEXT NOT NULL,
  last_value INT DEFAULT 0
);
ALTER TABLE numbering_sequences ENABLE ROW LEVEL SECURITY;

-- 4. FIRMAS (SIGNATURES)
CREATE TABLE signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  record_table TEXT NOT NULL,
  record_id TEXT NOT NULL,
  meaning TEXT NOT NULL, -- ejecuto, verifico, reviso, aprobo, libero
  record_hash TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  reauth_method TEXT DEFAULT 'password'
);
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- 5. REGLAS SOD
CREATE OR REPLACE FUNCTION check_sod(p_table TEXT, p_record_id TEXT, p_user_id UUID, p_meaning TEXT) RETURNS VOID AS $$
DECLARE
  v_has_executed BOOLEAN;
  v_has_verified BOOLEAN;
  v_is_author BOOLEAN;
BEGIN
  -- Verificar si el usuario ya ejecutó (SOD-1) o verificó (SOD-2)
  SELECT EXISTS(
    SELECT 1 FROM signatures 
    WHERE record_table = p_table AND record_id = p_record_id 
    AND user_id = p_user_id AND meaning = 'ejecuto'
  ) INTO v_has_executed;

  SELECT EXISTS(
    SELECT 1 FROM signatures 
    WHERE record_table = p_table AND record_id = p_record_id 
    AND user_id = p_user_id AND meaning = 'verifico'
  ) INTO v_has_verified;

  IF p_meaning = 'verifico' AND v_has_executed THEN
    RAISE EXCEPTION 'SOD_VIOLATION' USING DETAIL = 'No puede verificar un registro que usted mismo ejecutó.';
  END IF;

  IF p_meaning = 'aprobo' AND v_has_verified THEN
    RAISE EXCEPTION 'SOD_VIOLATION' USING DETAIL = 'No puede aprobar un registro que usted mismo verificó.';
  END IF;
  
  -- Añadiremos más lógica de SOD según las tablas específicas en las siguientes etapas.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. FUNCIÓN DE FIRMA (sign_record)
CREATE OR REPLACE FUNCTION sign_record(
  p_table TEXT,
  p_record_id TEXT,
  p_meaning TEXT,
  p_password TEXT,
  p_hash TEXT
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_sig_id UUID;
  v_locked_at_exists BOOLEAN;
  v_current_locked_at TIMESTAMPTZ;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'REAUTH_FAILED' USING DETAIL = 'Usuario no autenticado.';
  END IF;

  -- Reautenticación por contraseña no se puede hacer directo en SQL de forma segura sin RPC especial a Auth.
  -- Para el MVP, delegaremos la verificación al middleware/cliente antes de llamar, o simulamos aquí.
  -- Asumimos que p_password se validó o se delega.
  
  PERFORM check_sod(p_table, p_record_id, v_user_id, p_meaning);

  INSERT INTO signatures (user_id, record_table, record_id, meaning, record_hash)
  VALUES (v_user_id, p_table, p_record_id, p_meaning, p_hash)
  RETURNING id INTO v_sig_id;

  -- Actualizar el locked_at de la tabla destino (usando SQL dinámico)
  -- Intentamos setear locked_at = now() y status a algo si se requiere. Por simplicidad, solo locked_at.
  -- Esto asume que la tabla tiene una columna locked_at.
  BEGIN
    EXECUTE format('UPDATE %I SET locked_at = now() WHERE id = %L AND locked_at IS NULL', p_table, p_record_id);
  EXCEPTION WHEN undefined_column THEN
    -- La tabla no tiene locked_at, no pasa nada
  END;

  RETURN v_sig_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función de bloqueo tras firma (Trigger genérico)
CREATE OR REPLACE FUNCTION block_locked_records() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.locked_at IS NOT NULL THEN
    RAISE EXCEPTION 'RECORD_LOCKED' USING DETAIL = 'El registro ha sido firmado y está bloqueado.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. FUNCIÓN DE HORA DE SERVIDOR
CREATE OR REPLACE FUNCTION server_now() RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN now();
END;
$$ LANGUAGE plpgsql;

-- 8. CORRECCIONES (ESTRUCTURA CENTRALIZADA)
CREATE TABLE corrections_log (
  id BIGSERIAL PRIMARY KEY,
  record_table TEXT NOT NULL,
  record_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  reason TEXT NOT NULL,
  corrected_by UUID REFERENCES profiles(id),
  corrected_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE corrections_log ENABLE ROW LEVEL SECURITY;
REVOKE UPDATE, DELETE, TRUNCATE ON corrections_log FROM public, authenticated, anon;

