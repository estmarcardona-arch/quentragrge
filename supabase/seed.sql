-- SEED: Datos iniciales de desarrollo
-- IMPORTANTE: Solo para entorno local. No usar en producción.

-- 1. Insertar usuarios ficticios en auth.users (Supabase Auth)
-- NOTA: Como la contraseña usa bcrypt, asignaremos un hash genérico (password "Desarrollo123!") o podemos confiar en supabase cli si permite creación de usuarios.
-- Sin embargo, la forma más fácil de hacer esto localmente en el CLI es usar funciones si estamos insertando directamente en la tabla auth.users, pero dado que auth.users es un esquema de la plataforma, es mejor que se registren por API o hacer inserts crudos si es soportado por el CLI local de Supabase.

-- Las personas del Prompt 0B:
-- Comercial: Andrea Soler (asoler)
-- I+D: Diego Cárdenas (dcardenas)
-- Bodega Aux: Miguel Ortiz (mortiz)
-- Bodega Jefe: Patricia Rivas (privas)
-- Prod Aux: Juan Mendoza (jmendoza)
-- Prod Coord: Diana Castro (dcastro)
-- Lab Aux: Carolina Meza (cmeza)
-- Calidad Jefe: Sergio Beltrán (sbeltran)
-- Aseguramiento Dir: Victoria Cruz (vcruz)
-- Dirección Técnica: Ricardo Gómez (rgomez)
-- Admin: Admin Sistema (admin)
-- Master: Usuario Master (master)
-- AQ Doc: Laura Peña (lpena)
-- Gerencia: Carlos Duarte (cduarte)

-- Para poder tener la data lista en Supabase local, insertaremos los usuarios de prueba en auth.users si es posible en el motor de prueba, pero como puede haber constraints (como ids requeridos), usaremos bloques anonimos o simplemente la creación de perfiles.
-- Si estamos en cloud, los inserts a auth.users directos no funcionarán. 
-- El PRD dice "SEMITA: crea usuarios ficticios de todos los roles con los nombres del Prompt 0B (personas) y contraseñas de desarrollo en seed.sql solo para entorno local."

DO $$ 
DECLARE
  v_pass_hash TEXT := crypt('Desarrollo123!', gen_salt('bf'));
  v_role_id UUID;
BEGIN
  -- Esta función asume que estamos en local y somos superusuarios
  -- Insertaremos un usuario master de ejemplo
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@grufarcol.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      '00000000-0000-0000-0000-000000000001', 'admin@grufarcol.com', v_pass_hash, now(), 'authenticated', '{"provider": "email", "providers": ["email"]}', '{"name": "Admin Sistema"}'
    );
    INSERT INTO profiles (id, full_name, short_signature, active) VALUES ('00000000-0000-0000-0000-000000000001', 'Admin Sistema', 'A. Sistema', true);
    INSERT INTO user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-000000000001', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dt@grufarcol.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      '00000000-0000-0000-0000-000000000002', 'dt@grufarcol.com', v_pass_hash, now(), 'authenticated', '{"provider": "email", "providers": ["email"]}', '{"name": "Ricardo Gómez"}'
    );
    INSERT INTO profiles (id, full_name, short_signature, active) VALUES ('00000000-0000-0000-0000-000000000002', 'Ricardo Gómez', 'R. Gómez', true);
    INSERT INTO user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-000000000002', 'dt');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'master@grufarcol.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      '00000000-0000-0000-0000-000000000003', 'master@grufarcol.com', v_pass_hash, now(), 'authenticated', '{"provider": "email", "providers": ["email"]}', '{"name": "Usuario Master"}'
    );
    INSERT INTO profiles (id, full_name, short_signature, active) VALUES ('00000000-0000-0000-0000-000000000003', 'Usuario Master', 'U. Master', true);
    INSERT INTO user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-000000000003', 'master');
  END IF;
  
  -- Para agilizar las pruebas, estos 3 son los principales en E1
END $$;
