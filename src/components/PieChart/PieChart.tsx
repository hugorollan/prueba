/**
 * Componente de gráfico circular simple
 * Para producción se recomienda usar Chart.js, Recharts o similar
 */

import React from 'react';
import './PieChart.css';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let cumulativePercentage = 0;
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const startPercentage = cumulativePercentage;
    cumulativePercentage += percentage;

    return {
      ...item,
      percentage,
      startPercentage,
    };
  });

  return (
    <div className="pie-chart">
      {title && <h3 className="pie-chart__title">{title}</h3>}
      <div className="pie-chart__container">
        <div className="pie-chart__chart">
          <svg viewBox="0 0 100 100" className="pie-chart__svg">
            {segments.map((segment, index) => {
              const startAngle = (segment.startPercentage / 100) * 360 - 90;
              const endAngle = startAngle + (segment.percentage / 100) * 360;

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

              const largeArc = segment.percentage > 50 ? 1 : 0;

              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                `Z`,
              ].join(' ');

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
        </div>
        <div className="pie-chart__legend">
          {segments.map((segment, index) => (
            <div key={index} className="pie-chart__legend-item">
              <div
                className="pie-chart__legend-color"
                style={{ backgroundColor: segment.color }}
              />
              <div className="pie-chart__legend-text">
                <span className="pie-chart__legend-label">
                  {segment.label}
                </span>
                <span className="pie-chart__legend-value">
                  {segment.value.toLocaleString()} (
                  {segment.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
