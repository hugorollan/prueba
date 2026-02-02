import { useState } from "react";
import type { AnalisisManualResult } from "../types";

interface Props {
  onResultado: (resultado: AnalisisManualResult) => void;
  onIrAResultados?: () => void;
}

/**
 * Análisis Manual basado en el formulario HTML original (A1, A2, B)
 * y en la lógica JS v3.0:
 *  - recopilarRespuestas()
 *  - analizarRespuestas()
 *  - calcularPerfilManual()
 */
export function AnalisisManual({ onResultado, onIrAResultados }: Props) {
  // Estado plano por simplicidad: replicamos los ids del HTML
  const [datasetName, setDatasetName] = useState("");
  const [datasetRid, setDatasetRid] = useState("");
  const [volumen, setVolumen] = useState<number | "">("");
  const [proposito, setProposito] = useState("");
  const [necesitaIdentificar, setNecesitaIdentificar] = useState(false);
  const [vinculaFuentes, setVinculaFuentes] = useState(false);

  // A1: PII Directos (a1_1..a1_11)
  const [a1, setA1] = useState<Record<string, boolean>>({
    a1_1: false,
    a1_2: false,
    a1_3: false,
    a1_4: false,
    a1_5: false,
    a1_6: false,
    a1_7: false,
    a1_8: false,
    a1_9: false,
    a1_10: false,
    a1_11: false,
  });

  // A2: PII Indirectos (a2_1..a2_7)
  const [a2, setA2] = useState<Record<string, boolean>>({
    a2_1: false,
    a2_2: false,
    a2_3: false,
    a2_4: false,
    a2_5: false,
    a2_6: false,
    a2_7: false,
  });

  // B: PSI (b_1..b_15)
  const [b, setB] = useState<Record<string, boolean>>({
    b_1: false,
    b_2: false,
    b_3: false,
    b_4: false,
    b_5: false,
    b_6: false,
    b_7: false,
    b_8: false,
    b_9: false,
    b_10: false,
    b_11: false,
    b_12: false,
    b_13: false,
    b_14: false,
    b_15: false,
  });

  const toggleA1 = (id: keyof typeof a1) =>
    setA1((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleA2 = (id: keyof typeof a2) =>
    setA2((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleB = (id: keyof typeof b) =>
    setB((prev) => ({ ...prev, [id]: !prev[id] }));

  // ==========================
  // LÓGICA PORTADA DEL JS
  // ==========================

  function analizarRespuestas(resp: AnalisisManualResult["respuestas"]) {
    let countPiiDirectos = 0;
    let countPiiIndirectos = 0;
    let countPsi = 0;

    for (const key in resp.pii_directos) {
      if (resp.pii_directos[key]) countPiiDirectos++;
    }
    for (const key in resp.pii_indirectos) {
      if (resp.pii_indirectos[key]) countPiiIndirectos++;
    }
    for (const key in resp.psi) {
      if (resp.psi[key]) countPsi++;
    }

    return {
      count_pii_directos: countPiiDirectos,
      count_pii_indirectos: countPiiIndirectos,
      count_psi: countPsi,
    };
  }

  function calcularPerfilManual(analisis: {
    count_pii_directos: number;
    count_pii_indirectos: number;
    count_psi: number;
  }) {
    const totalPII = analisis.count_pii_directos + analisis.count_pii_indirectos;

    // Mismas reglas que tu JS
    if (totalPII === 0 && analisis.count_psi === 0) {
      return {
        id: "P0",
        nombre: "Público abierto",
        riesgo: "Bajo",
        k: "N/A",
      };
    }
    if (analisis.count_psi > 0) {
      if (analisis.count_psi >= 3 || analisis.count_pii_directos >= 3) {
        return {
          id: "P6",
          nombre: "Datos Altamente Sensibles",
          riesgo: "Muy Alto",
          k: "50",
        };
      }
      return {
        id: "P5",
        nombre: "Datos Sensibles Identificables",
        riesgo: "Alto",
        k: "25",
      };
    }
    if (analisis.count_pii_directos >= 3) {
      return {
        id: "P4",
        nombre: "Uso Interno Detallado",
        riesgo: "Medio-Alto",
        k: "10",
      };
    }
    if (
      analisis.count_pii_directos >= 1 ||
      totalPII >= 3
    ) {
      return {
        id: "P3",
        nombre: "Analítica con Pseudonimización",
        riesgo: "Medio",
        k: "10",
      };
    }
    if (analisis.count_pii_indirectos >= 2) {
      return {
        id: "P2",
        nombre: "Analítica Estadística",
        riesgo: "Medio-Bajo",
        k: "5",
      };
    }
    return {
      id: "P1",
      nombre: "Datos Agregados",
      riesgo: "Bajo",
      k: "3",
    };
  }

  function handleEvaluar() {
    if (!datasetName.trim() || !proposito.trim() || volumen === "") {
      alert("⚠️ Por favor completa Nombre, Volumen y Propósito.");
      return;
    }

    const respuestas: AnalisisManualResult["respuestas"] = {
      datasetName: datasetName.trim(),
      datasetRid: datasetRid.trim() || null,
      volumen: typeof volumen === "number" ? volumen : 0,
      proposito: proposito.trim(),
      necesita_identificar: necesitaIdentificar,
      vincula_fuentes: vinculaFuentes,
      pii_directos: { ...a1 },
      pii_indirectos: { ...a2 },
      psi: { ...b },
    };

    const analisis = analizarRespuestas(respuestas);
    const perfil = calcularPerfilManual(analisis);

    const resultado: AnalisisManualResult = {
      respuestas,
      analisis,
      perfil,
    };

    onResultado(resultado);

    if (onIrAResultados) {
      onIrAResultados();
    } else {
      alert(
        "✅ Análisis manual completado. Ve a la tab \"🎯 Resultados\" para ver el perfil calculado."
      );
    }
  }

  // ==========================
  // RENDER DEL FORMULARIO
  // ==========================

  return (
    <div className="card">
      <h2 className="card-title">📝 Evaluación Manual del Dataset</h2>

      <div className="alert alert-info">
        <strong>📋 Instrucciones:</strong> Completa la información y marca las
        casillas que aplican a tu dataset.
      </div>

      {/* Información del Dataset */}
      <section style={{ marginTop: "2rem" }}>
        <h3>Información del Dataset</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="datasetName" className="form-label">
              Nombre del Dataset *
            </label>
            <input
              id="datasetName"
              type="text"
              className="form-input"
              placeholder="ej: clientes_prod_2024"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
            />
            <small>Nombre descriptivo del dataset a evaluar</small>
          </div>
          <div className="form-group">
            <label htmlFor="datasetRid" className="form-label">
              RID del Dataset (opcional)
            </label>
            <input
              id="datasetRid"
              type="text"
              className="form-input"
              placeholder="ri.foundry.main.dataset.xxxxx"
              value={datasetRid}
              onChange={(e) => setDatasetRid(e.target.value)}
            />
            <small>🔗 Identificador único del dataset</small>
          </div>
        </div>
      </section>

      {/* PARTE A1: PII DIRECTOS */}
      <section style={{ marginTop: "2rem" }}>
        <h3>PARTE A1: PII DIRECTOS - Identificadores Personales</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={a1.a1_1}
              onChange={() => toggleA1("a1_1")}
            />{" "}
            Nombres completos
          </label>
          <label>
            <input
              type="checkbox"
              checked={a1.a1_2}
              onChange={() => toggleA1("a1_2")}
            />{" "}
            DNI / NIE
          </label>
          <label>
            <input
              type="checkbox"
              checked={a1.a1_3}
              onChange={() => toggleA1("a1_3")}
            />{" "}
            Pasaporte / SSN
          </label>
          <label>
            <input
              type="checkbox"
              checked={a1.a1_4}
              onChange={() => toggleA1("a1_4")}
            />{" "}
            Direcciones completas
          </label>
          <label>
            <input
              type="checkbox"
              checked={a1.a1_5}
              onChange={() => toggleA1("a1_5")}
            />{" "}
            Números de teléfono
          </label>
          <label>
            <input
              type="checkbox"
              checked={a1.a1_6}
              onChange={() => toggleA1("a1_6")}
            />{" "}
            Emails personales
          </label>
        </div>

        <h3>PII DIRECTOS - Datos Financieros</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={a1.a1_7}
              onChange={() => toggleA1("a1_7")}
            />{" "}
            Cuentas bancarias
          </label>
          <label>
            <input
              type="checkbox"
              checked={a1.a1_8}
              onChange={() => toggleA1("a1_8")}
            />{" "}
            Tarjetas de crédito/débito
          </label>
        </div>

        <h3>PII DIRECTOS - Biométricos y Otros</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={a1.a1_9}
              onChange={() => toggleA1("a1_9")}
            />{" "}
            Datos biométricos
          </label>
          <label>
            <input
              type="checkbox"
              checked={a1.a1_10}
              onChange={() => toggleA1("a1_10")}
            />{" "}
            Fotografías identificables
          </label>
          <label>
            <input
              type="checkbox"
              checked={a1.a1_11}
              onChange={() => toggleA1("a1_11")}
            />{" "}
            Placas de vehículos
          </label>
        </div>
      </section>

      {/* PARTE A2: PII INDIRECTOS */}
      <section style={{ marginTop: "2rem" }}>
        <h3>PARTE A2: PII INDIRECTOS - Datos Demográficos</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={a2.a2_1}
              onChange={() => toggleA2("a2_1")}
            />{" "}
            Fecha de nacimiento completa
          </label>
          <label>
            <input
              type="checkbox"
              checked={a2.a2_2}
              onChange={() => toggleA2("a2_2")}
            />{" "}
            Edad exacta
          </label>
        </div>

        <h3>PII INDIRECTOS - Ubicación</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={a2.a2_3}
              onChange={() => toggleA2("a2_3")}
            />{" "}
            Código postal completo
          </label>
          <label>
            <input
              type="checkbox"
              checked={a2.a2_4}
              onChange={() => toggleA2("a2_4")}
            />{" "}
            Geolocalización GPS
          </label>
        </div>

        <h3>PII INDIRECTOS - Identificadores Digitales</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={a2.a2_5}
              onChange={() => toggleA2("a2_5")}
            />{" "}
            Dirección IP
          </label>
          <label>
            <input
              type="checkbox"
              checked={a2.a2_6}
              onChange={() => toggleA2("a2_6")}
            />{" "}
            Cookies/IDs dispositivos
          </label>
          <label>
            <input
              type="checkbox"
              checked={a2.a2_7}
              onChange={() => toggleA2("a2_7")}
            />{" "}
            Combinaciones identificables
          </label>
        </div>
      </section>

      {/* PARTE B: PSI */}
      <section style={{ marginTop: "2rem" }}>
        <h3>PARTE B: PSI - Categorías Especiales (GDPR Art. 9)</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={b.b_1}
              onChange={() => toggleB("b_1")}
            />{" "}
            Origen racial/étnico
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_2}
              onChange={() => toggleB("b_2")}
            />{" "}
            Opiniones políticas
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_3}
              onChange={() => toggleB("b_3")}
            />{" "}
            Convicciones religiosas
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_4}
              onChange={() => toggleB("b_4")}
            />{" "}
            Afiliación sindical
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_5}
              onChange={() => toggleB("b_5")}
            />{" "}
            Datos genéticos
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_6}
              onChange={() => toggleB("b_6")}
            />{" "}
            Biométricos (identificación única)
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_7}
              onChange={() => toggleB("b_7")}
            />{" "}
            Datos de salud
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_8}
              onChange={() => toggleB("b_8")}
            />{" "}
            Vida sexual/orientación
          </label>
        </div>

        <h3>PSI - Datos Financieros Sensibles</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={b.b_9}
              onChange={() => toggleB("b_9")}
            />{" "}
            Ingresos exactos
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_10}
              onChange={() => toggleB("b_10")}
            />{" "}
            Patrimonio neto
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_11}
              onChange={() => toggleB("b_11")}
            />{" "}
            Historial crediticio
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_12}
              onChange={() => toggleB("b_12")}
            />{" "}
            Scoring crediticio
          </label>
        </div>

        <h3>PSI - Otros Datos Sensibles</h3>
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={b.b_13}
              onChange={() => toggleB("b_13")}
            />{" "}
            Antecedentes penales
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_14}
              onChange={() => toggleB("b_14")}
            />{" "}
            Datos de menores
          </label>
          <label>
            <input
              type="checkbox"
              checked={b.b_15}
              onChange={() => toggleB("b_15")}
            />{" "}
            Info laboral sensible
          </label>
        </div>
      </section>

      {/* Propósito y contexto */}
      <section style={{ marginTop: "2rem" }}>
        <h3>Propósito y Contexto</h3>
        <div className="form-group">
          <label htmlFor="proposito" className="form-label">
            Propósito del uso *
          </label>
          <select
            id="proposito"
            className="form-input"
            value={proposito}
            onChange={(e) => setProposito(e.target.value)}
          >
            <option value="">Selecciona...</option>
            <option value="publico">Publicación/Compartir públicamente</option>
            <option value="analisis_agregado">
              Análisis agregado/estadístico
            </option>
            <option value="analisis_detallado">Análisis interno detallado</option>
            <option value="operacional">Uso operacional/transaccional</option>
            <option value="ml">Machine Learning/IA</option>
          </select>
        </div>

        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={necesitaIdentificar}
              onChange={() => setNecesitaIdentificar((v) => !v)}
            />{" "}
            Se necesita identificar individuos
          </label>
          <label>
            <input
              type="checkbox"
              checked={vinculaFuentes}
              onChange={() => setVinculaFuentes((v) => !v)}
            />{" "}
            Se vincularán múltiples fuentes
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="volumen" className="form-label">
            Volumen aproximado de registros *
          </label>
          <input
            id="volumen"
            type="number"
            className="form-input"
            value={volumen}
            onChange={(e) =>
              setVolumen(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
      </section>

      <div className="form-actions" style={{ marginTop: "2rem" }}>
        <button className="btn btn-primary" onClick={handleEvaluar}>
          🔍 EVALUAR Y CALCULAR PERFIL
        </button>
      </div>
    </div>
  );
}
