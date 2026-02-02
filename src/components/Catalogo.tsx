export function Catalogo() {
  const perfiles = [
    { id: 'P0', nombre: 'Sin PII/PSI', riesgo: 'BAJO', k: 'N/A' },
    { id: 'P1', nombre: 'PII Indirecto/QI', riesgo: 'BAJO-MEDIO', k: '3' },
    { id: 'P2', nombre: 'PII Directo Único', riesgo: 'MEDIO', k: '3' },
    { id: 'P3', nombre: 'PII Directo + Indirecto', riesgo: 'MEDIO-ALTO', k: '3' },
    { id: 'P4', nombre: 'Múltiples PII + QI', riesgo: 'ALTO', k: '5' },
    { id: 'P5', nombre: 'Datos Especiales GDPR (PSI)', riesgo: 'CRÍTICO', k: '10' },
    { id: 'P6', nombre: 'Transferencia Internacional', riesgo: 'CRÍTICO', k: '10' },
  ];

  return (
    <div className="card">
      <h2 className="card-title">📚 Catálogo de Perfiles</h2>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Perfil</th>
              <th>Nombre</th>
              <th>Nivel de Riesgo</th>
              <th>K-Anonimity</th>
            </tr>
          </thead>
          <tbody>
            {perfiles.map((perfil) => (
              <tr key={perfil.id}>
                <td><strong>{perfil.id}</strong></td>
                <td>{perfil.nombre}</td>
                <td>{perfil.riesgo}</td>
                <td>{perfil.k}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
