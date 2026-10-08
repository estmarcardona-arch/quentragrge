import React from "react";
import { PageHeader, EmptyState } from "@/components/gxp";

export default function InicioPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Dashboard Principal" 
        subtitle="Bienvenido a la plataforma GRUFARCOL eBR" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <EmptyState 
          title="Tareas Pendientes" 
          description="Sin datos" 
        />
        <EmptyState 
          title="Lotes en Ejecución" 
          description="Sin datos" 
        />
        <EmptyState 
          title="Documentos para Revisión" 
          description="Sin datos" 
        />
      </div>
    </div>
  );
}
