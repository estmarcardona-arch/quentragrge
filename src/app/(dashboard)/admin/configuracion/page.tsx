"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/db/client";

type SettingRow = { id: string, setting_value: any, description: string };

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SettingRow[]>([]);
  
  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .order("id");
        
      if (error) {
        console.error(error);
      } else {
        setSettings(data || []);
      }
      setLoading(false);
    }
    
    loadSettings();
  }, []);

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Cargando configuración...</div>;
  }

  return (
    <div className="bg-card border border-border rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-accent/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold w-[250px]">Clave</th>
              <th className="px-6 py-4 font-semibold w-[250px]">Valor</th>
              <th className="px-6 py-4 font-semibold">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((row, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-foreground">{row.id}</td>
                <td className="px-6 py-4 font-mono text-xs text-foreground bg-accent/30 rounded">
                  {typeof row.setting_value === 'object' && row.setting_value !== null ? (
                    <pre className="m-0 whitespace-pre-wrap">
                      {Object.entries(row.setting_value).map(([k, v]) => `${k}: ${v}`).join('\n')}
                    </pre>
                  ) : (
                    String(row.setting_value)
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{row.description}</td>
              </tr>
            ))}
            {settings.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                  No hay configuraciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
