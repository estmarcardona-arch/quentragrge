"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { ShieldAlert, X, Plus, Edit2 } from "lucide-react";
import { StatusBadge } from "@/components/gxp";

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  short_signature: string;
  active: boolean;
  roles: string[];
};

export default function UsuariosPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: 'Desarrollo123!', role: 'dt' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  async function loadUsers() {
    setLoading(true);
    const supabase = createClient();
    
    const { data: profiles, error: pError } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name");
      
    if (pError) {
      console.error(pError);
      setLoading(false);
      return;
    }
    
    const { data: roles, error: rError } = await supabase
      .from("user_roles")
      .select("*");
      
    if (rError) {
      console.error(rError);
      setLoading(false);
      return;
    }
    
    const combined = profiles.map(p => ({
      ...p,
      email: p.email || "—",
      roles: roles.filter(r => r.user_id === p.id).map(r => r.role)
    }));
    
    setUsers(combined);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ full_name: '', email: '', password: 'Desarrollo123!', role: 'dt' });
        loadUsers();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      alert("Error al invitar usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Usuarios del Sistema</h2>
          <p className="text-sm text-muted-foreground">Gestione los accesos y roles de la plataforma.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Invitar usuario
        </Button>
      </div>

      <div className="bg-card border border-border rounded-[10px] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Cargando usuarios...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-accent/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Nombre Completo</th>
                <th className="px-6 py-4 font-semibold">Roles Asignados</th>
                <th className="px-6 py-4 font-semibold">Firma Corta</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex flex-col">
                      <span>{user.full_name}</span>
                      <span className="text-xs text-muted-foreground font-normal font-mono">{user.id.substring(0,8)}...</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.length > 0 ? user.roles.map(r => (
                        <span key={r} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-accent text-foreground uppercase tracking-wider border border-border">
                          {r}
                        </span>
                      )) : <span className="text-muted-foreground text-xs italic">Sin roles</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{user.short_signature || '—'}</td>
                  <td className="px-6 py-4">
                    {user.active 
                      ? <StatusBadge type="aprobado" label="Activo" /> 
                      : <StatusBadge type="rechazado" label="Inactivo" />}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-[#FFF1D6] border border-[#E3BE7A] rounded-[10px] p-4 flex gap-3 mt-6">
        <ShieldAlert className="w-5 h-5 text-[#7A4A00] flex-none mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-[#7A4A00]">Política de Seguridad Activa</h4>
          <p className="text-sm text-[#7A4A00] mt-1">Los auditores externos tienen vencimiento automático. Un auditor vencido (AC-11) no podrá iniciar sesión. Nunca se eliminan registros de usuario para mantener la integridad de la bitácora GxP.</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-accent/30">
              <h3 className="font-semibold text-lg text-foreground">Invitar Usuario</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre Completo</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full border border-input rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Ej: Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Correo Electrónico</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-input rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="juan.perez@grufarcol.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-input rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-primary outline-none bg-background">
                  <option value="dt">Director Técnico</option>
                  <option value="aq_dir">Director de Calidad</option>
                  <option value="aq_doc">Asuntos Regulatorios</option>
                  <option value="cc_jefe">Jefe de CC</option>
                  <option value="prod_coord">Coordinador Producción</option>
                  <option value="comercial">Comercial</option>
                  <option value="admin">Administrador TI</option>
                  <option value="auditor">Auditor Externo</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isSubmitting ? "Enviando..." : "Crear Invitación"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
