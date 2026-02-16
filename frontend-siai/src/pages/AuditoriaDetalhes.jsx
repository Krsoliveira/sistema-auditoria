import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModalAtividade from '../components/ModalAtividade';
import './AuditoriaDetalhes.css';

const AuditoriaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // URL da API Java (Backend)
  const API_URL = 'http://localhost:8080/api/atividades';

  // --- ESTADOS ---
  
  // Cabeçalho (Fixo por enquanto, pois o banco traz apenas a lista de atividades)
  const [cabecalho] = useState({
      relatorioNome: 'Auditoria Operacional - Fábrica II',
      numero: '2026.011',
      unidade: id === '1' ? 'Loja Jataí' : 'Insumos Rio Verde',
      grupo: 'IND - FÁBRICA DE RAÇÃO II',
      situacao: 'EM ANDAMENTO', // Você pode ajustar isso dinamicamente depois se quiser
      periodo: '27/01/2026 a 27/01/2026',
      auditorLider: 'Kaique Oliveira'
  });

  const [listaAtividades, setListaAtividades] = useState([]); // Dados que vêm do Banco
  const [selectedId, setSelectedId] = useState(null); 
  const [atividadeParaEditar, setAtividadeParaEditar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 1. CARREGAR DADOS DO BACKEND ---
  const carregarAtividades = async () => {
    try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            setListaAtividades(data);
        } else {
            console.error("Erro ao buscar dados do Java");
            alert("Erro ao carregar dados do servidor.");
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro de conexão com o Backend Java.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    carregarAtividades();
  }, []);

  // --- INTERAÇÕES ---

  // Clique Simples: Seleciona
  const handleRowClick = (itemCode) => {
    setSelectedId(itemCode);
  };

  // Duplo Clique: Abre Modal
  const handleRowDoubleClick = (row) => {
    setAtividadeParaEditar(row);
    setIsModalOpen(true);
  };

  // Botão Editar
  const handleEditSelected = () => {
    if (!selectedId) return;
    const row = listaAtividades.find(a => a.item === selectedId);
    if (row) {
        setAtividadeParaEditar(row);
        setIsModalOpen(true);
    }
  };

  // Botão Mover (Visual apenas - O banco ordena por ID padrão)
  const handleMoveSelected = (direction) => {
    if (!selectedId) return;
    const lista = [...listaAtividades];
    const index = lista.findIndex(a => a.item === selectedId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
        [lista[index], lista[index - 1]] = [lista[index - 1], lista[index]];
    }
    else if (direction === 'down' && index < lista.length - 1) {
        [lista[index], lista[index + 1]] = [lista[index + 1], lista[index]];
    }
    setListaAtividades(lista);
  };

  // --- SALVAR NO BANCO DE DADOS ---
  const handleSaveModal = async (atividadeAtualizada) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(atividadeAtualizada)
        });

        if (response.ok) {
            // Sucesso! Recarrega a lista direto do banco para garantir
            await carregarAtividades();
            setIsModalOpen(false);
        } else {
            alert('Erro ao salvar no banco de dados!');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão ao tentar salvar.');
    }
  };

  if (loading) return <div className="loading">Carregando dados do Banco SQL Server...</div>;

  return (
    <div className="audit-details-container">
      
      {/* CABEÇALHO */}
      <section className="audit-info-header">
        <div className="header-left-section">
            <div className="header-top-row">
                <button className="btn-back-link" onClick={() => navigate('/dashboard')}>
                    <span className="arrow">←</span> Voltar
                </button>
                <span className={`status-pill ${cabecalho.situacao === 'ABERTO' ? 'aberto' : 'em-andamento'}`}>
                    {cabecalho.situacao}
                </span>
            </div>
            <h1 className="audit-id-title">Auditoria #{cabecalho.numero}</h1>
            <p className="audit-report-name">{cabecalho.relatorioNome}</p>
        </div>
        <div className="header-vertical-divider"></div>
        <div className="header-right-grid">
            <div className="info-item"><label>Unidade</label><span>{cabecalho.unidade}</span></div>
            <div className="info-item"><label>Grupo</label><span>{cabecalho.grupo}</span></div>
            <div className="info-item"><label>Período</label><span>{cabecalho.periodo}</span></div>
            <div className="info-item"><label>Líder</label><span>{cabecalho.auditorLider}</span></div>
        </div>
      </section>

      {/* ÁREA DA TABELA */}
      <div className="audit-content-split">
        
        <div className="table-toolbar">
            <div className="toolbar-left">
                <span className="toolbar-title">Atividades ({listaAtividades.length})</span>
            </div>
            
            <div className="toolbar-actions">
                <button 
                    className="btn-toolbar" 
                    onClick={() => handleMoveSelected('up')}
                    disabled={!selectedId}
                    title="Mover Acima"
                >
                    ⬆ Mover Acima
                </button>
                <button 
                    className="btn-toolbar" 
                    onClick={() => handleMoveSelected('down')}
                    disabled={!selectedId}
                    title="Mover Abaixo"
                >
                    ⬇ Mover Abaixo
                </button>
                <div className="divider-small"></div>
                <button 
                    className="btn-toolbar primary" 
                    onClick={handleEditSelected}
                    disabled={!selectedId}
                    title="Editar"
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
                {listaAtividades.map((row, index) => {
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
                      
                      {/* Tratamento de datas para não quebrar se vier nulo */}
                      <td>{row.dtInicial ? new Date(row.dtInicial).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : ''}</td>
                      <td>{row.dtFinal ? new Date(row.dtFinal).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : ''}</td>
                      
                      <td>{row.realizadoPor}</td>
                      <td>
                          <span className={`badge-sm ${row.situacao ? row.situacao.toLowerCase().replace(' ', '-') : ''}`}>
                            {row.situacao}
                          </span>
                      </td>
                      <td>{row.classificacao}</td>
                      <td style={{ color: row.pendencia === 'Sim' ? 'red' : 'green', fontWeight: 'bold' }}>{row.pendencia}</td>
                      <td className="truncate-text" title={row.anotacao}>{row.anotacao}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="table-footer-hint">
             ℹ️ Dica: Dados REAIS carregados do SQL Server! Duplo clique para editar e salvar.
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