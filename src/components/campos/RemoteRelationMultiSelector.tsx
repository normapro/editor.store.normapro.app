import { useEffect, useMemo, useState } from "react";

interface RemoteRelationMultiSelectorProps {
  title: string;
  description: string;
  createModeMessage: string;
  entityId: number | null;
  catalogEndpoint: string;
  relationEndpointBase: string;
  token?: string | null;
  optionIdField?: string;
  optionLabelField?: string;
  relationIdsField?: string;
  createBodyField?: string;
  openLabel?: string;
  closeLabel?: string;
  emptyOptionsText?: string;
  noSelectionText?: string;
  saveLabel?: string;
  savingLabel?: string;
}

interface GenericOption {
  id: number;
  label: string;
}

export function RemoteRelationMultiSelector({
  title,
  description,
  createModeMessage,
  entityId,
  catalogEndpoint,
  relationEndpointBase,
  token,
  optionIdField = "id",
  optionLabelField = "description",
  relationIdsField = "id_relaciones",
  createBodyField = "id_relacion",
  openLabel = "Seleccionar",
  closeLabel = "Ocultar selector",
  emptyOptionsText = "No hay opciones disponibles.",
  noSelectionText = "No hay elementos seleccionados.",
  saveLabel = "Guardar relaciones",
  savingLabel = "Guardando relaciones...",
}: RemoteRelationMultiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<GenericOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedLabelMap = useMemo(() => {
    const map = new Map<number, string>();
    options.forEach((option) => {
      map.set(option.id, option.label);
    });
    return map;
  }, [options]);

  useEffect(() => {
    let cancelled = false;
    setLoadingOptions(true);

    fetch(catalogEndpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error("fetch_catalog_failed");
        }

        return res.json();
      })
      .then((data) => {
        if (cancelled) {
          return;
        }

        const parsed = Array.isArray(data)
          ? data
              .map((item: unknown) => {
                const row = (item ?? {}) as Record<string, unknown>;
                const idValue = Number(row[optionIdField]);
                const labelValue = String(row[optionLabelField] ?? "").trim();

                if (!Number.isFinite(idValue) || !labelValue) {
                  return null;
                }

                return {
                  id: idValue,
                  label: labelValue,
                };
              })
              .filter((item): item is GenericOption => item !== null)
          : [];

        setOptions(parsed);
      })
      .catch(() => {
        if (!cancelled) {
          setOptions([]);
          setError("No se pudo cargar la lista de opciones.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingOptions(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [catalogEndpoint, optionIdField, optionLabelField]);

  useEffect(() => {
    if (entityId === null) {
      setSelectedIds([]);
      setSavedIds([]);
      return;
    }

    let cancelled = false;
    setLoadingRelations(true);

    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`${relationEndpointBase}/${entityId}`, { headers })
      .then((res) => {
        if (!res.ok) {
          throw new Error("fetch_relations_failed");
        }

        return res.json();
      })
      .then((data) => {
        if (cancelled) {
          return;
        }

        const ids = Array.isArray(data?.[relationIdsField])
          ? data[relationIdsField]
              .map((item: unknown) => Number(item))
              .filter((id: number) => Number.isFinite(id))
          : [];

        setSelectedIds(ids);
        setSavedIds(ids);
      })
      .catch(() => {
        if (!cancelled) {
          setSelectedIds([]);
          setSavedIds([]);
          setError("No se pudieron cargar las relaciones.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingRelations(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [entityId, relationEndpointBase, relationIdsField, token]);

  const toggleOption = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  const saveRelations = async () => {
    if (entityId === null || saving) {
      return;
    }

    setSaving(true);
    setError(null);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const toCreate = selectedIds.filter((id) => !savedIds.includes(id));
    const toDelete = savedIds.filter((id) => !selectedIds.includes(id));

    try {
      for (const relationId of toCreate) {
        const res = await fetch(`${relationEndpointBase}/${entityId}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ [createBodyField]: relationId }),
        });

        if (!res.ok) {
          throw new Error("create_relation_failed");
        }
      }

      for (const relationId of toDelete) {
        const res = await fetch(`${relationEndpointBase}/${entityId}/${relationId}`, {
          method: "DELETE",
          headers,
        });

        if (!res.ok && res.status !== 404) {
          throw new Error("delete_relation_failed");
        }
      }

      setSavedIds([...selectedIds]);
    } catch {
      setError("No se pudieron guardar las relaciones.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <h4 className="text-sm font-semibold text-text-primary">{title}</h4>

      {entityId === null ? (
        <p className="text-sm text-text-muted">{createModeMessage}</p>
      ) : (
        <>
          <p className="text-sm text-text-muted">{description}</p>

          <div className="space-y-3">
            <button
              type="button"
              disabled={loadingOptions || loadingRelations || saving}
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isOpen ? closeLabel : openLabel}
              <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs text-text-primary">
                {selectedIds.length}
              </span>
            </button>

            {isOpen ? (
              <div className="max-h-56 space-y-2 overflow-auto rounded-lg border border-border bg-surface p-3">
                {options.length === 0 ? (
                  <p className="text-sm text-text-muted">{emptyOptionsText}</p>
                ) : (
                  options.map((option) => {
                    const active = selectedIds.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleOption(option.id)}
                        className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "border-accent bg-accent/10 text-text-primary"
                            : "border-border text-text-secondary hover:bg-surface-hover"
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className="ml-3 text-xs">{active ? "Seleccionado" : "Seleccionar"}</span>
                      </button>
                    );
                  })
                )}
              </div>
            ) : null}

            {selectedIds.length > 0 ? (
              <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-surface-alt p-3">
                {selectedIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleOption(id)}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-primary hover:bg-surface-hover"
                  >
                    {(selectedLabelMap.get(id) ?? `Elemento ${id}`) + " ×"}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">{noSelectionText}</p>
            )}
          </div>

          <button
            type="button"
            disabled={loadingOptions || loadingRelations || saving}
            onClick={saveRelations}
            className="rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? savingLabel : saveLabel}
          </button>
        </>
      )}

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
