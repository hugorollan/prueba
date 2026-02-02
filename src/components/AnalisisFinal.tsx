import { useState } from "react";
import type { AnalisisAutomaticoResult } from "../types";
import { client } from "../client";
import { analizarDatasetAutomaticoPython } from "@app-anlisis-pii-psi/sdk";

interface Props {
  onResultado: (resultado: AnalisisAutomaticoResult | null) => void;
}

// Tipo del JSON que devuelve la Function Python analizarDatasetAutomaticoPython
interface AnalizarDatasetAutomaticoResponse {
  success: boolean;
  error?: string;
  dataset_rid: string;
  total_columns: number;
  total_rows?: number;
  columns?: Array<{
    name: string;
    type: string;
    risk: string;
    emoji?: string;
    category?: string;
    techniques?: string[];
    regulations?: string[];
  }>;
  debug_source?: string;
}

export function AnalisisFinal({ onResultado }: Props) {
  const [rid, setRid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalizar = async () => {
    setError(null);
    onResultado(null);

    const trimmed = rid.trim();
    if (!trimmed || !trimmed.startsWith("ri.foundry.main.dataset.")) {
      setError(
        "⚠️ Por favor ingresa un RID válido. Formato: ri.foundry.main.dataset.xxxxx-xxxxx"
      );
      return;
    }

    setLoading(true);
    try {
      // Llamada a la Function Python analizarDatasetAutomaticoPython
      const resultString = await client(
        analizarDatasetAutomaticoPython
      ).executeFunction({
        dataset_rid: trimmed,
      });

      const parsed = JSON.parse(
        resultString as string
      ) as AnalizarDatasetAutomaticoResponse;

      // DEBUG: ver exactamente qué devuelve la función
      console.log("resultado analizarDatasetAutomaticoPython:", parsed);

      if (!parsed.success) {
        setError(parsed.error || "La función devolvió success = false.");
        onResultado(null);
        return;
      }

      const resultado: AnalisisAutomaticoResult = {
        dataset_rid: parsed.dataset_rid,
        total_columns: parsed.total_columns,
        total_rows: parsed.total_rows ?? 0,
        columns: (parsed.columns ?? []).map((c) => ({
          name: c.name,
          type: c.type,
          risk:
            c.risk === "CRITICO" ||
            c.risk === "ALTO" ||
            c.risk === "MEDIO" ||
            c.risk === "BAJO"
              ? (c.risk as "CRITICO" | "ALTO" | "MEDIO" | "BAJO")
              : "BAJO",
          emoji: c.emoji ?? "",
          category: c.category ?? "",
          techniques: c.techniques ?? [],
          regulations: c.regulations ?? [],
        })),
        success: true,
      };

      onResultado(resultado);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : JSON.stringify(e);
      setError(`Error al ejecutar analizarDatasetAutomaticoPython: ${msg}`);
      onResultado(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">🤖 Análisis Automático por RID</h2>

      <div className="alert alert-info" style={{ marginBottom: "1rem" }}>
        <strong>Modo automático activado</strong>
        <br />
        Introduce el RID de un dataset de Foundry y el sistema analizará
        automáticamente sus columnas PII/PSI utilizando la misma lógica que el
        análisis por columnas (v2).
      </div>

      {error && (
        <div
          className="alert alert-error"
          style={{ whiteSpace: "pre-line", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="rid" className="form-label">
          RID del Dataset:
        </label>
        <input
          id="rid"
          type="text"
          className="form-input"
          placeholder="ri.foundry.main.dataset.xxxxx-xxxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={rid}
          onChange={(e) => setRid(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: "1rem" }}
        onClick={handleAnalizar}
        disabled={loading || !rid.trim()}
      >
        {loading ? "⏳ Analizando..." : "🚀 ANALIZAR POR RID"}
      </button>
    </div>
  );
}
