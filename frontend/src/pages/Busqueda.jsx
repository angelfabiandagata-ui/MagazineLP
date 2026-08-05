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
        // 1. Desestructuración segura para evitar "e.filter is not a function"
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
        setComercios([]); // Fallback a arreglo vacío
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // 2. Filtro seguro de búsqueda (Insensible a mayúsculas/minúsculas y tolerante a nulls)
  const termino = busqueda.trim().toLowerCase();

  const comerciosFiltrados = comercios.filter((comercio) => {
    if (!termino) return true; // Si no hay búsqueda, muestra todos

    const nombre = (comercio.name || '').toLowerCase();
    const descripcion = (comercio.description || '').toLowerCase();
    const rubro = (comercio.rubro || '').toLowerCase();

    // Extraer labels limpias tolerando objetos o strings
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
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse font-semibold text-amber-400">
          Cargando buscador de La Punta...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white pt-24 pb-12">
      
      {/* BARRA DE BÚSQUEDA Y CABECERA */}
      <div className="max-w-4xl mx-auto px-6 mb-8 text-center">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-amber-400 mb-2">
          Buscador de Comercios
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Encontrá rubros, productos, servicios o etiquetas (ej: <i>medialunas</i>, <i>facia</i>, <i>delivery</i>).
        </p>

        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="¿Qué estás buscando hoy en La Punta?"
            className="w-full py-3.5 px-5 pl-12 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 shadow-xl transition-all"
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
      </div>

      {/* RESULTADOS DE BÚSQUEDA */}
      <div className="scroll-container">
        {comerciosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <p className="text-lg font-semibold mb-2">
              No se encontraron resultados para "{busqueda}"
            </p>
            <p className="text-xs text-gray-500">
              Proba buscando palabras más generales como "rotisería", "ropa" o "servicio".
            </p>
          </div>
        ) : (
          comerciosFiltrados.map((comercio) => (
            <BloqueComercio key={comercio.id} comercio={comercio} />
          ))
        )}
      </div>

    </div>
  );
}