import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  idKey?: keyof T & string;
}

type SortDir = "asc" | "desc" | null;

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  title,
  subtitle,
  onAdd,
  onEdit,
  onDelete,
  onView,
  idKey,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 15;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = data.filter((row) =>
    columns.some((col) => {
      const val = row[col.key];
      return val != null && String(val).toLowerCase().includes(search.toLowerCase());
    })
  );

  const sorted = sortKey && sortDir
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";
        const cmp = String(aVal).localeCompare(String(bVal), "es", { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice(page * perPage, (page + 1) * perPage);

  const hasActions = onEdit || onDelete || onView;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
          {subtitle && (
            <p className="text-[13px] text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filtrar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="h-9 px-3 rounded-lg bg-surface-alt border border-border text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 w-[200px] transition-colors"
          />
          {onAdd && (
            <button
              onClick={onAdd}
              className="h-9 px-4 rounded-lg bg-accent text-white text-[13px] font-medium flex items-center gap-2 hover:bg-accent-light transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Añadir
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-6 py-3 text-left text-[12px] font-semibold text-text-muted uppercase tracking-wider ${
                    col.sortable !== false ? "cursor-pointer select-none hover:text-text-secondary" : ""
                  }`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && (
                      <span className="text-text-muted/60">
                        {sortKey === col.key && sortDir === "asc" ? (
                          <ChevronUp size={14} />
                        ) : sortKey === col.key && sortDir === "desc" ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronsUpDown size={14} />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-text-muted uppercase tracking-wider w-[140px]">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-[14px] text-text-muted"
                >
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr
                  key={idKey ? String(row[idKey]) : idx}
                  className="border-b border-border/60 hover:bg-surface-hover transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-3 text-[14px] text-text-secondary"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                            title="Ver"
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-warning hover:bg-warning/10 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-border">
          <span className="text-[13px] text-text-muted">
            {sorted.length} registros · Página {page + 1} de {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="h-8 px-3 rounded-lg text-[13px] text-text-secondary border border-border hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="h-8 px-3 rounded-lg text-[13px] text-text-secondary border border-border hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
