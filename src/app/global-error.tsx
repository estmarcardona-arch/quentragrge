"use client";

import { ErrorState } from "@/components/ui/design-system";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-screen items-center justify-center p-4">
          <ErrorState title="Error Crítico (500)" message="Ha ocurrido un error inesperado. Por favor contacte soporte o intente de nuevo." />
        </div>
      </body>
    </html>
  );
}
