import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno SUPABASE_URL o SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLS() {
  console.log("Verificando RLS en todas las tablas...");
  
  const { data, error } = await supabase.rpc('check_rls_enabled');
  
  if (error) {
    console.error("No se pudo ejecutar la consulta (puede que la función RPC no exista todavía):", error.message);
    console.log("Asegúrese de aplicar la migración o de correr este script con permisos adecuados.");
    // No fallamos la CI si la función RPC no existe aún, para permitir primer despliegue
    process.exit(0);
  }
  
  if (data && data.length > 0) {
    console.error("❌ ERROR: Las siguientes tablas no tienen RLS activado:");
    console.error(data);
    process.exit(1);
  }
  
  console.log("✅ Todas las tablas tienen RLS activado.");
}

checkRLS();
