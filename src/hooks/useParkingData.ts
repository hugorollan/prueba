/**
 * Hook personalizado para gestionar los datos de aparcamientos
 * Simula carga asíncrona y estados de error
 */

import { useState, useEffect } from 'react';
import { Parking, DataState } from '../types/parking.types';
import { mockParkingData } from '../data/mockParkingData';

export const useParkingData = (simulateDelay: number = 1000) => {
  const [state, setState] = useState<DataState<Parking[]>>({
    data: null,
    loading: true,
    error: null,
    lastUpdate: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Simular llamada a API con delay
        await new Promise((resolve) => setTimeout(resolve, simulateDelay));

        // Simular error aleatorio (5% de probabilidad)
        if (Math.random() < 0.05) {
          throw new Error('Error al cargar los datos del servidor');
        }

        setState({
          data: mockParkingData,
          loading: false,
          error: null,
          lastUpdate: new Date(),
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
          lastUpdate: null,
        });
      }
    };

    fetchData();
  }, [simulateDelay]);

  const refetch = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setTimeout(() => {
      setState({
        data: mockParkingData,
        loading: false,
        error: null,
        lastUpdate: new Date(),
      });
    }, simulateDelay);
  };

  return { ...state, refetch };
};
