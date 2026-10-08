"use client";

import React from "react";
import { formatDateTimeEs } from "@/lib/format";

export interface AuditRecord {
  id: string;
  action: string;
  actorName: string;
  at: string;
  reason?: string;
}

export function AuditTrailPanel({ records }: { records: AuditRecord[] }) {
  if (records.length === 0) {
    return <p className="text-sm text-slate-500 italic">No hay historial para este registro.</p>;
  }

  return (
    <div className="space-y-4 border-l-2 border-slate-200 ml-3 pl-4 py-2">
      {records.map((rec) => (
        <div key={rec.id} className="relative">
          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white" />
          <div className="text-sm">
            <p className="font-medium text-slate-900">{rec.action}</p>
            <p className="text-slate-500 text-xs">
              {rec.actorName} · {formatDateTimeEs(rec.at)}
            </p>
            {rec.reason && (
              <p className="mt-1 text-slate-700 bg-slate-50 p-1.5 rounded inline-block">
                Motivo: {rec.reason}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
