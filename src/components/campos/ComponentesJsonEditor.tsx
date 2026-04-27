import { useEffect, useMemo, useState } from "react";
import type { ComponentLibraryItem, ComponentPropDefinition, ComponentPropType } from "../../types/editor";

type Bloque = {
  id: number | string;
  tipo: string;
  data: Record<string, unknown>;
};

interface ComponentesJsonEditorProps {
  value: unknown;
  onChange: (newValue: Bloque[]) => void;
  library: ComponentLibraryItem[];
}

interface FormField {
  key: string;
  label: string;
  type: ComponentPropType;
  value: unknown;
  required?: boolean;
}

function parseBloques(value: unknown): Bloque[] {
  const source = (() => {
    if (Array.isArray(value)) return value;

    if (typeof value === "string" && value.trim() !== "") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  })();

  return source.map((item: any, index: number) => ({
    id: item?.id ?? index + 1,
    tipo: String(item?.tipo ?? "").trim(),
    data: item?.data && typeof item.data === "object" && !Array.isArray(item.data) ? item.data : {},
  }));
}

function getNextId(bloques: Bloque[]): number {
  const maxId = bloques.reduce((acc, item) => {
    const maybeNumber = Number(item.id);
    return Number.isFinite(maybeNumber) ? Math.max(acc, maybeNumber) : acc;
  }, 0);

  return maxId + 1;
}

function toPrettyLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function inferFieldType(value: unknown): ComponentPropType {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";

  if (Array.isArray(value)) {
    const allStrings = value.every((item) => typeof item === "string");
    return allStrings ? "stringList" : "json";
  }

  if (value && typeof value === "object") {
    return "json";
  }

  if (typeof value === "string") {
    return value.length > 120 || value.includes("\n") ? "textarea" : "text";
  }

  return "text";
}

function buildFieldsFromSchema(schema: ComponentPropDefinition[], data: Record<string, unknown>): FormField[] {
  return schema.map((field) => ({
    key: field.key,
    label: field.label,
    type: field.type,
    required: field.required,
    value:
      data[field.key] ??
      field.defaultValue ??
      (field.type === "boolean" ? false : field.type === "number" ? 0 : field.type === "json" ? {} : ""),
  }));
}

function pickDataBySchema(schema: ComponentPropDefinition[], data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const field of schema) {
    const rawValue = data[field.key] ?? field.defaultValue;
    out[field.key] = normalizeFieldValue(field.type, rawValue);
  }

  return out;
}

function buildFieldsFromData(data: Record<string, unknown>): FormField[] {
  return Object.entries(data).map(([key, value]) => ({
    key,
    label: toPrettyLabel(key),
    type: inferFieldType(value),
    value,
  }));
}

function parseJsonValue(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed === "") return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}

function normalizeFieldValue(fieldType: ComponentPropType, rawValue: unknown): unknown {
  if (fieldType === "boolean") {
    return Boolean(rawValue);
  }

  if (fieldType === "number") {
    const num = Number(rawValue);
    return Number.isFinite(num) ? num : 0;
  }

  if (fieldType === "stringList") {
    if (Array.isArray(rawValue)) {
      return rawValue.map((item) => String(item));
    }

    return String(rawValue ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  if (fieldType === "json") {
    if (typeof rawValue === "string") {
      return parseJsonValue(rawValue);
    }
    return rawValue;
  }

  return String(rawValue ?? "");
}

export function ComponentesJsonEditor({ value, onChange, library }: ComponentesJsonEditorProps) {
  const bloques = useMemo(() => parseBloques(value), [value]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editorOpenIndex, setEditorOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("{}");

  useEffect(() => {
    if (bloques.length === 0) {
      setSelectedIndex(0);
      setEditorOpenIndex(null);
      setFields([]);
      setJsonDraft("{}");
      setFormError(null);
      return;
    }

    if (selectedIndex > bloques.length - 1) {
      setSelectedIndex(bloques.length - 1);
      setEditorOpenIndex((prev) => (prev !== null && prev > bloques.length - 1 ? null : prev));
      return;
    }

    const selectedData = bloques[selectedIndex]?.data ?? {};
    const selectedType = bloques[selectedIndex]?.tipo ?? "";
    const schema = library.find((item) => item.type === selectedType)?.propsSchema;

    setFields(schema && schema.length > 0 ? buildFieldsFromSchema(schema, selectedData) : buildFieldsFromData(selectedData));
    setJsonDraft(JSON.stringify(selectedData, null, 2));
    setFormError(null);
  }, [bloques, selectedIndex, library]);

  const selected = bloques[selectedIndex];
  const selectedLibraryItem = useMemo(
    () => (selected ? library.find((item) => item.type === selected.tipo) : undefined),
    [library, selected]
  );
  const selectedSchema = selectedLibraryItem?.propsSchema;
  const hasFixedSchema = Boolean(selectedSchema && selectedSchema.length > 0);
  const filteredLibrary = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return library;

    return library.filter((item) => {
      const haystack = `${item.label} ${item.type} ${item.description ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [library, searchTerm]);

  const updateBloque = (index: number, patch: Partial<Bloque>) => {
    const next = [...bloques];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const commitFieldsToSelected = (nextFields: FormField[]) => {
    if (!selected) return;

    const data: Record<string, unknown> = {};

    for (const field of nextFields) {
      const safeKey = field.key.trim();
      if (!safeKey) continue;
      data[safeKey] = normalizeFieldValue(field.type, field.value);
    }

    updateBloque(selectedIndex, { data });
  };

  const addFromLibrary = (item: ComponentLibraryItem) => {
    const next: Bloque = {
      id: getNextId(bloques),
      tipo: item.type,
      data: { ...(item.defaultData ?? {}) },
    };

    const merged = [...bloques, next];
    onChange(merged);
    setSelectedIndex(merged.length - 1);
  };

  const removeBloque = (index: number) => {
    const merged = bloques.filter((_, i) => i !== index);
    onChange(merged);

    setEditorOpenIndex((prev) => {
      if (prev === null) return null;
      if (prev === index) return null;
      if (prev > index) return prev - 1;
      return prev;
    });

    if (merged.length === 0) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex((prev) => Math.min(prev, merged.length - 1));
  };

  const moveBloque = (from: number, to: number) => {
    if (to < 0 || to >= bloques.length) return;

    const merged = [...bloques];
    const [moved] = merged.splice(from, 1);
    merged.splice(to, 0, moved);
    onChange(merged);
    setSelectedIndex(to);
    setEditorOpenIndex((prev) => (prev === from ? to : prev));
  };

  const abrirFormulario = (index: number) => {
    setSelectedIndex(index);
    setEditorOpenIndex((prev) => (prev === index ? null : index));
  };

  const updateField = (fieldIndex: number, value: unknown) => {
    const next = [...fields];
    next[fieldIndex] = { ...next[fieldIndex], value };
    setFields(next);
    commitFieldsToSelected(next);
  };

  const commitJsonDraft = () => {
    if (!selected) return;

    try {
      const parsed = JSON.parse(jsonDraft);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setFormError("El campo data debe ser un objeto JSON.");
        return;
      }

      const safeData =
        hasFixedSchema && selectedSchema
          ? pickDataBySchema(selectedSchema, parsed as Record<string, unknown>)
          : (parsed as Record<string, unknown>);

      updateBloque(selectedIndex, { data: safeData });
      setFields(
        hasFixedSchema && selectedSchema
          ? buildFieldsFromSchema(selectedSchema, safeData)
          : buildFieldsFromData(safeData)
      );
      setFormError(null);
    } catch {
      setFormError("JSON invalido. Revisa llaves, comas y comillas.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.9fr_1fr]">
        <div className="space-y-4 rounded-lg border border-border bg-surface p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-text-primary">Contenido configurado</h4>
          <span className="text-xs text-text-muted">{bloques.length} bloques</span>
        </div>

        <div className="max-h-72 space-y-2 overflow-auto rounded-md border border-border bg-surface-alt p-2">
          {bloques.length === 0 ? (
            <p className="px-2 py-3 text-sm text-text-muted">No hay componentes anadidos aun.</p>
          ) : (
            bloques.map((bloque, index) => (
              <div
                key={`bloque-${bloque.id}-${index}`}
                className={`rounded-md border px-3 py-2 transition ${
                  selectedIndex === index
                    ? "border-accent bg-accent/10"
                    : "border-border bg-surface"
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="text-xs text-text-muted">#{index + 1} - id {String(bloque.id)}</div>
                  <div className="text-sm font-bold text-text-primary">{bloque.tipo || "Sin tipo"}</div>
                </button>

                <div className="mt-2">
                  <button
                    type="button"
                    className="rounded-md border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface-hover"
                    onClick={() => abrirFormulario(index)}
                  >
                    {editorOpenIndex === index ? "Cerrar formulario" : "Abrir formulario"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </div>

        <aside className="space-y-3 rounded-lg border border-border bg-surface p-3">
        <h4 className="text-sm font-bold text-text-primary">Biblioteca de componentes</h4>
        <input
          type="text"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          placeholder="Buscar componente por nombre o tipo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="max-h-[36rem] overflow-auto pr-1">
          {filteredLibrary.length === 0 ? (
            <p className="rounded-md border border-border bg-surface-alt px-3 py-4 text-sm text-text-muted">
              No hay componentes que coincidan con tu busqueda.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredLibrary.map((item) => (
                <div key={item.type} className="rounded-md border border-border bg-surface-alt p-2">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.label}
                      className="mb-2 h-32 w-full rounded-md border border-border object-cover"
                    />
                  ) : (
                    <div className="mb-2 grid h-32 w-full place-items-center rounded-md border border-border bg-gradient-to-br from-slate-100 to-slate-200 text-xs text-text-muted">
                      Vista previa
                    </div>
                  )}

                  <div className="text-sm font-bold text-text-primary">{item.label}</div>
                  <div className="text-xs text-text-muted">{item.type}</div>
                  {item.description ? <p className="mt-1 text-xs text-text-muted">{item.description}</p> : null}

                  <button
                    type="button"
                    className="mt-2 w-full rounded-md bg-accent px-3 py-1.5 text-sm text-white hover:opacity-90"
                    onClick={() => addFromLibrary(item)}
                  >
                    Anadir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </aside>
      </div>

      {selected && editorOpenIndex === selectedIndex ? (
        <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover"
              onClick={() => moveBloque(selectedIndex, selectedIndex - 1)}
            >
              ^ Subir
            </button>
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover"
              onClick={() => moveBloque(selectedIndex, selectedIndex + 1)}
            >
              v Bajar
            </button>
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5 text-sm text-danger hover:bg-danger/10"
              onClick={() => removeBloque(selectedIndex)}
            >
              Eliminar
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-text-muted">Formulario del componente</label>
            <button
              type="button"
              className="rounded-md border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface-hover"
              onClick={() => setAdvancedMode((prev) => !prev)}
            >
              {advancedMode ? "Modo formulario" : "Modo JSON"}
            </button>
          </div>

          {hasFixedSchema ? (
            <p className="text-xs text-text-muted">
              Este componente usa props fijas definidas en su esquema. No se pueden crear campos nuevos.
            </p>
          ) : (
            <p className="text-xs text-text-muted">
              Este componente aun no tiene esquema fijo. Recomendado: definir propsSchema en componentLibraries.
            </p>
          )}

          {!advancedMode ? (
            <div className="space-y-3">
              {fields.length === 0 ? (
                <p className="text-sm text-text-muted">Este componente no tiene campos todavia.</p>
              ) : (
                fields.map((field, fieldIndex) => (
                  <div key={`${field.key}-${fieldIndex}`} className="rounded-md border border-border bg-surface-alt p-3">
                    <div className="mb-2 text-sm font-semibold text-text-secondary">
                      {field.label}
                      {field.required ? <span className="ml-1 text-danger">*</span> : null}
                    </div>

                    {field.type === "boolean" ? (
                      <label className="inline-flex items-center gap-2 text-sm text-text-primary">
                        <input
                          type="checkbox"
                          checked={Boolean(field.value)}
                          onChange={(e) => updateField(fieldIndex, e.target.checked)}
                        />
                        Activo
                      </label>
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                        value={String(field.value ?? 0)}
                          onChange={(e) => updateField(fieldIndex, e.target.value)}
                      />
                    ) : field.type === "stringList" ? (
                      <textarea
                        className="min-h-24 w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                        value={Array.isArray(field.value) ? field.value.join("\n") : ""}
                          onChange={(e) => updateField(fieldIndex, e.target.value)}
                        placeholder="Un valor por linea"
                      />
                    ) : field.type === "json" ? (
                      <textarea
                        className="min-h-24 w-full rounded-md border border-border bg-surface px-2 py-1 font-mono text-sm text-text-primary"
                        value={JSON.stringify(field.value ?? {}, null, 2)}
                          onChange={(e) => updateField(fieldIndex, e.target.value)}
                      />
                    ) : field.type === "textarea" ? (
                      <textarea
                        className="min-h-24 w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                        value={String(field.value ?? "")}
                          onChange={(e) => updateField(fieldIndex, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                        value={String(field.value ?? "")}
                          onChange={(e) => updateField(fieldIndex, e.target.value)}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <textarea
              className="min-h-56 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary"
              value={jsonDraft}
              onChange={(e) => setJsonDraft(e.target.value)}
              onBlur={commitJsonDraft}
            />
          )}

          {formError ? <p className="text-xs text-danger">{formError}</p> : null}
        </div>
      ) : selected ? (
        <div className="rounded-lg border border-border bg-surface-alt p-3 text-sm text-text-muted">
          Pulsa "Abrir formulario" en un bloque de la lista para editar sus campos.
        </div>
      ) : null}
    </div>
  );
}
