import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // O CARIMBO AQUI
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

  const [filtrosBusca, setFiltrosBusca] = useState({
    numero: true,
    descricao: true,
    grupo: true
  });

  const toggleFiltro = (campo) => {
    setFiltrosBusca(prev => {
      const novoEstado = { ...prev, [campo]: !prev[campo] };
      if (!novoEstado.numero && !novoEstado.descricao && !novoEstado.grupo) {
        return prev; 
      }
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
    return String(texto)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // 1. BARREIRA SANITÁRIA: Remove relatórios duplicados que vêm do SQL Server
  const relatoriosUnicos = [];
  const mapIds = new Set();
  for (const r of relatorios) {
    if (r.numeroRelatorio && !mapIds.has(r.id)) {
      mapIds.add(r.id);
      relatoriosUnicos.push(r);
    }
  }

  // 2. MOTOR DE BUSCA RIGOROSO (Usando a lista limpa)
  const relatoriosFiltrados = relatoriosUnicos.filter((r) => {
    if (anoFiltro === '0' && !termoBusca.trim()) return false;
    if (!termoBusca.trim()) return true;
    
    // Monta a string de busca estritamente baseada nos chips ativos
    let textoAlvo = "";
    if (filtrosBusca.numero) textoAlvo += " " + (r.numeroRelatorio || "");
    if (filtrosBusca.descricao) textoAlvo += " " + (r.descricaoRelatorio || "");
    if (filtrosBusca.grupo) textoAlvo += " " + (r.grupoDescricao || "");
    
    const textoCompleto = normalizarTexto(textoAlvo);
    const termosDigitados = normalizarTexto(termoBusca).split(' ').filter(t => t.length > 0);
    
    // O relatório só passa se contiver TODAS as palavras digitadas
    let matchesAll = true;
    for (let termo of termosDigitados) {
      if (!textoCompleto.includes(termo)) {
        matchesAll = false;
        break;
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
    const statusLimpo = r.situacao ? r.situacao.trim().toUpperCase() : '';
    if (statusLimpo === 'FINALIZADO') return formatarData(r.dataInicialRealizada || r.dataInicialPrevista); 
    return formatarData(r.dataInicialPrevista);
  };

  const getDataFim = (r) => {
    const statusLimpo = r.situacao ? r.situacao.trim().toUpperCase() : '';
    if (statusLimpo === 'FINALIZADO') return formatarData(r.dataFinalRealizada || r.dataFinalPrevista);
    return formatarData(r.dataFinalPrevista);
  };

  const formatarGrupo = (grupo) => {
    if (!grupo) return '---';
    const textoLimpo = grupo.replace(/\s+/g, ' ').trim();
    if (textoLimpo.includes('INSUMOS / PROGRAMA 5S')) return 'INSUMOS';
    return grupo;
  };

  // Os cards calculam as estatísticas baseadas na lista limpa
  const totalPlanejadoAno = relatoriosUnicos.length; 
  const qtdFinalizados = relatoriosUnicos.filter(r => (r.situacao || '').trim().toUpperCase() === 'FINALIZADO').length;
  const qtdAguardando = relatoriosUnicos.filter(r => (r.situacao || '').trim().toUpperCase() === 'AGUARDANDO').length;
  const qtdEmAndamento = relatoriosUnicos.filter(r => {
    const sit = (r.situacao || '').trim().toUpperCase();
    return sit === 'ABERTO' || sit === 'REVISÃO';
  }).length;

  const progressoPorcentagem = totalPlanejadoAno > 0 ? Math.round((qtdFinalizados / totalPlanejadoAno) * 100) : 0;

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* 🔴 O NOSSO COMPONENTE MÁGICO SUBSTITUIU MILHARES DE LINHAS AQUI */}
      <Sidebar />

      <main className="main-content" style={{ flex: 1 }}>
        <header className="top-bar">
          <div className="welcome-text">
            <h1>Olá, {usuarioLogado?.colNome || 'Auditor'}</h1>
            <p>Painel de Controle de Auditorias (Produção)</p>
          </div>
        </header>

        <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div className="stat-card" style={{ background: 'var(--bg-panel)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #0056b3', boxShadow: 'var(--panel-shadow)', backdropFilter: 'var(--glass-blur)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {anoFiltro === '0' ? 'Total Histórico' : 'Total Planejado (Ano)'}
            </p>
            <h3 style={{ fontSize: '32px', margin: '0', color: 'var(--text-bright)' }}>{totalPlanejadoAno}</h3>
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>Auditorias listadas</div>
          </div>
          
          <div className="stat-card" style={{ background: 'var(--bg-panel)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #28a745', boxShadow: 'var(--panel-shadow)', backdropFilter: 'var(--glass-blur)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Concluídos</p>
            <h3 style={{ fontSize: '32px', margin: '0', color: '#28a745' }}>{qtdFinalizados}</h3>
            <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '6px', width: '100%' }}>
              <div style={{ background: '#28a745', height: '6px', borderRadius: '4px', width: `${progressoPorcentagem}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>{progressoPorcentagem}% do total listado</div>
          </div>

          <div className="stat-card" style={{ background: 'var(--bg-panel)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #17a2b8', boxShadow: 'var(--panel-shadow)', backdropFilter: 'var(--glass-blur)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Em Andamento</p>
            <h3 style={{ fontSize: '32px', margin: '0', color: '#17a2b8' }}>{qtdEmAndamento}</h3>
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>Abertos e em Revisão</div>
          </div>

          <div className="stat-card" style={{ background: 'var(--bg-panel)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #ffc107', boxShadow: 'var(--panel-shadow)', backdropFilter: 'var(--glass-blur)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 5px 0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aguardando</p>
            <h3 style={{ fontSize: '32px', margin: '0', color: '#d39e00' }}>{qtdAguardando}</h3>
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>Na fila para iniciar</div>
          </div>
        </section>

        <section className="filters-section" style={{ 
            display: 'flex', gap: '20px', marginBottom: '25px', padding: '20px', 
            background: 'var(--bg-panel)', borderRadius: '16px', boxShadow: 'var(--panel-shadow)',
            alignItems: 'flex-start', flexWrap: 'wrap', backdropFilter: 'var(--glass-blur)', border: 'var(--glass-border)'
          }}>
          
          <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neon-primary)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Ano da Auditoria
            </label>
            <select 
              value={anoFiltro} 
              onChange={(e) => setAnoFiltro(e.target.value)}
              style={{ 
                padding: '12px 16px', fontSize: '15px', borderRadius: '8px', 
                backgroundColor: 'var(--bg-inset)', border: '1px solid rgba(0, 242, 255, 0.1)',
                color: 'var(--text-bright)', cursor: 'pointer', outline: 'none',
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)', boxSizing: 'border-box'
              }}
            >
              <option value="0">Todos os Anos</option>
              {anosDisponiveis.length > 0 ? (
                anosDisponiveis.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))
              ) : (
                <option value="2026">2026</option>
              )}
            </select>
          </div>

          <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '300px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neon-primary)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Buscar Auditoria
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Pesquise aqui..." 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                style={{ 
                  padding: '12px 16px 12px 40px', fontSize: '15px', borderRadius: '8px', 
                  backgroundColor: 'var(--bg-inset)', border: '1px solid rgba(0, 242, 255, 0.1)',
                  color: 'var(--text-bright)', width: '100%', outline: 'none',
                  boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)', transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '16px', color: 'var(--neon-primary)' }}>
                🔍
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '5px' }}>Filtrar por:</span>
              
              <button 
                onClick={() => toggleFiltro('numero')}
                style={{
                  background: filtrosBusca.numero ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
                  border: `1px solid ${filtrosBusca.numero ? 'var(--neon-primary)' : 'rgba(255,255,255,0.1)'}`,
                  color: filtrosBusca.numero ? 'var(--neon-primary)' : 'var(--text-muted)',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
                }}>
                {filtrosBusca.numero ? '✓' : '+'} Nº Relatório
              </button>

              <button 
                onClick={() => toggleFiltro('descricao')}
                style={{
                  background: filtrosBusca.descricao ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
                  border: `1px solid ${filtrosBusca.descricao ? 'var(--neon-primary)' : 'rgba(255,255,255,0.1)'}`,
                  color: filtrosBusca.descricao ? 'var(--neon-primary)' : 'var(--text-muted)',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
                }}>
                {filtrosBusca.descricao ? '✓' : '+'} Descrição
              </button>

              <button 
                onClick={() => toggleFiltro('grupo')}
                style={{
                  background: filtrosBusca.grupo ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
                  border: `1px solid ${filtrosBusca.grupo ? 'var(--neon-primary)' : 'rgba(255,255,255,0.1)'}`,
                  color: filtrosBusca.grupo ? 'var(--neon-primary)' : 'var(--text-muted)',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
                }}>
                {filtrosBusca.grupo ? '✓' : '+'} Grupo
              </button>
            </div>
          </div>
        </section>

        <section className="recent-audits">
          <div className="section-header">
            <h3>Relatórios Oficiais - {anoFiltro === '0' ? 'Todos os Anos' : anoFiltro}</h3>
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
                  {anoFiltro === '0' && !termoBusca.trim() ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '50px', backgroundColor: 'rgba(0, 242, 255, 0.02)' }}>
                        <span style={{ fontSize: '24px', display: 'block', marginBottom: '10px' }}>📚</span>
                        <h4 style={{ color: 'var(--neon-primary)', margin: '0 0 5px 0', fontSize: '16px' }}>Modo Histórico Ativado</h4>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Digite um termo na barra de pesquisa acima para localizar relatórios antigos.</p>
                      </td>
                    </tr>
                  ) : relatoriosExibidos.length > 0 ? (
                    relatoriosExibidos.map((relatorio) => {
                      const statusLimpo = relatorio.situacao ? relatorio.situacao.trim().toUpperCase() : '';

                      let corFundo = 'rgba(255, 255, 255, 0.05)';
                      let corTexto = 'var(--text-muted)';
                      let corBorda = 'rgba(255, 255, 255, 0.1)';
                      
                      if (statusLimpo === 'FINALIZADO') {
                        corFundo = 'rgba(40, 167, 69, 0.15)'; corTexto = '#28a745'; corBorda = 'rgba(40, 167, 69, 0.3)';
                      } else if (statusLimpo === 'AGUARDANDO') {
                        corFundo = 'rgba(255, 193, 7, 0.15)'; corTexto = '#ffc107'; corBorda = 'rgba(255, 193, 7, 0.3)';
                      } else if (statusLimpo === 'ABERTO' || statusLimpo === 'REVISÃO') {
                        corFundo = 'rgba(23, 162, 184, 0.15)'; corTexto = '#17a2b8'; corBorda = 'rgba(23, 162, 184, 0.3)';
                      }

                      return (
                        <tr key={relatorio.id}>
                          <td><span className="relatorio-id">{relatorio.numeroRelatorio}</span></td>
                          <td className="desc-cell"><strong>{relatorio.descricaoRelatorio || '---'}</strong></td>
                          <td>{getDataInicio(relatorio)}</td>
                          <td>{getDataFim(relatorio)}</td>
                          <td>{formatarGrupo(relatorio.grupoDescricao)}</td>
                          <td>
                            <span style={{ 
                              padding: '5px 10px', borderRadius: '20px', fontSize: '12px', 
                              fontWeight: '700', backgroundColor: corFundo, color: corTexto,
                              border: `1px solid ${corBorda}`
                            }}>
                              {relatorio.situacao || '---'}
                            </span>
                          </td>
                          <td>{relatorio.tipoTrabalho || '---'}</td>
                          <td>{relatorio.texto || '---'}</td>
                          <td>
                            <button className="btn-detalhes" onClick={() => navigate(`/auditoria/${relatorio.id}`)}>
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Nenhum relatório encontrado com esses filtros.
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