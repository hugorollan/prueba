export function Recetas() {
  const recetas = [
    {
      id: 'P0',
      nombre: 'Sin PII/PSI',
      riesgo: 'BAJO',
      k: 'N/A',
      pasos: [
        'Verificar que no hay PII oculto',
        'Documentar el dataset',
        'Aplicar acceso estándar',
        'No requiere técnicas especiales'
      ]
    },
    {
      id: 'P1',
      nombre: 'PII Indirecto/QI',
      riesgo: 'BAJO-MEDIO',
      k: '3',
      pasos: [
        'Generalización de QI (edad → rangos)',
        'Verificar K-anonimity k≥3',
        'Test de unicidad',
        'Documentar transformaciones'
      ]
    },
    {
      id: 'P2',
      nombre: 'PII Directo Único',
      riesgo: 'MEDIO',
      k: '3',
      pasos: [
        'Hash/Pseudoanonimización del PII',
        'Generalización de QI',
        'K-anonimity k≥3',
        'Control de acceso + audit log'
      ]
    },
    {
      id: 'P3',
      nombre: 'PII Directo + Indirecto',
      riesgo: 'MEDIO-ALTO',
      k: '3',
      pasos: [
        'Hash PII directo',
        'Generalización QI',
        'K-anonimity k≥3',
        'Test de re-identificación'
      ]
    },
    {
      id: 'P4',
      nombre: 'Múltiples PII + QI',
      riesgo: 'ALTO',
      k: '5',
      pasos: [
        'Hash/Supresión de PII múltiples',
        'Generalización agresiva de QI',
        'K-anonimity k≥5',
        'DPIA + Aprobación DPO'
      ]
    },
    {
      id: 'P5',
      nombre: 'Datos Especiales GDPR (PSI)',
      riesgo: 'CRÍTICO',
      k: '10',
      pasos: [
        'Anonimización completa (NO pseudoanonimización)',
        'K-anonimity k≥10',
        'DPIA obligatoria',
        'Aprobación DPO + Seguridad'
      ]
    },
    {
      id: 'P6',
      nombre: 'Transferencia Internacional',
      riesgo: 'CRÍTICO',
      k: '10',
      pasos: [
        'Anonimización IRREVERSIBLE',
        'NO guardar mapping',
        'SCC (Standard Contractual Clauses)',
        'DPIA + DPO + Legal'
      ]
    }
  ];

  return (
    <div className="card">
      <h2 className="card-title">📋 Recetas de Protección por Perfil</h2>

      <div className="alert alert-info">
        <strong>ℹ️ Sobre las recetas:</strong> Cada perfil tiene una receta específica con 4 pasos
        para proteger tus datos según su nivel de sensibilidad.
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
        {recetas.map((receta) => (
          <div key={receta.id} style={{
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1.5rem',
            background: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{receta.id}: {receta.nombre}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9em' }}>
                  <span><strong>Riesgo:</strong> {receta.riesgo}</span>
                  <span><strong>K-Anonimity:</strong> {receta.k}</span>
                </div>
              </div>
            </div>

            <h4>📝 Pasos a seguir:</h4>
            <ol style={{ margin: '0.5rem 0 0 1.5rem' }}>
              {receta.pasos.map((paso, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>{paso}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
