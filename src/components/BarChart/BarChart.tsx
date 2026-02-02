/**
 * Componente de gráfico de barras simple (sin librerías externas)
 * Para producción se recomienda usar Chart.js, Recharts o similar
 */

import React from 'react';
import './BarChart.css';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bar-chart">
      {title && <h3 className="bar-chart__title">{title}</h3>}
      <div className="bar-chart__container" style={{ height }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="bar-chart__item">
              <div className="bar-chart__bar-container">
                <div
                  className="bar-chart__bar"
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: item.color || '#3b82f6',
                  }}
                >
                  <span className="bar-chart__value">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bar-chart__label">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
