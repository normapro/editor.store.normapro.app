interface IndiceItem {
  title: string;
  ul: string[];
}

interface IndiceInformeEditorProps {
  value: unknown;
  onChange: (newValue: IndiceItem[]) => void;
}

function parseIndice(value: unknown): IndiceItem[] {
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

  return source.map((item: any) => {
    const title = String(item?.title ?? item?.titulo ?? '').trim();

    const ulSource = Array.isArray(item?.ul)
      ? item.ul
      : Array.isArray(item?.claims)
        ? item.claims.map((claim: any) => {
            const t = String(claim?.title ?? claim?.titulo ?? '').trim();
            const c = String(claim?.claim ?? claim?.texto ?? '').trim();
            return `${t} ${c}`.trim();
          })
        : [];

    const ul = ulSource
      .map((entry: unknown) => String(entry ?? '').trim())
      .filter((entry: string) => entry.length > 0);

    return { title, ul };
  });
}

export function IndiceInformeEditor({ value, onChange }: IndiceInformeEditorProps) {
  const items = parseIndice(value);

  const updateItem = (index: number, patch: Partial<IndiceItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const addItem = () => {
    onChange([...items, { title: '', ul: [] }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-3">
      {items.map((item, index) => (
        <div key={`indice-item-${index}`} className="space-y-2 rounded-md border border-border p-3">
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase text-text-muted">Titulo del bloque</label>
            <input
              type="text"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase text-text-muted">Puntos (uno por linea)</label>
            <textarea
              className="min-h-24 rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              value={item.ul.join('\n')}
              onChange={(e) => {
                const ul = e.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0);
                updateItem(index, { ul });
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5 text-danger hover:bg-danger/10"
              onClick={() => removeItem(index)}
            >
              Eliminar bloque
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="rounded-lg border border-border px-4 py-2 text-text-secondary hover:bg-surface-hover"
        onClick={addItem}
      >
        Anadir bloque del indice
      </button>
    </div>
  );
}
