"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/db/client";

type MatrixCell = { [role: string]: string };
type MatrixRow = { module: string, permissions: MatrixCell };

export default function PermisosPage() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [matrix, setMatrix] = useState<MatrixRow[]>([]);
  
  useEffect(() => {
    async function loadMatrix() {
      const supabase = createClient();
      
      // Load modules
      const { data: permsData, error: permError } = await supabase
        .from("permissions")
        .select("*")
        .order("id");
        
      if (permError) {
        console.error(permError);
        setLoading(false);
        return;
      }
      
      // Load mapping
      const { data: rolePermsData, error: rpError } = await supabase
        .from("role_permissions")
        .select("*");
        
      if (rpError) {
        console.error(rpError);
        setLoading(false);
        return;
      }
      
      // Get unique roles
      const uniqueRoles = Array.from(new Set(rolePermsData.map(rp => rp.role)));
      // You can define a custom sort order for roles if needed
      const sortedRoles = ["comercial", "idi", "bodega_aux", "bodega_jefe", "prod_aux", "prod_coord", "lab_aux", "cc_jefe", "aq_dir", "dt", "admin", "master", "aq_doc", "gerencia", "auditor"];
      const displayRoles = sortedRoles.filter(r => uniqueRoles.includes(r));
      // Append any roles not in the sorted list
      uniqueRoles.forEach(r => {
        if (!displayRoles.includes(r)) displayRoles.push(r);
      });
      
      setRoles(displayRoles);
      
      // Build matrix
      const matrixRows = permsData.map(perm => {
        const rowPermissions: MatrixCell = {};
        
        displayRoles.forEach(r => {
          const accesses = rolePermsData
            .filter(rp => rp.role === r && rp.permission_id === perm.id)
            .map(rp => rp.access_level);
            
          rowPermissions[r] = accesses.length > 0 ? accesses.join(" ") : "—";
        });
        
        return {
          module: perm.name,
          permissions: rowPermissions
        };
      });
      
      setMatrix(matrixRows);
      setLoading(false);
    }
    
    loadMatrix();
  }, []);

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Cargando matriz...</div>;
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex gap-4 mb-2 text-sm text-muted-foreground bg-accent/30 p-3 rounded-md border border-border">
        <strong>Leyenda de permisos:</strong>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> <strong>L:</strong> Leer</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> <strong>C:</strong> Crear / Editar</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> <strong>F:</strong> Firmar / Verificar</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> <strong>A:</strong> Aprobar / Liberar</span>
      </div>

      <div className="bg-card border border-border rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-accent/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold min-w-[300px]">Módulo</th>
                {roles.map(r => (
                  <th key={r} className="px-4 py-3 font-semibold whitespace-nowrap">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-foreground">{row.module}</td>
                  {roles.map(r => (
                    <td key={r} className={`px-4 py-3 font-mono text-xs whitespace-nowrap ${row.permissions[r] === '—' ? 'text-muted-foreground/40' : 'text-foreground font-semibold'}`}>
                      {row.permissions[r]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
