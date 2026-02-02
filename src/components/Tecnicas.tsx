export function Tecnicas() {
  const tecnicas = [
    { id: 'T1', nombre: 'Supresión', descripcion: 'Eliminar completamente el dato', ejemplo: 'Juan Pérez → [SUPRIMIDO]' },
    { id: 'T2', nombre: 'Hash/Pseudoanonimización', descripcion: 'Transformar a código irreversible', ejemplo: 'juan@email.com → a3f5d8e...' },
    { id: 'T3', nombre: 'Generalización', descripcion: 'Reducir precisión', ejemplo: '28 años → 25-30 años' },
    { id: 'T4', nombre: 'Agregación', descripcion: 'Agrupar datos', ejemplo: 'Salarios individuales → Promedio' },
    { id: 'T5', nombre: 'Enmascaramiento', descripcion: 'Ocultar parcialmente', ejemplo: '123456789 → ***456789' },
    { id: 'T7', nombre: 'Tokenización', descripcion: 'Sustituir por token reversible', ejemplo: 'Tarjeta → TOKEN_ABC' },
    { id: 'T8', nombre: 'Differential Privacy', descripcion: 'Añadir ruido estadístico', ejemplo: 'Edad 28 → 28 ± ruido' },
    { id: 'T9', nombre: 'K-Anonimity', descripcion: 'Garantizar k registros idénticos', ejemplo: 'Cada combinación aparece ≥k veces' },
  ];

  return (
    <div className="card">
      <h2 className="card-title">🛡️ Técnicas de Protección</h2>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {tecnicas.map((tecnica) => (
          <div key={tecnica.id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1rem',
            background: 'white'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{tecnica.id}: {tecnica.nombre}</h3>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>{tecnica.descripcion}</p>
            <div style={{ padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px', fontFamily: 'monospace' }}>
              {tecnica.ejemplo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
