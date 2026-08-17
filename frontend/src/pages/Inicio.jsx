import React, { useEffect, useState } from 'react';
import API from '../api';
import BloqueComercio from '../components/BloqueComercio';
import BloqueNoticias from '../components/BloqueNoticias';
import Footer from '../components/Footer';

// Helper seguro para ordenar aleatoriamente la lista de comercios
const mezclarArray = (array) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Inicio() {
  const [comercios, setComercios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    API.get('/comercios')
      .then(res => {
        let datos = [];
        if (Array.isArray(res.data)) {
          datos = res.data;
        } else if (res.data && typeof res.data === 'object') {
          datos = res.data.comercios || res.data.data || [];
        }

        const comerciosAleatorios = mezclarArray(datos);
        setComercios(comerciosAleatorios);
      })
      .catch(err => {
        console.error("Error al cargar comercios:", err);
        setComercios([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div className="h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse font-semibold text-amber-400">
          Cargando Comercios de La Punta...
        </p>
      </div>
    );
  }

  return (
    <div className="scroll-container bg-slate-900">
      
      {/* 1. PRIMER BLOQUE: PORTADA Y BIENVENIDA */}
      <section className="scroll-area min-h-screen md:h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center items-center p-6 text-center pt-20">
        <span className="text-amber-400 font-bold uppercase tracking-widest text-xs sm:text-sm mb-2">
          Revista Digital Comercial
        </span>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight mb-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
          Magazine La Punta
        </h1>
        
        <p className="text-sm sm:text-lg md:text-xl max-w-2xl text-gray-300 mb-8 leading-relaxed">
          Descubrí la guía comercial más completa de La Punta y zonas aledañas. Contacto directo, delivery y todas las promociones en un solo lugar.
        </p>
        
        <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl max-w-md border border-white/10 shadow-xl">
          <p className="text-xs sm:text-sm text-gray-300">
            📲 Conectando comercios locales con la comunidad al instante.
          </p>
        </div>

        <div className="mt-10 animate-bounce text-amber-400/80 text-xs sm:text-sm font-semibold tracking-wider">
          ↓ Deslizá para explorar
        </div>
      </section>

      {/* 2. SEGUNDO BLOQUE: NOVEDADES Y NOTICIAS DE LA CIUDAD */}
      <BloqueNoticias />

      {/* 3. TERCER BLOQUE EN ADELANTE: COMERCIOS ADHERIDOS */}
      {comercios.length === 0 ? (
        <section className="scroll-area min-h-screen md:h-screen flex items-center justify-center text-white p-4">
          <p className="text-gray-400">Aún no hay comercios cargados.</p>
        </section>
      ) : (
        comercios.map((comercio) => (
          <BloqueComercio key={comercio.id} comercio={comercio} />
        ))
      )}

      {/* 4. ÚLTIMO BLOQUE: FOOTER */}
      <Footer />

    </div>
  );
}