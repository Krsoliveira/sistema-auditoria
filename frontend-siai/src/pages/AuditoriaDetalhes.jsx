import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModalAtividade from '../components/ModalAtividade'; // Importando o Modal que criamos
import './AuditoriaDetalhes.css';

const AuditoriaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [auditoria, setAuditoria] = useState(null);
  const [selectedAtividade, setSelectedAtividade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla se o modal está visível

  useEffect(() => {
    // --- MOCK DE DADOS (Simulando o Banco de Dados) ---
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
          dtInicial: '2026-01-27', 
          dtFinal: '2026-01-27', 
          realizadoPor: 'Gabriel Vinicius', 
          situacao: 'ABERTO', 
          classificacao: 'Crítico', 
          pendencia: 'Sim', 
          resumo: 'Divergência de peso identificada na balança 02.',
          anotacao: 'Necessário calibrar balança rodoviária.' 
        },
        { 
          item: 2, 
          atividade: 'Saída de produtos', 
          testes: 'Validação de NF de Saída',
          extensao: 'Amostragem Aleatória',
          amostragem: 'NF 501, 502, 505',
          dtInicial: '2026-01-28', 
          dtFinal: '2026-01-28', 
          realizadoPor: 'Jonathas Almeida', 
          situacao: 'EM ANDAMENTO', 
          classificacao: 'Alto Risco', 
          pendencia: 'Não', 
          resumo: 'Sem divergências encontradas.',
          anotacao: '' 
        },
        { 
          item: 3, 
          atividade: 'Senhas SAP R/3', 
          testes: 'Verificação de política de segurança',
          extensao: 'Todos os usuários ativos',
          amostragem: 'Usuários: Adm01, Fin02',
          dtInicial: '2026-02-03', 
          dtFinal: '2026-02-03', 
          realizadoPor: 'Júlio César', 
          situacao: 'CONCLUIDO', 
          classificacao: 'Baixo Risco', 
          pendencia: 'Não', 
          resumo: 'Política aplicada corretamente.',
          anotacao: '' 
        },
      ]
    };
    
    setAuditoria(dadosMock);
  }, [id]);

  // Função chamada ao clicar na linha da tabela
  const handleRowClick = (row) => {
    setSelectedAtividade(row);
    setIsModalOpen(true); // Abre o Modal
  };

  // Função chamada quando o botão GRAVAR é clicado no Modal
  const handleSaveModal = (atividadeAtualizada) => {
    // 1. Atualiza a lista geral
    const novaLista = auditoria.atividades.map(a => 
      a.item === atividadeAtualizada.item ? atividadeAtualizada : a
    );
    
    // 2. Salva no estado principal
    setAuditoria({ ...auditoria, atividades: novaLista });
    
    // 3. Fecha o modal
    setIsModalOpen(false);
  };

  if (!auditoria) return <div className="loading">Carregando dados...</div>;

  return (
    <div className="audit-details-container">
      
      {/* TOPO: Botão Voltar + Título */}
      <div className="top-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="btn-voltar" onClick={() => navigate('/dashboard')}>⬅ Voltar</button>
            <h2 style={{ margin: 0, color: '#1e293b' }}>Auditoria #{auditoria.cabecalho.numero}</h2>
        </div>
        <span className={`status-badge ${auditoria.cabecalho.situacao.toLowerCase()}`}>
            {auditoria.cabecalho.situacao}
        </span>
      </div>

      {/* CABEÇALHO GERAL (Resumo Rápido) */}
      <section className="audit-info-header">
        <div className="info-field"><label>Unidade</label><span>{auditoria.cabecalho.unidade}</span></div>
        <div className="info-field"><label>Grupo</label><span>{auditoria.cabecalho.grupo}</span></div>
        <div className="info-field"><label>Período</label><span>{auditoria.cabecalho.periodo}</span></div>
        <div className="info-field"><label>Líder</label><span>{auditoria.cabecalho.auditorLider}</span></div>
      </section>

      {/* ÁREA DA TABELA */}
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
                    onClick={() => handleRowClick(row)} // Clicou, abriu o Modal
                    className="clickable-row"
                  >
                    <td>{row.item}</td>
                    <td><strong>{row.atividade}</strong></td>
                    {/* Formatação segura das datas */}
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
          <div style={{ padding: '10px', fontSize: '12px', color: '#666', textAlign: 'right', background: '#f8fafc' }}>
             ℹ️ Clique em uma linha para abrir a tela de preenchimento (Modal)
          </div>
        </div>
      </div>

      {/* MODAL DE PREENCHIMENTO (Renderizado condicionalmente) */}
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