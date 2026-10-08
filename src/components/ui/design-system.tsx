import React from "react";
import { Badge } from "./badge";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { Skeleton } from "./skeleton";

export function StatusBadge({ type, label, icon: Icon }: { type: "aprobado" | "cuarentena" | "rechazado" | "borrador" | "tramite" | "desviacion_menor" | "desviacion_mayor" | "desviacion_critica", label: string, icon?: React.ElementType }) {
  const getStyle = () => {
    switch(type) {
      case "aprobado": return "bg-green-100 text-green-800 border-green-300";
      case "cuarentena": return "bg-amber-100 text-amber-800 border-amber-300";
      case "rechazado": return "bg-red-100 text-red-800 border-red-300";
      case "borrador": return "bg-slate-100 text-slate-800 border-slate-300";
      case "tramite": return "bg-blue-100 text-blue-800 border-blue-300";
      case "desviacion_menor": return "bg-violet-100 text-violet-800 border-violet-300";
      case "desviacion_mayor": return "bg-violet-200 text-violet-900 border-violet-400";
      case "desviacion_critica": return "bg-violet-300 text-violet-950 border-violet-500 font-bold";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Badge variant="outline" className={`gap-1 ${getStyle()}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </Badge>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string, subtitle?: string, actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pb-4 mb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-slate-50 border-dashed">
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  );
}

export function ErrorState({ title, message }: { title: string, message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[300px]" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function SodNotice({ message }: { message: string }) {
  return (
    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
      <AlertTitle>Bloqueo por Segregación de Funciones (SOD)</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function DocHeader({ code, version, status }: { code: string, version: string, status: string }) {
  return (
    <div className="flex justify-between items-center bg-slate-100 p-2 rounded-md border text-xs mb-4 font-mono">
      <span><strong className="font-sans">Código:</strong> {code}</span>
      <span><strong className="font-sans">Versión:</strong> {version}</span>
      <span><strong className="font-sans">Estado:</strong> {status}</span>
    </div>
  );
}
