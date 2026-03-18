import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // SSO via Django: se o token já veio injetado, pula o formulário
  useEffect(() => {
    const tokenFromWindow = window.__SIAI_TOKEN__;
    if (tokenFromWindow) {
      localStorage.setItem('siai_token', tokenFromWindow);
      navigate('/dashboard');
      return;
    }
    const tokenSalvo = localStorage.getItem('siai_token');
    if (tokenSalvo) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('siai_token', data.token);
        window.location.href = '/dashboard';
      } else {
        const msg = await response.text();
        setErro(msg || 'Matrícula ou senha inválidos.');
      }
    } catch {
      setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">SIAI</h1>
        <p className="login-subtitle">Sistema de Auditoria Interna</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={inputStyle}
          />

          {erro && (
            <p style={{ color: '#ff4d6d', fontSize: '13px', margin: 0, textAlign: 'center' }}>
              {erro}
            </p>
          )}

          <button type="submit" disabled={carregando} style={buttonStyle}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="login-footer" style={{ textAlign: 'center' }}>
          SIAI — Auditoria Interna
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(0, 210, 230, 0.2)',
  borderRadius: '10px',
  padding: '12px 16px',
  color: '#e2e8f0',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const buttonStyle = {
  background: 'linear-gradient(135deg, #00d2e6, #0087a0)',
  border: 'none',
  borderRadius: '10px',
  padding: '13px',
  color: '#000',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer',
  letterSpacing: '0.5px',
  transition: 'opacity 0.2s',
};

export default Login;
