import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  
  const [relatorios, setRelatorios] = useState([]);
  const [anosDisponiveis, setAnosDisponiveis] = useState([]); 
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [anoFiltro, setAnoFiltro] = useState('2026'); 
  const [termoBusca, setTermoBusca] = useState(''); 
  const [filtroStatus, setFiltroStatus] = useState(null);

  const [filtrosBusca, setFiltrosBusca] = useState({
    numero: true,
    descricao: true,
    grupo: true
  });

  const toggleFiltro = (campo) => {
    setFiltrosBusca(prev => {
      const novoEstado = { ...prev, [campo]: !prev[campo] };
      if (!novoEstado.numero && !novoEstado.descricao && !novoEstado.grupo) return prev; 
      return novoEstado;
    });
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/relatorios/anos')
      .then(res => res.json())
      .then(data => {
        setAnosDisponiveis(data);
        if (data.length > 0 && !data.includes(Number(anoFiltro))) {
          setAnoFiltro(data[0].toString());
        }
      })
      .catch(err => console.error("Erro ao buscar anos:", err));
  }, []);

  useEffect(() => {
    if (!anoFiltro) return;
    setCarregando(true);
    setErro(null);
    setFiltroStatus(null); 

    fetch(`http://localhost:8080/api/relatorios?ano=${anoFiltro}`)
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao buscar dados do servidor');
        return response.json();
      })
      .then((data) => {
        setRelatorios(data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error('Erro de conexão:', error);
        setErro('Não foi possível carregar as auditorias.');
        setCarregando(false);
      });
  }, [anoFiltro]);

  const normalizarTexto = (texto) => {
    if (!texto) return '';
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  };

  // 1. Limpeza de Duplicados
  const relatoriosUnicos = [];
  const mapIds = new Set();
  for (const r of relatorios) {
    if (r.numeroRelatorio && !mapIds.has(r.id)) {
      mapIds.add(r.id);
      relatoriosUnicos.push(r);
    }
  }

  // 2. Filtro Geral da Tabela
  const relatoriosFiltrados = relatoriosUnicos.filter((r) => {
    if (anoFiltro === '0' && !termoBusca.trim() && !filtroStatus) return false;
    
    const sit = (r.situacao || 'NÃO DEFINIDO').trim().toUpperCase();

    // Filtro Exato do Card (agora filtra a palavra exata)
    if (filtroStatus && sit !== filtroStatus) return false;

    // Filtro de Texto
    if (!termoBusca.trim()) return true;
    let textoAlvo = "";
    if (filtrosBusca.numero) textoAlvo += " " + (r.numeroRelatorio || "");
    if (filtrosBusca.descricao) textoAlvo += " " + (r.descricaoRelatorio || "");
    if (filtrosBusca.grupo) textoAlvo += " " + (r.grupoDescricao || "");
    
    const textoCompleto = normalizarTexto(textoAlvo);
    const termosDigitados = normalizarTexto(termoBusca).split(' ').filter(t => t.length > 0);
    
    let matchesAll = true;
    for (let termo of termosDigitados) {
      if (!textoCompleto.includes(termo)) {
        matchesAll = false; break;
      }
    }
    return matchesAll;
  });

  const relatoriosExibidos = relatoriosFiltrados.slice(0, 100);

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    if (isNaN(data)) return '-';
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const getDataInicio = (r) => {
    const sit = r.situacao ? r.situacao.trim().toUpperCase() : '';
    if (sit === 'FINALIZADO') return formatarData(r.dataInicialRealizada || r.dataInicialPrevista); 
    return formatarData(r.dataInicialPrevista);
  };

  const getDataFim = (r) => {
    const sit = r.situacao ? r.situacao.trim().toUpperCase() : '';
    if (sit === 'FINALIZADO') return formatarData(r.dataFinalRealizada || r.dataFinalPrevista);
    return formatarData(r.dataFinalPrevista);
  };

  const formatarGrupo = (grupo) => {
    if (!grupo) return '---';
    const textoLimpo = grupo.replace(/\s+/g, ' ').trim();
    if (textoLimpo.includes('INSUMOS / PROGRAMA 5S')) return 'INSUMOS';
    return grupo;
  };

  // 🔴 MÁGICA: GERADOR DINÂMICO DE CARDS E STATUS
  const totalPlanejadoAno = relatoriosUnicos.length; 
  
  // Mapeia e conta todos os status diferentes que existem na base
  const statusMap = {};
  relatoriosUnicos.forEach(r => {
    const sit = (r.situacao || 'NÃO DEFINIDO').trim().toUpperCase();
    statusMap[sit] = (statusMap[sit] || 0) + 1;
  });

  // Transforma o mapa numa lista para criarmos os cards
  const statusCards = Object.keys(statusMap).sort().map(sit => ({
    status: sit,
    count: statusMap[sit]
  }));

  // Função para dar a cor exata para cada status (usada nos cards e na tabela)
  const getStatusColor = (status) => {
    switch(status) {
      case 'FINALIZADO': return '#28a745'; // Verde
      case 'AGUARDANDO': return '#ffc107'; // Amarelo
      case 'ABERTO': return '#17a2b8';     // Ciano
      case 'REVISÃO': return '#6f42c1';    // Roxo
      case 'CANCELADO': return '#dc3545';  // Vermelho
      case 'SUSPENSO': return '#fd7e14';   // Laranja
      case 'NÃO DEFINIDO': return '#6c757d'; // Cinza
      default: return 'var(--neon-primary)'; // Azul padrão para novos status
    }
  };

  const handleCardClick = (status) => {
    setFiltroStatus(filtroStatus === status ? null : status);
  };

  const getCardStyle = (statusBase, corBorda) => {
    const isAtivo = filtroStatus === statusBase;
    const isAlgumAtivo = filtroStatus !== null;
    return {
      background: 'var(--bg-panel)', padding: '20px', borderRadius: '16px',
      borderLeft: `4px solid ${corBorda}`,
      boxShadow: isAtivo ? `0 0 15px ${corBorda}40` : 'var(--panel-shadow)',
      backdropFilter: 'var(--glass-blur)', cursor: 'pointer',
      opacity: isAlgumAtivo && !isAtivo ? 0.4 : 1, 
      transform: isAtivo ? 'translateY(-3px)' : 'none',
      transition: 'all 0.3s ease', minWidth: '200px'
    };
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main className="main-content" style={{ flex: 1 }}>
        <header className="top-bar">
          <div className="welcome-text">
            <h1>Olá, {usuarioLogado?.colNome || 'Auditor'}</h1>
            <p>Painel de Controle de Auditorias (Produção)</p>
          </div>
        </header>

        {/* 🔴 GRID DE CARDS INTELIGENTE (Auto-Fit) */}
        <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          {/* Card Total (Sempre Visível) */}
          <div className="stat-card" onClick={() => setFiltroStatus(null)} style={getCardStyle(null, '#0a6ed1')}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {anoFiltro === '0' ? 'Total Histórico' : 'Total Planejado'}
            </p>
            <h3 style={{ fontSize: '32px', margin: '0', color: 'var(--text-bright)' }}>{totalPlanejadoAno}</h3>
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>Clique para remover filtros</div>
          </div>
          
          {/* 🔴 CARDS GERADOS DINAMICAMENTE PELO BANCO DE DADOS */}
          {statusCards.map((item) => {
            const cor = getStatusColor(item.status);
            const progresso = totalPlanejadoAno > 0 ? Math.round((item.count / totalPlanejadoAno) * 100) : 0;
            
            return (
              <div key={item.status} className="stat-card" onClick={() => handleCardClick(item.status)} style={getCardStyle(item.status, cor)}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {item.status}
                </p>
                <h3 style={{ fontSize: '32px', margin: '0', color: cor }}>{item.count}</h3>
                <div style={{ marginTop: '10px', background: 'rgba(128,128,128,0.15)', borderRadius: '4px', height: '6px', width: '100%' }}>
                  <div style={{ background: cor, height: '6px', borderRadius: '4px', width: `${progresso}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>{progresso}% do total</div>
              </div>
            );
          })}
        </section>

        {/* FILTROS DE TEXTO */}
        <section className="filters-section" style={{ 
            display: 'flex', gap: '20px', marginBottom: '25px', padding: '20px', 
            background: 'var(--bg-panel)', borderRadius: '16px', boxShadow: 'var(--panel-shadow)',
            alignItems: 'flex-start', flexWrap: 'wrap', backdropFilter: 'var(--glass-blur)', border: 'var(--glass-border)'
          }}>
          
          <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neon-primary)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ano da Auditoria</label>
            <select value={anoFiltro} onChange={(e) => setAnoFiltro(e.target.value)} style={{ padding: '12px 16px', fontSize: '15px', borderRadius: '8px', backgroundColor: 'var(--bg-inset)', border: '1px solid rgba(128, 128, 128, 0.2)', color: 'var(--text-bright)', cursor: 'pointer', outline: 'none' }}>
              <option value="0">Todos os Anos</option>
              {anosDisponiveis.length > 0 ? anosDisponiveis.map(ano => <option key={ano} value={ano}>{ano}</option>) : <option value="2026">2026</option>}
            </select>
          </div>

          <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '300px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neon-primary)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Buscar Auditoria</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input type="text" placeholder="Pesquise aqui..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} style={{ padding: '12px 16px 12px 40px', fontSize: '15px', borderRadius: '8px', backgroundColor: 'var(--bg-inset)', border: '1px solid rgba(128, 128, 128, 0.2)', color: 'var(--text-bright)', width: '100%', outline: 'none', boxSizing: 'border-box' }} />
              <span style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '16px', color: 'var(--neon-primary)' }}>🔍</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '5px' }}>Filtrar por:</span>
              <button onClick={() => toggleFiltro('numero')} style={{ background: filtrosBusca.numero ? 'rgba(0, 135, 95, 0.1)' : 'transparent', border: `1px solid ${filtrosBusca.numero ? 'var(--neon-primary)' : 'rgba(128,128,128,0.2)'}`, color: filtrosBusca.numero ? 'var(--neon-primary)' : 'var(--text-muted)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{filtrosBusca.numero ? '✓' : '+'} Nº Relatório</button>
              <button onClick={() => toggleFiltro('descricao')} style={{ background: filtrosBusca.descricao ? 'rgba(0, 135, 95, 0.1)' : 'transparent', border: `1px solid ${filtrosBusca.descricao ? 'var(--neon-primary)' : 'rgba(128,128,128,0.2)'}`, color: filtrosBusca.descricao ? 'var(--neon-primary)' : 'var(--text-muted)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{filtrosBusca.descricao ? '✓' : '+'} Descrição</button>
              <button onClick={() => toggleFiltro('grupo')} style={{ background: filtrosBusca.grupo ? 'rgba(0, 135, 95, 0.1)' : 'transparent', border: `1px solid ${filtrosBusca.grupo ? 'var(--neon-primary)' : 'rgba(128,128,128,0.2)'}`, color: filtrosBusca.grupo ? 'var(--neon-primary)' : 'var(--text-muted)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{filtrosBusca.grupo ? '✓' : '+'} Grupo</button>
            </div>
          </div>
        </section>

        {/* TABELA DE RELATÓRIOS */}
        <section className="recent-audits">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>
              Relatórios Oficiais - {anoFiltro === '0' ? 'Todos os Anos' : anoFiltro}
              {filtroStatus && <span style={{ marginLeft: '10px', fontSize: '14px', color: 'var(--neon-primary)' }}>👉 Filtrando por: {filtroStatus}</span>}
            </h3>
          </div>
          
          {carregando ? (
            <div className="loading-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '16px' }}>🔄 Carregando dados do banco de produção...</p>
            </div>
          ) : erro ? (
            <div className="error-state" style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                <p>⚠️ {erro}</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nº Relatório</th>
                    <th>Relatório</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Grupo</th>
                    <th>Situação</th>
                    <th>Tipo de Trabalho</th>
                    <th>Texto</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {anoFiltro === '0' && !termoBusca.trim() && !filtroStatus ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '50px', backgroundColor: 'var(--bg-inset)' }}>
                        <span style={{ fontSize: '24px', display: 'block', marginBottom: '10px' }}>📚</span>
                        <h4 style={{ color: 'var(--neon-primary)', margin: '0 0 5px 0', fontSize: '16px' }}>Modo Histórico Ativado</h4>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Digite um termo na pesquisa ou clique num card acima para localizar relatórios antigos.</p>
                      </td>
                    </tr>
                  ) : relatoriosExibidos.length > 0 ? (
                    relatoriosExibidos.map((relatorio) => {
                      const statusLimpo = relatorio.situacao ? relatorio.situacao.trim().toUpperCase() : 'NÃO DEFINIDO';
                      
                      // 🔴 A tabela agora puxa a cor exata que foi gerada para o card!
                      const corDoStatus = getStatusColor(statusLimpo);

                      return (
                        <tr key={relatorio.id}>
                          <td><span className="relatorio-id">{relatorio.numeroRelatorio}</span></td>
                          <td className="desc-cell"><strong>{relatorio.descricaoRelatorio || '---'}</strong></td>
                          <td>{getDataInicio(relatorio)}</td>
                          <td>{getDataFim(relatorio)}</td>
                          <td>{formatarGrupo(relatorio.grupoDescricao)}</td>
                          <td>
                            <span style={{ 
                              padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', 
                              backgroundColor: 'transparent', color: corDoStatus, border: `1px solid ${corDoStatus}` 
                            }}>
                              {statusLimpo}
                            </span>
                          </td>
                          <td>{relatorio.tipoTrabalho || '---'}</td>
                          <td>{relatorio.texto || '---'}</td>
                          <td>
                            <button className="btn-detalhes" onClick={() => navigate(`/auditoria/${relatorio.id}`)}>Ver Detalhes</button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Nenhum relatório encontrado para o filtro selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;