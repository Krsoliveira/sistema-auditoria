import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css'; // Certifique-se que o CSS está nesta pasta

const Dashboard = () => {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  
  // Estado para armazenar a lista vinda do Banco de Dados
  const [relatorios, setRelatorios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca os dados da API Java ao carregar a tela
  useEffect(() => {
    // A rota deve bater com o Controller Java criado: /api/relatorios
    fetch('http://localhost:8080/api/relatorios')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do servidor');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dados recebidos do Java:", data); // Para debug no F12
        setRelatorios(data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error('Erro de conexão:', error);
        setErro('Não foi possível carregar as auditorias.');
        setCarregando(false);
      });
  }, []);

  // Função para formatar a data (YYYY-MM-DD -> DD/MM/YYYY)
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    // Ajusta o fuso horário para não exibir o dia anterior
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  // Função de Logout
  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR (Menu Lateral) --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
           <h2>SIAI</h2>
           <span>Auditoria Interna</span>
        </div>
        <nav className="sidebar-nav">
           <button className="nav-item active">📊 Visão Geral</button>
           <button className="nav-item" onClick={() => navigate('/alterar-senha')}>⚙️ Alterar Senha</button>
           <button className="nav-item logout" onClick={handleLogout}>🚪 Sair</button>
        </nav>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="main-content">
        <header className="top-bar">
          <div className="welcome-text">
            <h1>Olá, {usuarioLogado?.nomeCompleto || 'Auditor'}</h1>
            <p>Painel de Controle de Auditorias (Produção)</p>
          </div>
        </header>

        {/* --- CARDS DE ESTATÍSTICAS --- */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>{relatorios.length}</h3>
            <p>Relatórios Totais</p>
            <div className="icon-bg">📂</div>
          </div>
          
          {/* Exemplo: Filtrando por trimestre se houver dados, senão mostra zero */}
          <div className="stat-card success">
            <h3>{relatorios.filter(r => r.trimestre === 4).length}</h3>
            <p>Realizados no 4º Trimestre</p>
            <div className="icon-bg">✅</div>
          </div>

          <div className="stat-card pending">
            <h3>{relatorios.length > 0 ? 'Ativo' : '---'}</h3>
            <p>Status do Sistema</p>
            <div className="icon-bg">📡</div>
          </div>
        </section>

        {/* --- TABELA DE DADOS --- */}
        <section className="recent-audits">
          <div className="section-header">
            <h3>Relatórios de Auditoria</h3>
            <span className="badge-total">{relatorios.length} encontrados</span>
          </div>
          
          {carregando ? (
            <div className="loading-state">
                <p>🔄 Carregando dados do banco de produção...</p>
            </div>
          ) : erro ? (
            <div className="error-state">
                <p>⚠️ {erro}</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nº Relatório</th>
                    <th>Unidade / Descrição</th>
                    <th>Data Realização</th>
                    <th>Gestor Responsável</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorios.map((relatorio) => (
                    <tr key={relatorio.id}>
                      {/* As chaves abaixo devem ser iguais ao arquivo Java Relatorio.java */}
                      <td>
                        <span className="relatorio-id">#{relatorio.numero}</span>
                      </td>
                      <td className="desc-cell">
                        <strong>{relatorio.descricao}</strong>
                        {relatorio.auditorLider && (
                            <div className="sub-info">Auditor: {relatorio.auditorLider}</div>
                        )}
                      </td>
                      <td>{formatarData(relatorio.data)}</td>
                      <td>{relatorio.gestor || 'Não informado'}</td>
                      <td>
                        <button 
                            className="btn-detalhes" 
                            onClick={() => navigate(`/auditoria/${relatorio.id}`)}
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
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