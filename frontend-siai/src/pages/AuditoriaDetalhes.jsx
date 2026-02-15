import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModalAtividade from '../components/ModalAtividade';
import './AuditoriaDetalhes.css';

const AuditoriaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [auditoria, setAuditoria] = useState(null);
  const [selectedId, setSelectedId] = useState(null); // ID da linha selecionada (Visual)
  const [atividadeParaEditar, setAtividadeParaEditar] = useState(null); // Dados para o Modal
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
        { item: 1, atividade: 'Recepção de matéria-prima', testes: 'Conferência de pesagem', extensao: '100%', amostragem: 'Tickets 12055', dtInicial: '2026-01-27', dtFinal: '2026-01-27', realizadoPor: 'Gabriel Vinicius', situacao: 'ABERTO', classificacao: 'Crítico', pendencia: 'Sim', anotacao: 'Necessário calibrar balança.', naoConformidade: '', reincidente: '', recomendacao: '', prazoSolucao: '', marcarPendencia: false, anotacaoGeral: '' },
        { item: 2, atividade: 'Saída de produtos acabados', testes: '', extensao: '', amostragem: '', dtInicial: '2026-01-28', dtFinal: '2026-01-28', realizadoPor: 'Jonathas Almeida', situacao: 'EM ANDAMENTO', classificacao: 'Alto Risco', pendencia: 'Não', anotacao: '', naoConformidade: '', reincidente: '', recomendacao: '', prazoSolucao: '', marcarPendencia: false, anotacaoGeral: '' },
        { item: 3, atividade: 'Controle de Senhas SAP R/3', testes: '', extensao: '', amostragem: '', dtInicial: '2026-02-03', dtFinal: '2026-02-03', realizadoPor: 'Júlio César', situacao: 'CONCLUIDO', classificacao: 'Baixo Risco', pendencia: 'Não', anotacao: '', naoConformidade: '', reincidente: '', recomendacao: '', prazoSolucao: '', marcarPendencia: false, anotacaoGeral: '' },
      ]
    };
    setAuditoria(dadosMock);
  }, [id]);

  // 1. Clique Simples: SELECIONA A LINHA
  const handleRowClick = (itemCode) => {
    setSelectedId(itemCode);
  };

  // 2. Duplo Clique: ABRE O MODAL
  const handleRowDoubleClick = (row) => {
    setAtividadeParaEditar(row);
    setIsModalOpen(true);
  };

  // 3. Botão Editar (Barra de Ferramentas)
  const handleEditSelected = () => {
    if (!selectedId || !auditoria) return;
    const row = auditoria.atividades.find(a => a.item === selectedId);
    if (row) {
        setAtividadeParaEditar(row);
        setIsModalOpen(true);
    }
  };

  // 4. Mover Selecionado (Cima/Baixo)
  const handleMoveSelected = (direction) => {
    if (!selectedId || !auditoria) return;

    const lista = [...auditoria.atividades];
    const index = lista.findIndex(a => a.item === selectedId);
    if (index === -1) return;

    // Mover para CIMA
    if (direction === 'up' && index > 0) {
        [lista[index], lista[index - 1]] = [lista[index - 1], lista[index]];
    }
    // Mover para BAIXO
    else if (direction === 'down' && index < lista.length - 1) {
        [lista[index], lista[index + 1]] = [lista[index + 1], lista[index]];
    }

    setAuditoria({ ...auditoria, atividades: lista });
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
      
      {/* CABEÇALHO GERAL */}
      <section className="audit-info-header">
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
        <div className="header-vertical-divider"></div>
        <div className="header-right-grid">
            <div className="info-item"><label>Unidade</label><span>{auditoria.cabecalho.unidade}</span></div>
            <div className="info-item"><label>Grupo</label><span>{auditoria.cabecalho.grupo}</span></div>
            <div className="info-item"><label>Período</label><span>{auditoria.cabecalho.periodo}</span></div>
            <div className="info-item"><label>Líder</label><span>{auditoria.cabecalho.auditorLider}</span></div>
        </div>
      </section>

      {/* ÁREA DA TABELA */}
      <div className="audit-content-split">
        
        {/* BARRA DE FERRAMENTAS (NOVA) */}
        <div className="table-toolbar">
            <div className="toolbar-left">
                <span className="toolbar-title">Atividades ({auditoria.atividades.length})</span>
            </div>
            
            <div className="toolbar-actions">
                <button 
                    className="btn-toolbar" 
                    onClick={() => handleMoveSelected('up')}
                    disabled={!selectedId || auditoria.atividades[0].item === selectedId}
                    title="Mover para Cima"
                >
                    ⬆ Mover Acima
                </button>
                <button 
                    className="btn-toolbar" 
                    onClick={() => handleMoveSelected('down')}
                    disabled={!selectedId || auditoria.atividades[auditoria.atividades.length - 1].item === selectedId}
                    title="Mover para Baixo"
                >
                    ⬇ Mover Abaixo
                </button>
                <div className="divider-small"></div>
                <button 
                    className="btn-toolbar primary" 
                    onClick={handleEditSelected}
                    disabled={!selectedId}
                    title="Editar Atividade Selecionada"
                >
                    ✏️ Editar Detalhes
                </button>
            </div>
        </div>

        <div className="table-panel">
          <div className="table-scroll">
            <table className="modern-table">
              <thead>
                <tr>
                  <th style={{width: '50px', textAlign: 'center'}}>#</th>
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
                {auditoria.atividades.map((row, index) => {
                  const isSelected = selectedId === row.item;
                  return (
                    <tr 
                      key={row.item} 
                      onClick={() => handleRowClick(row.item)} 
                      onDoubleClick={() => handleRowDoubleClick(row)}
                      className={`clickable-row ${isSelected ? 'selected-row' : ''}`}
                    >
                      <td style={{textAlign: 'center', fontWeight: 'bold', color: isSelected ? '#FCA311' : '#666'}}>
                        {index + 1}
                      </td>
                      <td><strong>{row.atividade}</strong></td>
                      <td>{row.dtInicial ? new Date(row.dtInicial).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : ''}</td>
                      <td>{row.dtFinal ? new Date(row.dtFinal).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : ''}</td>
                      <td>{row.realizadoPor}</td>
                      <td><span className={`badge-sm ${row.situacao.toLowerCase().replace(' ', '-')}`}>{row.situacao}</span></td>
                      <td>{row.classificacao}</td>
                      <td style={{ color: row.pendencia === 'Sim' ? 'red' : 'green', fontWeight: 'bold' }}>{row.pendencia}</td>
                      <td className="truncate-text" title={row.anotacao}>{row.anotacao || <em>(Sem anotação)</em>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="table-footer-hint">
             ℹ️ Dica: Clique para selecionar. Duplo clique para editar. Use os botões acima para organizar.
          </div>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {atividadeParaEditar && (
        <ModalAtividade 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            atividade={atividadeParaEditar}
            onSave={handleSaveModal}
        />
      )}

    </div>
  );
};

export default AuditoriaDetalhes;