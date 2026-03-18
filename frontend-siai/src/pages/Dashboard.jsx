import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  // 🔴 PEGANDO A PULSEIRA VIP DO COFRE
  const tokenJWT = localStorage.getItem('siai_token'); 
  
  const [relatorios, setRelatorios] = useState([]);
  const [anosDisponiveis, setAnosDisponiveis] = useState([]); 
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const filtroSalvo = JSON.parse(sessionStorage.getItem('dashboard_filtros') || 'null');

  const [anoFiltro, setAnoFiltro] = useState(filtroSalvo?.anoFiltro || '2026');
  const [termoBuscaInput, setTermoBuscaInput] = useState(filtroSalvo?.buscaAtiva || '');
  const [buscaAtiva, setBuscaAtiva] = useState(filtroSalvo?.buscaAtiva || '');

  const [filtroStatus, setFiltroStatus] = useState(filtroSalvo?.filtroStatus || null);

  const [paginaAtual, setPaginaAtual] = useState(filtroSalvo?.paginaAtual || 0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistos, setTotalRegistos] = useState(0); 
  const tamanhoPagina = 15; 

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

  // 🔴 MOSTRANDO A PULSEIRA VIP AO BUSCAR OS ANOS
  useEffect(() => {
    fetch('http://localhost:8080/api/relatorios/anos', {
      headers: {
        'Authorization': `Bearer ${tokenJWT}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setAnosDisponiveis(data);
        if (data.length > 0) {
          setAnoFiltro(prev => {
            if (!data.includes(Number(prev))) {
              return data[0].toString();
            }
            return prev;
          });
        }
      })
      .catch(err => console.error("Erro ao buscar anos:", err));
  }, [tokenJWT]);

  // Volta para a página 0 se mudar o ano, o termo ou clicar num card
  useEffect(() => {
    setPaginaAtual(0);
  }, [anoFiltro, buscaAtiva, filtroStatus]);

  // 🔴 MOSTRANDO A PULSEIRA VIP AO BUSCAR OS RELATÓRIOS
  useEffect(() => {
    if (!anoFiltro) return;
    setCarregando(true);
    setErro(null);

    let url = `http://localhost:8080/api/relatorios?ano=${anoFiltro}&page=${paginaAtual}&size=${tamanhoPagina}`;
    if (buscaAtiva) {
      url += `&busca=${encodeURIComponent(buscaAtiva)}`;
    }

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${tokenJWT}`
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao buscar dados do servidor');
        return response.json();
      })
      .then((data) => {
        setRelatorios(data.content || []);
        setTotalPaginas(data.totalPages || 0);
        setTotalRegistos(data.totalElements || 0);
        setCarregando(false);
      })
      .catch((error) => {
        console.error('Erro de conexão:', error);
        setErro('Não foi possível carregar as auditorias.');
        setCarregando(false);
      });
  }, [anoFiltro, buscaAtiva, paginaAtual, tokenJWT]);

  // Ação de disparar a busca no botão ou Enter
  const realizarBusca = () => {
    setBuscaAtiva(termoBuscaInput);
    setFiltroStatus(null);
  };

  const limparBusca = () => {
    setTermoBuscaInput('');
    setBuscaAtiva('');
  };

  const relatoriosUnicos = [];
  const mapIds = new Set();
  for (const r of relatorios) {
    if (!mapIds.has(r.id)) {
      mapIds.add(r.id);
      relatoriosUnicos.push(r);
    }
  }

  // O React agora só aplica o filtro dos cards de Status visualmente na página atual
  const relatoriosExibidos = relatoriosUnicos.filter((r) => {
    const sit = (r.situacao || 'NÃO DEFINIDO').trim().toUpperCase();
    if (filtroStatus && sit !== filtroStatus) return false;
    return true;
  });

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

  const totalPlanejadoDaPagina = relatoriosUnicos.length; 
  
  const statusMap = {};
  relatoriosUnicos.forEach(r => {
    const sit = (r.situacao || 'NÃO DEFINIDO').trim().toUpperCase();
    statusMap[sit] = (statusMap[sit] || 0) + 1;
  });

  const statusCards = Object.keys(statusMap).sort().map(sit => ({
    status: sit,
    count: statusMap[sit]
  }));

  const getStatusColor = (status) => {
    switch(status) {
      case 'FINALIZADO': return '#28a745'; 
      case 'AGUARDANDO': return '#ffc107'; 
      case 'ABERTO': return '#17a2b8';     
      case 'REVISÃO': return '#6f42c1';    
      case 'CANCELADO': return '#dc3545';  
      case 'SUSPENSO': return '#fd7e14';   
      case 'GERÊNCIA': return '#0d6efd';   
      case 'DIRETORIA': return '#e83e8c';  
      case 'CONCLUÍDO': return '#20c997';  
      case 'NÃO DEFINIDO': return '#6c757d'; 
      default: return '#00e5ff';           
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

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];
    if (totalPaginas <= maxVisiblePages) {
      for (let i = 0; i < totalPaginas; i++) pages.push(i);
    } else {
      if (paginaAtual <= 2) {
        pages.push(0, 1, 2, 3, '...', totalPaginas - 1);
      } else if (paginaAtual >= totalPaginas - 3) {
        pages.push(0, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1);
      } else {
        pages.push(0, '...', paginaAtual - 1, paginaAtual, paginaAtual + 1, '...', totalPaginas - 1);
      }
    }
    return pages;
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

        {buscaAtiva && (
          <div style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--neon-primary)', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '18px', marginRight: '10px' }}>🔍</span>
              <span style={{ color: 'var(--text-bright)' }}>Mostrando resultados para </span>
              <strong style={{ color: 'var(--neon-primary)', fontSize: '16px' }}>"{buscaAtiva}"</strong>
              <span style={{ color: 'var(--text-bright)' }}> no filtro: </span>
              <strong style={{ color: 'var(--neon-primary)', fontSize: '16px' }}>{anoFiltro === '0' ? 'Todos os Anos' : anoFiltro}</strong>
            </div>
            <button onClick={limparBusca} style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '6px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Limpar Pesquisa ✖
            </button>
          </div>
        )}

        <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px', opacity: buscaAtiva ? 0.5 : 1 }}>
          <div className="stat-card" onClick={() => setFiltroStatus(null)} style={getCardStyle(null, '#0a6ed1')}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {buscaAtiva ? 'Total Encontrado' : (anoFiltro === '0' ? 'Total Histórico' : 'Total no Ano')}
            </p>
            <h3 style={{ fontSize: '32px', margin: '0', color: 'var(--text-bright)' }}>{totalRegistos}</h3>
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>Na página atual: {totalPlanejadoDaPagina}</div>
          </div>
          
          {statusCards.map((item) => {
            const cor = getStatusColor(item.status);
            const progresso = totalPlanejadoDaPagina > 0 ? Math.round((item.count / totalPlanejadoDaPagina) * 100) : 0;
            return (
              <div key={item.status} className="stat-card" onClick={() => handleCardClick(item.status)} style={getCardStyle(item.status, cor)}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.status}</p>
                <h3 style={{ fontSize: '32px', margin: '0', color: cor }}>{item.count}</h3>
                <div style={{ marginTop: '10px', background: 'rgba(128,128,128,0.15)', borderRadius: '4px', height: '6px', width: '100%' }}>
                  <div style={{ background: cor, height: '6px', borderRadius: '4px', width: `${progresso}%` }}></div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>{progresso}% desta página</div>
              </div>
            );
          })}
        </section>

        <section className="filters-section" style={{ 
            display: 'flex', gap: '20px', marginBottom: '25px', padding: '20px', 
            background: 'var(--bg-panel)', borderRadius: '16px', boxShadow: 'var(--panel-shadow)',
            alignItems: 'flex-start', flexWrap: 'wrap', backdropFilter: 'var(--glass-blur)', border: 'var(--glass-border)'
          }}>
          
          <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neon-primary)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selecionar Ano</label>
            <select value={anoFiltro} onChange={(e) => setAnoFiltro(e.target.value)} style={{ padding: '12px 16px', fontSize: '15px', borderRadius: '8px', backgroundColor: 'var(--bg-inset)', border: '1px solid rgba(128, 128, 128, 0.2)', color: 'var(--text-bright)', cursor: 'pointer', outline: 'none' }}>
              <option value="0">Todos os Anos (Global)</option>
              {anosDisponiveis.length > 0 ? anosDisponiveis.map(ano => <option key={ano} value={ano}>{ano}</option>) : <option value="2026">2026</option>}
            </select>
          </div>

          <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '300px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neon-primary)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pesquisar no Banco de Dados</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Digite número, grupo ou descrição e aperte Enter..." 
                  value={termoBuscaInput} 
                  onChange={(e) => setTermoBuscaInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && realizarBusca()}
                  style={{ padding: '12px 16px 12px 40px', fontSize: '15px', borderRadius: '8px', backgroundColor: 'var(--bg-inset)', border: '1px solid rgba(128, 128, 128, 0.2)', color: 'var(--text-bright)', width: '100%', outline: 'none', boxSizing: 'border-box' }} 
                />
                <span style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '16px', color: 'var(--neon-primary)' }}>🔍</span>
              </div>
              <button 
                onClick={realizarBusca}
                style={{ background: 'var(--neon-primary)', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Pesquisar
              </button>
            </div>
          </div>
        </section>

        <section className="recent-audits">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>
              {buscaAtiva ? 'Resultados da Busca' : `Relatórios Oficiais - ${anoFiltro === '0' ? 'Todos os Anos' : anoFiltro}`}
              {filtroStatus && <span style={{ marginLeft: '10px', fontSize: '14px', color: 'var(--neon-primary)' }}>👉 Filtrando por: {filtroStatus}</span>}
            </h3>
          </div>
          
          {carregando ? (
            <div className="loading-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '16px' }}>🔄 Consultando banco de dados...</p>
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
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {relatoriosExibidos.length > 0 ? (
                    relatoriosExibidos.map((relatorio) => {
                      const statusLimpo = relatorio.situacao ? relatorio.situacao.trim().toUpperCase() : 'NÃO DEFINIDO';
                      const corDoStatus = getStatusColor(statusLimpo);

                      return (
                        <tr key={relatorio.id}>
                          <td><span className="relatorio-id">{relatorio.numeroRelatorio || '---'}</span></td>
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
                          <td>
                            <button className="btn-detalhes" onClick={() => {
                              sessionStorage.setItem('dashboard_filtros', JSON.stringify({
                                anoFiltro, buscaAtiva, filtroStatus, paginaAtual
                              }));
                              navigate(`/auditoria/${relatorio.id}`);
                            }}>Ver Detalhes</button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Nenhum resultado encontrado no banco de dados para os critérios informados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {totalPaginas > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: 'var(--bg-inset)', borderTop: 'var(--glass-border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    Mostrando <strong>{(paginaAtual * tamanhoPagina) + 1}</strong> a <strong>{Math.min((paginaAtual + 1) * tamanhoPagina, totalRegistos)}</strong> de <strong>{totalRegistos}</strong> resultados
                  </div>
                  
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button 
                      onClick={() => setPaginaAtual(prev => Math.max(0, prev - 1))} 
                      disabled={paginaAtual === 0}
                      style={{ padding: '6px 10px', background: 'transparent', color: paginaAtual === 0 ? 'var(--text-muted)' : 'var(--text-bright)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: paginaAtual === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      &lt;
                    </button>

                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} style={{ color: 'var(--text-muted)', padding: '0 5px' }}>...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setPaginaAtual(page)}
                          style={{
                            padding: '6px 12px',
                            background: page === paginaAtual ? 'var(--neon-primary)' : 'transparent',
                            color: page === paginaAtual ? '#fff' : 'var(--text-bright)',
                            border: page === paginaAtual ? 'none' : '1px solid var(--glass-border)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: page === paginaAtual ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                          }}
                        >
                          {page + 1}
                        </button>
                      )
                    ))}

                    <button 
                      onClick={() => setPaginaAtual(prev => prev + 1)} 
                      disabled={paginaAtual >= totalPaginas - 1}
                      style={{ padding: '6px 10px', background: 'transparent', color: paginaAtual >= totalPaginas - 1 ? 'var(--text-muted)' : 'var(--text-bright)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: paginaAtual >= totalPaginas - 1 ? 'not-allowed' : 'pointer' }}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;