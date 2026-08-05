import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../api';

export default function Turismo() {
  const [atractivos, setAtractivos] = useState([]);

  // Atractivos turísticos por defecto
  const atractivosFallback = [
    {
      id: 1,
      titulo: "Réplica del Cabildo Histórico de 1810",
      categoria: "Patrimonio",
      ubicación: "Av. Serrana s/n",
      resumen: "Monumento histórico nacional a escala real que recrea el edificio de la Revolución de Mayo con muestras interactivas y visitas guiadas.",
      imagen: "https://agenciasanluis.com/wp-content/uploads/2018/04/CABILDO-1.jpg"
    },
    {
      id: 2,
      titulo: "Parque Astronómico La Punta (PALP)",
      categoria: "Ciencia & Familia",
      ubicación: "Campus ULP",
      resumen: "Un espacio único para explorar el universo con su Planetario digital, el Solar de las Miradas y el observatorio astronómico.",
      imagen: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      titulo: "Réplica de la Casa de Tucumán",
      categoria: "Cultura",
      ubicación: "Av. Serrana",
      resumen: "Fiel recreación del histórico sitio de la Declaración de la Independencia, ambientada con mobiliario y reliquias de la época.",
      imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    // Si más adelante querés conectarlo a una tabla 'Turismo' en PostgreSQL:
    API.get('/turismo')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAtractivos(res.data);
        }
      })
      .catch(() => {
        // Mantiene el fallback silenciosamente si la API aún no existe
      });
  }, []);

  const listaAtractivos = atractivos.length > 0 ? atractivos : atractivosFallback;

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
          {listaAtractivos.map((item) => (
            <article 
              key={item.id}
              className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Imagen del Atractivo */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-800">
                <img 
                  src={item.imagen} 
                  alt={item.titulo} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                  {item.categoria}
                </div>
                {item.ubicación && (
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-gray-200 text-[11px] px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                    📍 {item.ubicación}
                  </div>
                )}
              </div>

              {/* Contenido del Atractivo */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold line-clamp-2 group-hover:text-amber-400 transition-colors leading-snug mb-2">
                    {item.titulo}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {item.resumen}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-semibold text-amber-400">
                  <span>Ver horarios y mapas</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Pie */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-gray-500 pt-8 border-t border-white/5 mt-12">
        Magazine La Punta • Guía Turística y Cultural
      </div>
    </div>
  );
}