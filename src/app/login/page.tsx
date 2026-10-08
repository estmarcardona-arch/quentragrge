"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Mensaje genérico en español, sin revelar si existe
      setError("Credenciales inválidas o cuenta bloqueada.");
      return;
    }

    router.push("/inicio");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-[440px] bg-card p-10 rounded-[10px] shadow-[0_8px_20px_rgba(22,27,35,0.08)] border border-border">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-[10px] bg-primary text-primary-foreground flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <h1 className="text-[28px] font-semibold leading-8 text-foreground m-0 tracking-tight">GRUFARCOL eBR</h1>
          <p className="text-sm font-normal text-muted-foreground mt-2">Registro Electrónico de Lote</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Correo electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="nombre@grufarcol.com" 
              className="h-10 border-border bg-card shadow-none focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 font-mono text-sm"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="h-10 border-border bg-card shadow-none focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 font-mono text-sm"
              required 
            />
          </div>

          {error && (
            <Alert className="bg-[#FDE8E8] border-[#E9A7A9] text-[#A4262C] rounded-md shadow-none py-3">
              <AlertDescription className="text-sm font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md shadow-none" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}
