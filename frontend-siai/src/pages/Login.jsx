import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

const Login = () => {
  // Mudamos de "usuario" para "matricula" para bater com o Java
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  
  // Novos estados para controlar o carregamento e erros
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa erros anteriores
    setCarregando(true); // Ativa o "Carregando..."

    try {
      // 1. Faz a chamada real para o seu Backend Java
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // O Java espera receber "matricula" e "senha"
        body: JSON.stringify({ 
            matricula: matricula, 
            senha: senha 
        })
      });

      // 2. Verifica a resposta
      if (response.ok) {
        // Sucesso! (Status 200)
        const dadosUsuario = await response.json();
        
        // Salva os dados no navegador (opcional, mas bom para mostrar o nome depois)
        localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
        
        navigate('/dashboard'); // Manda para o sistema
      } else {
        // Erro (Status 401 ou 403)
        setErro('Matrícula ou senha incorretos.');
      }

    } catch (error) {
      console.error('Erro de conexão:', error);
      setErro('Sem conexão com o servidor. O Backend está rodando?');
    } finally {
      setCarregando(false); // Destrava o botão
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">SIAI</h1>
        <p className="login-subtitle">Sistema Integrado de Auditoria Interna</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Matrícula</label>
            <input 
              type="text" 
              placeholder="Ex: 28685"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* Área de Mensagem de Erro (Só aparece se tiver erro) */}
          {erro && (
            <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
                {erro}
            </div>
          )}

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-footer">
          <small>Versão 1.0.0</small>
        </div>
      </div>
    </div>
  );
};

export default Login;