"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CorrectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCorrect: (newValue: string, reason: string) => Promise<void>;
  oldValue: string;
}

export function CorrectionDialog({ isOpen, onClose, onCorrect, oldValue }: CorrectionDialogProps) {
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCorrect(newValue, reason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Corregir valor</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Valor anterior</p>
            <p className="line-through text-slate-700">{oldValue}</p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="newValue">Nuevo valor</Label>
            <Input 
              id="newValue" 
              value={newValue} 
              onChange={(e) => setNewValue(e.target.value)} 
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="reason">Motivo de la corrección</Label>
            <Input 
              id="reason" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              required
              disabled={loading}
            />
            <p className="text-xs text-slate-500">La corrección quedará registrada en la bitácora de auditoría.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar corrección"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
