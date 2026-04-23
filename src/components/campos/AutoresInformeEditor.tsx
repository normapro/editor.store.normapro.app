interface ResponsableItem {
  nombre: string;
  empresa: string;
  cargo: string;
  imagen: string;
}

interface AutoresInformeEditorProps {
  value: unknown;
  onChange: (newValue: ResponsableItem[]) => void;
}

function parseAutores(value: unknown): ResponsableItem[] {
  const source = (() => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })();

  return source.map((item: any) => ({
    nombre: String(item?.nombre ?? '').trim(),
    empresa: String(item?.empresa ?? '').trim(),
    cargo: String(item?.cargo ?? '').trim(),
    imagen: String(item?.imagen ?? '').trim(),
  }));
}

export function AutoresInformeEditor({ value, onChange }: AutoresInformeEditorProps) {
  const items = parseAutores(value);

  const updateItem = (index: number, patch: Partial<ResponsableItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const addItem = () => {
    onChange([...items, { nombre: '', empresa: '', cargo: '', imagen: '' }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-3">
      {items.map((item, index) => (
        <div key={`autor-item-${index}`} className="space-y-2 rounded-md border border-border p-3">
          <input
            type="text"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            placeholder="Nombre"
            value={item.nombre}
            onChange={(e) => updateItem(index, { nombre: e.target.value })}
          />
          <input
            type="text"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            placeholder="Empresa"
            value={item.empresa}
            onChange={(e) => updateItem(index, { empresa: e.target.value })}
          />
          <input
            type="text"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            placeholder="Cargo"
            value={item.cargo}
            onChange={(e) => updateItem(index, { cargo: e.target.value })}
          />
          <input
            type="text"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            placeholder="Ruta de imagen (ej. personas/juan.png)"
            value={item.imagen}
            onChange={(e) => updateItem(index, { imagen: e.target.value })}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5 text-danger hover:bg-danger/10"
              onClick={() => removeItem(index)}
            >
              Eliminar autor
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="rounded-lg border border-border px-4 py-2 text-text-secondary hover:bg-surface-hover"
        onClick={addItem}
      >
        Anadir autor
      </button>
    </div>
  );
}
