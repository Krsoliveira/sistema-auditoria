import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import BotaoAnexoLegado from '../components/BotaoAnexoLegado'; // <-- Importação do Botão
import '../Dashboard.css';

const DetalhesAuditoria = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [atividades, setAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('detalhes'); 
  const [anotacoes, setAnotacoes] = useState([]);
  const [loadingAnotacoes, setLoadingAnotacoes] = useState(false);

  const [cabecalho, setCabecalho] = useState({ 
    relatorio: '-', numero: '-', gestor: '-', situacao: '-', grupo: '-',
    cabecalho1: '', cabecalho2: '', cabecalho3: '', sugestao: ''
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        try {
          const resAtividades = await fetch(`http://localhost:8080/api/relatorio-atividade/detalhes/${id}`);
          if (resAtividades.ok) {
            const dataAtividades = await resAtividades.json();
            const dadosOrdenados = dataAtividades.sort((a, b) => {
              const itemA = Number(a.item);
              const itemB = Number(b.item);
              if (itemA === 0 && itemB !== 0) return 1;
              if (itemA !== 0 && itemB === 0) return -1;
              return itemA - itemB;
            });
            setAtividades(dadosOrdenados);
          }
        } catch (erroAtividades) {
          console.error("Falha ao buscar atividades:", erroAtividades);
        }

        try {
          const resCabecalho = await fetch(`http://localhost:8080/api/relatorios/cabecalho/${id}`);
          if (resCabecalho.ok) {
            const text = await resCabecalho.text();
            if (text) {
              const dataCabecalho = JSON.parse(text);
              setCabecalho({
                relatorio: dataCabecalho.relatorio || 'N/A',
                numero: dataCabecalho.numero || 'N/A',
                gestor: dataCabecalho.gestor || 'N/A',
                situacao: dataCabecalho.situacao || 'N/A',
                grupo: dataCabecalho.grupo || 'Geral',
                cabecalho1: dataCabecalho.cabecalho1 || '',
                cabecalho2: dataCabecalho.cabecalho2 || '',
                cabecalho3: dataCabecalho.cabecalho3 || '',
                sugestao: dataCabecalho.sugestao || ''
              });
            }
          }
        } catch (erroCabecalho) {
          console.error("Falha ao buscar cabeçalho:", erroCabecalho);
        }

      } finally {
        setLoading(false);
      }
    };
    if (id) carregarDados();
  }, [id]);

  const abrirModalDeAtividade = async (atv) => {
    setAtividadeSelecionada(atv);
    setIsModalOpen(true);
    setActiveTab('detalhes'); 
    
    if (atv.reaId) {
      try {
        setLoadingAnotacoes(true);
        const res = await fetch(`http://localhost:8080/api/anotacoes/atividade/${atv.reaId}`);
        if (res.ok && res.status !== 204) {
          const data = await res.json();
          setAnotacoes(data);
        } else {
          setAnotacoes([]); 
        }
      } catch (e) {
        console.error("Erro ao buscar anotações:", e);
        setAnotacoes([]);
      } finally {
        setLoadingAnotacoes(false);
      }
    }
  };

  const indexSelecionado = atividades.findIndex(
    a => atividadeSelecionada && Number(a.item) === Number(atividadeSelecionada.item) && a.atividade === atividadeSelecionada.atividade
  );

  const moverItemSelecionado = (direcao) => {
    if (indexSelecionado === -1) return;
    const novaPosicao = indexSelecionado + direcao;
    if (novaPosicao < 0 || novaPosicao >= atividades.length) return;

    const novasAtividades = [...atividades];
    const temp = novasAtividades[indexSelecionado];
    novasAtividades[indexSelecionado] = novasAtividades[novaPosicao];
    novasAtividades[novaPosicao] = temp;
    setAtividades(novasAtividades);
  };

  const gridTemplate = "60px 2fr 100px 100px 1.5fr 120px 1.5fr 60px";

  const renderizarHTML = (htmlString) => {
    if (!htmlString || htmlString.trim() === '') return <span style={{color: 'var(--text-muted)', fontStyle: 'italic'}}>Nenhum texto preenchido.</span>;
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      
      <Sidebar />

      <main className="main-content" style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        
        {/* CABEÇALHO COM O NOVO BOTÃO */}
        <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(0, 135, 95, 0.1)', border: '1px solid var(--neon-primary)', color: 'var(--neon-primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ← Voltar
          </button>
          <div>
            <h1 style={{ margin: 0, color: 'var(--text-bright)', fontSize: '24px' }}>Detalhes da Auditoria</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>ID de Referência: {id}</p>
          </div>
          
          {/* COMPONENTE DO ANEXO ALINHADO À DIREITA */}
          <div style={{ marginLeft: 'auto' }}>
            <BotaoAnexoLegado relatorioId={id} />
          </div>
        </header>

        <section style={{ background: 'var(--bg-panel)', padding: '20px', borderRadius: '16px', boxShadow: 'var(--panel-shadow)', border: 'var(--glass-border)', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', gap: '15px' }}>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Relatório</span><br/><strong style={{ color: 'var(--text-bright)' }}>{cabecalho.relatorio}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Número</span><br/><strong style={{ color: 'var(--neon-primary)' }}>{cabecalho.numero}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Grupo</span><br/><strong style={{ color: 'var(--neon-secondary)' }}>{cabecalho.grupo}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Gestor</span><br/><strong style={{ color: 'var(--text-bright)' }}>{cabecalho.gestor}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Situação</span><br/><strong style={{ color: '#ffc107' }}>{cabecalho.situacao}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Total Itens</span><br/><strong style={{ color: 'var(--text-bright)' }}>{atividades.length}</strong></div>
        </section>

        <section style={{ background: 'var(--bg-panel)', borderRadius: '16px', border: 'var(--glass-border)', marginBottom: '20px', overflow: 'hidden', boxShadow: 'var(--panel-shadow)' }}>
          <div style={{ padding: '15px 20px', borderBottom: 'var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--text-bright)' }}>Atividades do Relatório (Duplo clique para abrir)</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => moverItemSelecionado(-1)} disabled={indexSelecionado <= 0} style={{ background: 'rgba(0, 135, 95, 0.1)', color: 'var(--neon-primary)', border: '1px solid var(--neon-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>▲ Subir</button>
              <button onClick={() => moverItemSelecionado(1)} disabled={indexSelecionado === -1 || indexSelecionado === atividades.length - 1} style={{ background: 'rgba(0, 135, 95, 0.1)', color: 'var(--neon-primary)', border: '1px solid var(--neon-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>▼ Descer</button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '10px', padding: '12px 20px', backgroundColor: 'var(--bg-inset)', borderBottom: '2px solid var(--neon-primary)', color: 'var(--neon-primary)', fontWeight: 'bold', fontSize: '13px' }}>
              <div>ITEM</div><div>ATIVIDADE</div><div>DT. INICIAL</div><div>DT. FINAL</div><div>REALIZADO POR</div><div>SITUAÇÃO</div><div>CLASSIFICAÇÃO</div><div>PEND.</div>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neon-primary)' }}>Buscando dados no servidor...</div>
              ) : atividades.length > 0 ? (
                (() => {
                  let contadorVisual = 1;
                  return atividades.map((atv, index) => {
                    const isSelecionada = atividadeSelecionada?.item === atv.item && atividadeSelecionada?.atividade === atv.atividade;
                    const isZero = Number(atv.item) === 0;
                    const numeroDaLinha = isZero ? "" : contadorVisual++;
                    const classTexto = (atv.classificacao === 'Selecione...' || !atv.classificacao) ? '-' : atv.classificacao;

                    return (
                      <div key={index} 
                        onClick={() => setAtividadeSelecionada(atv)}
                        onDoubleClick={() => abrirModalDeAtividade(atv)}
                        title="Dê um duplo clique para ver os detalhes da atividade"
                        style={{ 
                          display: 'grid', gridTemplateColumns: gridTemplate, gap: '10px', padding: '12px 20px', cursor: 'pointer', alignItems: 'center', borderBottom: 'var(--glass-border)', backgroundColor: isSelecionada ? 'rgba(0, 135, 95, 0.1)' : 'transparent', borderLeft: isSelecionada ? '4px solid var(--neon-primary)' : '4px solid transparent', transition: 'background-color 0.2s',
                          color: 'var(--text-bright)'
                        }}
                      >
                        <div style={{ color: 'var(--neon-primary)', fontWeight: 'bold' }}>{numeroDaLinha}</div>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={atv.atividade}>{atv.atividade}</div>
                        <div>{atv.dataInicial}</div>
                        <div>{atv.dataFinal}</div>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={atv.realizadoPor}>{atv.realizadoPor}</div>
                        <div><span style={{ color: atv.situacao === 'F' ? '#28a745' : '#ffc107', fontWeight: 'bold' }}>{atv.situacao === 'F' ? 'FINALIZADO' : (atv.situacao === 'A' ? 'AGUARDANDO' : atv.situacao)}</span></div>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={classTexto}>{classTexto}</div>
                        <div>{atv.pendencia ? 'Sim' : 'Não'}</div>
                      </div>
                    )
                  });
                })()
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Nenhuma atividade encontrada.</div>
              )}
            </div>
          </div>
        </section>
      </main>

      {isModalOpen && atividadeSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'var(--bg-panel)', width: '90%', maxWidth: '1200px', height: '90vh', borderRadius: '12px', border: '1px solid var(--neon-primary)', boxShadow: '0 0 30px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            <div style={{ padding: '20px', borderBottom: 'var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-inset)' }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--neon-primary)', fontSize: '20px' }}>Atividade: {atividadeSelecionada.atividade}</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Grupo: {cabecalho.grupo} | Item: {atividadeSelecionada.item}</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#ff4444', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }}>✖</button>
            </div>

            <div style={{ display: 'flex', borderBottom: 'var(--glass-border)', background: 'var(--bg-inset)' }}>
              <button 
                onClick={() => setActiveTab('detalhes')}
                style={{ flex: 1, padding: '15px', background: activeTab === 'detalhes' ? 'rgba(0, 135, 95, 0.05)' : 'transparent', border: 'none', borderBottom: activeTab === 'detalhes' ? '2px solid var(--neon-primary)' : '2px solid transparent', color: activeTab === 'detalhes' ? 'var(--neon-primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s' }}>
                📋 Detalhes da Atividade
              </button>
              <button 
                onClick={() => setActiveTab('anotacoes')}
                style={{ flex: 1, padding: '15px', background: activeTab === 'anotacoes' ? 'rgba(0, 135, 95, 0.05)' : 'transparent', border: 'none', borderBottom: activeTab === 'anotacoes' ? '2px solid var(--neon-primary)' : '2px solid transparent', color: activeTab === 'anotacoes' ? 'var(--neon-primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s' }}>
                💬 Anotações/Revisões {anotacoes.length > 0 && <span style={{background: '#ff4444', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', marginLeft: '5px'}}>{anotacoes.length}</span>}
              </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-panel)' }}>
              
              {activeTab === 'detalhes' && (
                <>
                  <div style={{ border: '1px dashed var(--neon-primary)', padding: '15px', borderRadius: '8px', background: 'rgba(0, 135, 95, 0.02)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--neon-primary)' }}>1. Detalhes da Atividade (Testes)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ background: 'var(--bg-inset)', border: 'var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'var(--text-bright)' }}><strong style={{color: '#d39e00'}}>Testes Realizados:</strong>{renderizarHTML(atividadeSelecionada.teste)}</div>
                      <div style={{ background: 'var(--bg-inset)', border: 'var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'var(--text-bright)' }}><strong style={{color: '#d39e00'}}>Extensão / Amostra:</strong>{renderizarHTML(atividadeSelecionada.extensao)}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div style={{ background: 'var(--bg-inset)', border: 'var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'var(--text-bright)' }}><strong style={{color: '#d39e00'}}>Critério / Período:</strong>{renderizarHTML(atividadeSelecionada.criterio)}</div>
                      <div style={{ background: 'var(--bg-inset)', border: 'var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'var(--text-bright)' }}><strong style={{color: '#d39e00'}}>Veredito (Observação):</strong>{renderizarHTML(atividadeSelecionada.observacao)}</div>
                    </div>
                  </div>

                  <div style={{ border: '1px dashed #ff4444', padding: '15px', borderRadius: '8px', background: 'rgba(255, 68, 68, 0.02)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#ff4444' }}>2. Pendências / Irregularidades</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                      <div style={{ background: 'var(--bg-inset)', border: 'var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'var(--text-bright)' }}><strong style={{color: '#ff4444'}}>Não Conformidade:</strong>{renderizarHTML(atividadeSelecionada.naoConformidade)}</div>
                      <div style={{ background: 'var(--bg-inset)', border: 'var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'var(--text-bright)' }}><strong style={{color: '#ff4444'}}>Reincidente?</strong>{renderizarHTML(atividadeSelecionada.reincidente)}</div>
                      <div style={{ background: 'var(--bg-inset)', border: 'var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'var(--text-bright)' }}><strong style={{color: '#ff4444'}}>Recomendação:</strong>{renderizarHTML(atividadeSelecionada.recomendacao)}</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'anotacoes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {loadingAnotacoes ? (
                    <div style={{ textAlign: 'center', color: 'var(--neon-primary)', padding: '40px' }}>Carregando histórico de anotações...</div>
                  ) : anotacoes.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px', background: 'var(--bg-inset)', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                      <h3>Nenhuma interação registrada.</h3>
                      <p>O histórico de anotações/revisões desta atividade está limpo.</p>
                    </div>
                  ) : (
                    [...anotacoes].reverse().map((ant, idx) => {
                      const isVersaoAtual = idx === 0;
                      const statusColor = ant.status === 'Concluído' ? '#28a745' : (ant.status?.includes('Revisor') ? 'var(--neon-secondary)' : '#ffc107');

                      return (
                        <div key={ant.id} style={{ 
                          border: isVersaoAtual ? '1px solid var(--neon-primary)' : 'var(--glass-border)', 
                          borderRadius: '12px', padding: '20px', 
                          background: isVersaoAtual ? 'rgba(0, 135, 95, 0.05)' : 'var(--bg-inset)',
                          boxShadow: isVersaoAtual ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                          opacity: isVersaoAtual ? 1 : 0.7,
                          transition: 'opacity 0.2s'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'var(--glass-border)', paddingBottom: '12px', marginBottom: '15px' }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                              <span style={{ color: isVersaoAtual ? 'var(--neon-primary)' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '18px' }}>
                                {isVersaoAtual ? '⭐ Versão Atual' : `Versão Histórica ${ant.versao}`}
                              </span>
                              <span style={{ background: statusColor, color: '#fff', padding: '4px 10px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold' }}>
                                {ant.status}
                              </span>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                              🗓️ {ant.dataHora} <br/> 👤 {ant.usuario}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ borderLeft: '3px solid #ff4444', paddingLeft: '15px' }}>
                              <strong style={{ color: '#ff4444', fontSize: '13px', display: 'block', marginBottom: '8px' }}>💬 OBSERVAÇÃO DO REVISOR</strong>
                              <div style={{ background: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', minHeight: '80px', color: 'var(--text-bright)', fontSize: '14px', border: 'var(--glass-border)' }}>
                                {renderizarHTML(ant.obsRevisor)}
                              </div>
                            </div>
                            
                            <div style={{ borderLeft: '3px solid #28a745', paddingLeft: '15px' }}>
                              <strong style={{ color: '#28a745', fontSize: '13px', display: 'block', marginBottom: '8px' }}>💬 OBSERVAÇÃO DO AUDITOR</strong>
                              <div style={{ background: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', minHeight: '80px', color: 'var(--text-bright)', fontSize: '14px', border: 'var(--glass-border)' }}>
                                {renderizarHTML(ant.obsAuditor)}
                              </div>
                            </div>
                          </div>

                          {ant.ignorarProximo === 1 && (
                            <div style={{ marginTop: '15px', color: '#ffc107', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              ⚠️ <i>Marcado como leitura não obrigatória no próximo relatório.</i>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '20px', borderTop: 'var(--glass-border)', background: 'var(--bg-inset)', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', color: 'var(--text-bright)', border: '1px solid var(--text-muted)', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Fechar Visualização
              </button>
              <button style={{ background: 'var(--neon-primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => alert('Em breve ativaremos a Edição (Motor de Salvamento)!')}>
                ✏️ Habilitar Edição
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DetalhesAuditoria;