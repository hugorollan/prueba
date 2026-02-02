import React from "react";
import { Link } from "react-router-dom";
// import { useOsdkClient } from "@osdk/react";
import css from "./Home.module.css";
import Header from "./components/Header";
import NextSteps from "./components/NextSteps";
import Osdk from "./components/Osdk";

function Home(): React.ReactElement {
  // See Ontology and Platform SDK docs in Developer Console on how to
  // use the client object to access Ontology resources and platform APIs
  // const client = useOsdkClient();

  return (
    <div className={css.home}>
      <Header />
      
      {/* Link to Dashboard */}
      <div style={{ 
        textAlign: 'center', 
        margin: '40px 0',
        padding: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px'
      }}>
        <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '24px' }}>
          Dashboard de Aparcamientos Valencia
        </h2>
        <Link 
          to="/dashboard"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          🅿️ Ver Dashboard de Métricas
        </Link>
      </div>

      <Osdk />
      <NextSteps />
    </div>
  );
}

export default Home;
