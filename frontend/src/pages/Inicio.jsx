import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BloqueComercio from '../components/BloqueComercio';

// Función para mezclar un array de forma aleatoria (Fisher-Yates)
const mezclarArray = (array) => {
  const lista = [...array];
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
};

export default function Inicio() {
  const [comercios, setComercios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/comercios')
      .then(res => {
        // 👈 Mezclamos la lista de comercios antes de guardarla en el estado
        const comerciosAleatorios = mezclarArray(res.data);
        setComercios(comerciosAleatorios);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar comercios:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div className="h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Cargando Comercios de La Punta...</p>
      </div>
    );
  }

  return (
    <div className="scroll-container bg-slate-900">
      {/* Primer Bloque 100vh: Bienvenida y Noticias de La Punta */}
      <section className="scroll-area h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col justify-center items-center p-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">Magazine La Punta</h1>
        <p className="text-lg md:text-xl max-w-2xl text-gray-300 mb-8">
          Descubrí la guía comercial más completa de La Punta y zonas aledañas. Contacto directo, delivery y todas las novedades locales en un solo lugar.
        </p>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl max-w-xl border border-white/10">
          <h3 className="text-amber-400 font-bold uppercase tracking-wider text-sm mb-2">📢 Noticias & Novedades</h3>
          <p className="text-sm text-gray-200">
            ¡Bienvenidos a la nueva plataforma comercial! Deslizá hacia abajo para explorar las promociones y comercios adheridos.
          </p>
        </div>
        <div className="mt-12 animate-bounce text-gray-400 text-sm">
          ↓ Deslizá para explorar
        </div>
      </section>

      {/* Despliegue de los Comercios Adheridos */}
      {comercios.length === 0 ? (
        <section className="scroll-area h-screen flex items-center justify-center text-white">
          <p>Aún no hay comercios cargados.</p>
        </section>
      ) : (
        comercios.map((comercio) => (
          <BloqueComercio key={comercio.id} comercio={comercio} />
        ))
      )}
    </div>
  );
}