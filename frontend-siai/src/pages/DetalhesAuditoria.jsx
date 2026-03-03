import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const DetalhesAuditoria = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [atividades, setAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cabecalho, setCabecalho] = useState({ 
    relatorio: '-', numero: '-', gestor: '-', situacao: '-', grupo: '-',
    cabecalho1: '', cabecalho2: '', cabecalho3: '', sugestao: ''
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // 1. BUSCA AS ATIVIDADES
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

        // 2. BUSCA O CABEÇALHO COM OS TEXTOS HTML
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

    if (id) {
      carregarDados();
    }
  }, [id]);

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
    if (!htmlString) return <span style={{color: 'rgba(255,255,255,0.3)'}}>Sem informações cadastradas.</span>;
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  return (
    <div className="dashboard-container">
      <main className="main-content" style={{ width: '100%', padding: '30px' }}>
        
        {/* CABEÇALHO DA TELA */}
        <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ 
              background: 'rgba(0, 242, 255, 0.1)', border: '1px solid var(--neon-primary)', 
              color: 'var(--neon-primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}>
            ← Voltar
          </button>
          <div>
            <h1 style={{ margin: 0, color: 'var(--text-bright)', fontSize: '24px' }}>Detalhes da Auditoria</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>ID de Referência: {id}</p>
          </div>
        </header>

        {/* BLOCO 1: INFORMAÇÕES GERAIS */}
        <section style={{ 
            background: 'var(--bg-panel)', padding: '20px', borderRadius: '16px', 
            boxShadow: 'var(--panel-shadow)', border: 'var(--glass-border)', marginBottom: '20px',
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', gap: '15px'
        }}>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Relatório</span><br/><strong style={{ color: 'var(--text-bright)' }}>{cabecalho.relatorio}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Número</span><br/><strong style={{ color: 'var(--neon-primary)' }}>{cabecalho.numero}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Grupo</span><br/><strong style={{ color: 'var(--neon-secondary)', textShadow: '0 0 5px var(--neon-secondary)' }}>{cabecalho.grupo}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Gestor</span><br/><strong style={{ color: 'var(--text-bright)' }}>{cabecalho.gestor}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Situação</span><br/><strong style={{ color: '#ffc107' }}>{cabecalho.situacao}</strong></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Total Itens</span><br/><strong style={{ color: 'var(--text-bright)' }}>{atividades.length}</strong></div>
        </section>

        {/* BLOCO 2: TABELA DE ATIVIDADES */}
        <section style={{ background: 'var(--bg-panel)', borderRadius: '16px', border: 'var(--glass-border)', marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--text-bright)' }}>Atividades do Relatório (Duplo clique para abrir)</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => moverItemSelecionado(-1)} disabled={indexSelecionado <= 0} style={{ background: 'rgba(0, 242, 255, 0.1)', color: 'var(--neon-primary)', border: '1px solid var(--neon-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>▲ Subir</button>
              <button onClick={() => moverItemSelecionado(1)} disabled={indexSelecionado === -1 || indexSelecionado === atividades.length - 1} style={{ background: 'rgba(0, 242, 255, 0.1)', color: 'var(--neon-primary)', border: '1px solid var(--neon-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>▼ Descer</button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '10px', padding: '12px 20px', backgroundColor: '#050a14', borderBottom: '2px solid var(--neon-primary)', color: 'var(--neon-primary)', fontWeight: 'bold', fontSize: '13px' }}>
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
                      <div 
                        key={index} 
                        // 🔴 A CIRURGIA ACONTECEU NESTAS DUAS LINHAS ABAIXO:
                        onClick={() => setAtividadeSelecionada(atv)} // Clique simples APENAS seleciona a linha
                        onDoubleClick={() => setIsModalOpen(true)}   // Clique duplo ABRE O MODAL gigante
                        title="Dê um duplo clique para ver os detalhes da atividade"
                        style={{ 
                          display: 'grid', gridTemplateColumns: gridTemplate, gap: '10px',
                          padding: '12px 20px', cursor: 'pointer', alignItems: 'center',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          backgroundColor: isSelecionada ? 'rgba(0, 242, 255, 0.15)' : 'transparent',
                          borderLeft: isSelecionada ? '4px solid var(--neon-primary)' : '4px solid transparent',
                          transition: 'background-color 0.2s'
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

      {/* A JANELA GIGANTE (MODAL DE DETALHES) */}
      {isModalOpen && atividadeSelecionada && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          
          <div style={{
            background: '#0a0f1a', width: '90%', maxWidth: '1000px', maxHeight: '90vh',
            borderRadius: '12px', border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 30px rgba(0, 242, 255, 0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            
            {/* CABEÇALHO DO MODAL */}
            <div style={{ 
              padding: '20px', borderBottom: '1px solid rgba(0, 242, 255, 0.3)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050a14' 
            }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--neon-primary)', fontSize: '20px' }}>
                  Atividade: {atividadeSelecionada.atividade}
                </h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Grupo: {cabecalho.grupo} | Situação: {cabecalho.situacao}
                </span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#ff4444', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✖
              </button>
            </div>

            {/* CORPO DO MODAL COM SCROLL */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* SESSÃO 1: CABEÇALHO DO RELATÓRIO GERAL */}
              <div style={{ border: '1px dashed rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>1. Textos de Abertura do Relatório</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', color: '#ccc', fontSize: '13px' }}>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px' }}>
                    <strong style={{color: 'var(--neon-primary)'}}>Título:</strong>
                    {renderizarHTML(cabecalho.cabecalho1)}
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px' }}>
                    <strong style={{color: 'var(--neon-primary)'}}>Relatório:</strong>
                    {renderizarHTML(cabecalho.cabecalho2)}
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px' }}>
                    <strong style={{color: 'var(--neon-primary)'}}>Abertura:</strong>
                    {renderizarHTML(cabecalho.cabecalho3)}
                  </div>
                </div>
              </div>

              {/* SESSÃO 2: TESTES E VAREDEITOS DA ATIVIDADE */}
              <div style={{ border: '1px dashed rgba(0, 242, 255, 0.4)', padding: '15px', borderRadius: '8px', background: 'rgba(0, 242, 255, 0.02)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--neon-primary)' }}>2. Detalhes da Atividade (Testes)</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', color: '#fff' }}>
                    <strong style={{color: '#ffc107'}}>Testes Realizados:</strong>
                    {renderizarHTML(atividadeSelecionada.teste)}
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', color: '#fff' }}>
                    <strong style={{color: '#ffc107'}}>Extensão / Amostra:</strong>
                    {renderizarHTML(atividadeSelecionada.extensao)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', color: '#fff' }}>
                    <strong style={{color: '#ffc107'}}>Critério / Período:</strong>
                    {renderizarHTML(atividadeSelecionada.criterio)}
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', color: '#fff' }}>
                    <strong style={{color: '#ffc107'}}>Veredito (Observação):</strong>
                    {renderizarHTML(atividadeSelecionada.observacao)}
                  </div>
                </div>
              </div>

              {/* SESSÃO 3: PENDÊNCIAS */}
              <div style={{ border: '1px dashed rgba(255, 68, 68, 0.4)', padding: '15px', borderRadius: '8px', background: 'rgba(255, 68, 68, 0.02)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#ff4444' }}>3. Pendências / Irregularidades</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', color: '#fff' }}>
                    <strong style={{color: '#ff4444'}}>Não Conformidade:</strong>
                    {renderizarHTML(atividadeSelecionada.naoConformidade)}
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', color: '#fff' }}>
                    <strong style={{color: '#ff4444'}}>Reincidente?</strong>
                    {renderizarHTML(atividadeSelecionada.reincidente)}
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', color: '#fff' }}>
                    <strong style={{color: '#ff4444'}}>Recomendação:</strong>
                    {renderizarHTML(atividadeSelecionada.recomendacao)}
                  </div>
                </div>
              </div>

              {/* SESSÃO 4: RODAPÉ */}
              <div style={{ border: '1px dashed rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>4. Fechamento</h4>
                <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', color: '#ccc' }}>
                    <strong style={{color: 'var(--neon-primary)'}}>Sugestões e Orientações (Geral):</strong>
                    {renderizarHTML(cabecalho.sugestao)}
                </div>
              </div>

            </div>

            {/* RODAPÉ DO MODAL (Botões) */}
            <div style={{ padding: '20px', borderTop: '1px solid rgba(0, 242, 255, 0.3)', background: '#050a14', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', color: '#ccc', border: '1px solid #555', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar
              </button>
              <button style={{ background: 'var(--neon-primary)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Salvar (Em Breve)
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DetalhesAuditoria;