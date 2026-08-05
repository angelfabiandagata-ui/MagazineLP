import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 text-white py-2 sm:py-3 px-3 sm:px-6 flex justify-between items-center shadow-lg transition-all">
      {/* Logotipo / Título - Se achica suavemente en pantallas pequeñas */}
      <Link 
        to="/" 
        className="text-base sm:text-lg md:text-xl font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent truncate"
      >
        Magazine La Punta
      </Link>

      {/* Enlaces de Navegación - Compactos en mobile, holgados en desktop */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider">
        <Link to="/" className="hover:text-amber-400 transition-colors py-1 px-1">
          Inicio
        </Link>
        <Link to="/busqueda" className="hover:text-amber-400 transition-colors py-1 px-1">
          Búsqueda
        </Link>
        <Link to="/turismo" className="hover:text-amber-400 transition-colors py-1 px-1">
          Turismo
        </Link>
        <Link to="/contacto" className="hover:text-amber-400 transition-colors py-1 px-1">
          Contacto
        </Link>
        <Link to="/login" className="hover:text-amber-400 transition-colors py-1 px-1 text-amber-400">
          Login
        </Link>
      </div>
    </nav>
  );
}