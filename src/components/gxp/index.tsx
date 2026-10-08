import React from "react";
import { Badge } from "../ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";

export function StatusBadge({ type, label, icon: Icon }: { type: "aprobado" | "cuarentena" | "rechazado" | "borrador" | "tramite" | "desviacion_menor" | "desviacion_mayor" | "desviacion_critica", label: string, icon?: React.ElementType }) {
  const getStyle = () => {
    switch(type) {
      case "aprobado": return "bg-[#E6F4EA] text-[#1B6B3A] border-[#9FD0AF]";
      case "cuarentena": return "bg-[#FFF1D6] text-[#7A4A00] border-[#E3BE7A]";
      case "rechazado": return "bg-[#FDE8E8] text-[#A4262C] border-[#E9A7A9]";
      case "borrador": return "bg-[#EEF1F5] text-[#4D596B] border-[#B6C1CE]";
      case "tramite": return "bg-[#DCE7F4] text-[#173E70] border-[#8FB0D6]";
      case "desviacion_menor": return "bg-[#F1ECFA] text-[#5B3A99] border-[#B9A3DE]";
      case "desviacion_mayor": return "bg-[#DCCFF3] text-[#46287F] border-[#8E6CC8]";
      case "desviacion_critica": return "bg-[#4B2A8A] text-[#FFFFFF] border-[#4B2A8A] font-bold";
      default: return "bg-[#EEF1F5] text-[#4D596B] border-[#B6C1CE]";
    }
  };

  return (
    <Badge variant="outline" className={`gap-1 font-medium px-2.5 py-0.5 rounded-md ${getStyle()}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </Badge>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string, subtitle?: string, actions?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between pb-6 mb-6 border-b border-border">
      <div>
        <h1 className="text-2xl font-semibold leading-8 text-foreground m-0">{title}</h1>
        {subtitle && <p className="text-sm leading-[22px] text-muted-foreground mt-1 max-w-[760px]">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-border rounded-[10px] bg-card shadow-sm">
      <div className="w-14 h-14 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
    </div>
  );
}

export function ErrorState({ title, message }: { title: string, message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-border rounded-[10px] bg-card shadow-sm">
      <div className="w-14 h-14 rounded-full bg-[#FDE8E8] text-[#B3261E] flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{message}</p>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="p-6 border border-border rounded-[10px] bg-card flex flex-col items-center justify-center min-h-[200px]" aria-busy="true">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Cargando</div>
      <div className="w-full max-w-md space-y-3">
        <Skeleton className="h-2 w-3/4 mx-auto rounded-md bg-accent" />
        <Skeleton className="h-2 w-full mx-auto rounded-md bg-accent" />
        <Skeleton className="h-2 w-5/6 mx-auto rounded-md bg-accent" />
      </div>
    </div>
  );
}

export function SodNotice({ message }: { message: string }) {
  return (
    <Alert className="bg-[#FFF1D6] border-[#E3BE7A] text-[#7A4A00] rounded-lg">
      <AlertTitle className="font-semibold text-sm">Bloqueo por Segregación de Funciones (SOD)</AlertTitle>
      <AlertDescription className="text-sm text-[#7A4A00] mt-1">{message}</AlertDescription>
    </Alert>
  );
}

export function DocHeader({ code, version, status }: { code: string, version: string, status: string }) {
  return (
    <div className="flex justify-between items-center bg-accent px-4 py-3 rounded-lg border border-border text-sm mb-6">
      <span className="font-mono text-foreground font-medium"><strong className="font-sans font-semibold text-muted-foreground mr-1">Código:</strong> {code}</span>
      <span className="font-mono text-foreground font-medium"><strong className="font-sans font-semibold text-muted-foreground mr-1">Versión:</strong> {version}</span>
      <span className="font-mono text-foreground font-medium"><strong className="font-sans font-semibold text-muted-foreground mr-1">Estado:</strong> {status}</span>
    </div>
  );
}

export * from "./SignatureModal";
export * from "./AuditTrailPanel";
export * from "./CorrectionDialog";
export * from "./LockedBanner";

