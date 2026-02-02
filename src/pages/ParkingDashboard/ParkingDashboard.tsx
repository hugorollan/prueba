/**
 * Página principal del Dashboard de Aparcamientos
 */

import React from 'react';
import { useParkingData } from '../../hooks/useParkingData';
import { useParkingMetrics } from '../../hooks/useParkingMetrics';
import { KPICard } from '../../components/KPICard/KPICard';
import { BarChart } from '../../components/BarChart/BarChart';
import { PieChart } from '../../components/PieChart/PieChart';
import { ParkingTable } from '../../components/ParkingTable/ParkingTable';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import './ParkingDashboard.css';

export const ParkingDashboard: React.FC = () => {
  const { data, loading, error, lastUpdate, refetch } = useParkingData(1500);
  const { kpis, districtData, typeDistribution } = useParkingMetrics(data);

  // Renderizar loading
  if (loading) {
    return (
      <div className="dashboard">
        <LoadingSpinner message="Cargando datos de aparcamientos..." />
      </div>
    );
  }

  // Renderizar error
  if (error) {
    return (
      <div className="dashboard">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  // Renderizar dashboard
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard de Aparcamientos</h1>
          <p className="dashboard__subtitle">
            Métricas y estadísticas de aparcamientos en Valencia
          </p>
        </div>
        {lastUpdate && (
          <div className="dashboard__last-update">
            <span className="dashboard__update-label">Última actualización:</span>
            <span className="dashboard__update-time">
              {lastUpdate.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
            <button onClick={refetch} className="dashboard__refresh-btn">
              🔄 Actualizar
            </button>
          </div>
        )}
      </header>

      {/* KPIs */}
      {kpis && (
        <section className="dashboard__kpis">
          <KPICard
            title="Total Aparcamientos"
            value={kpis.totalParkings}
            icon="🅿️"
            color="blue"
          />
          <KPICard
            title="Plazas Totales"
            value={kpis.totalSpaces}
            icon="📊"
            color="green"
          />
          <KPICard
            title="Plazas Medias"
            value={kpis.averageSpaces}
            subtitle="por aparcamiento"
            icon="📈"
            color="purple"
          />
          <KPICard
            title="Distrito Top"
            value={kpis.topDistrict.name}
            subtitle={`${kpis.topDistrict.spaces.toLocaleString()} plazas`}
            icon="🏆"
            color="orange"
          />
        </section>
      )}

      {/* Charts */}
      <section className="dashboard__charts">
        <div className="dashboard__chart-item">
          <BarChart
            title="Plazas por Distrito"
            data={districtData.map((d) => ({
              label: d.district,
              value: d.totalSpaces,
              color: '#3b82f6',
            }))}
          />
        </div>
        <div className="dashboard__chart-item">
          <PieChart
            title="Distribución por Tipo"
            data={typeDistribution.map((t) => ({
              label: t.type === 'UNDERGROUND' ? 'Subterráneo' : 'Superficie',
              value: t.count,
              color: t.type === 'UNDERGROUND' ? '#3b82f6' : '#10b981',
            }))}
          />
        </div>
      </section>

      {/* Table */}
      {data && (
        <section className="dashboard__table">
          <ParkingTable data={data} title="Listado de Aparcamientos" />
        </section>
      )}
    </div>
  );
};
