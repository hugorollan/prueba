import React, { useState } from "react";
import { analizarColumnasPII } from "@app-anlisis-pii-psi/sdk";
import { client } from "../client";

type ColumnaAnalizada = {
  name: string;
  logicalType: string;
  inferredType: string;
  risk: string;
  emoji: string;
  category: string;
  techniques: string[];
  regulations: string[];
  nullCount_sample: number | null;
  distinctCount_sample: number | null;
  sampleValues: string[];
  detectedPatterns: string[];
  comments: string[];
};

type ResultadoPII = {
  total_columns: number;
  columns: ColumnaAnalizada[];
  risk_summary: Record<string, number>;
  has_critical: boolean;
  has_high: boolean;
  success: boolean;
  error?: string;
};

export function AnalisisPorColumnas() {
  const [namesCsv, setNamesCsv] = useState("");
  const [typesCsv, setTypesCsv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoPII | null>(null);

  const handleAnalizar = async () => {
    setError(null);
    setResultado(null);

    const trimmed = namesCsv.trim();
    if (!trimmed) {
      setError("Por favor introduce al menos un nombre de columna.");
      return;
    }

    setLoading(true);
    try {
      const resultString = await client(analizarColumnasPII).executeFunction({
        column_names_csv: trimmed,
        column_types_csv: typesCsv.trim() || undefined,
      });

      const parsed: ResultadoPII = JSON.parse(resultString as string);

      if (!parsed.success) {
        setError(parsed.error || "La función devolvió success = false.");
      } else {
        setResultado(parsed);
      }
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : JSON.stringify(e);
      setError(`Error al ejecutar analizarColumnasPII: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const renderResumenRiesgo = () => {
    if (!resultado) return null;
    const rs = resultado.risk_summary || {};

    return (
      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          backgroundColor: "#f1f5f9",
          borderRadius: 4,
          border: "1px solid #d1d5db",
        }}
      >
        <h4 style={{ margin: 0, marginBottom: "0.5rem" }}>
          📊 Resumen por nivel de riesgo
        </h4>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.9em" }}>
          <li>🔴 CRÍTICO: {rs.CRITICO ?? 0}</li>
          <li>🟠 ALTO: {rs.ALTO ?? 0}</li>
          <li>🟡 MEDIO: {rs.MEDIO ?? 0}</li>
          <li>🟢 BAJO: {rs.BAJO ?? 0}</li>
        </ul>
        {(resultado.has_critical || resultado.has_high) && (
          <p
            style={{
              marginTop: "0.5rem",
              color: "#b91c1c",
              fontSize: "0.85em",
            }}
          >
            ⚠️ Este conjunto de columnas contiene datos sensibles (CRÍTICO o
            ALTO).
          </p>
        )}
      </div>
    );
  };

  const renderTablaColumnas = () => {
    if (!resultado || !resultado.columns?.length) {
      return (
        <p style={{ marginTop: "1rem", fontSize: "0.9em", color: "#6b7280" }}>
          No hay columnas analizables. ¿Has introducido correctamente los
          nombres separados por comas?
        </p>
      );
    }

    return (
      <div style={{ marginTop: "1rem" }}>
        <h4 style={{ marginTop: 0 }}>📋 Columnas analizadas</h4>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85em",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th style={thStyle}>Columna</th>
                <th style={thStyle}>Tipo lógico</th>
                <th style={thStyle}>Tipo inferido</th>
                <th style={thStyle}>Riesgo</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Técnicas</th>
                <th style={thStyle}>Regulaciones</th>
                <th style={thStyle}>Documentación / Acción recomendada</th>
              </tr>
            </thead>
            <tbody>
              {resultado.columns.map((c, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                  }}
                >
                  <td style={tdStyle}>
                    <strong>{c.name}</strong>
                  </td>
                  <td style={tdStyle}>{c.logicalType}</td>
                  <td style={tdStyle}>{c.inferredType}</td>
                  <td style={tdStyle}>
                    {c.emoji} {c.risk}
                  </td>
                  <td style={tdStyle}>{c.category}</td>
                  <td style={tdStyle}>{c.techniques.join(", ")}</td>
                  <td style={tdStyle}>{c.regulations.join(", ")}</td>
                  <td style={{ ...tdStyle, maxWidth: 340 }}>
                    {getDocumentacionCorta(c)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      {/* Mantén el (v2) si quieres saber que es la nueva versión */}
      <h2 className="card-title">🔎 Análisis PII/PSI por columnas (v2)</h2>

      <div
        className="alert alert-info"
        style={{
          marginBottom: "1rem",
          backgroundColor: "#e0f2fe",
          borderColor: "#bae6fd",
          color: "#0c4a6e",
        }}
      >
        <strong>Modo manual basado en schema</strong>
        <br />
        Copia los nombres de las columnas de tu dataset (por ejemplo desde
        Object Explorer o el esquema de Foundry) y pégalos abajo, separados por
        comas. Opcionalmente, introduce también los tipos lógicos.
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
        <label htmlFor="cols-names" className="form-label">
          Nombres de columnas (separados por comas)
        </label>
        <textarea
          id="cols-names"
          className="form-input"
          rows={3}
          placeholder="Ej: dni,email,telefono,fecha_nacimiento,ciudad,id_cliente"
          value={namesCsv}
          onChange={(e) => setNamesCsv(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group" style={{ marginTop: "0.75rem" }}>
        <label htmlFor="cols-types" className="form-label">
          Tipos de columnas (opcional, separados por comas)
        </label>
        <textarea
          id="cols-types"
          className="form-input"
          rows={2}
          placeholder="Ej: string,string,string,date,string,string"
          value={typesCsv}
          onChange={(e) => setTypesCsv(e.target.value)}
          disabled={loading}
        />
        <small
          style={{
            display: "block",
            marginTop: "0.5rem",
            color: "#6b7280",
          }}
        >
          Si se deja vacío, se asumirá tipo <code>string</code> para todas las
          columnas.
        </small>
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: "1rem" }}
        onClick={handleAnalizar}
        disabled={loading || !namesCsv.trim()}
      >
        {loading ? "⏳ Analizando columnas..." : "🚀 ANALIZAR COLUMNAS"}
      </button>

      {resultado && (
        <>
          {renderResumenRiesgo()}
          {renderTablaColumnas()}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "0.5rem",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "0.8em",
  color: "#4b5563",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  fontSize: "0.8em",
  color: "#111827",
};

function getDocumentacionCorta(col: ColumnaAnalizada): string {
  const { risk, category } = col;

  if (category === "PSI" || risk === "CRITICO") {
    return (
      "PSI (GDPR Art.9). Aplica perfiles P5/P6: T1 (Supresión), T2 (Hash irreversible), " +
      "T3/T4 (generalización/agrupación), T8 (Differential Privacy) y T9 (k≥10). " +
      "Revisión obligatoria del DPO."
    );
  }

  if (category === "PII_DIRECTO") {
    if (risk === "ALTO") {
      return (
        "PII directo. Aplica perfiles P2–P4: T2 (pseudonimización) o T7 (tokenización) " +
        "según necesidad de reversibilidad; T3 sobre QI; T9 (k≥3–5). Considerar T1 " +
        "para columnas no esenciales."
      );
    }
    if (risk === "MEDIO") {
      return (
        "PII directo con riesgo medio. Recomendada pseudonimización (T2) o tokenización (T7) " +
        "y generalización ligera (T3) si hay QI. Verificar k≥3."
      );
    }
  }

  if (category === "PII_INDIRECTO") {
    return (
      "PII indirecto / QI. Perfil típicamente P1: aplicar T3 (generalización de edad, ZIP, etc.) " +
      "y T9 (k≥3). Comprobar que no existan combinaciones únicas de QI."
    );
  }

  if (category === "TECNICO") {
    return (
      "Identificador técnico. Revisar si puede vincularse a personas mediante otros datasets. " +
      "Si actúa como ID estable de persona, tratar como PII directo (T2/T7); en caso contrario " +
      "puede considerarse P0."
    );
  }

  if (category === "REVISAR") {
    return (
      "Categoría REVISAR. Analizar el significado real de la columna. Si contiene PII/PSI, " +
      "aplicar las técnicas T1–T9 según el perfil (P2–P6). Si es solo dato operativo, " +
      "puede reclasificarse como P0."
    );
  }

  if (risk === "BAJO") {
    return (
      "Riesgo bajo. Verificar ausencia de PII/PSI y de QI combinables. Si se confirma, " +
      "puede tratarse como P0 (sin técnicas adicionales)."
    );
  }

  return (
    "Revisar esta columna en detalle y aplicar T1–T9 según el perfil global del dataset (P0–P6)."
  );
}
