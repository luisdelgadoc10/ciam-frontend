// src/components/CustomTable.jsx
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function CustomTable({ 
  data, 
  columns, 
  searchable = true,
  // 🆕 Props opcionales para paginación del servidor
  serverPagination = false,
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
  loading = false,
}) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: serverPagination ? undefined : getPaginationRowModel(), // 🆕
    getSortedRowModel: getSortedRowModel(),
    manualPagination: serverPagination, // 🆕
  });

  // 🆕 Función para generar números de página (servidor)
  const getServerPageNumbers = () => {
    const pageCount = lastPage;
    const current = currentPage - 1; // Ajustar a índice 0
    const delta = 2;
    const range = [];

    range.push(0);

    const left = Math.max(1, current - delta);
    const right = Math.min(pageCount - 2, current + delta);

    if (left > 1) range.push("ellipsis-left");

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < pageCount - 2) range.push("ellipsis-right");

    if (pageCount > 1) range.push(pageCount - 1);

    return range;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border">
      {/* Barra de búsqueda */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {loading ? "Cargando..." : "No hay datos disponibles"}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🆕 Paginación - SERVIDOR O CLIENTE según serverPagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => serverPagination ? onPageChange(currentPage - 1) : table.previousPage()}
            disabled={serverPagination ? (currentPage === 1 || loading) : !table.getCanPreviousPage()}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={() => serverPagination ? onPageChange(currentPage + 1) : table.nextPage()}
            disabled={serverPagination ? (currentPage === lastPage || loading) : !table.getCanNextPage()}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* 🆕 Información de paginación según tipo */}
            <p className="text-sm text-gray-700">
              {serverPagination ? (
                <>
                  Mostrando{" "}
                  <span className="font-medium">{total > 0 ? (currentPage - 1) * perPage + 1 : 0}</span>{" "}
                  a{" "}
                  <span className="font-medium">{Math.min(currentPage * perPage, total)}</span>{" "}
                  de{" "}
                  <span className="font-medium">{total}</span>{" "}
                  resultados
                </>
              ) : (
                <>
                  Mostrando{" "}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-medium">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{" "}
                  resultados
                </>
              )}
            </p>

            {/* 🆕 Selector de registros por página (solo servidor) */}
            {serverPagination && (
              <div className="flex items-center gap-2">
                <label htmlFor="perPage" className="text-sm text-gray-700">
                  Por página:
                </label>
                <select
                  id="perPage"
                  value={perPage}
                  onChange={(e) => onPerPageChange(Number(e.target.value))}
                  disabled={loading}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              {/* 🆕 Botones de primera página (solo servidor) */}
              {serverPagination && (
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1 || loading}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Primera página"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
              )}

              {/* Botón anterior */}
              <button
                onClick={() => serverPagination ? onPageChange(currentPage - 1) : table.previousPage()}
                disabled={serverPagination ? (currentPage === 1 || loading) : !table.getCanPreviousPage()}
                className={`relative inline-flex items-center px-2 py-2 ${!serverPagination ? 'rounded-l-md' : ''} border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* 🆕 Números de página según tipo */}
              {serverPagination ? (
                // Paginación servidor
                getServerPageNumbers().map((page, idx) => {
                  if (page === "ellipsis-left" || page === "ellipsis-right") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  const pageNumber = page + 1; // Ajustar a índice 1
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(pageNumber)}
                      disabled={loading}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNumber
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNumber}
                    </button>
                  );
                })
              ) : (
                // Paginación cliente (original)
                (() => {
                  const pageCount = table.getPageCount();
                  const currentPageIndex = table.getState().pagination.pageIndex;
                  const delta = 2;
                  const range = [];

                  range.push(0);

                  const left = Math.max(1, currentPageIndex - delta);
                  const right = Math.min(pageCount - 2, currentPageIndex + delta);

                  if (left > 1) range.push("ellipsis-left");

                  for (let i = left; i <= right; i++) {
                    range.push(i);
                  }

                  if (right < pageCount - 2) range.push("ellipsis-right");

                  if (pageCount > 1) range.push(pageCount - 1);

                  return range.map((page, idx) => {
                    if (page === "ellipsis-left" || page === "ellipsis-right") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => table.setPageIndex(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPageIndex === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page + 1}
                      </button>
                    );
                  });
                })()
              )}

              {/* Botón siguiente */}
              <button
                onClick={() => serverPagination ? onPageChange(currentPage + 1) : table.nextPage()}
                disabled={serverPagination ? (currentPage === lastPage || loading) : !table.getCanNextPage()}
                className={`relative inline-flex items-center px-2 py-2 ${!serverPagination ? 'rounded-r-md' : ''} border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* 🆕 Botones de última página (solo servidor) */}
              {serverPagination && (
                <button
                  onClick={() => onPageChange(lastPage)}
                  disabled={currentPage === lastPage || loading}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Última página"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}