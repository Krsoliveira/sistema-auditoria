import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside style={{ 
      width: '260px', background: '#0a0f1a', borderRight: '1px solid rgba(0, 242, 255, 0.1)', 
      padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ margin: 0, color: 'var(--neon-primary)', fontSize: '24px', letterSpacing: '1px' }}>SIAI</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Auditoria & Controle</span>
      </div>

      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ background: 'transparent', border: 'none', color: '#ccc', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 242, 255, 0.05)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        📊 Visão Geral
      </button>
      
      <button 
        onClick={() => navigate('/banco-horas')} 
        style={{ background: 'transparent', border: 'none', color: '#ccc', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 242, 255, 0.05)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        ⏱️ Banco de Horas
      </button>

      <div style={{ marginTop: 'auto' }}>
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