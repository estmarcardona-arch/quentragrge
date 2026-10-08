"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/gxp";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Usuarios y roles", href: "/admin/usuarios" },
    { label: "Matriz de permisos", href: "/admin/permisos" },
    { label: "Catálogos maestros", href: "/admin/catalogos" },
    { label: "Configuración del sistema", href: "/admin/configuracion" }
  ];

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <PageHeader 
        title="Administración del Sistema" 
        subtitle="Gestión de usuarios, permisos, catálogos y configuración de la plataforma." 
      />

      <div className="border-b border-border flex gap-6 mb-6">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link 
              key={tab.href}
              href={tab.href}
              className={`pb-2.5 text-sm transition-colors ${
                isActive 
                  ? "font-semibold text-primary border-b-2 border-primary" 
                  : "font-medium text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
