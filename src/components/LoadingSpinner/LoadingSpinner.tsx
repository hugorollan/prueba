/**
 * Componente de spinner de carga
 */

import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando datos...',
}) => {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__spinner"></div>
      <p className="loading-spinner__message">{message}</p>
    </div>
  );
};
