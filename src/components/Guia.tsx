export function Guia() {
  return (
    <div className="card">
      <h2 className="card-title">📖 Guía de Clasificación PII/PSI</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>🔴 PII Directo</h3>
        <p>Información que identifica directamente a una persona:</p>
        <ul>
          <li>Nombre completo</li>
          <li>DNI, NIE, Pasaporte</li>
          <li>Email, teléfono</li>
          <li>Dirección postal</li>
          <li>Datos bancarios</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>🟡 PII Indirecto (Quasi-Identifiers)</h3>
        <p>Información que combinada puede identificar a una persona:</p>
        <ul>
          <li>Fecha de nacimiento, edad</li>
          <li>Género</li>
          <li>Código postal, ciudad</li>
          <li>Profesión</li>
          <li>Nivel educativo</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>🚨 PSI (Datos Especiales GDPR Art. 9)</h3>
        <p>Datos sensibles que requieren protección especial:</p>
        <ul>
          <li>Salud</li>
          <li>Origen racial o étnico</li>
          <li>Orientación sexual</li>
          <li>Creencias religiosas</li>
          <li>Afiliación sindical</li>
          <li>Datos genéticos</li>
          <li>Antecedentes penales</li>
          <li>Datos de menores</li>
        </ul>
      </div>
    </div>
  );
}
