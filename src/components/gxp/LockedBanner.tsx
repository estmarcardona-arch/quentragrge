import React from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Lock } from "lucide-react";

export function LockedBanner() {
  return (
    <Alert className="bg-slate-50 border-slate-200 mb-4">
      <Lock className="w-4 h-4 text-slate-500" />
      <AlertTitle className="text-slate-700">Registro Firmado y Bloqueado</AlertTitle>
      <AlertDescription className="text-slate-600">
        Este registro ha sido firmado electrónicamente y ya no puede ser editado. Cualquier modificación requiere la creación de un nuevo registro o versión.
      </AlertDescription>
    </Alert>
  );
}
