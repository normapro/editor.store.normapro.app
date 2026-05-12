type DesgraneListItem = {
  image: string;
  title: string;
  claim: string;
};

interface DesgraneListEditorProps {
  value: unknown;
  onChange: (nextList: DesgraneListItem[]) => void;
}

function normalizeDesgraneList(rawValue: unknown): DesgraneListItem[] {
  const source = (() => {
    if (Array.isArray(rawValue)) return rawValue;

    if (typeof rawValue === "string" && rawValue.trim() !== "") {
      try {
        const parsed = JSON.parse(rawValue);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  })();

  return source.map((item: any) => ({
    image: String(item?.image ?? ""),
    title: String(item?.title ?? ""),
    claim: String(item?.claim ?? ""),
  }));
}

export function DesgraneListEditor({ value, onChange }: DesgraneListEditorProps) {
  const list = normalizeDesgraneList(value);

  return (
    <div className="space-y-3">
      {list.length === 0 ? (
        <p className="text-xs text-text-muted">No hay elementos todavia. Pulsa "Anadir elemento".</p>
      ) : (
        list.map((item, itemIndex) => (
          <div key={`desgrane-item-${itemIndex}`} className="rounded-md border border-border bg-surface p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-text-muted">Elemento #{itemIndex + 1}</span>
              <button
                type="button"
                className="rounded-md border border-border px-2 py-1 text-xs text-danger hover:bg-danger/10"
                onClick={() => {
                  const nextList = list.filter((_, idx) => idx !== itemIndex);
                  onChange(nextList);
                }}
              >
                Eliminar
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">Image</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                  value={item.image}
                  onChange={(e) => {
                    const nextList = [...list];
                    nextList[itemIndex] = { ...nextList[itemIndex], image: e.target.value };
                    onChange(nextList);
                  }}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">Title</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                  value={item.title}
                  onChange={(e) => {
                    const nextList = [...list];
                    nextList[itemIndex] = { ...nextList[itemIndex], title: e.target.value };
                    onChange(nextList);
                  }}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">Claim</label>
                <textarea
                  className="min-h-20 w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                  value={item.claim}
                  onChange={(e) => {
                    const nextList = [...list];
                    nextList[itemIndex] = { ...nextList[itemIndex], claim: e.target.value };
                    onChange(nextList);
                  }}
                />
              </div>
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover"
        onClick={() => {
          const nextList = [...list, { image: "", title: "", claim: "" }];
          onChange(nextList);
        }}
      >
        Anadir elemento
      </button>
    </div>
  );
}
