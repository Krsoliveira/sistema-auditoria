import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const TEMAS = ['dark', 'light', 'sap'];

  const TEMA_CONFIG = {
    dark:  { label: '☀️ Modo Claro',    proximo: 'light' },
    light: { label: '🔷 SAP Fiori',     proximo: 'sap'   },
    sap:   { label: '🌙 Modo Escuro',   proximo: 'dark'  },
  };

  const [tema, setTema] = useState('dark');

  useEffect(() => {
    const temaSalvo = localStorage.getItem('siai_tema');
    const temaValido = TEMAS.includes(temaSalvo) ? temaSalvo : 'dark';
    setTema(temaValido);
    document.documentElement.setAttribute('data-theme', temaValido);
  }, []);

  const alternarTema = () => {
    const proximo = TEMA_CONFIG[tema].proximo;
    setTema(proximo);
    document.documentElement.setAttribute('data-theme', proximo);
    localStorage.setItem('siai_tema', proximo);
  };

  return (
    <aside style={{ 
      width: '260px', 
      background: 'var(--bg-panel)', // Agora o fundo do menu também respeita o tema!
      borderRight: 'var(--glass-border)', 
      padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.2)' }}>
        <h2 style={{ margin: 0, color: 'var(--neon-primary)', fontSize: '24px', letterSpacing: '1px' }}>SIAI</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Auditoria & Controle</span>
      </div>

      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text-bright)', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(128, 128, 128, 0.1)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        📊 Visão Geral
      </button>
      
      <button 
        onClick={() => navigate('/banco-horas')} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text-bright)', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(128, 128, 128, 0.1)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        ⏱️ Banco de Horas
      </button>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <button
          onClick={alternarTema}
          style={{ width: '100%', background: 'transparent', border: '1px solid var(--neon-primary)', color: 'var(--neon-primary)', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(128, 128, 128, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          title={`Tema atual: ${tema.toUpperCase()} — clique para alternar`}
        >
          {TEMA_CONFIG[tema].label}
        </button>

        <button 
          onClick={() => {
            localStorage.removeItem('usuarioLogado'); 
            navigate('/'); 
          }} 
          style={{ width: '100%', background: 'rgba(255, 68, 68, 0.05)', border: '1px solid rgba(255, 68, 68, 0.3)', color: '#ff4444', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.05)'}
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;