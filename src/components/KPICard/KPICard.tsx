/**
 * Componente reutilizable para mostrar una tarjeta KPI
 */

import React from 'react';
import './KPICard.css';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}) => {
  return (
    <div className={`kpi-card kpi-card--${color}`}>
      <div className="kpi-card__header">
        <div className="kpi-card__title">{title}</div>
        {icon && <div className="kpi-card__icon">{icon}</div>}
      </div>

      <div className="kpi-card__value">{value.toLocaleString()}</div>

      {subtitle && <div className="kpi-card__subtitle">{subtitle}</div>}

      {trend && (
        <div
          className={`kpi-card__trend ${
            trend.value >= 0 ? 'kpi-card__trend--up' : 'kpi-card__trend--down'
          }`}
        >
          <span className="kpi-card__trend-icon">
            {trend.value >= 0 ? '↑' : '↓'}
          </span>
          <span className="kpi-card__trend-value">
            {Math.abs(trend.value)}%
          </span>
          <span className="kpi-card__trend-label">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
