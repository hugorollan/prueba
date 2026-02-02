/**
 * Componente para mostrar mensajes de error
 */

import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="error-message">
      <div className="error-message__icon">⚠️</div>
      <h3 className="error-message__title">Error al cargar los datos</h3>
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-message__retry-btn">
          Reintentar
        </button>
      )}
    </div>
  );
};
