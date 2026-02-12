import React, { useState, useEffect } from 'react';
import './ModalAtividade.css';

const ModalAtividade = ({ isOpen, onClose, atividade, onSave }) => {
  if (!isOpen || !atividade) return null;

  const [formData, setFormData] = useState(atividade);

  useEffect(() => {
    setFormData(atividade);
  }, [atividade]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        
        {/* === HEADER AZUL FIXO === */}
        <div className="modal-header">
            <h3>📝 Detalhamento da Atividade: {formData.item}</h3>
            <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        {/* === CORPO COM SCROLL (Aqui dentro cabe tudo) === */}
        <div className="modal-body-scroll">
            
            {/* BLOCO 1: DADOS GERAIS */}
            <section className="content-block">
                <span className="block-label">01. Dados do Relatório</span>
                <div className="header-grid">
                    <div className="form-col">
                        <label>Título</label>
                        <input type="text" value="RELATÓRIO DE AUDITORIA" className="input-read input-bold" readOnly />
                    </div>
                    <div className="form-col">
                        <label>Unidade / Relatório</label>
                        <textarea className="input-read" readOnly value="INDÚSTRIA FÁBRICA DE RAÇÃO II - Auditoria Operacional 2026" rows="2" />
                    </div>
                    <div className="form-col">
                        <label>Texto de Abertura</label>
                        <textarea className="input-read" readOnly value="Realizamos no período de auditoria nas Fábricas de Rações..." rows="2" />
                    </div>
                    <div className="form-col">
                        <label>Controle</label>
                        <div style={{textAlign: 'center', background: '#e2e8f0', padding: '10px', borderRadius: '4px', fontWeight: 'bold'}}>
                            #{formData.item}
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCO 2: DETALHES DA EXECUÇÃO (Horizontal) */}
            <section className="content-block">
                <span className="block-label">02. Execução e Testes</span>
                
                <div className="activity-container">
                    {/* Atividade */}
                    <div className="form-col col-std">
                        <label>Atividade</label>
                        <textarea className="full-h-input input-read" value={formData.atividade} readOnly />
                    </div>

                    {/* Testes */}
                    <div className="form-col col-std">
                        <label>Testes Realizados</label>
                        <textarea 
                            className="full-h-input" 
                            value={formData.testes || ''}
                            onChange={(e) => handleChange('testes', e.target.value)}
                        />
                    </div>

                    {/* Extensão */}
                    <div className="form-col col-std">
                        <label>Extensão dos Exames</label>
                        <textarea 
                            className="full-h-input" 
                            value={formData.extensao || ''}
                            onChange={(e) => handleChange('extensao', e.target.value)}
                        />
                    </div>

                    {/* Critério */}
                    <div className="form-col col-std">
                        <label>Critério / Amostragem</label>
                        <textarea 
                            className="full-h-input" 
                            value={formData.amostragem || ''}
                            onChange={(e) => handleChange('amostragem', e.target.value)}
                        />
                    </div>

                    {/* Datas */}
                    <div className="form-col col-date">
                        <label>Período</label>
                        <div className="date-box">
                            <input type="date" value={formData.dtInicial} onChange={(e) => handleChange('dtInicial', e.target.value)} />
                            <div style={{textAlign: 'center', fontSize: '10px', color: '#999'}}>até</div>
                            <input type="date" value={formData.dtFinal} onChange={(e) => handleChange('dtFinal', e.target.value)} />
                        </div>
                    </div>

                    {/* Resumo/Obs */}
                    <div className="form-col col-wide">
                        <label>Resumo da Situação</label>
                        <textarea 
                            className="full-h-input" 
                            value={formData.resumo || ''}
                            onChange={(e) => handleChange('resumo', e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* === AQUI É O ESPAÇO PARA OS SEUS PRÓXIMOS BLOCOS === */}
            
            {/* BLOCO 3: RESERVADO */}
            <section className="content-block">
                 <span className="block-label">03. Participantes e Responsáveis</span>
                 {/* Substitua esta div pelo conteúdo real quando quiser */}
                 <div className="placeholder-block">
                    + Bloco de Participantes será inserido aqui
                 </div>
            </section>

            {/* BLOCO 4: RESERVADO */}
            <section className="content-block">
                 <span className="block-label">04. Validação e Aprovação</span>
                 {/* Substitua esta div pelo conteúdo real quando quiser */}
                 <div className="placeholder-block">
                    + Bloco de Validação será inserido aqui
                 </div>
            </section>

        </div>

        {/* === FOOTER FIXO EMBAIXO === */}
        <div className="modal-footer">
            <div className="footer-user">
                <div className="avatar-circle">KO</div>
                <div>
                    <div style={{fontSize: '11px', color: '#64748b'}}>Realizado por</div>
                    <div style={{fontWeight: '600'}}>{formData.realizadoPor}</div>
                </div>
            </div>

            <div className="footer-actions">
                <button className="btn-sec">📂 Anexos</button>
                <button className="btn-sec">✏ Notas</button>
                <button className="btn-primary" onClick={() => { onSave(formData); onClose(); }}>
                    💾 Gravar Alterações
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ModalAtividade;