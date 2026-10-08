"use client";

import React from "react";
import Link from "next/link";
import { 
  Scale, 
  Box, 
  Settings2, 
  AlertTriangle, 
  Wrench, 
  ShieldCheck, 
  Archive,
  Tag
} from "lucide-react";

export default function CatalogosPage() {
  const catalogs = [
    { id: "units", name: "Unidades de Medida", icon: Scale, desc: "Definición de kg, g, mg, L, mL, %." },
    { id: "material_types", name: "Tipos de Material", icon: Box, desc: "Materia prima, envase, empaque, granel." },
    { id: "equipment_types", name: "Tipos de Equipo", icon: Settings2, desc: "Clasificación y criticidad de equipos productivos." },
    { id: "deviation_classifications", name: "Clasificación de Desviaciones", icon: AlertTriangle, desc: "Niveles de severidad (Menor, Mayor, Crítica)." },
    { id: "correction_motives", name: "Motivos de Corrección", icon: Wrench, desc: "Causas estándar para bitácora de auditoría." },
    { id: "regulatory_profiles", name: "Perfiles Regulatorios", icon: ShieldCheck, desc: "Reglas para cosméticos vs. medicamentos." },
    { id: "retention_rules", name: "Reglas de Retención", icon: Archive, desc: "Tiempos de custodia de expedientes." },
    { id: "brands", name: "Marcas y Clientes", icon: Tag, desc: "Gestión comercial y asignación a lotes." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Catálogos Maestros</h2>
        <p className="text-sm text-muted-foreground">Todos los catálogos están versionados e integrados a la bitácora inmutable.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {catalogs.map((cat) => (
          <Link key={cat.id} href={`/admin/catalogos/${cat.id}`}>
            <div className="bg-card border border-border p-5 rounded-[10px] hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full">
              <div className="w-10 h-10 rounded-[8px] bg-accent text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <cat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{cat.desc}</p>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs font-semibold text-muted-foreground group-hover:text-primary">
                <span>Gestionar</span>
                <span>&rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
