"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (password: string) => Promise<void>;
  recordTitle: string;
  recordCode: string;
  meaning: "Ejecuté" | "Verifiqué" | "Revisé" | "Aprobé" | "Liberé";
  userName: string;
}

export function SignatureModal({ isOpen, onClose, onSign, recordTitle, recordCode, meaning, userName }: SignatureModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSign(password);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Contraseña incorrecta o error de firma");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-slate-900">Firmar registro</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Documento / Registro</p>
            <p className="font-medium text-slate-900">{recordTitle} ({recordCode})</p>
          </div>
          <div className="p-3 bg-slate-50 rounded border text-sm text-slate-700">
            Al firmar, declaro que <strong>{meaning}</strong> el contenido de este registro, conforme a los procedimientos establecidos.
          </div>
          
          <div>
            <p className="text-sm text-slate-500 mb-1">Firmante</p>
            <p className="font-medium">{userName}</p>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="password">Confirme su identidad (contraseña)</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Firmando..." : "Firmar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
