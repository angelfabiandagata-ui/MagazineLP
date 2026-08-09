import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-gray-400 border-t border-slate-800 pt-12 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Columna 1: Marca y Descripción */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-black uppercase text-amber-400 tracking-wider">
            Magazine La Punta
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            La guía comercial y digital para conectar a los vecinos de La Punta con los mejores comercios, servicios y novedades locales.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Navegación
          </h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors">Inicio</Link>
            </li>
            <li>
              <Link to="/comercios" className="hover:text-amber-400 transition-colors">Comercios</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-amber-400 transition-colors">Mi Cuenta / Iniciar Sesión</Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-amber-400 transition-colors">Sumar mi Comercio</Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Legales */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Legales
          </h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/terminos" className="hover:text-amber-400 transition-colors">Términos y Condiciones</Link>
            </li>
            <li>
              <Link to="/privacidad" className="hover:text-amber-400 transition-colors">Política de Privacidad</Link>
            </li>
            <li>
              <Link to="/preguntas-frecuentes" className="hover:text-amber-400 transition-colors">Preguntas Frecuentes</Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Contacto y Soporte */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Contacto
          </h4>
          <p className="text-sm mb-2">La Punta, San Luis, Argentina</p>
          <a 
            href="https://wa.me/5492664759571" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block text-sm text-amber-400 hover:underline font-semibold mt-1"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>

      </div>

      {/* Barra Inferior de Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <p>© {anioActual} Magazine La Punta. Todos los derechos reservados.</p>
        <p>
          Desarrollado por <span className="text-slate-300 font-semibold">Producciones Digitales D'Agata</span>
        </p>
      </div>
    </footer>
  );
}