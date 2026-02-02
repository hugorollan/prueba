import { useState } from "react";
import { auth } from "./client";
import { AnalisisFinal } from "./components/AnalisisFinal";
import { AnalisisManual } from "./components/AnalisisManual";
import { Resultados } from "./components/Resultados";
import { Recetas } from "./components/Recetas";
import { Guia } from "./components/Guia";
import { Catalogo } from "./components/Catalogo";
import { Tecnicas } from "./components/Tecnicas";
import { Ayuda } from "./components/Ayuda";
import { AnalisisPorColumnas } from "./components/AnalisisPorColumnas";
import type {
  TabType,
  AnalisisAutomaticoResult,
  AnalisisManualResult,
} from "./types";
import "./App.css";

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>("automatico");
  const [resultadoAutomatico, setResultadoAutomatico] =
    useState<AnalisisAutomaticoResult | null>(null);
  const [resultadoManual, setResultadoManual] =
    useState<AnalisisManualResult | null>(null);

  const tabs: { id: TabType; label: string }[] = [
    { id: "automatico", label: "🤖 Análisis Automático" },
    { id: "columnas", label: "🔎 Análisis por columnas" },
    { id: "manual", label: "✍️ Análisis Manual" },
    { id: "resultados", label: "🎯 Resultados" },
    { id: "recetas", label: "📋 Recetas" },
    { id: "guia", label: "📖 Guía" },
    { id: "catalogo", label: "📚 Catálogo" },
    { id: "tecnicas", label: "🛡️ Técnicas" },
    { id: "ayuda", label: "💡 Ayuda" },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error("Error signing out", e);
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
            <h1>📊 Sistema de Protección de Datos PII/PSI</h1>
            <p>Análisis automático y manual de datasets</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "1px solid white",
              color: "white",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: "0.9rem",
            }}
          >
            🔒 Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <main className="tab-content">
        {activeTab === "automatico" && (
          <AnalisisFinal onResultado={setResultadoAutomatico} />
        )}

        {activeTab === "columnas" && <AnalisisPorColumnas />}

        {activeTab === "manual" && (
          <AnalisisManual
            onResultado={setResultadoManual}
            onIrAResultados={() => setActiveTab("resultados")}
          />
        )}

        {activeTab === "resultados" && (
          <Resultados
            resultadoAutomatico={resultadoAutomatico}
            resultadoManual={resultadoManual}
          />
        )}

        {activeTab === "recetas" && <Recetas />}
        {activeTab === "guia" && <Guia />}
        {activeTab === "catalogo" && <Catalogo />}
        {activeTab === "tecnicas" && <Tecnicas />}
        {activeTab === "ayuda" && <Ayuda />}
      </main>
    </div>
  );
}

export default App;
