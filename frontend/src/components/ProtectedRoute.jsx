import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // SI NO HAY TOKEN O EL ROL NO ES EXACTAMENTE 'admin', LO REBOTA
  if (!token || rol !== 'admin') {
    // Limpiamos por las dudas si había basurita
    return <Navigate to="/login" replace />;
  }

  // Solo si es admin renderiza la página
  return children;
}