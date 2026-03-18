import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BotaoAnexoLegado from '../components/BotaoAnexoLegado'; // <-- Importação do Botão
import '../Dashboard.css';

// ── Helpers e componente MentionTag fora do componente pai para evitar remounts ──

const getIniciais = (nome) => {
  if (!nome) return '?';
  const partes = nome.trim().split(' ').filter(p => p.length > 2);
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const abreviarNome = (nome) => {
  if (!nome) return '—';
  const partes = nome.trim().split(' ').filter(Boolean);
  if (partes.length <= 2) return nome;
  const primeiro = partes[0];
  const ultimo = partes[partes.length - 1];
  const meios = partes.slice(1, -1).map(p => `${p[0]}.`).join(' ');
  return `${primeiro} ${meios} ${ultimo}`.trim();
};

const getCorAvatar = (nome) => {
  if (!nome) return '#6c757d';
  const cores = ['#0a6ed1', '#7c6aff', '#00875f', '#e8a000', '#bb0000', '#107e3e', '#c87533'];
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  return cores[Math.abs(hash) % cores.length];
};

const MentionTag = ({ nome, colCodigo }) => {
  const [useFallback, setUseFallback] = useState(false);

  if (!nome) return <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>;
  const cor = getCorAvatar(nome);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${cor}14`, border: `1px solid ${cor}33`, borderRadius: '20px', padding: '3px 10px 3px 3px', maxWidth: '100%', overflow: 'hidden' }}>
      <div style={{ width: '22px', height: '22px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
        {colCodigo && !useFallback ? (
          <img
            src={`http://localhost:8080/api/foto/${colCodigo}`}
            alt={getIniciais(nome)}
            style={{ width: '22px', height: '22px', objectFit: 'cover', borderRadius: '50%' }}
            onError={() => setUseFallback(true)}
          />
        ) : (
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>
            {getIniciais(nome)}
          </div>
        )}
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: cor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {nome}
      </span>
    </div>
  );
};

const DetalhesAuditoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tokenJWT = localStorage.getItem('siai_token');
  
  const [atividades, setAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('detalhes');
  const [anotacoes, setAnotacoes] = useState([]);
  const [loadingAnotacoes, setLoadingAnotacoes] = useState(false);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [versaoExpandida, setVersaoExpandida] = useState(null);

  const [cabecalho, setCabecalho] = useState({
    relatorio: '-', numero: '-', gestor: '-', situacao: '-', grupo: '-',
    cabecalho1: '', cabecalho2: '', cabecalho3: '', sugestao: ''
  });
  const [colaboradoresRelatorio, setColaboradoresRelatorio] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        try {
          // Busca a lista completa (sem paginação)
          const resAtividades = await fetch(`http://localhost:8080/api/relatorio-atividade/cronograma/${id}`, {
            headers: { 'Authorization': `Bearer ${tokenJWT}` }
          });
          if (resAtividades.ok) {
            const dataAtividades = await resAtividades.json();
            
            // 🔴 BLINDAGEM: Se vier array usa o array. Se vier objeto de página, usa o .content!
            const listaSegura = Array.isArray(dataAtividades) ? dataAtividades : (dataAtividades.content || []);
            
            const dadosOrdenados = listaSegura.sort((a, b) => {
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
          const resColaboradores = await fetch(`http://localhost:8080/api/relatorios/${id}/colaboradores`, {
            headers: { 'Authorization': `Bearer ${tokenJWT}` }
          });
          if (resColaboradores.ok) {
            const dataCol = await resColaboradores.json();
            setColaboradoresRelatorio(Array.isArray(dataCol) ? dataCol : []);
          }
        } catch (erroCol) {
          console.error("Falha ao buscar colaboradores:", erroCol);
        }

        try {
          const resCabecalho = await fetch(`http://localhost:8080/api/relatorios/cabecalho/${id}`, {
            headers: { 'Authorization': `Bearer ${tokenJWT}` }
          });
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
        const res = await fetch(`http://localhost:8080/api/anotacoes/atividade/${atv.reaId}`, {
          headers: { 'Authorization': `Bearer ${tokenJWT}` }
        });
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

        {colaboradoresRelatorio.length > 0 && (
          <section style={{ background: 'var(--bg-panel)', padding: '14px 20px', borderRadius: '12px', boxShadow: 'var(--panel-shadow)', border: 'var(--glass-border)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>Realizado por</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {colaboradoresRelatorio.map((col, i) => (
                <MentionTag key={i} nome={col.colNome} colCodigo={col.colCodigo} />
              ))}
            </div>
          </section>
        )}

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

            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
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
                        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <MentionTag nome={atv.realizadoPor} colCodigo={atv.colCodigo} />
                          {atv.realizadoPor2 && <MentionTag nome={atv.realizadoPor2} colCodigo={atv.colCodigo2} />}
                        </div>
                        <div><span style={{ color: atv.situacao === 'F' || atv.situacao === 'C' ? '#28a745' : '#ffc107', fontWeight: 'bold' }}>{atv.situacao === 'F' || atv.situacao === 'C' ? 'FINALIZADO' : (atv.situacao === 'A' ? 'AGUARDANDO' : atv.situacao)}</span></div>
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
          <div style={{ background: 'var(--bg-panel)', width: '95%', maxWidth: '1400px', height: '95vh', borderRadius: '12px', border: '1px solid var(--neon-primary)', boxShadow: '0 0 40px rgba(0, 229, 255, 0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
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

            <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--bg-panel)', overflow: 'hidden' }}>
              
              {activeTab === 'detalhes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minHeight: 0 }}>

                  {/* ── BARRA DE METADADOS ── */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', background: 'var(--bg-inset)', borderRadius: '8px', border: 'var(--glass-border)', overflow: 'hidden', flexShrink: 0 }}>
                    {[
                      { label: 'Realizado por',  valor: null, cor: '', peso: '' },
                      { label: 'Data Inicial',   valor: atividadeSelecionada.dataInicial  || '—', cor: 'var(--text-bright)', peso: 'normal' },
                      { label: 'Data Final',     valor: atividadeSelecionada.dataFinal    || '—', cor: 'var(--text-bright)', peso: 'normal' },
                      { label: 'Situação',       valor: (atividadeSelecionada.situacao === 'F' || atividadeSelecionada.situacao === 'C') ? 'FINALIZADO' : atividadeSelecionada.situacao === 'A' ? 'AGUARDANDO' : (atividadeSelecionada.situacao || '—'), cor: (atividadeSelecionada.situacao === 'F' || atividadeSelecionada.situacao === 'C') ? '#28a745' : '#ffc107', peso: 'bold' },
                      { label: 'Classificação',  valor: (!atividadeSelecionada.classificacao || atividadeSelecionada.classificacao === 'Selecione...') ? '—' : atividadeSelecionada.classificacao, cor: 'var(--neon-primary)', peso: '600' },
                    ].map(({ label, valor, cor, peso }, i, arr) => (
                      <div key={label} style={{ padding: '10px 16px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.6px', marginBottom: '4px' }}>{label}</div>
                        <div style={{ fontSize: '13px', lineHeight: '1.3' }}>
                          {label === 'Realizado por'
                            ? <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <MentionTag nome={atividadeSelecionada.realizadoPor} colCodigo={atividadeSelecionada.colCodigo} />
                                {atividadeSelecionada.realizadoPor2 && <MentionTag nome={atividadeSelecionada.realizadoPor2} colCodigo={atividadeSelecionada.colCodigo2} />}
                              </div>
                            : <span style={{ color: cor, fontWeight: peso }}>{valor}</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── CORPO PRINCIPAL: 2 COLUNAS ── */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flex: 1, minHeight: 0 }}>

                    {/* COLUNA ESQUERDA — Texto das Atividades */}
                    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', border: '1px solid rgba(0,135,95,0.3)', overflow: 'hidden', minHeight: 0 }}>
                      <div style={{ padding: '8px 14px', background: 'rgba(0,135,95,0.08)', borderBottom: '1px solid rgba(0,135,95,0.2)', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ width: '3px', height: '14px', background: 'var(--neon-primary)', borderRadius: '2px', display: 'inline-block' }} />
                        <span style={{ color: 'var(--neon-primary)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Texto das Atividades do Relatório</span>
                      </div>
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', padding: '10px', minHeight: 0 }}>
                        {[
                          { label: 'Testes Realizados',                        valor: atividadeSelecionada.teste },
                          { label: 'Extensão dos Exames',                       valor: atividadeSelecionada.extensao },
                          { label: 'Critério / Amostragem',                     valor: atividadeSelecionada.criterio },
                          { label: 'Observação / Resumo da Situação Encontrada', valor: atividadeSelecionada.observacao },
                        ].map(({ label, valor }) => (
                          <div key={label} style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-inset)', borderRadius: '6px', border: 'var(--glass-border)', overflow: 'hidden', minHeight: 0 }}>
                            <div style={{ padding: '5px 10px', background: 'rgba(0,0,0,0.25)', borderBottom: 'var(--glass-border)', flexShrink: 0 }}>
                              <span style={{ fontSize: '10px', color: '#d39e00', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
                            </div>
                            <div style={{ flex: 1, padding: '10px', color: 'var(--text-bright)', fontSize: '13px', overflowY: 'auto', lineHeight: '1.5' }}>
                              {renderizarHTML(valor)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* COLUNA DIREITA — Pendências + Fechamento */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>

                      {/* Pendências */}
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 3, borderRadius: '8px', border: '1px solid rgba(255,68,68,0.3)', overflow: 'hidden', minHeight: 0 }}>
                        <div style={{ padding: '8px 14px', background: 'rgba(255,68,68,0.06)', borderBottom: '1px solid rgba(255,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '3px', height: '14px', background: '#ff4444', borderRadius: '2px', display: 'inline-block' }} />
                            <span style={{ color: '#ff4444', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Texto das Pendências do Relatório</span>
                          </div>
                          {atividadeSelecionada.pendencia
                            ? <span style={{ background: 'rgba(255,68,68,0.15)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.4)', padding: '2px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '700' }}>⚠ PENDÊNCIA ATIVA</span>
                            : <span style={{ color: '#28a745', fontSize: '11px', fontWeight: '700' }}>✔ Sem pendência</span>
                          }
                        </div>
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 0.6fr 1.4fr', gap: '8px', padding: '10px', minHeight: 0 }}>
                          {[
                            { label: 'Não Conformidade / Oportunidade de Melhora', valor: atividadeSelecionada.naoConformidade },
                            { label: 'Reincidente?',                               valor: atividadeSelecionada.reincidente },
                            { label: 'Recomendação',                               valor: atividadeSelecionada.recomendacao },
                          ].map(({ label, valor }) => (
                            <div key={label} style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-inset)', borderRadius: '6px', border: 'var(--glass-border)', overflow: 'hidden', minHeight: 0 }}>
                              <div style={{ padding: '5px 10px', background: 'rgba(0,0,0,0.25)', borderBottom: 'var(--glass-border)', flexShrink: 0 }}>
                                <span style={{ fontSize: '10px', color: '#ff4444', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
                              </div>
                              <div style={{ flex: 1, padding: '10px', color: 'var(--text-bright)', fontSize: '13px', overflowY: 'auto', lineHeight: '1.5' }}>
                                {renderizarHTML(valor)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fechamento */}
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 2, borderRadius: '8px', border: '1px solid rgba(108,117,125,0.3)', overflow: 'hidden', minHeight: 0 }}>
                        <div style={{ padding: '8px 14px', background: 'rgba(108,117,125,0.06)', borderBottom: '1px solid rgba(108,117,125,0.2)', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span style={{ width: '3px', height: '14px', background: '#6c757d', borderRadius: '2px', display: 'inline-block' }} />
                          <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Texto do Fechamento do Relatório</span>
                        </div>
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '170px 1fr', gap: '8px', padding: '10px', minHeight: 0 }}>
                          {[
                            { label: 'Gestor',                   valor: cabecalho.gestor   || '—' },
                            { label: 'Sugestões e Orientações',  valor: cabecalho.sugestao },
                          ].map(({ label, valor }) => (
                            <div key={label} style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-inset)', borderRadius: '6px', border: 'var(--glass-border)', overflow: 'hidden', minHeight: 0 }}>
                              <div style={{ padding: '5px 10px', background: 'rgba(0,0,0,0.25)', borderBottom: 'var(--glass-border)', flexShrink: 0 }}>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
                              </div>
                              <div style={{ flex: 1, padding: '10px', color: 'var(--text-bright)', fontSize: '13px', overflowY: 'auto', lineHeight: '1.5', fontWeight: label === 'Gestor' ? '600' : 'normal' }}>
                                {label === 'Sugestões e Orientações' ? renderizarHTML(valor) : valor}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'anotacoes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', minHeight: 0 }}>
                  {loadingAnotacoes ? (
                    <div style={{ textAlign: 'center', color: 'var(--neon-primary)', padding: '40px' }}>
                      Carregando histórico de anotações...
                    </div>
                  ) : anotacoes.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px', background: 'var(--bg-inset)', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                      <h3>Nenhuma interação registrada.</h3>
                      <p>O histórico de anotações/revisões desta atividade está limpo.</p>
                    </div>
                  ) : (() => {
                    const ordenadas = [...anotacoes].sort((a, b) => b.versao - a.versao);
                    const atual = ordenadas[0];
                    const anteriores = ordenadas.slice(1);
                    const getStatusColor = (status) => status === 'Concluído' ? '#28a745' : (status?.includes('Revisor') ? 'var(--neon-secondary)' : '#ffc107');

                    const renderConteudoAnotacao = (ant) => (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                        <div style={{ borderLeft: '3px solid #ff4444', paddingLeft: '15px' }}>
                          <strong style={{ color: '#ff4444', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Observação do Revisor</strong>
                          <div style={{ background: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', minHeight: '70px', color: 'var(--text-bright)', fontSize: '14px', border: 'var(--glass-border)' }}>
                            {renderizarHTML(ant.obsRevisor)}
                          </div>
                        </div>
                        <div style={{ borderLeft: '3px solid #28a745', paddingLeft: '15px' }}>
                          <strong style={{ color: '#28a745', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Observação do Auditor</strong>
                          <div style={{ background: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', minHeight: '70px', color: 'var(--text-bright)', fontSize: '14px', border: 'var(--glass-border)' }}>
                            {renderizarHTML(ant.obsAuditor)}
                          </div>
                        </div>
                        {ant.ignorarProximo === 1 && (
                          <div style={{ gridColumn: '1 / -1', color: '#ffc107', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ⚠️ <i>Marcado como leitura não obrigatória no próximo relatório.</i>
                          </div>
                        )}
                      </div>
                    );

                    return (
                      <>
                        {/* ── VERSÃO ATUAL ── */}
                        <div style={{ border: '1px solid var(--neon-primary)', borderRadius: '12px', padding: '20px', background: 'rgba(0, 135, 95, 0.04)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ background: 'var(--neon-primary)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                VERSÃO ATUAL
                              </span>
                              <span style={{ background: getStatusColor(atual.status), color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                                {atual.status}
                              </span>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                              <div>📅 {atual.dataHora}</div>
                              <div>👤 {atual.usuario}</div>
                            </div>
                          </div>
                          {renderConteudoAnotacao(atual)}
                        </div>

                        {/* ── HISTÓRICO DE VERSÕES ── */}
                        {anteriores.length > 0 && (
                          <div>
                            <button
                              onClick={() => { setHistoricoAberto(p => !p); setVersaoExpandida(null); }}
                              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-inset)', border: 'var(--glass-border)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                            >
                              <span>🕓 Histórico de revisões ({anteriores.length} versão{anteriores.length > 1 ? 'ões' : ''} anterior{anteriores.length > 1 ? 'es' : ''})</span>
                              <span>{historicoAberto ? '▲ Recolher' : '▼ Expandir'}</span>
                            </button>

                            {historicoAberto && (
                              <div style={{ marginTop: '2px', borderLeft: '2px solid var(--glass-border)', marginLeft: '20px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {anteriores.map((ant) => {
                                  const estaAberto = versaoExpandida === ant.id;
                                  return (
                                    <div key={ant.id} style={{ borderRadius: '8px', overflow: 'hidden', border: 'var(--glass-border)' }}>
                                      {/* Cabeçalho clicável da versão */}
                                      <button
                                        onClick={() => setVersaoExpandida(estaAberto ? null : ant.id)}
                                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: estaAberto ? 'rgba(255,255,255,0.04)' : 'var(--bg-inset)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block', flexShrink: 0 }} />
                                          <span style={{ color: 'var(--text-bright)', fontSize: '13px', fontWeight: 'bold' }}>Versão {ant.versao}</span>
                                          <span style={{ background: getStatusColor(ant.status), color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>{ant.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📅 {ant.dataHora} &nbsp; 👤 {ant.usuario}</span>
                                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{estaAberto ? '▲' : '▼'}</span>
                                        </div>
                                      </button>

                                      {/* Conteúdo expandido */}
                                      {estaAberto && (
                                        <div style={{ padding: '0 16px 16px 16px', background: 'rgba(255,255,255,0.02)' }}>
                                          {renderConteudoAnotacao(ant)}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
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