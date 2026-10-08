import { format, parseISO } from "date-fns";

export function formatCop(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDateEs(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "dd/MM/yyyy");
}

export function formatDateTimeEs(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "dd/MM/yyyy HH:mm");
}
