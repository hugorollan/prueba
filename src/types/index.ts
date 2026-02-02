/**
 * Tipos para el Sistema de Análisis PII/PSI
 */

export interface Column {
  name: string;
  type: string;
  risk: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  emoji: string;
  category: string;
  techniques: string[];
  regulations: string[];
}

export interface AnalisisAutomaticoResult {
  dataset_rid: string;
  total_columns: number;
  total_rows: number;
  columns: Column[];
  success: boolean;
  error?: string;
}

export interface AnalisisManualResult {
  // Respuestas completas del formulario manual
  respuestas: {
    datasetName: string;
    datasetRid: string | null;
    volumen: number;
    proposito: string;
    necesita_identificar: boolean;
    vincula_fuentes: boolean;
    pii_directos: Record<string, boolean>;    // a1_1..a1_11
    pii_indirectos: Record<string, boolean>;  // a2_1..a2_7
    psi: Record<string, boolean>;             // b_1..b_15
  };

  // Conteos agregados
  analisis: {
    count_pii_directos: number;
    count_pii_indirectos: number;
    count_psi: number;
  };

  // Perfil final (copiado de tu JS: P0–P6, riesgo, k)
  perfil: {
    id: string;
    nombre: string;
    riesgo: string;
    k: string;
  };
}

export interface Receta {
  perfil_id: string;
  perfil_nombre: string;
  descripcion: string;
  nivel_riesgo: string;
  k_anonimity: string;
  paso_1: string;
  paso_2: string;
  paso_3: string;
  paso_4: string;
}

export interface Tecnica {
  tecnica_id: string;
  tecnica_nombre: string;
  descripcion: string;
  ejemplo_antes: string;
  ejemplo_despues: string;
  casos_uso: string;
}


export type TabType =
  | "automatico"
  | "columnas"
  | "manual"
  | "resultados"
  | "recetas"
  | "guia"
  | "catalogo"
  | "tecnicas"
  | "ayuda";
