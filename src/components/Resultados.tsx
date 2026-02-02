import type {
  AnalisisAutomaticoResult,
  AnalisisManualResult,
} from "../types";

interface Props {
  resultadoAutomatico: AnalisisAutomaticoResult | null;
  resultadoManual: AnalisisManualResult | null;
}

export function Resultados({
  resultadoAutomatico,
  resultadoManual,
}: Props) {
  if (!resultadoAutomatico && !resultadoManual) {
    return (
      <div className="card">
        <h2 className="card-title">🎯 Resultados del Análisis</h2>
        <div className="alert alert-info">
          No hay resultados disponibles. Por favor realiza un análisis
          automático o manual primero.
        </div>
      </div>
    );
  }

  const getRiskClass = (risk: string) => {
    const upper = risk.toUpperCase();
    if (upper.includes("CRITICO") || upper.includes("CRÍTICO") || upper.includes("MUY ALTO")) {
      return "risk-critico";
    }
    if (upper.includes("ALTO")) {
      return "risk-alto";
    }
    if (upper.includes("MEDIO")) {
      return "risk-medio";
    }
    if (upper.includes("BAJO")) {
      return "risk-bajo";
    }
    return "";
  };

  return (
    <div>
      {/* Resultados Automáticos (por RID) */}
      {resultadoAutomatico && (
        <div className="card">
          <h2 className="card-title">🤖 Resultados del Análisis Automático</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
              <div style={{ fontSize: "2em", fontWeight: "bold", color: "#1976d2" }}>
                {resultadoAutomatico.total_columns}
              </div>
              <div>Total Columnas</div>
            </div>
            <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
              <div style={{ fontSize: "2em", fontWeight: "bold", color: "#1976d2" }}>
                {resultadoAutomatico.total_rows.toLocaleString()}
              </div>
              <div>Total Registros</div>
            </div>
            <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
              <div style={{ fontSize: "2em", fontWeight: "bold", color: "#c62828" }}>
                {resultadoAutomatico.columns.filter((c) => c.risk === "CRITICO").length}
              </div>
              <div>Columnas Críticas</div>
            </div>
          </div>

          <h3>📊 Detalle por Columna</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Columna</th>
                  <th>Tipo</th>
                  <th>Riesgo</th>
                  <th>Categoría</th>
                  <th>Técnicas Recomendadas</th>
                  <th>Regulaciones</th>
                </tr>
              </thead>
              <tbody>
                {resultadoAutomatico.columns.map((col, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{col.name}</strong>
                    </td>
                    <td>{col.type}</td>
                    <td>
                      <span className={`risk-badge ${getRiskClass(col.risk)}`}>
                        {col.emoji} {col.risk}
                      </span>
                    </td>
                    <td>{col.category}</td>
                    <td>{col.techniques.join(", ") || "N/A"}</td>
                    <td>{col.regulations.join(", ") || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resultados Manuales */}
      {resultadoManual && (
        <div className="card" style={{ marginTop: "2rem" }}>
          <h2 className="card-title">✍️ Resultados del Análisis Manual</h2>

          <div
            style={{
              padding: "1.5rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              background:
                resultadoManual.perfil.riesgo.includes("Alto") ||
                resultadoManual.perfil.riesgo.toUpperCase().includes("CRÍTICO")
                  ? "#ffebee"
                  : resultadoManual.perfil.riesgo.includes("Medio")
                  ? "#fff8e1"
                  : "#e8f5e9",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              📊 PERFIL ASIGNADO: {resultadoManual.perfil.id} –{" "}
              {resultadoManual.perfil.nombre}
            </h3>
            <p>
              <strong>Nivel de Riesgo:</strong>{" "}
              <span
                className={`risk-badge ${getRiskClass(
                  resultadoManual.perfil.riesgo
                )}`}
              >
                {resultadoManual.perfil.riesgo}
              </span>
            </p>
            <p>
              <strong>K-Anonimity Requerido:</strong>{" "}
              {resultadoManual.perfil.k}
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3>📈 Resumen de Análisis Manual</h3>
            <table className="data-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Dataset</strong>
                  </td>
                  <td>{resultadoManual.respuestas.datasetName}</td>
                </tr>
                {resultadoManual.respuestas.datasetRid && (
                  <tr>
                    <td>
                      <strong>RID</strong>
                    </td>
                    <td>
                      <code>{resultadoManual.respuestas.datasetRid}</code>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <strong>Volumen</strong>
                  </td>
                  <td>
                    {resultadoManual.respuestas.volumen.toLocaleString()}{" "}
                    registros
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Propósito</strong>
                  </td>
                  <td>{resultadoManual.respuestas.proposito}</td>
                </tr>
                <tr>
                  <td>
                    <strong>PII Directos Detectados</strong>
                  </td>
                  <td>
                    <span className="risk-badge risk-medio">
                      {resultadoManual.analisis.count_pii_directos}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>PII Indirectos Detectados</strong>
                  </td>
                  <td>
                    <span className="risk-badge risk-medio">
                      {resultadoManual.analisis.count_pii_indirectos}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>PSI Especiales Detectados</strong>
                  </td>
                  <td>
                    <span className="risk-badge risk-critico">
                      {resultadoManual.analisis.count_psi}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>💡 Recomendaciones</h3>
            <ul>
              <li>
                ✅ Aplicar técnicas de protección según perfil{" "}
                {resultadoManual.perfil.id}
              </li>
              <li>📋 Documentar en registro de tratamiento GDPR</li>
              <li>🔒 Implementar controles de acceso basados en roles</li>
              {resultadoManual.analisis.count_psi > 0 && (
                <>
                  <li>
                    🚨 <strong>CRÍTICO: Realizar DPIA obligatoria</strong>
                  </li>
                  <li>🔐 Aplicar cifrado AES-256 en reposo y tránsito</li>
                  <li>👥 Obtener aprobaciones de C-Level, DPO y Legal</li>
                </>
              )}
              {resultadoManual.analisis.count_pii_directos >= 3 && (
                <li>
                  🛡️ Aplicar pseudonimización (T1) y tokenización (T6)
                </li>
              )}
              <li>
                📊 Garantizar K-Anonimity ≥ {resultadoManual.perfil.k}
              </li>
              <li>
                📖 Consulta la tab <strong>📚 Catálogo</strong> para más detalles
                sobre cada perfil y técnicas T1–T9.
              </li>
              <li>
                📖 Consulta también la tab <strong>📖 Guía</strong> para
                definiciones detalladas de PII/PSI.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
