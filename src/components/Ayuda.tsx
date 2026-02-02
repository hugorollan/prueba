export function Ayuda() {
  return (
    <div className="card">
      <h2 className="card-title">💡 Ayuda y Preguntas Frecuentes</h2>

      <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3>❓ ¿Cómo funciona el análisis automático?</h3>
          <p>El análisis automático examina el schema del dataset (nombres y tipos de columnas) y detecta automáticamente patrones que indican datos sensibles PII/PSI.</p>
        </div>

        <div>
          <h3>❓ ¿Cuándo usar análisis manual vs automático?</h3>
          <p><strong>Análisis Automático:</strong> Rápido, ideal para primera evaluación<br />
          <strong>Análisis Manual:</strong> Más preciso, recomendado para decisiones finales</p>
        </div>

        <div>
          <h3>❓ ¿Qué es K-Anonimity?</h3>
          <p>Es una técnica que garantiza que cada combinación de atributos aparezca al menos k veces en el dataset, dificultando la re-identificación individual.</p>
        </div>

        <div>
          <h3>❓ ¿Qué diferencia hay entre PII y PSI?</h3>
          <p><strong>PII (Personal Identifiable Information):</strong> Cualquier dato que pueda identificar a una persona<br />
          <strong>PSI (Personal Sensitive Information):</strong> Datos especialmente sensibles protegidos por GDPR Art. 9</p>
        </div>

        <div>
          <h3>❓ ¿Necesito aprobación del DPO?</h3>
          <p>Sí, para perfiles P4, P5 y P6. También se requiere DPIA (Data Protection Impact Assessment) para PSI.</p>
        </div>

        <div>
          <h3>📞 Contacto</h3>
          <p>Para soporte adicional, contacta a:<br />
          • Data Governance Team<br />
          • Data Protection Officer (DPO)<br />
          • Seguridad de la Información</p>
        </div>
      </div>
    </div>
  );
}
