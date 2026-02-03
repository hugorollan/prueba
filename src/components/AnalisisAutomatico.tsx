import { useState } from 'react';
import type { AnalisisAutomaticoResult } from '../types';
import { auth } from '../client';

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

  const getAuthToken = async (): Promise<string | null> => {
    try {
      addDebugInfo('🔑 Obteniendo token de autenticación...');
      const token = await auth.getTokenOrUndefined();
      if (token) {
        addDebugInfo('✅ Token obtenido correctamente');
        return token;
      } else {
        addDebugInfo('❌ No se pudo obtener token');
        return null;
      }
    } catch (err) {
      addDebugInfo(`❌ Error al obtener token: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  const tryWithFoundrySDK = async (datasetRid: string): Promise<AnalisisAutomaticoResult | null> => {
    addDebugInfo('🔄 Método SDK: Usando Foundry SDK Client');
    
    try {
      const token = await getAuthToken();
      if (!token) {
        addDebugInfo('❌ Sin token de autenticación');
        return null;
      }

      const functionRid = 'ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510';
      const foundryUrl = document.querySelector('meta[name="osdk-foundryUrl"]')?.getAttribute('content') || window.location.origin;
      
      // CORRECCIÓN APLICADA: Añadido ?preview=true al final
      const apiUrl = `${foundryUrl}/api/v2/functions/${functionRid}/execute?preview=true`;
      
      addDebugInfo(`📍 URL: ${apiUrl}`);
      addDebugInfo(`📦 Parámetros: { dataset_rid: "${datasetRid}" }`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          parameters: {
            dataset_rid: datasetRid
          }
        }),
      });

      addDebugInfo(`📡 Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const resultText = await response.text();
        addDebugInfo(`📄 Response: ${resultText.substring(0, 200)}...`);
        
        // La función Python devuelve un JSON string, necesitamos parsearlo dos veces
        const result = JSON.parse(resultText);
        addDebugInfo('✅ Método SDK: Exitoso!');
        return result;
      } else {
        const errorText = await response.text();
        addDebugInfo(`❌ Método SDK: Falló - ${errorText.substring(0, 200)}`);
        return null;
      }
    } catch (err) {
      addDebugInfo(`❌ Método SDK: Error - ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  const tryDirectWithCredentials = async (datasetRid: string): Promise<AnalisisAutomaticoResult | null> => {
    addDebugInfo('🔄 Método Directo: Usando credentials directas');
    
    try {
      const functionRid = 'ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510';
      // CORRECCIÓN APLICADA: También aquí por si acaso se usa el fallback
      const apiUrl = `${window.location.origin}/api/v2/functions/${functionRid}/execute?preview=true`;
      
      addDebugInfo(`📍 URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          parameters: {
            dataset_rid: datasetRid
          }
        }),
      });

      addDebugInfo(`📡 Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const result = JSON.parse(await response.text());
        addDebugInfo('✅ Método Directo: Exitoso!');
        return result;
      } else {
        addDebugInfo(`❌ Método Directo: Falló`);
        return null;
      }
    } catch (err) {
      addDebugInfo(`❌ Método Directo: Error - ${err instanceof Error ? err.message : String(err)}`);
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
      // Intentar primero con el SDK (más confiable)
      let resultado = await tryWithFoundrySDK(rid);
      
      // Si falla, intentar directo
      if (!resultado) {
        resultado = await tryDirectWithCredentials(rid);
      }

      if (resultado && resultado.success) {
        addDebugInfo('✅ ¡Análisis completado exitosamente!');
        onResultado(resultado);
        setError(null);
      } else if (resultado && !resultado.success) {
        setError(`❌ Error en el análisis: ${resultado.error || 'Error desconocido'}`);
        addDebugInfo(`❌ La función retornó error: ${resultado.error}`);
      } else {
        // Ambos métodos fallaron
        addDebugInfo('⚠️ Todos los métodos fallaron.');
        addDebugInfo('💡 Posibles causas:');
        addDebugInfo('   1. La función no tiene permisos para esta aplicación');
        addDebugInfo('   2. La función está en una Ontología diferente');
        addDebugInfo('   3. El dataset no es accesible');
        
        setError(
          '⚠️ No se pudo ejecutar la función Python.\n\n' +
          'Causas posibles:\n' +
          '1. La función no tiene permisos de ejecución para esta aplicación\n' +
          '2. La función está en una Ontología diferente a la aplicación\n' +
          '3. El dataset no existe o no tienes acceso\n\n' +
          'SOLUCIÓN TEMPORAL: Mostrando datos de ejemplo.'
        );

        // Usar datos de ejemplo
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
        <strong>🔧 Versión con Autenticación OSDK</strong><br />
        Esta versión usa el cliente OSDK para autenticarse correctamente.<br />
        <strong>Función:</strong> <code>analizarDatasetAutomatico</code> (v0.2.1)
      </div>

      <div className="alert alert-info">
        <strong>📋 Instrucciones:</strong><br />
        1. Ingresa el RID del dataset que deseas analizar<br />
        2. Click en &ldquo;🚀 ANALIZAR DATASET&rdquo;<br />
        3. Observa el Debug Log para ver el proceso<br />
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
          Ejemplo: ri.foundry.main.dataset.4c3ab260-b974-4ae7-9682-25b6456b0db3
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
          <p>⚙️ Conectando con la función Python...</p>
        </div>
      )}

      {debugInfo.length > 0 && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          border: '1px solid #dee2e6',
          maxHeight: '400px',
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

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
        <h3 style={{ marginTop: 0 }}>⚠️ Diagnóstico de Error 404</h3>
        <p><strong>El error 404 en todos los métodos indica:</strong></p>
        <ul>
          <li>❌ La función NO está accesible desde esta aplicación</li>
          <li>❌ Probablemente están en Ontologías diferentes</li>
        </ul>
        
        <h4>🔧 Soluciones Posibles:</h4>
        <ol>
          <li>
            <strong>Verificar la Ontología:</strong>
            <ul>
              <li>Ve a Ontology Manager</li>
              <li>Busca la función: <code>analizarDatasetAutomatico</code></li>
              <li>Verifica en qué Ontología está</li>
              <li>Compara con la Ontología de esta aplicación</li>
            </ul>
          </li>
          <li>
            <strong>Añadir Permisos:</strong>
            <ul>
              <li>En Ontology Manager, abre la función</li>
              <li>Ve a &ldquo;Permissions&rdquo; o &ldquo;Roles&rdquo;</li>
              <li>Añade permiso de &ldquo;Execute&rdquo; para esta aplicación</li>
            </ul>
          </li>
          <li>
            <strong>Mover la función:</strong>
            <ul>
              <li>Republica la función en la misma Ontología que la aplicación</li>
              <li>O usa una Ontología compartida</li>
            </ul>
          </li>
        </ol>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h4>🔗 Información Técnica:</h4>
        <ul style={{ fontSize: '0.9em' }}>
          <li><strong>Función RID:</strong> <code style={{fontSize: '0.85em'}}>ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510</code></li>
          <li><strong>Versión:</strong> 0.2.1</li>
          <li><strong>API name:</strong> <code>analizarDatasetAutomatico</code></li>
          <li><strong>Aplicación RID:</strong> <code style={{fontSize: '0.85em'}}>ri.third-party-applications.main.application.19cd33c0-5e30-41f8-9c44-69e372825c4b</code></li>
        </ul>
      </div>
    </div>
  );
}