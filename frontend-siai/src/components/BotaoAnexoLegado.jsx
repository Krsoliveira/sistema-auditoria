import React, { useState, useEffect } from 'react';

const BotaoAnexoLegado = ({ relatorioId }) => {
  const [temAnexo, setTemAnexo] = useState(false);
  const [arrId, setArrId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!relatorioId) return;

    const verificarAnexo = async () => {
      const token = localStorage.getItem('siai_token');
      try {
        const response = await fetch(`http://localhost:8080/api/relatorios/${relatorioId}/anexo-legado-info`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.temArquivo) {
            setTemAnexo(true);
            setArrId(data.arrId);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar anexo:", error);
      } finally {
        setLoading(false);
      }
    };

    verificarAnexo();
  }, [relatorioId]);

  const handleAbrirPdf = () => {
    if (arrId) {
      window.open(`http://localhost:8080/api/relatorios/legado/${arrId}/pdf`, '_blank');
    }
  };

  if (loading || !temAnexo) return null;

  return (
    <section
      style={{
        background: 'var(--bg-panel)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 135, 95, 0.35)',
        boxShadow: '0 0 20px rgba(0, 135, 95, 0.06)',
        marginBottom: '20px',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Ícone */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        background: 'rgba(0, 135, 95, 0.12)', border: '1px solid rgba(0, 135, 95, 0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <svg width="22" height="22" fill="none" stroke="var(--neon-primary)" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </div>

      {/* Texto */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.6px' }}>
          Anexo do Relatório
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-bright)', marginTop: '2px' }}>
          Documento original disponível para visualização
        </div>
      </div>

      {/* Botão */}
      <button
        onClick={handleAbrirPdf}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: 'rgba(0, 135, 95, 0.12)', border: '1px solid var(--neon-primary)',
          color: 'var(--neon-primary)', padding: '8px 18px', borderRadius: '8px',
          cursor: 'pointer', fontWeight: '700', fontSize: '13px',
          transition: 'background 0.2s', whiteSpace: 'nowrap', flexShrink: 0
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(0, 135, 95, 0.22)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(0, 135, 95, 0.12)'}
        title="Abrir anexo do relatório"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Abrir documento
      </button>
    </section>
  );
};

export default BotaoAnexoLegado;
