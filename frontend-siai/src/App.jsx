import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuditoriaForm from './pages/AuditoriaForm';
import AlterarSenha from './pages/AlterarSenha';
import DetalhesAuditoria from './pages/DetalhesAuditoria';
import BancoHoras from './pages/BancoHoras';

function App() {
  // 🔍 O único critério de entrada agora é o Token do Django
  const token = localStorage.getItem('siai_token');

  // Em dev (npm run dev): base é '/', então basename deve ser '/'
  // Em prod (Django): app está em /cronograma/, então basename deve ser '/cronograma'
  const basename = import.meta.env.DEV ? '/' : '/cronograma';

  return (
    <Router basename={basename}>
      <Routes>
        {/* Rota Raiz: Se tem token vai pro Dashboard, se não tem, vai pro Login (que agora é só um redirecionador) */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />        
        
        {/* Se o usuário tentar acessar direto /dashboard sem token, o Dashboard deve tratar ou enviamos pro login */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />        
        
        <Route path="/auditoria" element={token ? <AuditoriaForm /> : <Navigate to="/" />} />        
        <Route path="/auditoria/:id" element={token ? <DetalhesAuditoria /> : <Navigate to="/" />} />
        <Route path="/banco-horas" element={token ? <BancoHoras /> : <Navigate to="/" />} />
        
        {/* Rota de login (caso o SSO falhe ou expire) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;