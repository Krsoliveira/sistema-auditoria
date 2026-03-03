// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando as páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuditoriaForm from './pages/AuditoriaForm'; // Tela de Nova Auditoria
import AlterarSenha from './pages/AlterarSenha';
import DetalhesAuditoria from './pages/DetalhesAuditoria'; // Nossa nova tela Neo-Tactile!

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota 1: Login */}
        <Route path="/" element={<Login />} />        
        
        {/* Rota 2: Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />        
        
        {/* Rota 3: Criar Nova Auditoria */}
        <Route path="/auditoria" element={<AuditoriaForm />} />        
        
        {/* Rota 4: Ver Detalhes (Nossa Tela Nova de 3 Blocos) */}
        <Route path="/auditoria/:id" element={<DetalhesAuditoria />} />
        
        {/* Rota 5: Alterar Senha */}
        <Route path="/alterar-senha" element={<AlterarSenha />} /> 
      </Routes>
    </Router>
  );
}

export default App;