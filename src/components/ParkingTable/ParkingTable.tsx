/**
 * Componente de tabla para mostrar los datos de aparcamientos
 */

import React, { useState } from 'react';
import { Parking } from '../../types/parking.types';
import './ParkingTable.css';

interface ParkingTableProps {
  data: Parking[];
  title?: string;
}

type SortField = keyof Parking | null;
type SortDirection = 'asc' | 'desc';

export const ParkingTable: React.FC<ParkingTableProps> = ({ data, title }) => {
  const [sortField, setSortField] = useState<SortField>('totalSpaces');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [data, sortField, sortDirection]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return (
      <span className="sort-icon sort-icon--active">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="parking-table">
      {title && <h3 className="parking-table__title">{title}</h3>}
      <div className="parking-table__wrapper">
        <table className="parking-table__table">
          <thead>
            <tr>
              <th onClick={() => handleSort('parkingName')}>
                Nombre <SortIcon field="parkingName" />
              </th>
              <th onClick={() => handleSort('district')}>
                Distrito <SortIcon field="district" />
              </th>
              <th onClick={() => handleSort('parkingType')}>
                Tipo <SortIcon field="parkingType" />
              </th>
              <th onClick={() => handleSort('totalSpaces')}>
                Plazas <SortIcon field="totalSpaces" />
              </th>
              <th>Ubicación</th>
              <th onClick={() => handleSort('ingestTimestamp')}>
                Última actualización <SortIcon field="ingestTimestamp" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((parking) => (
              <tr key={parking.parkingId}>
                <td className="parking-table__name">{parking.parkingName}</td>
                <td>{parking.district}</td>
                <td>
                  <span
                    className={`parking-table__badge parking-table__badge--${parking.parkingType.toLowerCase()}`}
                  >
                    {parking.parkingType === 'UNDERGROUND'
                      ? 'Subterráneo'
                      : 'Superficie'}
                  </span>
                </td>
                <td className="parking-table__spaces">
                  {parking.totalSpaces.toLocaleString()}
                </td>
                <td className="parking-table__location">
                  {parking.latitude.toFixed(4)}, {parking.longitude.toFixed(4)}
                </td>
                <td className="parking-table__date">
                  {new Date(parking.ingestTimestamp).toLocaleDateString(
                    'es-ES',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="parking-table__pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="parking-table__pagination-btn"
          >
            ← Anterior
          </button>
          <span className="parking-table__pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="parking-table__pagination-btn"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};
