import { useEffect, useState, type ReactNode } from 'react';
import type { CampoEsquema } from '../../types/editor';
import { getEditorToken } from '../../auth/session';
import { ParagraphsEditor } from '../campos/ParagraphsEditor';
import { Multiselect } from '../campos/Multiselect';
import { ContenidoInforme } from '../campos/ContenidoInforme';
import { IndiceInformeEditor } from '../campos/IndiceInformeEditor';
import { AutoresInformeEditor } from '../campos/AutoresInformeEditor';
import { ComponentesJsonEditor } from '../campos/ComponentesJsonEditor';

interface EditorProps<T extends object> {
  endpoint: string;
  saveEndpoint?: string;
  fields: CampoEsquema<T>[];
  idEdicion: number | string | null;
  onCerrar: () => void;
  onGuardado?: () => void;
  extraBeforeActions?: ReactNode;
}

export function Editor<T extends object>({ endpoint, saveEndpoint, fields, idEdicion, onCerrar, onGuardado, extraBeforeActions }: EditorProps<T>) {
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

  const handleChange = (field: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as unknown as T[keyof T],
    }));
  };

  const getFieldValue = (field: keyof T): unknown => {
    const record = formData as Record<string, unknown>;
    const key = String(field);

    if (record[key] !== undefined) {
      return record[key];
    }

    const snakeKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
    if (record[snakeKey] !== undefined) {
      return record[snakeKey];
    }

    const camelKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
    if (record[camelKey] !== undefined) {
      return record[camelKey];
    }

    return undefined;
  };

  const cleanContenidoInforme = (data: any) => {
    if (!Array.isArray(data)) return data;

    return data.map((item) => ({
      ...item,
      content: item.content
        ?.replace(/&nbsp;/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s+/g, ' ')
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasError(false);

    const metodo = idEdicion !== null ? 'PUT' : 'POST';
    const writeBase = saveEndpoint ?? endpoint;
    const url = idEdicion !== null ? `${writeBase}/${idEdicion}` : writeBase;
    const token = getEditorToken();

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Limpiar el contenido del informe antes de enviarlo
    const cleanedFormData = { ...formData } as any;

    if (cleanedFormData["prologo"]) {
      cleanedFormData["prologo"] = cleanContenidoInforme(cleanedFormData["prologo"]);
    }

    // Enviar la solicitud al backend
    try {
      const res = await fetch(url, {
        method: metodo,
        headers,
        body: JSON.stringify(cleanedFormData),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("ERROR DEL BACKEND:", errorMsg);
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

      {fields.map((campo) => {
        const valorActual = getFieldValue(campo.name);
        const safeString = (() => {
          if (valorActual === null || valorActual === undefined) {
            return '';
          }

          if (campo.type === 'date') {
            if (typeof valorActual === 'string') {
              const trimmed = valorActual.trim();
              const isoLike = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
              if (isoLike) {
                return isoLike[1];
              }

              const parsed = new Date(trimmed);
              if (!Number.isNaN(parsed.getTime())) {
                return parsed.toISOString().slice(0, 10);
              }

              return '';
            }

            if (valorActual instanceof Date && !Number.isNaN(valorActual.getTime())) {
              return valorActual.toISOString().slice(0, 10);
            }

            return '';
          }

          if (typeof valorActual === 'string' || typeof valorActual === 'number') {
            return String(valorActual);
          }

          if (Array.isArray(valorActual)) {
            if (campo.type === 'textarea') {
              try {
                return JSON.stringify(valorActual, null, 2);
              } catch {
                return '';
              }
            }

            return valorActual
              .map((item) => String(item).trim())
              .filter((item) => item.length > 0)
              .join(',');
          }

          try {
            return campo.type === 'textarea'
              ? JSON.stringify(valorActual, null, 2)
              : JSON.stringify(valorActual);
          } catch {
            return '';
          }
        })();

        return (
          <div key={String(campo.name)} className="flex flex-col gap-1">
            <label className="text-sm font-bold text-text-secondary">{campo.label}</label>
            {campo.type === 'textarea' ? (
              <textarea
                className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
                value={safeString}
                onChange={(e) => handleChange(campo.name, e.target.value)}
              />
            ) : campo.type === 'select' ? (
              <select
                className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
                value={safeString}
                onChange={(e) => handleChange(campo.name, e.target.value)}
              >
                <option value="">Selecciona una opcion</option>
                {(campo.options ?? []).map((option: any, index: number) => {
                  const valor = typeof option === 'object' ? option.value : option;
                  const etiqueta = typeof option === 'object' ? option.label : option;

                  return (
                    <option key={valor ?? index} value={valor}>
                      {etiqueta}
                    </option>
                  );
                })}
              </select>
            ) : campo.type === 'multiselect' ? (
              <Multiselect
                value={valorActual as string | string[]}
                options={campo.options ?? []}
                onChange={(newValue) => handleChange(campo.name, newValue)}
              />
            ) : campo.type === 'paragraphs' ? (
              <ParagraphsEditor
                value={Array.isArray(valorActual) ? (valorActual as string[]) : []}
                onChange={(newValue) => handleChange(campo.name, newValue)}
              />
            ) : campo.type === 'contenido_informe' ? (
              <ContenidoInforme
                value={valorActual}
                onChange={(newValue) => handleChange(campo.name, newValue)}
              />
            ) : campo.type === 'indice_informe' ? (
              <IndiceInformeEditor
                value={valorActual}
                onChange={(newValue) => handleChange(campo.name, newValue)}
              />
            ) : campo.type === 'autores_informe' ? (
              <AutoresInformeEditor
                value={valorActual}
                onChange={(newValue) => handleChange(campo.name, newValue)}
              />
            ) : campo.type === 'componentes_json' ? (
              <ComponentesJsonEditor
                value={valorActual}
                onChange={(newValue) => handleChange(campo.name, newValue)}
                library={campo.componentLibrary ?? []}
              />
            ) : (
              <input
                type={campo.type}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
                value={safeString}
                onChange={(e) => handleChange(campo.name, e.target.value)}
              />
            )}
          </div>
        );
      })}

      {extraBeforeActions}

      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-white hover:opacity-90">Guardar</button>
        <button type="button" onClick={onCerrar} className="rounded-lg border border-border px-4 py-2 text-text-secondary hover:bg-surface-hover">Cancelar</button>
      </div>
    </form>
  );
}