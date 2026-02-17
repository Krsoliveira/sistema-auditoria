import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Dashboard.css'; // Usa o mesmo CSS do painel

const AuditoriaDetalhes = () => {
  const { id } = useParams(); // Pega o ID da URL (ex: 98)
  const navigate = useNavigate();
  
  // Estados para armazenar os dados
  const [relatorio, setRelatorio] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // 1. Busca a Capa do Relatório (Nome, Gestor, Data)
    fetch(`http://localhost:8080/api/relatorios/${id}`)
      .then(res => res.json())
      .then(data => setRelatorio(data))
      .catch(err => console.error("Erro ao buscar relatório:", err));

    // 2. Busca as Atividades/Itens (Caixa Geral, Estoque, etc)
    // Nota: Essa rota deve bater com o Controller Java 'RelatorioAtividadeController'
    fetch(`http://localhost:8080/api/atividades-execucao/${id}`)
      .then(res => res.json())
      .then(data => {
        setAtividades(data);
        setCarregando(false); // Só para de carregar quando as atividades chegarem
      })
      .catch(err => {
        console.error("Erro ao buscar atividades:", err);
        setCarregando(false);
      });

  }, [id]);

  // Função auxiliar: Formata Data
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    return new Date(dataString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  // Função auxiliar: Remove tags HTML (ex: <html><body>...) para mostrar texto limpo
  const limparHTML = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Função auxiliar: Define cor do status
  const getStatusColor = (status) => {
    if (!status) return 'gray';
    if (status === 'FINALIZADO') return 'green';
    if (status === 'PENDENTE') return 'orange';
    return 'blue';
  };

  if (carregando) return <div className="dashboard-container"><p style={{padding: '20px'}}>Carregando detalhes do processo...</p></div>;
  if (!relatorio) return <div className="dashboard-container"><p style={{padding: '20px'}}>Relatório não encontrado.</p></div>;

  return (
    <div className="dashboard-container">
      {/* --- MENU LATERAL --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
           <h2>SIAI</h2>
        </div>
        <nav className="sidebar-nav">
           <button className="nav-item active" onClick={() => navigate('/dashboard')}>⬅ Voltar para Lista</button>
        </nav>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="main-content">
        <header className="top-bar">
          <div className="welcome-text">
            <h1>Detalhes da Auditoria</h1>
            <p>Relatório Nº <strong>{relatorio.numero}</strong></p>
          </div>
        </header>

        <section className="recent-audits">
            <div className="card-detalhe" style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                
                {/* 1. CABEÇALHO DO RELATÓRIO */}
                <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
                    {relatorio.descricao}
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div>
                        <small style={{color: '#7f8c8d'}}>GESTOR RESPONSÁVEL</small>
                        <p style={{fontWeight: 'bold', fontSize: '1.1em'}}>{relatorio.gestor}</p>
                    </div>
                    <div>
                        <small style={{color: '#7f8c8d'}}>DATA REALIZAÇÃO</small>
                        <p style={{fontWeight: 'bold', fontSize: '1.1em'}}>{formatarData(relatorio.data)}</p>
                    </div>
                    <div>
                         <small style={{color: '#7f8c8d'}}>AUDITOR LÍDER</small>
                         <p style={{fontWeight: 'bold', fontSize: '1.1em'}}>{relatorio.auditorLider || 'Não informado'}</p>
                    </div>
                </div>

                {/* 2. TABELA DE ITENS (ATIVIDADES) */}
                <h3 style={{ marginTop: '40px', marginBottom: '15px', color: '#34495e' }}>
                    Itens Verificados ({atividades.length})
                </h3>

                {atividades.length === 0 ? (
                    <div style={{padding: '20px', background: '#f8f9fa', borderRadius: '5px', textAlign: 'center'}}>
                        Nenhum item de verificação encontrado para este relatório.
                    </div>
                ) : (
                    <div className="table-container">
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{background: '#f1f2f6', color: '#57606f', textAlign: 'left'}}>
                                    <th style={{padding: '12px', borderBottom: '2px solid #dfe6e9'}}>Tarefa / Descrição</th>
                                    <th style={{padding: '12px', borderBottom: '2px solid #dfe6e9'}}>Data Início</th>
                                    <th style={{padding: '12px', borderBottom: '2px solid #dfe6e9'}}>Status</th>
                                    <th style={{padding: '12px', borderBottom: '2px solid #dfe6e9'}}>Observação (Resumo)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atividades.map((item) => (
                                    <tr key={item.id} style={{borderBottom: '1px solid #eee'}}>
                                        <td style={{padding: '12px', fontWeight: '500', color: '#2c3e50'}}>
                                            {item.descricao}
                                        </td>
                                        <td style={{padding: '12px', color: '#7f8c8d'}}>
                                            {formatarData(item.dataInicial)}
                                        </td>
                                        <td style={{padding: '12px'}}>
                                            <span style={{
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                fontSize: '0.85em', 
                                                fontWeight: 'bold',
                                                color: 'white',
                                                backgroundColor: getStatusColor(item.status)
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{padding: '12px', fontSize: '0.9em', color: '#636e72', maxWidth: '300px'}}>
                                            {/* Limpa o HTML e mostra apenas os primeiros 60 caracteres */}
                                            {limparHTML(item.observacaoHTML).substring(0, 60)}
                                            {limparHTML(item.observacaoHTML).length > 60 && '...'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="btn-voltar-estilizado"
                    style={{ 
                        marginTop: '30px', 
                        padding: '10px 20px', 
                        background: '#34495e', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}
                >
                    Voltar para o Painel
                </button>
            </div>
        </section>
      </main>
    </div>
  );
};

export default AuditoriaDetalhes;