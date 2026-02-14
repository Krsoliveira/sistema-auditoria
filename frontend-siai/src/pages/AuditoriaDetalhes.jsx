import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModalAtividade from '../components/ModalAtividade'; // Importando o Modal
import './AuditoriaDetalhes.css';

const AuditoriaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [auditoria, setAuditoria] = useState(null);
  const [selectedAtividade, setSelectedAtividade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // --- MOCK DE DADOS ---
    const dadosMock = {
      cabecalho: {
        relatorioNome: 'Auditoria Operacional - Fábrica II',
        numero: '2026.011',
        unidade: id === '1' ? 'Loja Jataí' : 'Insumos Rio Verde',
        grupo: 'IND - FÁBRICA DE RAÇÃO II',
        situacao: 'ABERTO',
        periodo: '27/01/2026 a 27/01/2026',
        auditorLider: 'Kaique Oliveira'
      },
      atividades: [
        { 
          item: 1, 
          atividade: 'Recepção de matéria-prima', 
          testes: 'Conferência de pesagem',
          extensao: '100% dos tickets do dia',
          amostragem: 'Tickets 12055 a 12090',
          dtInicial: '2026-01-27', dtFinal: '2026-01-27', 
          realizadoPor: 'Gabriel Vinicius', 
          situacao: 'ABERTO', classificacao: 'Crítico', pendencia: 'Sim', 
          resumo: 'Divergência de peso identificada na balança 02.',
          anotacao: 'Necessário calibrar balança rodoviária.' 
        },
        { 
          item: 2, 
          atividade: 'Saída de produtos', 
          testes: 'Validação de NF de Saída',
          extensao: 'Amostragem Aleatória',
          amostragem: 'NF 501, 502, 505',
          dtInicial: '2026-01-28', dtFinal: '2026-01-28', 
          realizadoPor: 'Jonathas Almeida', 
          situacao: 'EM ANDAMENTO', classificacao: 'Alto Risco', pendencia: 'Não', 
          resumo: 'Sem divergências encontradas.',
          anotacao: '' 
        },
        { 
          item: 3, 
          atividade: 'Senhas SAP R/3', 
          testes: 'Verificação de política de segurança',
          extensao: 'Todos os usuários ativos',
          amostragem: 'Usuários: Adm01, Fin02',
          dtInicial: '2026-02-03', dtFinal: '2026-02-03', 
          realizadoPor: 'Júlio César', 
          situacao: 'CONCLUIDO', classificacao: 'Baixo Risco', pendencia: 'Não', 
          resumo: 'Política aplicada corretamente.',
          anotacao: '' 
        },
      ]
    };
    
    setAuditoria(dadosMock);
  }, [id]);

  const handleRowClick = (row) => {
    setSelectedAtividade(row);
    setIsModalOpen(true);
  };

  const handleSaveModal = (atividadeAtualizada) => {
    const novaLista = auditoria.atividades.map(a => 
      a.item === atividadeAtualizada.item ? atividadeAtualizada : a
    );
    setAuditoria({ ...auditoria, atividades: novaLista });
    setIsModalOpen(false);
  };

  if (!auditoria) return <div className="loading">Carregando dados...</div>;

  return (
    <div className="audit-details-container">
      
      {/* === CABEÇALHO UNIFICADO E ELEGANTE === */}
      <section className="audit-info-header">
        
        {/* LADO ESQUERDO: Título e Contexto */}
        <div className="header-left-section">
            <div className="header-top-row">
                <button className="btn-back-link" onClick={() => navigate('/dashboard')}>
                    <span className="arrow">←</span> Voltar
                </button>
                <span className={`status-pill ${auditoria.cabecalho.situacao.toLowerCase()}`}>
                    {auditoria.cabecalho.situacao}
                </span>
            </div>
            
            <h1 className="audit-id-title">Auditoria #{auditoria.cabecalho.numero}</h1>
            <p className="audit-report-name">{auditoria.cabecalho.relatorioNome}</p>
        </div>

        {/* DIVISOR VERTICAL */}
        <div className="header-vertical-divider"></div>

        {/* LADO DIREITO: Dados Técnicos */}
        <div className="header-right-grid">
            <div className="info-item">
                <label>Unidade</label>
                <span>{auditoria.cabecalho.unidade}</span>
            </div>
            <div className="info-item">
                <label>Grupo / Setor</label>
                <span>{auditoria.cabecalho.grupo}</span>
            </div>
            <div className="info-item">
                <label>Período</label>
                <span>{auditoria.cabecalho.periodo}</span>
            </div>
            <div className="info-item">
                <label>Auditor Líder</label>
                <span>{auditoria.cabecalho.auditorLider}</span>
            </div>
        </div>

      </section>

      {/* === TABELA DE ATIVIDADES === */}
      <div className="audit-content-split">
        <div className="table-panel">
          <div className="table-scroll">
            <table className="modern-table">
              <thead>
                <tr>
                  <th style={{width: '50px'}}>Item</th>
                  <th>Atividades</th>
                  <th>Dt. Inicial</th>
                  <th>Dt. Final</th>
                  <th>Realizado por</th>
                  <th>Situação</th>
                  <th>Classificação</th>
                  <th>Pendência</th>
                  <th>Anotação</th>
                </tr>
              </thead>
              <tbody>
                {auditoria.atividades.map((row) => (
                  <tr 
                    key={row.item} 
                    onClick={() => handleRowClick(row)} 
                    className="clickable-row"
                  >
                    <td>{row.item}</td>
                    <td><strong>{row.atividade}</strong></td>
                    <td>{row.dtInicial ? new Date(row.dtInicial).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : ''}</td>
                    <td>{row.dtFinal ? new Date(row.dtFinal).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : ''}</td>
                    <td>{row.realizadoPor}</td>
                    <td>
                      <span className={`badge-sm ${row.situacao.toLowerCase().replace(' ', '-')}`}>
                        {row.situacao}
                      </span>
                    </td>
                    <td>{row.classificacao}</td>
                    <td style={{ color: row.pendencia === 'Sim' ? 'red' : 'green', fontWeight: 'bold' }}>
                      {row.pendencia}
                    </td>
                    <td className="truncate-text" title={row.anotacao}>
                      {row.anotacao || <em>(Sem anotação)</em>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer-hint">
             ℹ️ Clique em uma linha para abrir a tela de preenchimento
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedAtividade && (
        <ModalAtividade 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            atividade={selectedAtividade}
            onSave={handleSaveModal}
        />
      )}

    </div>
  );
};

export default AuditoriaDetalhes;