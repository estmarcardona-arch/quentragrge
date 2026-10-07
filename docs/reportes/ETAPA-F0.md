# REPORTE DE ETAPA: F0 Cimientos

## Qué se construyó
- **Repositorio:** Proyecto Next.js configurado en el directorio raíz.
- **Base de datos:** `supabase` CLI inicializado.
- **Frontend:** Instalación del núcleo de Shadcn UI y dependencias exactas sin saltos de versión.
- **Reglas:** Definido `AGENTS.md` que incluye los mandatos permanentes, GxP, y bloqueos de seguridad.
- **Variables de Entorno:** Generados `.env.example` y `.env.local` sin exponer secretos al repositorio.

## Resultados de Pruebas / Criterios (DoD)
| Requisito / Prueba | Estado | Notas |
|---|---|---|
| Repositorio inicializado y Next.js vacío | Aprobado | Ejecutado `npm install` |
| Supabase CLI inicializado | Aprobado | Archivo `supabase/config.toml` verificado |
| Dependencias exactas (Regla 10) | Aprobado | Reportado en `docs/VERSIONES.md` |
| `AGENTS.md` generado | Aprobado | |

## Deuda técnica y Preguntas abiertas
- Falta configurar un sistema de pruebas formales (Vitest/Playwright/pgTAP) dado que esto se afianzará al momento de escribir la primera RPC y UI (Etapa F1).

## Comandos para reproducir (o iniciar el entorno)
1. Iniciar Base de Datos Local: `npx supabase start`
2. Iniciar Servidor Web: `npm run dev`
