// src/components/BlocoIdentificacao.jsx
import React from 'react';

const BlocoIdentificacao = ({ formData, setFormData }) => {
  return (
    <section className="form-section">
      <h3>01. Identificação</h3>
      <div className="grid-row">
        <div className="form-group col-6">
          <label>Unidade / Filial</label>
          <select 
            value={formData.unidadeId}
            onChange={(e) => setFormData({ ...formData, unidadeId: e.target.value })}
          >
            <option value="">Selecione a Unidade...</option>
            {/* Amanhã aqui faremos o .map() das unidades do banco */}
            <option value="38">LOJA JATAÍ</option>
            <option value="1116">INSUMOS RIO VERDE</option>
          </select>
        </div>

        <div className="form-group col-6">
          <label>Tipo de Trabalho</label>
          <div className="radio-group">
            <label>
              <input 
                type="radio" 
                name="tipo" 
                value="P" 
                checked={formData.tipoTrabalho === 'P'} 
                onChange={(e) => setFormData({ ...formData, tipoTrabalho: e.target.value })}
              /> Planejado
            </label>
            <label>
              <input 
                type="radio" 
                name="tipo" 
                value="S" 
                checked={formData.tipoTrabalho === 'S'} 
                onChange={(e) => setFormData({ ...formData, tipoTrabalho: e.target.value })}
              /> Sindicância
            </label>
          </div>
        </div>
      </div>

      <div className="grid-row">
        <div className="form-group col-12">
          <label>Texto de Abertura (Automático)</label>
          <textarea 
            rows="3" 
            value={formData.textoAbertura} 
            className="input-readonly" 
            readOnly 
            placeholder="O texto aparecerá aqui ao selecionar a unidade..."
          />
        </div>
      </div>
    </section>
  );
};

export default BlocoIdentificacao;