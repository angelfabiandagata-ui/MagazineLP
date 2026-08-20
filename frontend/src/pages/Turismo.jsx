import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Turismo() {
  const [atractivos, setAtractivos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    API.get('/turismo')
      .then(res => {
        if (Array.isArray(res.data)) {
          setAtractivos(res.data);
        }
      })
      .catch(err => {
        console.error('Error al cargar turismo:', err);
        setAtractivos([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const resolverEnlace = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://${url}`;
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse font-semibold text-amber-400">
          Cargando Puntos Turísticos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-10 pt-24 sm:pt-28 md:pt-32 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Encabezado */}
        <div className="mb-8 text-center sm:text-left">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
            Descubrí la Ciudad
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wide mt-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            Puntos Turísticos
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-2xl">
            Conocé los principales atractivos culturales, monumentos históricos y paseos naturales que hacen única a La Punta.
          </p>
          <div className="w-20 h-1 bg-amber-500 rounded-full mt-3 mx-auto sm:mx-0"></div>
        </div>

        {/* Grilla de Atractivos */}
        {atractivos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No hay puntos turísticos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
            {atractivos.map((item) => {
              const urlDestino = resolverEnlace(item.enlace);

              return (
                <article 
                  key={item.id}
                  className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-800">
                    <img 
                      src={item.imagen} 
                      alt={item.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Turismo+La+Punta'; }}
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                      {item.categoria}
                    </div>
                    {item.ubicacion && (
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-gray-200 text-[11px] px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                        📍 {item.ubicacion}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold line-clamp-2 group-hover:text-amber-400 transition-colors leading-snug mb-2">
                        {item.titulo}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {item.resumen}
                      </p>
                    </div>

                    {urlDestino ? (
                      <a
                        href={urlDestino}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <span>Ver horarios y mapa</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    ) : (
                      <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-semibold text-gray-500">
                        <span>Información disponible en el lugar</span>
                        <span>📍</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* Pie */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-gray-500 pt-8 border-t border-white/5 mt-12">
        Magazine La Punta • Guía Turística y Cultural
      </div>
    </div>
  );
}