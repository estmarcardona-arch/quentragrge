import React from "react";
import { StatusBadge, PageHeader, EmptyState, ErrorState, LoadingSkeleton, SodNotice, DocHeader } from "@/components/ui/design-system";
import { CheckCircle, AlertTriangle, XCircle, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DesignSystemPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <PageHeader 
        title="Sistema de Diseño: GRUFARCOL eBR" 
        subtitle="Referencia visual de los componentes GxP y estados base."
        actions={<Button>Acción Principal</Button>}
      />

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">1. Semáforo de Calidad y Vigencia</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge type="aprobado" label="Aprobado" icon={CheckCircle} />
          <StatusBadge type="cuarentena" label="Cuarentena" icon={AlertTriangle} />
          <StatusBadge type="rechazado" label="Rechazado" icon={XCircle} />
          <StatusBadge type="borrador" label="Borrador / Sin dato" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">2. Trámite y Severidad (Desviaciones)</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge type="tramite" label="En revisión" icon={Clock} />
          <StatusBadge type="desviacion_menor" label="Desviación Menor" icon={ShieldAlert} />
          <StatusBadge type="desviacion_mayor" label="Desviación Mayor" icon={ShieldAlert} />
          <StatusBadge type="desviacion_critica" label="Desviación Crítica" icon={ShieldAlert} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">3. Componentes Documentales (GxP)</h2>
        <DocHeader code="PRD-PR-003-FR-01" version="v03" status="Vigente" />
        <SodNotice message="Usted ejecutó este paso. El sistema requiere que un usuario diferente realice la verificación (Segregación de Funciones)." />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">4. Estados Base de Página</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState title="No hay lotes en curso" description="Haga clic en 'Nuevo Lote' para comenzar la manufactura." />
          <ErrorState title="Error de conexión" message="No se pudo contactar la base de datos de Supabase. Verifique su conexión." />
        </div>
        <div className="mt-6 border p-6 rounded-lg bg-white">
          <h3 className="mb-4 text-sm font-medium text-slate-500">Esqueleto de Carga (LoadingSkeleton)</h3>
          <LoadingSkeleton />
        </div>
      </section>
    </div>
  );
}
