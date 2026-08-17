import React from 'react';
import { Link } from 'react-router-dom';

export default function BloqueFooter() {
  const anioActual = new Date().getFullYear();

  return (
    <div className="scroll-area relative w-full min-h-screen md:h-screen bg-slate-950 flex flex-col justify-between p-6 sm:p-10 md:p-12 text-gray-300 pt-20">
      
      {/* Parte Superior: Marca y Columnas */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 my-auto">
        
        {/* Columna 1: Marca */}
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-black uppercase text-amber-400 tracking-wider">
            Magazine La Punta
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            La guía comercial y digital para conectar a los vecinos de La Punta con los mejores comercios, servicios y novedades locales.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Navegación
          </h4>
          <ul className="flex flex-col gap-2 text-xs sm:text-sm">
            <li><Link to="/" className="hover:text-amber-400 transition-colors">Inicio</Link></li>
            <li><Link to="/busqueda" className="hover:text-amber-400 transition-colors">Buscar Comercios</Link></li>
            <li><Link to="/turismo" className="hover:text-amber-400 transition-colors">Turismo</Link></li>
            <li><Link to="/login" className="hover:text-amber-400 transition-colors">Panel Comercios</Link></li>
          </ul>
        </div>

        {/* Columna 3: Legales */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Legales
          </h4>
          <ul className="flex flex-col gap-2 text-xs sm:text-sm">
            <li><Link to="/terminos" className="hover:text-amber-400 transition-colors">Términos y Condiciones</Link></li>
            <li><Link to="/privacidad" className="hover:text-amber-400 transition-colors">Política de Privacidad</Link></li>
            <li><Link to="/preguntas-frecuentes" className="hover:text-amber-400 transition-colors">Preguntas Frecuentes</Link></li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Contacto
          </h4>
          <p className="text-xs sm:text-sm mb-2 text-gray-400">La Punta, San Luis, Argentina</p>
          <a 
            href="https://wa.me/5492664759571" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block text-xs sm:text-sm text-amber-400 hover:underline font-semibold"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>

      </div>

      {/* Parte Inferior: Copyright */}
      <div className="max-w-6xl mx-auto w-full pt-4 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 gap-2">
        <p>© {anioActual} Magazine La Punta. Todos los derechos reservados.</p>
        <p>
          Desarrollado por <span className="text-slate-300 font-semibold">Producciones Digitales D'Agata</span>
        </p>
      </div>

    </div>
  );
}