import { useEffect, useState } from 'react';
import type { CampoEsquema } from '../../types/editor';
import { ParagraphsEditor } from '../campos/ParagraphsEditor';

interface EditorProps<T extends object> {
  endpoint: string;
  fields: CampoEsquema<T>[];
  idEdicion: number | string | null;
  onCerrar: () => void;
  onGuardado?: () => void;
}

export function Editor<T extends object>({ endpoint, fields, idEdicion, onCerrar, onGuardado }: EditorProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (idEdicion === null) {
      setFormData({});
      setHasError(false);
      return;
    }

    setHasError(false);

    fetch(`${endpoint}/${idEdicion}`)
      .then((res) => {
        if (!res.ok) throw new Error('fetch_failed');
        return res.json();
      })
      .then((data) => {
        setFormData(data as Partial<T>);
      })
      .catch(() => {
        setHasError(true);
      });
  }, [endpoint, idEdicion]);

  const handleChange = (field: keyof T, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as unknown as T[keyof T],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasError(false);

    const metodo = idEdicion !== null ? 'PUT' : 'POST';
    const url = idEdicion !== null ? `${endpoint}/${idEdicion}` : endpoint;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('save_failed');
      }

      onGuardado?.();
      onCerrar();
    } catch {
      setHasError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <h3 className="text-lg font-bold text-text-primary">{idEdicion !== null ? 'Editar registro' : 'Crear registro'}</h3>

      {hasError && <div className="text-danger">Error al guardar.</div>}

      {fields.map((campo) => (
        <div key={String(campo.name)} className="flex flex-col">
          <label className="text-sm font-bold text-text-secondary">{campo.label}</label>
          {campo.type === 'textarea' ? (
            <textarea
              className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              value={String(formData[campo.name] ?? '')}
              onChange={(e) => handleChange(campo.name, e.target.value)}
            />
          ) : campo.type === 'select' ? (
            <select
              className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              value={String(formData[campo.name] ?? '')}
              onChange={(e) => handleChange(campo.name, e.target.value)}
            >
              <option value="">Selecciona una opcion</option>
              {(campo.options ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : campo.type === 'paragraphs' ? (
            <ParagraphsEditor
              value={Array.isArray(formData[campo.name]) ? (formData[campo.name] as string[]) : []}
              onChange={(e) => setFormData({...formData, [campo.name]: e as any})}
            />
          ) : (
            <input
              type={campo.type}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              value={String(formData[campo.name] ?? '')}
              onChange={(e) => handleChange(campo.name, e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-white hover:opacity-90">Guardar</button>
        <button type="button" onClick={onCerrar} className="rounded-lg border border-border px-4 py-2 text-text-secondary hover:bg-surface-hover">Cancelar</button>
      </div>
    </form>
  );
}