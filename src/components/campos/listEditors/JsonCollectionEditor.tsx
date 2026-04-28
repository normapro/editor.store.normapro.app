type JsonPrimitive = string | number | boolean | null;

type JsonObject = Record<string, unknown>;

interface JsonCollectionEditorProps {
  value: unknown;
  onChange: (nextValue: unknown[]) => void;
  defaultObjectShape?: JsonObject;
  defaultPrimitive?: JsonPrimitive;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function parseArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function isPlainObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function formatComplexValue(value: unknown): string {
  try {
    return JSON.stringify(value ?? (Array.isArray(value) ? [] : {}), null, 2);
  } catch {
    return "";
  }
}

export function JsonCollectionEditor({ value, onChange, defaultObjectShape, defaultPrimitive = "" }: JsonCollectionEditorProps) {
  const collection = parseArray(value);

  const objectItems = collection.filter((item) => isPlainObject(item)) as JsonObject[];
  const useObjectMode = objectItems.length > 0 || Boolean(defaultObjectShape);

  const inferredObjectKeys = Array.from(new Set(objectItems.flatMap((item) => Object.keys(item))));

  const objectKeys = (() => {
    if (defaultObjectShape) {
      const configured = Object.keys(defaultObjectShape);
      return inferredObjectKeys.length > 0
        ? Array.from(new Set([...configured, ...inferredObjectKeys]))
        : configured;
    }

    return inferredObjectKeys.length > 0 ? inferredObjectKeys : ["value"];
  })();

  const addObjectItem = () => {
    const baseObject: JsonObject = defaultObjectShape
      ? deepClone(defaultObjectShape)
      : Object.fromEntries(objectKeys.map((key) => [key, ""]));

    onChange([...collection, baseObject]);
  };

  const addPrimitiveItem = () => {
    onChange([...collection, defaultPrimitive]);
  };

  if (useObjectMode) {
    return (
      <div className="space-y-3">
        {objectItems.length === 0 ? (
          <p className="text-xs text-text-muted">No hay elementos todavia. Pulsa "Anadir elemento".</p>
        ) : (
          objectItems.map((item, itemIndex) => (
            <div key={`json-obj-item-${itemIndex}`} className="rounded-md border border-border bg-surface p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-text-muted">Elemento #{itemIndex + 1}</span>
                <button
                  type="button"
                  className="rounded-md border border-border px-2 py-1 text-xs text-danger hover:bg-danger/10"
                  onClick={() => {
                    const next = [...collection];
                    next.splice(itemIndex, 1);
                    onChange(next);
                  }}
                >
                  Eliminar
                </button>
              </div>

              <div className="space-y-2">
                {objectKeys.map((key) => {
                  const currentValue = item[key];

                  if (typeof currentValue === "boolean") {
                    return (
                      <label key={`${itemIndex}-${key}`} className="inline-flex items-center gap-2 text-sm text-text-primary">
                        <input
                          type="checkbox"
                          checked={Boolean(currentValue)}
                          onChange={(e) => {
                            const next = [...collection];
                            const current = isPlainObject(next[itemIndex]) ? { ...(next[itemIndex] as JsonObject) } : {};
                            current[key] = e.target.checked;
                            next[itemIndex] = current;
                            onChange(next);
                          }}
                        />
                        {key}
                      </label>
                    );
                  }

                  if (typeof currentValue === "number") {
                    return (
                      <div key={`${itemIndex}-${key}`}>
                        <label className="mb-1 block text-xs font-semibold text-text-secondary">{key}</label>
                        <input
                          type="number"
                          className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                          value={String(currentValue)}
                          onChange={(e) => {
                            const next = [...collection];
                            const current = isPlainObject(next[itemIndex]) ? { ...(next[itemIndex] as JsonObject) } : {};
                            const parsed = Number(e.target.value);
                            current[key] = Number.isFinite(parsed) ? parsed : 0;
                            next[itemIndex] = current;
                            onChange(next);
                          }}
                        />
                      </div>
                    );
                  }

                  if (Array.isArray(currentValue) || isPlainObject(currentValue)) {
                    return (
                      <div key={`${itemIndex}-${key}`}>
                        <label className="mb-1 block text-xs font-semibold text-text-secondary">{key} (JSON)</label>
                        <textarea
                          className="min-h-20 w-full rounded-md border border-border bg-surface px-2 py-1 font-mono text-sm text-text-primary"
                          value={formatComplexValue(currentValue)}
                          onBlur={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              const next = [...collection];
                              const current = isPlainObject(next[itemIndex]) ? { ...(next[itemIndex] as JsonObject) } : {};
                              current[key] = parsed;
                              next[itemIndex] = current;
                              onChange(next);
                            } catch {
                              // Keep previous value if user leaves invalid JSON.
                            }
                          }}
                          onChange={() => {
                            // Controlled on blur to avoid noisy intermediate writes.
                          }}
                        />
                      </div>
                    );
                  }

                  const asString = currentValue === null || currentValue === undefined ? "" : String(currentValue);
                  const useTextarea = asString.length > 120 || asString.includes("\n");

                  return (
                    <div key={`${itemIndex}-${key}`}>
                      <label className="mb-1 block text-xs font-semibold text-text-secondary">{key}</label>
                      {useTextarea ? (
                        <textarea
                          className="min-h-20 w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                          value={asString}
                          onChange={(e) => {
                            const next = [...collection];
                            const current = isPlainObject(next[itemIndex]) ? { ...(next[itemIndex] as JsonObject) } : {};
                            current[key] = e.target.value;
                            next[itemIndex] = current;
                            onChange(next);
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                          value={asString}
                          onChange={(e) => {
                            const next = [...collection];
                            const current = isPlainObject(next[itemIndex]) ? { ...(next[itemIndex] as JsonObject) } : {};
                            current[key] = e.target.value;
                            next[itemIndex] = current;
                            onChange(next);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover"
          onClick={addObjectItem}
        >
          Anadir elemento
        </button>
      </div>
    );
  }

  const primitiveList = collection as JsonPrimitive[];

  return (
    <div className="space-y-3">
      {primitiveList.length === 0 ? (
        <p className="text-xs text-text-muted">No hay valores todavia. Pulsa "Anadir valor".</p>
      ) : (
        primitiveList.map((item, itemIndex) => (
          <div key={`json-primitive-item-${itemIndex}`} className="flex items-center gap-2">
            <input
              type="text"
              className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
              value={item === null || item === undefined ? "" : String(item)}
              onChange={(e) => {
                const next = [...primitiveList];
                if (typeof item === "number" || typeof defaultPrimitive === "number") {
                  const parsed = Number(e.target.value);
                  next[itemIndex] = Number.isFinite(parsed) ? parsed : 0;
                } else if (typeof item === "boolean" || typeof defaultPrimitive === "boolean") {
                  next[itemIndex] = e.target.value === "true";
                } else {
                  next[itemIndex] = e.target.value;
                }
                onChange(next);
              }}
            />
            <button
              type="button"
              className="rounded-md border border-border px-2 py-1 text-xs text-danger hover:bg-danger/10"
              onClick={() => {
                const next = [...primitiveList];
                next.splice(itemIndex, 1);
                onChange(next);
              }}
            >
              Eliminar
            </button>
          </div>
        ))
      )}

      <button
        type="button"
        className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover"
        onClick={addPrimitiveItem}
      >
        Anadir valor
      </button>
    </div>
  );
}
