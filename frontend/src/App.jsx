import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Busqueda from './pages/Busqueda';
import Login from './pages/Login';
import Contacto from './pages/Contacto';
import Perfil from './pages/Perfil';
import Registro from './pages/Registro';

const Turismo = () => (
  <div className="min-h-screen bg-slate-900 text-white pt-28 px-6 text-center">
    <h2 className="text-3xl font-extrabold uppercase text-amber-400 mb-4">Turismo en La Punta</h2>
    <p className="text-gray-300 max-w-xl mx-auto">
      Descubrí los atractivos turísticos, réplicas históricas, senderos y miradores de nuestra ciudad.
    </p>
  </div>
);


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/turismo" element={<Turismo />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}