import React, { useState, useEffect } from 'react';
import type { RecursoConfig } from '../../types/editor';

interface Props<T> {
  config: RecursoConfig<T>;
  idEdicion: number | string | null;
  onCerrar: () => void;
}

export function Editor<T>({ config, idEdicion, onCerrar }: Props<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});

  useEffect(() => {
    if (idEdicion) {
      fetch(`${config.endpoint}/${idEdicion}`)
        .then(res => res.json())
        .then(data => setFormData(data));
    }
  }, [idEdicion, config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const metodo = idEdicion ? 'PUT' : 'POST';
    const url = idEdicion ? `${config.endpoint}/${idEdicion}` : config.endpoint;

    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("Operación exitosa");
      onCerrar();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded bg-white">
      <h3 className="text-lg font-bold">{idEdicion ? 'Editar' : 'Crear'} {config.singular}</h3>
      {config.esquema.map((campo) => (
        <div key={String(campo.name)} className="flex flex-col">
          <label className="text-sm font-bold">{campo.label}</label>
          {campo.type === 'textarea' ? (
            <textarea
              className="border p-2 rounded"
              value={(formData[campo.name] as any) || ''}
              onChange={(e) => setFormData({...formData, [campo.name]: e.target.value as any})}
            />
          ) : (
            <input
              type={campo.type}
              className="border p-2 rounded"
              value={(formData[campo.name] as any) || ''}
              onChange={(e) => setFormData({...formData, [campo.name]: e.target.value as any})}
            />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
        <button type="button" onClick={onCerrar} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  );
}