import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BloqueNoticias() {
  const [noticias, setNoticias] = useState([]);

  // Noticias de respaldo por si el servidor aún no devuelve nada
  const noticiasFallback = [
    {
      id: 1,
      titulo: "Nuevas obras de pavimentación e iluminación en La Punta",
      categoria: "Ciudad",
      fecha: "01 Ago 2026",
      resumen: "Avanzan los trabajos de mejora urbana en los accesos principales para garantizar mayor seguridad vial.",
      imagen: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      titulo: "Gran Feria de Artesanos y Emprendedores este fin de semana",
      categoria: "Eventos",
      fecha: "02 Ago 2026",
      resumen: "Este sábado y domingo la plaza cívica reunirá a más de 50 puestos con gastronomía, artesanías y shows en vivo.",
      imagen: "https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      titulo: "Apertura de inscripciones para los Talleres Culturales 2026",
      categoria: "Cultura",
      fecha: "03 Ago 2026",
      resumen: "Conoce la oferta de cursos gratuitos de música, teatro y artes plásticas disponibles para todas las edades.",
      imagen: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    axios.get('http://localhost:3000/api/noticias')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setNoticias(res.data);
        }
      })
      .catch(err => console.error("Error al obtener noticias:", err));
  }, []);

  // Definimos listaNoticias explícitamente para evitar el ReferenceError
  const listaNoticias = noticias.length > 0 ? noticias : noticiasFallback;

  return (
    <div className="scroll-area relative w-full min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 md:p-10 text-white pt-24 sm:pt-28 md:pt-32">
      
      {/* Encabezado del Bloque */}
      <div className="max-w-7xl mx-auto w-full mb-6 text-center sm:text-left">
        <span className="text-amber-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
          Acontecer Local
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wide mt-1 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Novedades de la Ciudad
        </h2>
        <div className="w-20 h-1 bg-amber-500 rounded-full mt-2 mx-auto sm:mx-0"></div>
      </div>

      {/* Grilla de 3 Noticias */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        {listaNoticias.slice(0, 3).map((item) => (
          <article 
            key={item.id}
            className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Contenedor de Imagen con Categoría */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-800">
              <img 
                src={item.imagen} 
                alt={item.titulo} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                {item.categoria}
              </div>
              {item.fecha && (
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-gray-300 text-[11px] px-2.5 py-0.5 rounded-md">
                  {item.fecha}
                </div>
              )}
            </div>

            {/* Texto de la Noticia */}
            <div className="p-5 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold line-clamp-2 group-hover:text-amber-400 transition-colors leading-snug mb-2">
                  {item.titulo}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {item.resumen}
                </p>
              </div>

            </div>
          </article>
        ))}
      </div>

      {/* Pie sutil del bloque */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-gray-500 pt-4 border-t border-white/5">
        Magazine La Punta • Información actualizada al instante
      </div>
    </div>
  );
}