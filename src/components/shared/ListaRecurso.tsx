import { useEffect, useState, useMemo } from 'react';

// Props minimas del componente: solo necesita el endpoint a consultar.
interface ListaRecursoProps<T extends object> {
  endpoint: string;
  titleField: keyof T;
  onAdd?: () => void;
  onEdit?: (id: number | string, item: T) => void; 
  onDelete?: (id: number | string, item: T) => void;
  reloadKey?: number;
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

// Obtiene la clave compuesta si es soluciones-ambitos o soluciones-ambitos-sectores
// Si no obtiene el ID tomando la primera columna del objeto.
// Si no existe o no es string/number, usa el indice como fallback.
function resolveItemId<T extends object>(item: T, index: number): number | string {
  const row = item as unknown as Record<string, any>;
  
  // Clave compuesta (Soluciones - Ambitos - Sectores)
  if (row.id_solucion !== undefined && row.id_ambito !== undefined) {
    let composite = `${row.id_solucion}-${row.id_ambito}`;
    if (row.id_sector !== undefined) composite += `-${row.id_sector}`;
    return composite;
  }

  // Primera columna
  const firstKey = Object.keys(row)[0];
  if (firstKey && (typeof row[firstKey] === 'number' || typeof row[firstKey] === 'string')) {
    return row[firstKey];
  }

  // Fallback al indice
  return index;
}

export function ListaRecurso<T extends object>({
  endpoint,
  titleField,
  onAdd,
  onEdit,
  onDelete,
  reloadKey,
}: ListaRecursoProps<T>) {
  // items: filas recibidas desde la API.
  // hasError: controla si se debe mostrar el mensaje rojo generico.
  const [items, setItems] = useState<T[]>([]);
  const [hasError, setHasError] = useState(false);
  
  // --- NUEVO: Estado para el término de búsqueda ---
  const [searchTerm, setSearchTerm] = useState('');

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
  }, [endpoint, reloadKey]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return items;

    return items.filter((item, index) => {
      const id = String(resolveItemId(item, index)).toLowerCase();
      const title = String(item[titleField] ?? '').toLowerCase();
      return id.includes(query) || title.includes(query);
    });
  }, [items, searchTerm, titleField]);

  if (hasError) return <div className="text-danger">Error al cargar la lista.</div>;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
        {/* Barra de busqueda */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Buscar por ID o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2 text-text-muted hover:text-text-primary"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-primary/10 w-full sm:w-auto h-10 min-w-[120px]"
        >
          Añadir +
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="min-w-full bg-surface">
          <thead className="border-b border-border bg-surface-alt">
            <tr>
              {/* Estructura fija solicitada: solo ID y Title. */}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-text-muted">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-text-muted">Title</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-text-muted">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const id = resolveItemId(item, index);
                return (
                  <tr key={id} className="hover:bg-surface-hover">
                    <td className="px-6 py-4 text-sm text-text-muted">{id}</td>
                    <td className="px-6 py-4 text-sm text-text-primary">{String(item[titleField] ?? '')}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(id, item)}
                          className="rounded-md border border-border px-3 py-1.5 text-text-secondary hover:bg-primary/10"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(id, item)}
                          disabled={!onDelete}
                          className="rounded-md border border-border px-3 py-1.5 text-danger hover:bg-danger/10"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-text-muted">
                  No se encontraron resultados para "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}