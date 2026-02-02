/**
 * Hook para calcular métricas agregadas de los datos de aparcamientos
 */

import { useMemo } from 'react';
import {
  Parking,
  KPIMetrics,
  DistrictAggregation,
  TypeDistribution,
} from '../types/parking.types';

export const useParkingMetrics = (parkings: Parking[] | null) => {
  const kpis = useMemo<KPIMetrics | null>(() => {
    if (!parkings || parkings.length === 0) return null;

    const totalParkings = parkings.length;
    const totalSpaces = parkings.reduce((sum, p) => sum + p.totalSpaces, 0);
    const averageSpaces = Math.round(totalSpaces / totalParkings);

    // Calcular distrito con más plazas
    const districtMap = new Map<string, number>();
    parkings.forEach((p) => {
      const current = districtMap.get(p.district) || 0;
      districtMap.set(p.district, current + p.totalSpaces);
    });

    let topDistrict = { name: '', spaces: 0 };
    districtMap.forEach((spaces, district) => {
      if (spaces > topDistrict.spaces) {
        topDistrict = { name: district, spaces };
      }
    });

    return {
      totalParkings,
      totalSpaces,
      averageSpaces,
      topDistrict,
    };
  }, [parkings]);

  const districtData = useMemo<DistrictAggregation[]>(() => {
    if (!parkings || parkings.length === 0) return [];

    const districtMap = new Map<
      string,
      { totalSpaces: number; parkingCount: number }
    >();

    parkings.forEach((p) => {
      const current = districtMap.get(p.district) || {
        totalSpaces: 0,
        parkingCount: 0,
      };
      districtMap.set(p.district, {
        totalSpaces: current.totalSpaces + p.totalSpaces,
        parkingCount: current.parkingCount + 1,
      });
    });

    return Array.from(districtMap.entries())
      .map(([district, data]) => ({
        district,
        totalSpaces: data.totalSpaces,
        parkingCount: data.parkingCount,
      }))
      .sort((a, b) => b.totalSpaces - a.totalSpaces);
  }, [parkings]);

  const typeDistribution = useMemo<TypeDistribution[]>(() => {
    if (!parkings || parkings.length === 0) return [];

    const typeMap = new Map<string, { count: number; totalSpaces: number }>();

    parkings.forEach((p) => {
      const current = typeMap.get(p.parkingType) || {
        count: 0,
        totalSpaces: 0,
      };
      typeMap.set(p.parkingType, {
        count: current.count + 1,
        totalSpaces: current.totalSpaces + p.totalSpaces,
      });
    });

    return Array.from(typeMap.entries()).map(([type, data]) => ({
      type: type as 'UNDERGROUND' | 'SURFACE',
      count: data.count,
      totalSpaces: data.totalSpaces,
    }));
  }, [parkings]);

  return {
    kpis,
    districtData,
    typeDistribution,
  };
};
