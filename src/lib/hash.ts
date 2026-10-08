import { createHash } from "crypto";

/**
 * Calcula el hash SHA-256 del contenido canónico de un registro.
 * Para asegurar que la firma es robusta, las llaves se ordenan alfabéticamente.
 */
export function calculateRecordHash(record: Record<string, unknown>): string {
  // Ordenar llaves
  const sortedKeys = Object.keys(record).sort();
  const canonicalObject: Record<string, unknown> = {};
  
  for (const key of sortedKeys) {
    canonicalObject[key] = record[key];
  }
  
  const jsonString = JSON.stringify(canonicalObject);
  return createHash("sha256").update(jsonString).digest("hex");
}
