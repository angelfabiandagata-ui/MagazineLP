import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10 text-white py-3 px-6 flex justify-between items-center shadow-lg">
      {/* Logotipo / Titulo */}
      <Link to="/" className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
        Magazine La Punta
      </Link>

      {/* Enlaces de Navegación */}
      <div className="flex gap-6 text-sm font-semibold uppercase tracking-wider">
        <Link to="/" className="hover:text-amber-400 transition-colors">
          Inicio
        </Link>
        <Link to="/busqueda" className="hover:text-amber-400 transition-colors">
          Búsqueda
        </Link>
        <Link to="/turismo" className="hover:text-amber-400 transition-colors">
          Turismo
        </Link>
        <Link to="/contacto" className="hover:text-amber-400 transition-colors">
          Contacto
        </Link>
        <Link to="/login" className="hover:text-amber-400 transition-colors">
          Login
        </Link>
      </div>
    </nav>
  );
}