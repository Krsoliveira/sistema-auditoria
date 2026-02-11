import React from 'react';

const BlocoParticipantes = ({ formData, setFormData }) => {
  return (
    <section className="form-section">
      <h3>02. Participantes / Gestores</h3>
      <div className="grid-row">
        <div className="form-group col-6">
          <label>Gestor da Unidade</label>
          <input 
            type="text" 
            value={formData.gestorNome} 
            readOnly 
            className="input-readonly"
            placeholder="Aguardando seleção da unidade..."
          />
        </div>
        <div className="form-group col-6">
          <label>Responsável Administrativo</label>
          <input 
            type="text" 
            value={formData.admNome} 
            onChange={(e) => setFormData({...formData, admNome: e.target.value})}
            placeholder="Nome do administrativo presente"
          />
        </div>
      </div>
    </section>
  );
};

export default BlocoParticipantes;