// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando as páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuditoriaForm from './pages/AuditoriaForm'; // Tela de Nova Auditoria
import AuditoriaDetalhes from './pages/AuditoriaDetalhes'; // Tela de Detalhes (VERIFIQUE SE ESTE ARQUIVO EXISTE)

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
        
        {/* Rota 4: Ver Detalhes (O :id é a chave mágica!) */}
        <Route path="/auditoria/:id" element={<AuditoriaDetalhes />} />
      </Routes>
    </Router>
  );
}

export default App;