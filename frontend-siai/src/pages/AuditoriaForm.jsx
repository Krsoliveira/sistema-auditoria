import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuditoriaForm.css';

const AuditoriaForm = () => {
  const navigate = useNavigate();

  // Estado único para todo o formulário
  const [formData, setFormData] = useState({
    unidade: '',
    data: new Date().toISOString().split('T')[0], // Hoje
    tipo: 'Planejada',
    gestor: '',
    administrativo: '',
    textoAbertura: 'O objetivo deste trabalho é assegurar a conformidade dos processos...'
  });

  // Mock de Itens para o Checklist
  const [itens, setItens] = useState([
    { id: 1, pergunta: 'O fundo de caixa está conferido e assinado?', resposta: '' },
    { id: 2, pergunta: 'As notas fiscais de entrada foram lançadas no prazo?', resposta: '' },
    { id: 3, pergunta: 'O livro de ocorrências está atualizado?', resposta: '' },
    { id: 4, pergunta: 'Os extintores estão dentro da validade?', resposta: '' },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (id, valor) => {
    const novosItens = itens.map(item => 
      item.id === id ? { ...item, resposta: valor } : item
    );
    setItens(novosItens);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Auditoria Criada com Sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="audit-form-container">
      
      {/* 1. TOPO */}
      <header className="form-header-top">
        <div className="form-title">
          <h2>Nova Auditoria</h2>
          <div className="form-subtitle">Preencha os dados iniciais para começar a validação.</div>
        </div>
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ⬅ Voltar ao Painel
        </button>
      </header>

      <form onSubmit={handleSubmit}>
        
        {/* 2. BLOCO IDENTIFICAÇÃO */}
        <section className="form-block">
          <span className="block-tag">01. Identificação da Unidade</span>
          
          <div className="form-grid-3">
            <div className="input-wrapper">
              <label>Unidade / Filial</label>
              <select name="unidade" value={formData.unidade} onChange={handleChange} autoFocus>
                <option value="">Selecione a Loja...</option>
                <option value="1">Loja Jataí</option>
                <option value="2">Insumos Rio Verde</option>
                <option value="3">Armazém Central</option>
              </select>
            </div>
            
            <div className="input-wrapper">
              <label>Data da Auditoria</label>
              <input type="date" name="data" value={formData.data} onChange={handleChange} />
            </div>

            <div className="input-wrapper">
              <label>Tipo de Trabalho</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="Planejada">Auditoria Planejada</option>
                <option value="Sindicancia">Sindicância</option>
                <option value="Surpresa">Visita Surpresa</option>
              </select>
            </div>
          </div>

          <div className="input-wrapper">
            <label>Texto de Abertura (Automático)</label>
            <textarea 
              name="textoAbertura" 
              value={formData.textoAbertura} 
              readOnly 
              className="input-readonly"
              rows="3"
            />
          </div>
        </section>

        {/* 3. BLOCO PARTICIPANTES */}
        <section className="form-block">
          <span className="block-tag">02. Participantes e Gestores</span>
          
          <div className="form-grid-2">
            <div className="input-wrapper">
              <label>Gestor da Unidade</label>
              <input 
                type="text" 
                name="gestor"
                placeholder="Ex: João da Silva" 
                value={formData.gestor} 
                onChange={handleChange} 
              />
            </div>
            <div className="input-wrapper">
              <label>Responsável Administrativo</label>
              <input 
                type="text" 
                name="administrativo"
                placeholder="Ex: Maria Oliveira" 
                value={formData.administrativo} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </section>

        {/* 4. BLOCO CHECKLIST INICIAL */}
        <section className="form-block">
          <span className="block-tag">03. Checklist Preliminar</span>
          
          <table className="questionario-table">
            <thead>
              <tr>
                <th style={{width: '70%'}}>Ponto de Controle</th>
                <th>Conformidade</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id}>
                  <td>{item.pergunta}</td>
                  <td>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name={`q-${item.id}`} 
                          checked={item.resposta === 'S'}
                          onChange={() => handleRadioChange(item.id, 'S')}
                        /> Sim
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name={`q-${item.id}`} 
                          checked={item.resposta === 'N'}
                          onChange={() => handleRadioChange(item.id, 'N')}
                        /> Não
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name={`q-${item.id}`} 
                          checked={item.resposta === 'NA'}
                          onChange={() => handleRadioChange(item.id, 'NA')}
                        /> N/A
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 5. RODAPÉ FIXO */}
        <div className="form-footer-bar">
          <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>Cancelar</button>
          <button type="submit" className="btn-submit">✅ Criar Auditoria</button>
        </div>

      </form>
    </div>
  );
};

export default AuditoriaForm;