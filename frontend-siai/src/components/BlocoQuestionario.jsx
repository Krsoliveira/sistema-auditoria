import React from 'react';

const BlocoQuestionario = ({ itens, onAnswer }) => {
  return (
    <section className="form-section">
      <h3>03. Itens Auditados</h3>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição do Ponto de Controle</th>
            <th>Resposta</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id}>
              <td>{item.numero}</td>
              <td>{item.pergunta}</td>
              <td className="radio-cell">
                <label><input type="radio" name={`item-${item.id}`} value="S" /> S</label>
                <label><input type="radio" name={`item-${item.id}`} value="N" /> N</label>
                <label><input type="radio" name={`item-${item.id}`} value="NA" /> NA</label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default BlocoQuestionario;