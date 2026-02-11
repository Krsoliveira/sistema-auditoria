// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando as 3 páginas que criamos
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuditoriaForm from './pages/AuditoriaForm'; // <--- A página nova que acabamos de criar

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota 1: A tela inicial é o Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota 2: O Painel Principal */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rota 3: O Formulário de Auditoria */}
        <Route path="/auditoria" element={<AuditoriaForm />} />
      </Routes>
    </Router>
  );
}

export default App;