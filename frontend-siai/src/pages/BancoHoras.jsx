import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // 🔴 IMPORTAÇÃO DO MENU AQUI!
import '../Dashboard.css';

const BancoHoras = () => {
  const tokenJWT = localStorage.getItem('siai_token');
  const [resumoGeral, setResumoGeral] = useState([]);
  const [extrato, setExtrato] = useState([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState(null);
  const [loadingResumo, setLoadingResumo] = useState(true);
  const [loadingExtrato, setLoadingExtrato] = useState(false);

  // Converte os Minutos do Java de volta para HH:MM
  const formatarMinutosParaHoras = (totalMinutos) => {
    if (!totalMinutos) return "00:00";
    const ehNegativo = totalMinutos < 0;
    const minutosAbsolutos = Math.abs(totalMinutos);
    const horas = Math.floor(minutosAbsolutos / 60);
    const minutos = minutosAbsolutos % 60;
    
    const horasFormatadas = String(horas).padStart(2, '0');
    const minutosFormatados = String(minutos).padStart(2, '0');
    
    return `${ehNegativo ? '-' : ''}${horasFormatadas}:${minutosFormatados}`;
  };

  useEffect(() => {
    const buscarResumo = async () => {
      try {
        setLoadingResumo(true);
        const res = await fetch('http://localhost:8080/api/bancohoras/resumo', {
          headers: { 'Authorization': `Bearer ${tokenJWT}` }
        });
        if (res.ok) {
          const data = await res.json();
          setResumoGeral(data);
        }
      } catch (error) {
        console.error("Erro ao carregar o resumo do banco de horas:", error);
      } finally {
        setLoadingResumo(false);
      }
    };
    buscarResumo();
  }, []);

  const selecionarColaborador = async (colab) => {
    setColaboradorSelecionado(colab);
    try {
      setLoadingExtrato(true);
      const res = await fetch(`http://localhost:8080/api/bancohoras/extrato/${colab.colaboradorId}`, {
        headers: { 'Authorization': `Bearer ${tokenJWT}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExtrato(data);
      } else {
        setExtrato([]);
      }
    } catch (error) {
      console.error("Erro ao carregar extrato:", error);
    } finally {
      setLoadingExtrato(false);
    }
  };

  const gridResumoTemplate = "2fr 1.5fr 1fr 1fr 1fr";
  const gridExtratoTemplate = "100px 100px 100px 3fr";

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* 🔴 A MÁGICA AQUI: Usando o carimbo do Menu Lateral */}
      <Sidebar />

      <main className="main-content" style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        
        {/* CABEÇALHO DA TELA */}
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: 'var(--text-bright)', fontSize: '24px' }}>⏱️ Gestão de Banco de Horas</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Acompanhamento de créditos (Horas Extras) e débitos (Compensações)</p>
        </header>

        {/* BLOCO SUPERIOR: RESUMO GERAL */}
        <section style={{ background: 'var(--bg-panel)', borderRadius: '16px', border: 'var(--glass-border)', marginBottom: '30px', overflow: 'hidden' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: 0, color: 'var(--neon-primary)' }}>Saldo Consolidado por Colaborador</h3>
            <span style={{ fontSize: '12px', color: '#888' }}>Clique num colaborador para ver o extrato detalhado.</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: gridResumoTemplate, gap: '10px', padding: '12px 20px', backgroundColor: '#050a14', borderBottom: '2px solid var(--neon-primary)', color: 'var(--neon-primary)', fontWeight: 'bold', fontSize: '13px' }}>
              <div>COLABORADOR</div><div>CARGO</div><div>HORAS EXTRAS (+)</div><div>COMPENSAÇÕES (-)</div><div>SALDO FINAL</div>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {loadingResumo ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neon-primary)' }}>Calculando saldos...</div>
              ) : resumoGeral.length > 0 ? (
                resumoGeral.map((colab, index) => {
                  const isSelecionado = colaboradorSelecionado?.colaboradorId === colab.colaboradorId;
                  const saldoNegativo = colab.saldoMinutos < 0;

                  return (
                    <div key={index} 
                      onClick={() => selecionarColaborador(colab)}
                      style={{ 
                        display: 'grid', gridTemplateColumns: gridResumoTemplate, gap: '10px', padding: '12px 20px', cursor: 'pointer', alignItems: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        backgroundColor: isSelecionado ? 'rgba(0, 242, 255, 0.15)' : 'transparent',
                        borderLeft: isSelecionado ? '4px solid var(--neon-primary)' : '4px solid transparent',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{ color: 'var(--text-bright)', fontWeight: 'bold' }}>{colab.nome}</div>
                      <div style={{ color: '#aaa', fontSize: '13px' }}>{colab.cargo || 'Não Informado'}</div>
                      <div style={{ color: '#00ff88', fontWeight: 'bold' }}>{formatarMinutosParaHoras(colab.horasExtrasMinutos)}</div>
                      <div style={{ color: '#ff4444', fontWeight: 'bold' }}>{formatarMinutosParaHoras(colab.compensacoesMinutos)}</div>
                      <div style={{ 
                        color: saldoNegativo ? '#ff4444' : '#00ff88', 
                        fontWeight: 'bold', 
                        fontSize: '16px',
                        background: saldoNegativo ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0, 255, 136, 0.1)',
                        padding: '4px 8px', borderRadius: '4px', textAlign: 'center'
                      }}>
                        {formatarMinutosParaHoras(colab.saldoMinutos)}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Nenhum registo de banco de horas encontrado.</div>
              )}
            </div>
          </div>
        </section>

        {/* BLOCO INFERIOR: O EXTRATO DETALHADO */}
        {colaboradorSelecionado && (
          <section style={{ background: '#0a0f1a', borderRadius: '16px', border: '1px dashed rgba(0, 242, 255, 0.3)', overflow: 'hidden' }}>
            <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(0, 242, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-bright)' }}>Extrato Detalhado</h3>
                <span style={{ fontSize: '13px', color: 'var(--neon-primary)' }}>{colaboradorSelecionado.nome}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: gridExtratoTemplate, gap: '10px', padding: '12px 20px', backgroundColor: '#050a14', borderBottom: '1px solid #333', color: '#888', fontWeight: 'bold', fontSize: '12px' }}>
                <div>DATA</div><div>TIPO</div><div>QUANTIDADE</div><div>OBSERVAÇÃO / MOTIVO</div>
              </div>

              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {loadingExtrato ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neon-primary)' }}>A carregar histórico...</div>
                ) : extrato.length > 0 ? (
                  extrato.map((linha, index) => {
                    const isCredito = linha.tipo === 'CREDITO';
                    return (
                      <div key={index} style={{ display: 'grid', gridTemplateColumns: gridExtratoTemplate, gap: '10px', padding: '12px 20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <div style={{ color: '#ccc' }}>{linha.dataFormatada}</div>
                        <div>
                          <span style={{ 
                            background: isCredito ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)', 
                            color: isCredito ? '#00ff88' : '#ff4444', 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' 
                          }}>
                            {isCredito ? 'EXTRA (+)' : 'COMPENS. (-)'}
                          </span>
                        </div>
                        <div style={{ color: 'var(--text-bright)', fontWeight: 'bold' }}>{linha.quantidade}</div>
                        <div style={{ color: '#999', fontSize: '13px', fontStyle: 'italic' }}>{linha.observacao || 'Sem observação'}</div>
                      </div>
                    )
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Nenhum detalhe encontrado para este colaborador.</div>
                )}
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default BancoHoras;