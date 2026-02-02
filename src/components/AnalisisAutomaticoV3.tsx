import { useState } from 'react';
import type { AnalisisAutomaticoResult } from '../types';

interface Props {
  onResultado: (resultado: AnalisisAutomaticoResult) => void;
}

export function AnalisisAutomaticoV3({ onResultado }: Props) {
  const [rid, setRid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, message]);
  };

  const handleAnalizar = async () => {
    if (!rid || !rid.startsWith('ri.foundry.main.dataset.')) {
      setError('⚠️ Por favor ingresa un RID válido. Formato: ri.foundry.main.dataset.xxxxx-xxxxx');
      return;
    }

    setLoading(true);
    setError(null);
    setDebugInfo([]);
    addDebugInfo('🚀 Iniciando análisis del dataset...');
    addDebugInfo(`📦 Dataset RID: ${rid}`);
    addDebugInfo('🔧 Usando Functions Runtime API con función v0.2.5');

    try {
      // Llamar a la función usando Foundry Public API
      addDebugInfo('📡 Ejecutando función Python con Foundry Public API...');
      
      const functionRid = 'ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510';
      const apiUrl = `${window.location.origin}/api/v1/functions/${functionRid}/execute`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          parameters: { 
            dataset_rid: rid 
          } 
        }),
      });

      addDebugInfo(`📡 Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        addDebugInfo(`❌ Error response: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const resultString = await response.text();
      addDebugInfo('✅ Función ejecutada exitosamente');
      addDebugInfo('🔄 Parseando resultado JSON...');

      // La función retorna un string JSON, parsearlo
      const resultado: AnalisisAutomaticoResult = JSON.parse(resultString);

      if (resultado.success) {
        addDebugInfo('✅ ¡Análisis completado exitosamente!');
        addDebugInfo(`📊 Total columnas analizadas: ${resultado.total_columns}`);
        addDebugInfo(`📈 Total filas: ${resultado.total_rows}`);
        
        // Contar por nivel de riesgo
        const riesgoCounts = resultado.columns.reduce((acc, col) => {
          acc[col.risk] = (acc[col.risk] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        addDebugInfo(`🔴 CRÍTICO: ${riesgoCounts.CRITICO || 0}`);
        addDebugInfo(`🟠 ALTO: ${riesgoCounts.ALTO || 0}`);
        addDebugInfo(`🟡 MEDIO: ${riesgoCounts.MEDIO || 0}`);
        addDebugInfo(`🟢 BAJO: ${riesgoCounts.BAJO || 0}`);
        
        onResultado(resultado);
        setError(null);
      } else {
        const errorMsg = `❌ Error en el análisis: ${resultado.error || 'Error desconocido'}`;
        addDebugInfo(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addDebugInfo(`❌ Error al ejecutar la función: ${errorMessage}`);
      
      // Error más detallado para el usuario
      setError(
        `❌ No se pudo ejecutar la función Python.\n\n` +
        `Error: ${errorMessage}\n\n` +
        `Posibles causas:\n` +
        `• La función no tiene permisos para ejecutarse\n` +
        `• El RID del dataset no es válido o no tienes acceso\n` +
        `• El dataset no existe en Foundry\n` +
        `• Hay un problema de red o autenticación\n\n` +
        `💡 Revisa la consola del navegador (F12) para más detalles.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">🤖 Análisis Automático de Dataset</h2>
      
      <div className="alert alert-info" style={{ marginBottom: '1rem', backgroundColor: '#d1ecf1', borderColor: '#bee5eb', color: '#0c5460' }}>
        <strong>✨ Versión 3 - Usando OSDK Oficial</strong><br />
        Esta versión usa el SDK generado de Developer Console (v0.3.0) para llamar a la función Python.<br />
        <strong>Función:</strong> <code>analizarDatasetAutomatico</code> (v0.2.5)<br />
        <strong>SDK:</strong> <code>@app-anlisis-pii-psi/sdk@0.3.0</code>
      </div>

      <div className="alert alert-info">
        <strong>📋 Instrucciones:</strong><br />
        1. Ingresa el RID del dataset que deseas analizar<br />
        2. Click en &ldquo;🚀 ANALIZAR DATASET&rdquo;<br />
        3. La función Python analizará el dataset automáticamente<br />
        4. Ve los resultados en la tab &ldquo;🎯 Resultados&rdquo;
      </div>

      {error && (
        <div className="alert alert-error" style={{ whiteSpace: 'pre-line' }}>
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
        <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
          Ejemplo: ri.foundry.main.dataset.87a6285f-8eb6-4cda-b364-f6bcd7acc366
        </small>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleAnalizar}
        disabled={loading || !rid}
      >
        {loading ? '⏳ Analizando...' : '🚀 ANALIZAR DATASET'}
      </button>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>⚙️ Ejecutando función Python con OSDK...</p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            Analizando columnas y clasificando por nivel de riesgo...
          </p>
        </div>
      )}

      {debugInfo.length > 0 && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          border: '1px solid #dee2e6',
          maxHeight: '300px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.85em'
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>🔍 Debug Log:</h4>
          {debugInfo.map((info, idx) => (
            <div key={idx} style={{ marginBottom: '0.25rem' }}>
              {info}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0 }}>✨ Acerca de esta versión</h3>
        
        <h4>🎯 Ventajas de esta implementación:</h4>
        <ul>
          <li>✅ Usa Query API pública (más estable)</li>
          <li>✅ SDK v0.3.0 instalado y configurado</li>
          <li>✅ Manejo automático de autenticación</li>
          <li>✅ Logs detallados para debugging</li>
          <li>✅ Función Python v0.2.5 (última versión)</li>
        </ul>
        
        <h4>🔗 Información de la Función:</h4>
        <ul>
          <li><strong>Nombre:</strong> <code>analizarDatasetAutomatico</code></li>
          <li><strong>RID:</strong> <code>ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510</code></li>
          <li><strong>Versión:</strong> 0.2.5</li>
          <li><strong>SDK Package:</strong> <code>@app-anlisis-pii-psi/sdk@0.3.0</code></li>
          <li><strong>Ontology RID:</strong> <code>ri.ontology.main.ontology.122b5e19-6632-4dd9-acb1-4a41f4571048</code></li>
        </ul>
        
        <h4>📊 ¿Qué analiza?</h4>
        <p>La función Python analiza cada columna del dataset y detecta:</p>
        <ul>
          <li>🔴 <strong>CRÍTICO:</strong> DNI, SSN, salarios, datos de salud</li>
          <li>🟠 <strong>ALTO:</strong> Nombres, emails, teléfonos, direcciones</li>
          <li>🟡 <strong>MEDIO:</strong> Edad, género, ciudad, fecha de nacimiento</li>
          <li>🟢 <strong>BAJO:</strong> IDs técnicos, códigos</li>
        </ul>
        
        <p>Además clasifica por categoría (PII_DIRECTO, PII_INDIRECTO, PSI) y sugiere técnicas de protección según normativas (GDPR, LOPD, HIPAA).</p>
      </div>
    </div>
  );
}
