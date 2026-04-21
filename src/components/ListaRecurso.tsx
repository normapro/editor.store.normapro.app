import { useEffect, useState } from 'react';
import type { RecursoConfig } from '../types/editor.ts';

interface Props<T> {
  config: RecursoConfig<T>;
  onEditar: (id: number | string) => void;
  onCrear: () => void;
}

export function ListaRecurso<T>( { config, onEditar, onCrear }: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(config.endpoint)
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudo obtener la lista`);
        return res.json();
      })
      .then(data => {
        // Verifica si la API devuelve el array directamente o si viene dentro de un objeto
        const lista = Array.isArray(data) ? data : data.data || [];
        setItems(lista);
      })
      .catch(err => {
        console.error("Error en fetch:", err);
        setError(err.message);
      });
  }, [config]);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (items.length === 0) return <div className="text-gray-500">No hay {config.plural} para mostrar.</div>;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de {config.plural}</h2>
        <button onClick={onCrear} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          + Crear {config.singular}
        </button>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {String(config.columnaPrincipal)}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item: any) => {
              // Buscamos el ID dinámicamente
              const id = item.id_noticia || item.id || item.id_informe;
              
              return (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {String(item[config.columnaPrincipal])}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button 
                      onClick={() => onEditar(id)}
                      className="text-blue-600 hover:text-blue-900 font-semibold"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}