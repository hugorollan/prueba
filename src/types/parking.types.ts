/**
 * Tipos de datos para el sistema de aparcamientos
 */

export type ParkingType = 'UNDERGROUND' | 'SURFACE';

export interface Parking {
  parkingId: string;
  parkingName: string;
  district: string;
  parkingType: ParkingType;
  totalSpaces: number;
  latitude: number;
  longitude: number;
  source: string;
  ingestTimestamp: Date;
}

export interface KPIMetrics {
  totalParkings: number;
  totalSpaces: number;
  averageSpaces: number;
  topDistrict: {
    name: string;
    spaces: number;
  };
}

export interface DistrictAggregation {
  district: string;
  totalSpaces: number;
  parkingCount: number;
}

export interface TypeDistribution {
  type: ParkingType;
  count: number;
  totalSpaces: number;
}

export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}
