# Entornos y Despliegue (GRUFARCOL eBR)

La plataforma cuenta con 3 entornos:

## 1. Local (Desarrollo)
- **Base de Datos**: Supabase CLI (local con Docker) o Supabase Cloud (Proyecto Dev).
- **Hosting**: `http://localhost:3015`
- **Variables requeridas** (`.env.local`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`

## 2. Staging (Pruebas / QA)
- **Base de Datos**: Supabase Cloud (Proyecto QA).
- **Hosting**: Vercel (Preview/Staging).
- **Promoción de Migraciones**: CI/CD (GitHub Actions) aplica automáticamente las migraciones nuevas en la rama `staging` hacia Supabase QA.
- **Variables requeridas** (en el Hosting): Las mismas que Local + credenciales para webhooks si aplica.

## 3. Producción (Live)
- **Base de Datos**: Supabase Cloud (Proyecto Producción).
- **Hosting**: Vercel (Production) / VPC.
- **Promoción de Migraciones**: Ejecución supervisada o por CI/CD tras aprobación en `main`.
- **Variables requeridas**: Las mismas, apuntando a producción.
