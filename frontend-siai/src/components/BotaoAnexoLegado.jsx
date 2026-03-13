import React, { useState, useEffect } from 'react';

const BotaoAnexoLegado = ({ relatorioId }) => {
  const [temAnexo, setTemAnexo] = useState(false);
  const [arrId, setArrId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!relatorioId) return;

    const verificarAnexo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/relatorios/${relatorioId}/anexo-legado-info`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
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

  if (loading || !temAnexo) {
    return null; 
  }

  return (
    <button 
      onClick={handleAbrirPdf}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--neon-primary)',
        color: '#000',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(0, 135, 95, 0.4)',
        transition: 'transform 0.2s ease, filter 0.2s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
      title="Abrir anexo do relatório"
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
      </svg>
      Anexo
    </button>
  );
};

export default BotaoAnexoLegado;