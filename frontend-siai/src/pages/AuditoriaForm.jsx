// src/pages/AuditoriaForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Importa o CSS do formulário que fizemos antes
import BlocoIdentificacao from '../components/BlocoIdentificacao';
import BlocoParticipantes from '../components/BlocoParticipantes';
import BlocoQuestionario from '../components/BlocoQuestionario';

const AuditoriaForm = () => {
  const navigate = useNavigate();

  // Estado para guardar os dados do formulário
  const [formData, setFormData] = useState({
    unidadeId: '',
    tipoTrabalho: 'P',
    textoAbertura: '',
    gestorNome: '',
    admNome: ''
  });

  // Dados de exemplo para o questionário
  const itensExemplo = [
    { id: 1, numero: '1.1', pergunta: 'O fundo de caixa está conferido e assinado?' },
    { id: 2, numero: '1.2', pergunta: 'As notas fiscais de entrada foram lançadas no prazo?' },
    { id: 3, numero: '1.3', pergunta: 'O livro de ocorrências está atualizado?' },
  ];

  return (
    <div className="container">
      <header className="form-header">
        <button className="btn-voltar" onClick={() => navigate('/dashboard')} style={{marginRight: '15px', cursor: 'pointer'}}>
          ⬅ Voltar
        </button>
        <h1>Nova Auditoria</h1>
      </header>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Chamando os nossos componentes (Blocos) */}
        <BlocoIdentificacao formData={formData} setFormData={setFormData} />
        <BlocoParticipantes formData={formData} setFormData={setFormData} />
        <BlocoQuestionario itens={itensExemplo} />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn-salvar" onClick={() => alert('Auditoria Salva!')}>
                Finalizar Auditoria
            </button>
        </div>
      </form>
    </div>
  );
};

export default AuditoriaForm;