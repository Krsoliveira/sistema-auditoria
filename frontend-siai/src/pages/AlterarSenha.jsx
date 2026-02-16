import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AlterarSenha.css';

const AlterarSenha = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [carregando, setCarregando] = useState(false);

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        if (form.novaSenha !== form.confirmarSenha) {
            setMensagem({ texto: 'As novas senhas não coincidem!', tipo: 'erro' });
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/alterar-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matricula: usuarioLogado.matricula,
                    senhaAtual: form.senhaAtual,
                    novaSenha: form.novaSenha
                })
            });

            if (response.ok) {
                setMensagem({ texto: 'Senha alterada com sucesso!', tipo: 'sucesso' });
                setForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
                // Volta para o dashboard após 2 segundos
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                const erroTexto = await response.text();
                setMensagem({ texto: erroTexto, tipo: 'erro' });
            }
        } catch (err) {
            setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="change-password-container">
            {/* BOTÃO VOLTAR */}
            <button onClick={() => navigate('/dashboard')} className="btn-voltar-link">
            ← Voltar ao Dashboard
            </button>

            <h3>Segurança da Conta</h3>
            <p className="user-info-text">Usuário: <strong>{usuarioLogado?.nomeCompleto}</strong></p>

            <form onSubmit={handleUpdate}>
                <div className="input-group">
                    <label>Senha Atual</label>
                    <input type="password" value={form.senhaAtual} onChange={e => setForm({...form, senhaAtual: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Nova Senha</label>
                    <input type="password" value={form.novaSenha} onChange={e => setForm({...form, novaSenha: e.target.value})} required />
                </div>
                <div className="input-group">
                    <label>Confirmar Nova Senha</label>
                    <input type="password" value={form.confirmarSenha} onChange={e => setForm({...form, confirmarSenha: e.target.value})} required />
                </div>
                
                {mensagem.texto && <div className={`message ${mensagem.tipo}`}>{mensagem.texto}</div>}
                
                <button type="submit" className="btn-save" disabled={carregando}>
                    {carregando ? 'Salvando...' : 'Atualizar Senha'}
                </button>
            </form>
        </div>
    );
};

export default AlterarSenha;