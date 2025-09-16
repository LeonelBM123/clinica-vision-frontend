import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSort, faSortUp, faSortDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';
import "../styles/GestionarList.css";

export default function GestionarList({ 
  apiUrl, 
  title = "Gestión de Datos", 
  columns = [], 
  onEdit, 
  onDelete,
  onAdd,
  refreshKey // renombrado (antes refreshTrigger)
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const fetchData = React.useCallback(async (signal) => {
    if (!apiUrl) {
      setLoading(false);
      return;
    }
    try {
      setError("");
      setLoading(true);
      const response = await fetch(apiUrl, { signal });
      if (!response.ok) throw new Error('Error en la petición');
      const result = await response.json();
      setData(Array.isArray(result) ? result : [result]);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error('Error fetching data:', err);
        setError(err.message || "Error al cargar los datos");
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData, refreshKey]); // se actualiza cuando cambia la URL o pides refresh

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      const aValue = getNestedValue(a, key);
      const bValue = getNestedValue(b, key);

      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current ? current[key] : undefined;
    }, obj);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
  };

  const handleEdit = (item) => {
    if (onEdit) {
      onEdit(item);
    } else {
      console.log('Editar:', item);
    }
  };

  const handleDelete = (item) => {
    if (onDelete) {
      onDelete(item);
    } else {
      if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
        console.log('Eliminar:', item);
      }
    }
  };

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    } else {
      console.log('Agregar nuevo');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="gestionar-list-container">
      <div className="list-header">
        <h2>{title}</h2>
        {onAdd && (
          <button className="btn btn-primary btn-add" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} /> Agregar
          </button>
        )}
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={column.sortable ? 'sortable-header' : ''}
                  style={{ width: column.width }}
                >
                  <div className="header-content">
                    <span className="header-label">{column.label}</span>
                    {column.sortable && (
                      <FontAwesomeIcon icon={getSortIcon(column.key)} className="sort-icon" />
                    )}
                  </div>
                </th>
              ))}
              <th className="actions-header">
                <div className="header-content">
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="no-data">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="data-row">
                  {columns.map((column) => (
                    <td key={column.key} className="data-cell">
                      {column.render ? column.render(getNestedValue(item, column.key), item) : getNestedValue(item, column.key)}
                    </td>
                  ))}
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(item)}
                        title="Editar"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(item)}
                        title="Eliminar"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}