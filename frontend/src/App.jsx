import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de Layout
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas
import Inicio from './pages/Inicio';
import Busqueda from './pages/Busqueda';
import Turismo from './pages/Turismo';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';

// Páginas Privadas (Comercio / Admin)
import Perfil from './pages/Perfil';
import AdminDashboard from './pages/AdminDashboard';
import GestionComercios from './pages/GestionComercios';
import GestionNoticias from './pages/GestionNoticias';
import GestionTurismo from './pages/GestionTurismo';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* 🟢 RUTAS PÚBLICAS */}
            <Route path="/" element={<Inicio />} />
            <Route path="/busqueda" element={<Busqueda />} />
            <Route path="/turismo" element={<Turismo />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />

            {/* 🏪 RUTA DE PERFIL */}
            <Route 
              path="/perfil" 
              element={
                localStorage.getItem('token') ? <Perfil /> : <Navigate to="/login" replace />
              } 
            />

            {/* 🔒 RUTAS EXCLUSIVAS DE ADMINISTRADOR */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gestion-comercios" 
              element={
                <ProtectedRoute>
                  <GestionComercios />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gestion-noticias" 
              element={
                <ProtectedRoute>
                  <GestionNoticias />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gestion-turismo" 
              element={
                <ProtectedRoute>
                  <GestionTurismo />
                </ProtectedRoute>
              } 
            />

            {/* 🚫 REDIRECCIÓN POR DEFECTO */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}