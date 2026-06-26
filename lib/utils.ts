type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean>
  | ClassValue[];

/**
 * Concatène des classes conditionnelles (équivalent léger de clsx).
 * Supporte les chaînes, tableaux et objets { classe: condition }.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string' || typeof input === 'number') {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) out.push(key);
      }
    }
  }
  return out.join(' ');
}
