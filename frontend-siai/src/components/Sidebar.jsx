import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  
  // 🔴 1. Estado para controlar qual é o tema atual
  const [isLightMode, setIsLightMode] = useState(false);

  // 🔴 2. Ao abrir o sistema, ele lê a memória para saber qual tema o usuário prefere
  useEffect(() => {
    const temaSalvo = localStorage.getItem('siai_tema');
    if (temaSalvo === 'light') {
      setIsLightMode(true);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // 🔴 3. A função que vira a chave (Interruptor)
  const toggleTema = () => {
    if (isLightMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('siai_tema', 'dark');
      setIsLightMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('siai_tema', 'light');
      setIsLightMode(true);
    }
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
        
        {/* 🔴 O BOTÃO MÁGICO DO TEMA */}
        <button 
          onClick={toggleTema} 
          style={{ width: '100%', background: 'transparent', border: '1px solid var(--neon-primary)', color: 'var(--neon-primary)', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(128, 128, 128, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {isLightMode ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
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