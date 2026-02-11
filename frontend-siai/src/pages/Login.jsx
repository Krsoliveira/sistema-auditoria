import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css'; // Vamos criar esse CSS específico já já

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Por enquanto, aceita qualquer coisa só para testar o fluxo
    if (usuario && senha) {
      navigate('/dashboard'); // Manda para a próxima tela
    } else {
      alert('Preencha usuário e senha!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">SIAI</h1>
        <p className="login-subtitle">Sistema Integrado de Auditoria Interna</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Usuário</label>
            <input 
              type="text" 
              placeholder="Ex: k.oliveira"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login">Entrar</button>
        </form>
        
        <div className="login-footer">
          <small>Versão 1.0.0</small>
        </div>
      </div>
    </div>
  );
};

export default Login;