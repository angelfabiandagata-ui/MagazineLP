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

// Páginas Privadas (Comercio / Admin)
import Perfil from './pages/Perfil';
import AdminDashboard from './pages/AdminDashboard';
import Registro from './pages/Registro';
import GestionComercios from './pages/GestionComercios';
import GestionNoticias from './pages/GestionNoticias';
import GestionTurismo from './pages/GestionTurismo';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* 🟢 RUTAS PÚBLICAS (Accesibles por cualquier usuario) */}
        <Route path="/" element={<Inicio />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/turismo" element={<Turismo />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />

        {/* 🏪 RUTA DE PERFIL (Solo si hay sesión activa de comercio o admin) */}
        <Route 
          path="/perfil" 
          element={
            localStorage.getItem('token') ? <Perfil /> : <Navigate to="/login" replace />
          } 
        />

        {/* 🔒 RUTAS EXCLUSIVAS DE ADMINISTRADOR (Blindadas por ProtectedRoute) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/registro" 
          element={
            <ProtectedRoute>
              <Registro />
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

        {/* 🚫 REDIRECCIÓN POR DEFECTO PARA RUTAS INEXISTENTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}