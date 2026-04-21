import { useEffect, useState } from 'react';

// Props minimas del componente: solo necesita el endpoint a consultar.
interface ListaRecursoProps<T extends object> {
  endpoint: string;
  titleField: keyof T;
}

// Normaliza la respuesta del backend a un array de objetos.
// Soporta array directo o formato { data: [] }.
function parseListResponse<T extends object>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== 'object') return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data as T[];
  return [];
}

// Obtiene el ID tomando siempre la primera columna del objeto.
// Si no existe o no es string/number, usa el indice como fallback.
function resolveItemId<T extends object>(item: T, index: number): number | string {
  const row = item as unknown as Record<string, unknown>;
  const firstKey = Object.keys(row)[0];
  if (!firstKey) {
    return index;
  }

  const firstValue = row[firstKey];
  if (typeof firstValue === 'number' || typeof firstValue === 'string') {
    return firstValue;
  }

  return index;
}

export function ListaRecurso<T extends object>({ endpoint, titleField }: ListaRecursoProps<T>) {
  // items: filas recibidas desde la API.
  // hasError: controla si se debe mostrar el mensaje rojo generico.
  const [items, setItems] = useState<T[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Evita setState cuando el componente se desmonta antes de acabar el fetch.
    let cancelled = false;

    setHasError(false);

    // Pide la lista al endpoint configurado.
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error('fetch_failed');
        return res.json();
      })
      .then((data) => {
        // Si sigue montado, guarda la lista parseada.
        if (!cancelled) {
          setItems(parseListResponse<T>(data));
        }
      })
      .catch(() => {
        // Para cualquier error, muestra mensaje generico en rojo.
        if (!cancelled) {
          setHasError(true);
        }
      });

    // Limpieza del efecto.
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  // Mensaje unico de error, sin detalles tecnicos.
  if (hasError) return <div className="text-danger">Error al cargar la lista.</div>;

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="min-w-full bg-surface">
          <thead className="border-b border-border bg-surface-alt">
            <tr>
              {/* Estructura fija solicitada: solo ID y Title. */}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-text-muted">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-text-muted">Title</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item, index) => {
              // Calcula clave/valor de la columna ID.
              const id = resolveItemId(item, index);
              
              return (
                <tr key={id} className="hover:bg-surface-hover">
                  <td className="px-6 py-4 text-sm text-text-muted">{id}</td>
                  <td className="px-6 py-4 text-sm text-text-primary">{String(item[titleField] ?? '')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}