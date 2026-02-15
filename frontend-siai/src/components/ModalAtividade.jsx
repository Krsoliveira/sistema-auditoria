import React, { useState, useEffect } from 'react';
import './ModalAtividade.css';

const ModalAtividade = ({ isOpen, onClose, atividade, onSave }) => {
  if (!isOpen || !atividade) return null;

  const PADROES_SUGESTAO = {
    'Recepção': { testes: 'Conferência comparativa entre peso do ticket de balança e nota fiscal.', extensao: '100% das cargas de matéria-prima do dia.', amostragem: 'Selecionar aleatoriamente 5 tickets por turno.' },
    'Saída': { testes: 'Validação de conferência física x documental na portaria.', extensao: 'Amostragem direcionada.', amostragem: 'Cargas de alto valor agregado e granel.' },
    'Estoque': { testes: 'Contagem física cega (dupla contagem).', extensao: 'Itens da Curva A e B.', amostragem: 'Todos os itens com movimentação nos últimos 7 dias.' },
    'Senhas': { testes: 'Verificação de complexidade e expiração de senhas.', extensao: 'Todos os usuários ativos no AD.', amostragem: '100% da base de usuários.' },
    'default': { testes: 'Verificação de conformidade com o procedimento operacional padrão (POP).', extensao: 'Amostragem aleatória conforme matriz de risco.', amostragem: 'Selecionar 10% dos documentos gerados no período.' }
  };

  const [formData, setFormData] = useState(atividade);
  const [showAnotacao, setShowAnotacao] = useState(false);
  
  // Estado para Múltiplos Participantes
  const [participantes, setParticipantes] = useState([]);

  // Mock de Usuários
  const usuarioLogado = 'Kaique Oliveira'; 
  const listaAuditores = ['Gabriel Vinicius', 'Jonathas Almeida', 'Júlio César', 'Kaique Oliveira', 'Ana Paula'];

  useEffect(() => {
    let dadosIniciais = {
        ...atividade,
        naoConformidade: atividade.naoConformidade || '',
        reincidente: atividade.reincidente || '',
        recomendacao: atividade.recomendacao || '',
        prazoSolucao: atividade.prazoSolucao || '',
        marcarPendencia: atividade.marcarPendencia || false,
        anotacaoGeral: atividade.anotacaoGeral || ''
    };

    // Automação de Datas
    if (!dadosIniciais.dtInicial) {
        const hoje = new Date().toISOString().split('T')[0];
        dadosIniciais.dtInicial = hoje;
        dadosIniciais.dtFinal = hoje;
    }

    // Lógica de Participantes (String -> Array)
    if (dadosIniciais.realizadoPor) {
        // Se vier "Kaique, Gabriel", vira ['Kaique', 'Gabriel']
        setParticipantes(dadosIniciais.realizadoPor.split(',').map(p => p.trim()).filter(p => p !== ''));
    } else {
        // Se estiver vazio, adiciona o logado por padrão
        setParticipantes([usuarioLogado]);
    }

    setFormData(dadosIniciais);
    if (atividade.anotacaoGeral) setShowAnotacao(true);
  }, [atividade]);

  const handleChange = (field, value) => {
    let novosDados = { ...formData, [field]: value };
    // Automação NC -> Prazo
    if (field === 'naoConformidade' && value.length > 5 && !formData.prazoSolucao) {
        const dataFutura = new Date();
        dataFutura.setDate(dataFutura.getDate() + 15);
        novosDados.prazoSolucao = dataFutura.toISOString().split('T')[0];
        if (!formData.reincidente) novosDados.reincidente = 'Não';
    }
    setFormData(novosDados);
  };

  // --- LÓGICA DE MÚLTIPLOS PARTICIPANTES ---
  const addParticipante = (e) => {
    const nome = e.target.value;
    if (nome && !participantes.includes(nome)) {
        setParticipantes([...participantes, nome]);
    }
    // Reseta o select visualmente
    e.target.value = "";
  };

  const removeParticipante = (nomeParaRemover) => {
    setParticipantes(participantes.filter(p => p !== nomeParaRemover));
  };

  // Botão Mágico
  const aplicarSugestaoPadrao = () => {
    const nomeAtividade = formData.atividade || '';
    let padraoEncontrado = PADROES_SUGESTAO['default'];

    if (nomeAtividade.includes('Recepção') || nomeAtividade.includes('Matéria-prima')) padraoEncontrado = PADROES_SUGESTAO['Recepção'];
    else if (nomeAtividade.includes('Saída') || nomeAtividade.includes('Expedição')) padraoEncontrado = PADROES_SUGESTAO['Saída'];
    else if (nomeAtividade.includes('Estoque') || nomeAtividade.includes('Contagem')) padraoEncontrado = PADROES_SUGESTAO['Estoque'];
    else if (nomeAtividade.includes('Senha') || nomeAtividade.includes('TI')) padraoEncontrado = PADROES_SUGESTAO['Senhas'];

    setFormData({
        ...formData,
        testes: padraoEncontrado.testes,
        extensao: padraoEncontrado.extensao,
        amostragem: padraoEncontrado.amostragem
    });
  };

  const handleSave = () => {
    // Converte o Array de volta para String antes de salvar
    const dadosFinais = {
        ...formData,
        realizadoPor: participantes.join(', ')
    };
    onSave(dadosFinais);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        
        {/* HEADER */}
        <div className="modal-header">
            <div className="header-title-wrapper">
                <span className="header-icon">📝</span>
                <h3 className="activity-title-header">{formData.atividade}</h3>
            </div>
            <div className="header-controls">
                <button className="btn-close" onClick={onClose} title="Fechar">&times;</button>
            </div>
        </div>

        {/* CORPO */}
        <div className="modal-body-scroll">
            
            {/* BLOCO 1 */}
            <section className="content-block">
                <span className="block-label">01. Cabeçalho do Relatório</span>
                <div className="header-grid">
                    <div className="form-col"><label>Título</label><input type="text" value="RELATÓRIO DE AUDITORIA" className="input-read input-bold" readOnly /></div>
                    <div className="form-col"><label>Relatório</label><input type="text" value="INDÚSTRIA FÁBRICA DE RAÇÃO II" className="input-read" readOnly /></div>
                    <div className="form-col"><label>Abertura</label><input type="text" value="Auditoria realizada no período..." className="input-read" readOnly /></div>
                    <div className="form-col"><label>Controle</label><input type="text" value={`#${formData.item}`} className="input-read input-bold" style={{textAlign: 'center'}} readOnly /></div>
                </div>
            </section>

            {/* BLOCO 2 */}
            <section className="content-block">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <span className="block-label">02. Preenchimento dados da atividade</span>
                    <button className="btn-magic" onClick={aplicarSugestaoPadrao} title="Preencher automaticamente">⚡ Preencher Padrão</button>
                </div>
                <div className="activity-container">
                    <div className="form-col col-std"><label>Atividade</label><textarea className="full-h-input input-read" value={formData.atividade} readOnly /></div>
                    <div className="form-col col-std"><label>Testes Realizados</label><textarea className="full-h-input" value={formData.testes || ''} onChange={(e) => handleChange('testes', e.target.value)} /></div>
                    <div className="form-col col-std"><label>Extensão dos Exames</label><textarea className="full-h-input" value={formData.extensao || ''} onChange={(e) => handleChange('extensao', e.target.value)} /></div>
                    <div className="form-col col-std"><label>Critério / Amostragem</label><textarea className="full-h-input" value={formData.amostragem || ''} onChange={(e) => handleChange('amostragem', e.target.value)} /></div>
                    <div className="form-col col-date"><label>Período</label><div className="date-box"><input type="date" value={formData.dtInicial} onChange={(e) => handleChange('dtInicial', e.target.value)} /><span style={{textAlign: 'center', fontSize: '10px', color: '#999'}}>até</span><input type="date" value={formData.dtFinal} onChange={(e) => handleChange('dtFinal', e.target.value)} /></div></div>
                    <div className="form-col col-wide"><label>Resumo / Observação</label><textarea className="full-h-input" value={formData.resumo || ''} onChange={(e) => handleChange('resumo', e.target.value)} /></div>
                </div>
            </section>

            {/* BLOCO 3 */}
            <section className="content-block">
                 <span className="block-label">03. Pendências do Relatório</span>
                 <div className="pendency-grid">
                    <div className="form-col"><label>1. Não conformidade / Oportunidade de melhoria</label><textarea className="input-box-large" placeholder="Descreva aqui..." value={formData.naoConformidade} onChange={(e) => handleChange('naoConformidade', e.target.value)} /></div>
                    <div className="pendency-row">
                        <div className="form-col" style={{width: '150px'}}><label>2. Reincidente</label><select className="input-box-std" value={formData.reincidente} onChange={(e) => handleChange('reincidente', e.target.value)}><option value="">Selecione...</option><option value="Sim">Sim</option><option value="Não">Não</option></select></div>
                        <div className="form-col" style={{flex: 1}}><label>3. Recomendação</label><input type="text" className="input-box-std" placeholder="Ação recomendada..." value={formData.recomendacao} onChange={(e) => handleChange('recomendacao', e.target.value)} /></div>
                        <div className="form-col" style={{width: '180px'}}><label>4. Data Solução</label><input type="date" className="input-box-std" value={formData.prazoSolucao} onChange={(e) => handleChange('prazoSolucao', e.target.value)} /></div>
                    </div>
                 </div>
            </section>

            {/* BLOCO 4 */}
            <div className="checkbox-row-clean">
                 <label className="checkbox-label-clean"><input type="checkbox" checked={formData.marcarPendencia} onChange={(e) => handleChange('marcarPendencia', e.target.checked)} /><span className="checkbox-text-clean">⚠️ Marcar como pendência na próxima auditoria</span></label>
                 <span className="checkbox-helper-text">(Item aparecerá no próximo relatório)</span>
            </div>

            {/* ANOTAÇÕES EXTRA */}
            {showAnotacao && (
                <section className="content-block animation-fade-in" style={{marginTop: '10px'}}>
                    <span className="block-label" style={{background: '#333', color: '#fff'}}>Anotações Gerais</span>
                    <textarea className="input-box-large" style={{height: '100px'}} placeholder="Insira anotações extras..." value={formData.anotacaoGeral} onChange={(e) => handleChange('anotacaoGeral', e.target.value)} />
                </section>
            )}
        </div>

        {/* === FOOTER COM MULTI-SELECT === */}
        <div className="modal-footer">
            <div className="footer-left-multiselect">
                <label>Realizado por:</label>
                
                <div className="participants-wrapper-footer">
                    {/* Lista de Etiquetas */}
                    {participantes.map(p => (
                        <span key={p} className="participant-chip">
                            {p}
                            <button onClick={() => removeParticipante(p)} title="Remover">×</button>
                        </span>
                    ))}

                    {/* Dropdown de Adicionar */}
                    <select className="add-participant-select" onChange={addParticipante} defaultValue="">
                        <option value="" disabled>+ Adicionar...</option>
                        {listaAuditores.map(nome => (
                            <option key={nome} value={nome}>{nome}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="footer-actions">
                <button className={`btn-sec ${showAnotacao ? 'active' : ''}`} onClick={() => setShowAnotacao(!showAnotacao)}>✏️ Anotações</button>
                <button className="btn-sec">📂 Anexos</button>
                <button className="btn-primary" onClick={handleSave}>💾 Gravar</button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ModalAtividade;