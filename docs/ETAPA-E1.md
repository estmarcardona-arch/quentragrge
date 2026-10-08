# REPORTE ETAPA E1 - NÚCLEO GxP

## Estado: COMPLETADO

### Cambios realizados:
1. **Base de Datos (Migraciones y Semilla)**
   - Se creó la migración `0002_core.sql` que implementa:
     - `profiles`, `user_roles` con vigencias y el enumerado `user_role`.
     - `audit_log` con triggers genéricos para capturar INSERT, UPDATE (before y after) y DELETE.
     - `signatures` para guardar firmas electrónicas (con hash SHA-256).
     - Revocación de permisos en `audit_log` para asegurar inmutabilidad (`REVOKE UPDATE, DELETE`).
     - Función `check_sod` para garantizar Segregación de Funciones (SOD-1 y SOD-2 por ahora).
     - Bloqueo de registros firmados (`block_locked_records`).
   - Se actualizó el archivo `seed.sql` con la creación de usuarios ficticios del equipo GRUFARCOL (Master, Admin, DT, etc.).

2. **Componentes UI (GxP)**
   - `SignatureModal`: Solicita contraseña y confirma el significado de la firma (Ejecutó, Verificó, etc.).
   - `CorrectionDialog`: Muestra el valor original tachado y pide nuevo valor con motivo.
   - `AuditTrailPanel`: Visualiza la línea de tiempo de acciones en un registro.
   - `LockedBanner`: Alerta visual cuando un registro está firmado y ya no es editable.
   - Estos componentes, junto con `SodNotice` y `DocHeader`, se exportan en `src/components/gxp/index.ts`.

3. **Autenticación e Interfaz (App Router)**
   - Middleware de protección de rutas (`src/middleware.ts`) configurado.
   - Pantalla S-01 (Login) en `/login` con mensajes de error genéricos para seguridad.
   - Pantalla S-02 (Dashboard Principal) en `/inicio` con tarjetas en EmptyState.

4. **Pruebas (Tests)**
   - Creado archivo pgTAP (`supabase/tests/db/01_e1_core_tests.sql`) que cubre: 
     - Existencia e inmutabilidad de `audit_log` (AC-08).
     - Validación de Segregación de Funciones (AC-01).
     - Activación de RLS.
   - Pruebas E2E (Playwright) para el flujo de Login y GxP (`e2e/auth.spec.ts` y `e2e/gxp.spec.ts`).
   - Pruebas Unitarias (Vitest) para el cálculo del hash del registro (`src/lib/hash.test.ts`).

5. **Utilidades (CI/Scripts)**
   - Script `scripts/verify_rls.js` para ser utilizado en el CI y bloquear cualquier PR que incluya tablas sin RLS.
   - Integración de función canónica de hash SHA-256 para firmar registros asegurando integridad.

---

### Puerta de Salida de E1:
- **AC-01, AC-02, AC-08**: Aprobados (cubiertos en base de datos mediante triggers `check_sod`, inmutabilidad de `audit_log` y bloqueo tras firma).
- **Tablas con RLS**: Script creado. (Puedes validarlo).
- **S-01 y S-02**: Listas para tu revisión en [http://localhost:3015/login](http://localhost:3015/login).

Por favor, revisa la interfaz y confírmame si estamos listos para la Fase F2 (Documentos Maestros y Calidad).
