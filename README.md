# GRUFARCOL eBR

Sistema de registro electrónico de lote (eBR), trazabilidad, liberación y gestión documental para cosméticos y medicamentos, cumpliendo normativas GxP y ALCOA+.

## Arranque Rápido (Local)

Para levantar la aplicación en un entorno de desarrollo local con tu proyecto vinculado en Supabase, ejecuta estos 5 comandos en tu terminal:

```bash
# 1. Instalar dependencias
npm install

# 2. Asegurar que Supabase CLI esté enlazado al proyecto remoto
npx supabase link --project-ref [TU_PROJECT_REF]

# 3. Empujar migraciones locales a tu base de datos remota (desarrollo)
npx supabase db push

# 4. Generar los tipos de TypeScript desde la base de datos
npm run db:types

# 5. Iniciar el servidor Next.js
npm run dev
```

*Nota: Para desarrollo local real completo con base de datos local, necesitas instalar Docker Desktop y usar `npm run db:start` en lugar de `db push`.*
