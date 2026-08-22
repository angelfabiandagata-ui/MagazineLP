import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  const opciones = [
    {
      titulo: "Gestión de Comercios",
      descripcion: "Aprobar altas, pausar comercios y gestionar bajas o eliminaciones.",
      icono: "🏪",
      link: "/gestion-comercios",
      color: "border-amber-500/30 hover:border-amber-400"
    },
    {
      titulo: "Gestión de Novedades",
      descripcion: "Editar los 3 bloques de noticias y actualidad local de la portada.",
      icono: "📰",
      link: "/gestion-noticias",
      color: "border-blue-500/30 hover:border-blue-400"
    },
    {
      titulo: "Gestión de Turismo",
      descripcion: "Modificar las tarjetas informativas, fotos y enlaces de los atractivos locales.",
      icono: "📍",
      link: "/gestion-turismo",
      color: "border-emerald-500/30 hover:border-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 pt-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
              Panel Administrativo
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide mt-1">
              Centro de Control
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Selecciona el módulo que deseas administrar.
            </p>
          </div>

          <button
            onClick={handleCerrarSesion}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Tarjetas de Accesos Directos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opciones.map((op, index) => (
            <Link 
              key={index} 
              to={op.link}
              className={`bg-slate-900/80 p-6 rounded-2xl border ${op.color} transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-xl group`}
            >
              <div>
                <div className="text-4xl mb-4">{op.icono}</div>
                <h3 className="text-lg font-bold group-hover:text-amber-400 transition-colors mb-2">
                  {op.titulo}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {op.descripcion}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-semibold text-amber-400">
                <span>Ingresar al módulo</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}