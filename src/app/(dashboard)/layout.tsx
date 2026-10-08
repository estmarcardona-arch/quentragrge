"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Home, LayoutDashboard, FileText, CheckSquare, Search, Bell, ChevronRight, ChevronDown, User, Key, LogOut } from "lucide-react";
import { createClient } from "@/lib/db/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Cargando...");
  const [userRole, setUserRole] = useState("Cargando...");
  const [userInitials, setUserInitials] = useState("--");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        const { data: roles } = await supabase.from('user_roles').select('*').eq('user_id', user.id);
        
        if (profile) {
          setUserName(profile.full_name);
          const parts = profile.full_name.split(' ');
          setUserInitials(parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0]);
        } else {
          setUserName(user.email || "Usuario sin perfil");
          setUserInitials(user.email ? user.email.substring(0, 2).toUpperCase() : "US");
        }
        
        if (roles && roles.length > 0) {
          // Just show the first role for the UI
          setUserRole(roles[0].role.toUpperCase());
        } else {
          setUserRole("SIN ROL");
        }
      } else {
        setUserName("Invitado");
        setUserRole("NO AUTENTICADO");
      }
    }
    loadUser();
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/inicio", icon: LayoutDashboard },
    { label: "Órdenes de Producción", href: "/ordenes", icon: FileText, count: 3 },
    { label: "Control de Calidad", href: "/calidad", icon: CheckSquare },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[232px] bg-card border-r border-border flex flex-col flex-none">
        <div className="flex items-center gap-2.5 p-3 px-3 pb-3.5 mb-1 mt-1">
          <div className="w-7 h-7 rounded-[7px] bg-primary text-primary-foreground flex items-center justify-center">
            <Shield className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[15px] leading-5 text-foreground">GRUFARCOL eBR</span>
        </div>
        
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 h-10 px-2.5 rounded-md text-sm transition-colors ${
                  isActive 
                    ? "bg-accent text-primary font-semibold" 
                    : "text-muted-foreground hover:bg-slate-50 hover:text-foreground font-medium"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.count && (
                  <span className="min-w-[22px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-5 py-4 border-t border-border flex flex-col">
          <span className="text-xs text-muted-foreground mb-0.5">Rol activo</span>
          <span className="font-semibold text-[13px] text-foreground">{userRole}</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar */}
        <header className="h-[60px] bg-card border-b border-border flex items-center justify-between px-5 flex-none relative z-10">
          
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Link href="/inicio" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-foreground">Dashboard Principal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 h-9 w-[280px] px-3 rounded-md border border-input text-muted-foreground text-sm bg-background">
              <Search className="w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground h-full"
              />
              <span className="font-mono font-medium text-[11px] px-1.5 py-0.5 rounded-sm bg-accent border border-border text-foreground">
                Ctrl K
              </span>
            </div>

            <button className="relative w-9 h-9 flex items-center justify-center rounded-md text-foreground hover:bg-accent transition-colors">
              <Bell className="w-[22px] h-[22px]" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground font-semibold text-[11px] flex items-center justify-center border-2 border-card box-content">
                7
              </span>
            </button>

            <button className="flex items-center gap-2.5 pl-2">
              <div className="w-[34px] h-[34px] rounded-full bg-[#DCE7F4] text-[#173E70] flex items-center justify-center font-semibold text-[13px]">
                {userInitials}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-[13px] leading-4 text-foreground">{userName}</span>
                <span className="text-xs text-muted-foreground">{userRole}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background p-7 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
