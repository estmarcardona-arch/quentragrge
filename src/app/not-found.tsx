import { EmptyState } from "@/components/gxp";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <EmptyState title="Página no encontrada (404)" description="La ruta solicitada no existe o no tiene permisos para verla." />
    </div>
  );
}
