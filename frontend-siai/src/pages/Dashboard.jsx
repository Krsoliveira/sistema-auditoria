import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // PEGA OS DADOS DO USUÁRIO QUE SALVAMOS NO LOGIN
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const auditoriasRecentes = [
    { id: 1, unidade: 'Loja Jataí', data: '10/02/2026', status: 'Em Andamento', tipo: 'Planejado' },
    { id: 2, unidade: 'Insumos Rio Verde', data: '08/02/2026', status: 'Finalizado', tipo: 'Sindicância' },
    { id: 3, unidade: 'Armazém Central', data: '01/02/2026', status: 'Pendente', tipo: 'Planejado' },
  ];

  return (
    <div className="dashboard-container">
      {/* 1. Barra Lateral (Menu) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SIAI</h2>
          <span>Auditoria v1.0</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item active">📊 Visão Geral</button>
          <button className="nav-item">📋 Minhas Auditorias</button>
          
          {/* BOTÃO PARA ALTERAR SENHA ADICIONADO AQUI NO MENU */}
          <button 
            className="nav-item" 
            onClick={() => navigate('/alterar-senha')}
          >
            ⚙️ Alterar Senha
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => {
            localStorage.removeItem('usuarioLogado'); // Limpa o login ao sair
            navigate('/');
          }} className="logout-btn">Sair</button>
        </div>
      </aside>

      {/* 2. Área Principal */}
      <main className="main-content">
        <header className="top-bar">
          <div className="welcome-text">
            {/* EXIBE O NOME REAL DO USUÁRIO DO BANCO */}
            <h1>Olá, {usuarioLogado?.nomeCompleto || 'Auditor'}</h1>
            <p>Aqui está o resumo das suas atividades.</p>
          </div>
          <button className="btn-nova-auditoria" onClick={() => navigate('/auditoria')}>
            + Nova Auditoria
          </button>
        </header>

        {/* 3. Cards de Estatísticas */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>12</h3>
            <p>Auditorias no Mês</p>
            <div className="icon-bg">📅</div>
          </div>
          <div className="stat-card pending">
            <h3>4</h3>
            <p>Pendentes</p>
            <div className="icon-bg">⏳</div>
          </div>
          <div className="stat-card success">
            <h3>98%</h3>
            <p>Conformidade Geral</p>
            <div className="icon-bg">✅</div>
          </div>
        </section>

        {/* 4. Tabela de Auditorias Recentes */}
        <section className="recent-audits">
          <h3>Atividades Recentes</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Unidade</th>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {auditoriasRecentes.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.unidade}</strong></td>
                    <td>{item.data}</td>
                    <td>{item.tipo}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-detalhes" 
                        onClick={() => navigate(`/auditoria/${item.id}`)}
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;