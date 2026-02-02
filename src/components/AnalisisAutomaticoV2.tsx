import { useState } from 'react';
import type { AnalisisAutomaticoResult } from '../types';

interface Props {
  onResultado: (resultado: AnalisisAutomaticoResult) => void;
}

export function AnalisisAutomatico({ onResultado }: Props) {
  const [rid, setRid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, message]);
  };

  const tryMethod1_OntologyQueries = async (datasetRid: string): Promise<AnalisisAutomaticoResult | null> => {
    addDebugInfo('🔄 Método 1: Intentando /api/v2/ontologies/queries/...');
    
    try {
      const apiUrl = `${window.location.origin}/api/v2/ontologies/queries/analizarDatasetAutomatico/execute`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ parameters: { datasetRid } }),
      });

      addDebugInfo(`📡 Status: ${response.status}`);

      if (response.ok) {
        const result = JSON.parse(await response.text());
        addDebugInfo('✅ Método 1: Exitoso!');
        return result;
      } else {
        addDebugInfo(`❌ Método 1: Falló - ${response.statusText}`);
        return null;
      }
    } catch (err) {
      addDebugInfo(`❌ Método 1: Error - ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  const tryMethod2_FunctionsRuntime = async (datasetRid: string): Promise<AnalisisAutomaticoResult | null> => {
    addDebugInfo('🔄 Método 2: Intentando /functions-runtime/api/...');
    
    try {
      const functionRid = 'ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510';
      const apiUrl = `${window.location.origin}/functions-runtime/api/v1/functions/${functionRid}/execute`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          parameters: { dataset_rid: datasetRid },
          timeout: 120000 
        }),
      });

      addDebugInfo(`📡 Status: ${response.status}`);

      if (response.ok) {
        const result = JSON.parse(await response.text());
        addDebugInfo('✅ Método 2: Exitoso!');
        return result;
      } else {
        addDebugInfo(`❌ Método 2: Falló - ${response.statusText}`);
        return null;
      }
    } catch (err) {
      addDebugInfo(`❌ Método 2: Error - ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  const tryMethod3_DirectAPI = async (datasetRid: string): Promise<AnalisisAutomaticoResult | null> => {
    addDebugInfo('🔄 Método 3: Intentando /api/v1/functions/...');
    
    try {
      const functionRid = 'ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510';
      const apiUrl = `${window.location.origin}/api/v1/functions/${functionRid}/execute`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          parameters: { dataset_rid: datasetRid }
        }),
      });

      addDebugInfo(`📡 Status: ${response.status}`);

      if (response.ok) {
        const result = JSON.parse(await response.text());
        addDebugInfo('✅ Método 3: Exitoso!');
        return result;
      } else {
        addDebugInfo(`❌ Método 3: Falló - ${response.statusText}`);
        return null;
      }
    } catch (err) {
      addDebugInfo(`❌ Método 3: Error - ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
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

    try {
      // Intentar los 3 métodos en orden
      let resultado = await tryMethod1_OntologyQueries(rid);
      
      if (!resultado) {
        resultado = await tryMethod2_FunctionsRuntime(rid);
      }
      
      if (!resultado) {
        resultado = await tryMethod3_DirectAPI(rid);
      }

      if (resultado && resultado.success) {
        addDebugInfo('✅ ¡Análisis completado exitosamente!');
        onResultado(resultado);
        setError(null);
      } else if (resultado && !resultado.success) {
        setError(`❌ Error en el análisis: ${resultado.error || 'Error desconocido'}`);
      } else {
        // Todos los métodos fallaron - usar fallback
        addDebugInfo('⚠️ Todos los métodos fallaron. Usando datos de ejemplo...');
        
        setError(
          '⚠️ No se pudo conectar con la función Python. Posibles causas:\n' +
          '1. La función no tiene permisos de ejecución para esta aplicación\n' +
          '2. La función está en una Ontología diferente\n' +
          '3. Hay un problema de red o autenticación\n\n' +
          'Mostrando datos de ejemplo mientras tanto.'
        );

        const mockResult: AnalisisAutomaticoResult = {
          dataset_rid: rid,
          total_columns: 8,
          total_rows: 1000,
          success: true,
          columns: [
            {
              name: 'dni',
              type: 'string',
              risk: 'CRITICO',
              emoji: '🔴',
              category: 'PII_DIRECTO',
              techniques: ['T1', 'T2', 'T5'],
              regulations: ['GDPR Art.9', 'LOPD']
            },
            {
              name: 'nombre_completo',
              type: 'string',
              risk: 'ALTO',
              emoji: '🟠',
              category: 'PII_DIRECTO',
              techniques: ['T2', 'T3', 'T7'],
              regulations: ['GDPR Art.4', 'LOPD']
            },
            {
              name: 'email',
              type: 'string',
              risk: 'ALTO',
              emoji: '🟠',
              category: 'PII_DIRECTO',
              techniques: ['T2', 'T5', 'T7'],
              regulations: ['GDPR Art.4', 'LOPD']
            },
            {
              name: 'telefono',
              type: 'string',
              risk: 'ALTO',
              emoji: '🟠',
              category: 'PII_DIRECTO',
              techniques: ['T5', 'T7'],
              regulations: ['GDPR Art.4', 'LOPD']
            },
            {
              name: 'fecha_nacimiento',
              type: 'date',
              risk: 'MEDIO',
              emoji: '🟡',
              category: 'PII_INDIRECTO',
              techniques: ['T3', 'T4'],
              regulations: ['GDPR Art.4']
            },
            {
              name: 'ciudad',
              type: 'string',
              risk: 'MEDIO',
              emoji: '🟡',
              category: 'PII_INDIRECTO',
              techniques: ['T3', 'T4'],
              regulations: ['GDPR Art.4']
            },
            {
              name: 'salario',
              type: 'double',
              risk: 'CRITICO',
              emoji: '🔴',
              category: 'PSI',
              techniques: ['T3', 'T5', 'T8'],
              regulations: ['GDPR Art.9', 'LOPD']
            },
            {
              name: 'id_empleado',
              type: 'integer',
              risk: 'BAJO',
              emoji: '🟢',
              category: 'TECNICO',
              techniques: [],
              regulations: []
            }
          ]
        };
        
        onResultado(mockResult);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      addDebugInfo(`❌ Error general: ${errorMessage}`);
      setError(`❌ Error inesperado: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">🤖 Análisis Automático de Dataset</h2>
      
      <div className="alert alert-info" style={{ marginBottom: '1rem', backgroundColor: '#d1ecf1', borderColor: '#bee5eb', color: '#0c5460' }}>
        <strong>🔧 Versión Multi-Método (Recomendada)</strong><br />
        Esta versión intenta conectar con la función Python usando 3 métodos diferentes automáticamente.<br />
        <strong>Función:</strong> <code>analizarDatasetAutomatico</code> (v0.2.6 - Serverless) - con SDK v0.5.0
      </div>

      <div className="alert alert-info">
        <strong>📋 Instrucciones:</strong><br />
        1. Ingresa el RID del dataset que deseas analizar<br />
        2. Click en &ldquo;🚀 ANALIZAR DATASET&rdquo;<br />
        3. El sistema intentará conectarse automáticamente<br />
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
          <p>⚙️ Intentando conectar con la función Python...</p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            Probando múltiples métodos de conexión...
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
        <h3 style={{ marginTop: 0 }}>ℹ️ Acerca de esta versión</h3>
        
        <h4>🔄 Métodos de Conexión:</h4>
        <ol>
          <li><strong>Método 1:</strong> API de Ontology Queries (<code>/api/v2/ontologies/queries/</code>)</li>
          <li><strong>Método 2:</strong> Functions Runtime API (<code>/functions-runtime/api/v1/</code>)</li>
          <li><strong>Método 3:</strong> Direct Functions API (<code>/api/v1/functions/</code>)</li>
        </ol>
        
        <p>Si ningún método funciona, se mostrarán datos de ejemplo para que puedas probar la aplicación.</p>
        
        <h4>🐛 Depuración:</h4>
        <ul>
          <li>Los logs aparecerán arriba en tiempo real</li>
          <li>También puedes abrir la Consola del Navegador (F12) para ver más detalles</li>
          <li>Si todos los métodos fallan, revisa los permisos de la función</li>
        </ul>
        
        <h4>🔗 Información de la Función:</h4>
        <ul>
          <li><strong>RID:</strong> <code>ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510</code></li>
          <li><strong>Versión:</strong> 0.2.6 (Serverless habilitado)</li>
          <li><strong>API name:</strong> <code>analizarDatasetAutomatico</code></li>
          <li><strong>SDK:</strong> v0.5.0 instalado</li>
        </ul>
      </div>
    </div>
  );
}
