import React, { useState, useEffect } from 'react';
import API from '../api';
import BloqueComercio from '../components/BloqueComercio';

export default function Busqueda() {
  const [comercios, setComercios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    API.get('/comercios')
      .then((res) => {
        let datos = [];
        if (Array.isArray(res.data)) {
          datos = res.data;
        } else if (res.data && typeof res.data === 'object') {
          datos = res.data.comercios || res.data.data || [];
        }

        setComercios(datos);
      })
      .catch((err) => {
        console.error('Error al obtener comercios para búsqueda:', err);
        setComercios([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const termino = busqueda.trim().toLowerCase();

  const comerciosFiltrados = comercios.filter((comercio) => {
    if (!termino) return true;

    const nombre = (comercio.name || '').toLowerCase();
    const descripcion = (comercio.description || '').toLowerCase();
    const rubro = (comercio.rubro || '').toLowerCase();

    const listaLabels = comercio.Labels || comercio.labels || [];
    const etiquetasStr = listaLabels
      .map((lbl) => (typeof lbl === 'object' ? lbl.label || lbl.name : lbl))
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return (
      nombre.includes(termino) ||
      descripcion.includes(termino) ||
      rubro.includes(termino) ||
      etiquetasStr.includes(termino)
    );
  });

  if (cargando) {
    return (
      <div className="h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse font-semibold text-amber-400">
          Cargando buscador de La Punta...
        </p>
      </div>
    );
  }

  return (
    <div className="scroll-container bg-slate-900">
      
      {/* 1. PRIMER BLOQUE SNAP: CABECERA Y BUSCADOR */}
      <section className="scroll-area min-h-screen md:h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center items-center p-6 text-center pt-20">
        <span className="text-amber-400 font-bold uppercase tracking-widest text-xs sm:text-sm mb-2">
          Guía Comercial Digital
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-amber-400 mb-3">
          Buscador de Comercios
        </h1>
        
        <p className="text-gray-300 text-xs sm:text-base max-w-lg mb-6 leading-relaxed">
          Encontrá rubros, productos, servicios o etiquetas (ej: <i>medialunas</i>, <i>facia</i>, <i>delivery</i>).
        </p>

        {/* Input de Búsqueda */}
        <div className="relative w-full max-w-xl mx-auto mb-4">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="¿Qué estás buscando hoy en La Punta?"
            className="w-full py-3.5 px-5 pl-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 shadow-xl transition-all text-sm sm:text-base"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 text-lg">
            🔍
          </span>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-white font-bold text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Contador de Resultados / Guía de Deslizamiento */}
        <div className="mt-6 text-xs sm:text-sm text-gray-400">
          {comerciosFiltrados.length > 0 ? (
            <span className="text-amber-300/90 font-medium animate-pulse">
              Se encontraron {comerciosFiltrados.length} resultado{comerciosFiltrados.length !== 1 ? 's' : ''} ↓ Deslizá para ver
            </span>
          ) : (
            <span className="text-red-400">
              No se encontraron coincidencias para "{busqueda}"
            </span>
          )}
        </div>
      </section>

      {/* 2. BLOQUES SIGUIENTES: RESULTADOS DE COMERCIOS */}
      {comerciosFiltrados.length === 0 ? (
        <section className="scroll-area min-h-screen md:h-screen flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-slate-900">
          <p className="text-base sm:text-lg font-semibold mb-2 text-white">
            Sin comercios para mostrar
          </p>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm">
            Probá buscando por términos generales como "taller", "rotisería", "indumentaria" o limpiá el buscador.
          </p>
        </section>
      ) : (
        comerciosFiltrados.map((comercio) => (
          <BloqueComercio key={comercio.id} comercio={comercio} />
        ))
      )}

    </div>
  );
}