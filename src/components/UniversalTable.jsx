import React, { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const UniversalTable = ({
  title,
  data = [],
  columns = [],
  onAdd,
  onEdit,
  onDelete,
  loading = false,
  searchPlaceholder = "Buscar...",
  addButtonText = "Agregar",
  showAddButton = true,
  emptyMessage = "No hay datos disponibles",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((item) =>
    columns.some((column) => {
      const value = column.accessor ? item[column.accessor] : "";
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 mx-4 my-4">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Búsqueda */}
            <div className="relative flex-1 lg:flex-initial lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition"
              />
            </div>
            {/* Botón Agregar */}
            {showAddButton && (
              <button
                onClick={onAdd}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm whitespace-nowrap"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">{addButtonText}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor de tabla completamente adaptativo */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-opacity-50"></div>
            <span className="ml-4 text-blue-600 font-semibold animate-pulse">
              Cargando...
            </span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-base">
            {searchTerm ? "No se encontraron resultados" : emptyMessage}
          </div>
        ) : (
          <>
            {/* Tabla para desktop */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                      >
                        {column.header}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-32">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedData.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-blue-50 transition">
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="px-4 py-3 text-sm text-gray-900">
                          {column.render ? column.render(item) : item[column.accessor]}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(item)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(item)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards para móvil */}
            <div className="block lg:hidden space-y-4">
              {paginatedData.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="space-y-3">
                    {columns.map((column, colIndex) => (
                      <div key={colIndex} className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {column.header}:
                        </span>
                        <span className="text-sm text-gray-900 text-right ml-2">
                          {column.render ? column.render(item) : item[column.accessor] || '—'}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => onEdit(item)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-900 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        <Edit size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-900 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Mostrando <span className="font-bold">{startIndex + 1}</span> a{' '}
              <span className="font-bold">
                {Math.min(startIndex + itemsPerPage, filteredData.length)}
              </span>{' '}
              de <span className="font-bold">{filteredData.length}</span> resultados
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-blue-50 transition disabled:opacity-50"
              >
                Anterior
              </button>
              {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                let pageNumber;
                if (totalPages <= 3) {
                  pageNumber = i + 1;
                } else {
                  if (currentPage <= 2) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    pageNumber = totalPages - 2 + i;
                  } else {
                    pageNumber = currentPage - 1 + i;
                  }
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-500 hover:bg-blue-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-blue-50 transition disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalTable;
