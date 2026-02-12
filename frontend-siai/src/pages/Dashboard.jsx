// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css'; // Certifique-se de que o CSS está na pasta src

const Dashboard = () => {
  const navigate = useNavigate();

  // Dados fictícios (MOCK) para visualizar o layout
  // Note que os IDs (1, 2, 3) serão usados para abrir a tela de detalhes correta
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
          <button className="nav-item">⚙️ Configurações</button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => navigate('/')} className="logout-btn">Sair</button>
        </div>
      </aside>

      {/* 2. Área Principal */}
      <main className="main-content">
        <header className="top-bar">
          <div className="welcome-text">
            <h1>Olá, Auditor</h1>
            <p>Aqui está o resumo das suas atividades.</p>
          </div>
          {/* Botão que leva para criar uma NOVA auditoria */}
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
                      {/* --- AQUI ESTÁ A MUDANÇA IMPORTANTE --- */}
                      {/* Ao clicar, ele navega para /auditoria/1, /auditoria/2, etc. */}
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