import { useEffect, useMemo, useState } from "react";
import { getEditorToken } from "../../auth/session";

type RelationId = string | number;
type RowRecord = Record<string, unknown>;

interface OptionResolved {
  id: RelationId;
  label: string;
}

interface RemoteRelationMultiSelectorProps {
  title: string;
  description: string;
  createModeMessage: string;
  entityId: number | string | null;
  catalogEndpoint: string;
  relationEndpointBase: string;
  token?: string | null;
  optionIdField?: string;
  optionLabelField?: string;
  optionResolver?: (item: RowRecord) => OptionResolved | null;
  relationIdsField?: string;
  createBodyField?: string;
  openLabel?: string;
  closeLabel?: string;
  emptyOptionsText?: string;
  noSelectionText?: string;
  saveLabel?: string;
  savingLabel?: string;
  searchPlaceholder?: string;
}

interface GenericOption {
  id: RelationId;
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
  optionResolver,
  relationIdsField = "id_relaciones",
  createBodyField = "id_relacion",
  openLabel = "Seleccionar",
  closeLabel = "Ocultar selector",
  emptyOptionsText = "No hay opciones disponibles.",
  noSelectionText = "No hay elementos seleccionados.",
  saveLabel = "Guardar relaciones",
  savingLabel = "Guardando relaciones...",
  searchPlaceholder = "Buscar por nombre...",
}: RemoteRelationMultiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<GenericOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<RelationId[]>([]);
  const [savedIds, setSavedIds] = useState<RelationId[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    options.forEach((option) => {
      map.set(String(option.id), option.label);
    });
    return map;
  }, [options]);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return options;
    }

    return options.filter((option) => {
      const fullLabel = option.label.toLowerCase();
      const namePart = option.label.includes(" - ")
        ? option.label.split(" - ").slice(1).join(" - ").toLowerCase()
        : fullLabel;

      return fullLabel.includes(term) || namePart.includes(term);
    });
  }, [options, searchTerm]);

  const hasId = (list: RelationId[], id: RelationId): boolean => {
    const target = String(id);
    return list.some((item) => String(item) === target);
  };

  const normalizeRelationId = (value: unknown): RelationId | null => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }

    return null;
  };

  const getAuthToken = (): string | null => {
    return getEditorToken() ?? token ?? null;
  };

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
                const row = (item ?? {}) as RowRecord;

                if (optionResolver) {
                  return optionResolver(row);
                }

                const idValue = normalizeRelationId(row[optionIdField]);
                const labelValue = String(row[optionLabelField] ?? "").trim();

                if (idValue === null || !labelValue) {
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
  }, [catalogEndpoint, optionIdField, optionLabelField, optionResolver]);

  useEffect(() => {
    if (entityId === null) {
      setSelectedIds([]);
      setSavedIds([]);
      return;
    }

    let cancelled = false;
    setLoadingRelations(true);

    const headers: HeadersInit = {};
    const authToken = getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
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
              .map((item: unknown) => normalizeRelationId(item))
              .filter((id: RelationId | null): id is RelationId => id !== null)
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

  const toggleOption = (id: RelationId) => {
    setSelectedIds((prev) => {
      if (hasId(prev, id)) {
        return prev.filter((item) => String(item) !== String(id));
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

    const authToken = getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const toCreate = selectedIds.filter((id) => !hasId(savedIds, id));
    const toDelete = savedIds.filter((id) => !hasId(selectedIds, id));

    try {
      for (const relationId of toCreate) {
        const res = await fetch(`${relationEndpointBase}/${entityId}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ [createBodyField]: relationId }),
        });

        if (!res.ok) {
          const responseText = await res.text();
          throw new Error(`create_relation_failed (${res.status}) ${responseText}`.trim());
        }
      }

      for (const relationId of toDelete) {
        const encodedRelationId = encodeURIComponent(String(relationId));
        const res = await fetch(`${relationEndpointBase}/${entityId}/${encodedRelationId}`, {
          method: "DELETE",
          headers,
        });

        if (!res.ok && res.status !== 404) {
          const responseText = await res.text();
          throw new Error(`delete_relation_failed (${res.status}) ${responseText}`.trim());
        }
      }

      setSavedIds([...selectedIds]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "error_desconocido";
      console.error("Error guardando relaciones:", message);

      if (message.includes("(401)") || message.includes("(403)")) {
        setError("No se pudieron guardar las relaciones: sesion expirada o sin permisos.");
      } else {
        setError("No se pudieron guardar las relaciones.");
      }
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
              onClick={() => {
                setIsOpen((prev) => {
                  const next = !prev;
                  if (!next) {
                    setSearchTerm("");
                  }
                  return next;
                });
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isOpen ? closeLabel : openLabel}
              <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs text-text-primary">
                {selectedIds.length}
              </span>
            </button>

            {isOpen ? (
              <div className="max-h-56 space-y-2 overflow-auto rounded-lg border border-border bg-surface p-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
                />

                {filteredOptions.length === 0 ? (
                  <p className="text-sm text-text-muted">{emptyOptionsText}</p>
                ) : (
                  filteredOptions.map((option) => {
                    const active = hasId(selectedIds, option.id);

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
                    key={String(id)}
                    type="button"
                    onClick={() => toggleOption(id)}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-primary hover:bg-surface-hover"
                  >
                    {(selectedLabelMap.get(String(id)) ?? `Elemento ${id}`) + " ×"}
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
