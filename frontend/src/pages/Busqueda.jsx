import React, { useEffect, useState } from 'react';
import API from '../api';
import BloqueComercio from '../components/BloqueComercio';

export default function Busqueda() {
  const [comercios, setComercios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    API.get('/comercios')
      .then(res => {
        setComercios(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar comercios:", err);
        setCargando(false);
      });
  }, []);

  // Filtrado en tiempo real por Nombre, Rubro o Etiquetas
  const comerciosFiltrados = comercios.filter((comercio) => {
    const termino = busqueda.toLowerCase().trim().replace('#', '');
    if (!termino) return true;

    const coincideNombre = comercio.name?.toLowerCase().includes(termino);
    const coincideRubro = comercio.rubro?.toLowerCase().includes(termino);

    const coincideLabel = (comercio.Labels || comercio.labels)?.some(l => {
      const nombreLabel = typeof l === 'object' ? (l.label || l.name) : l;
      return nombreLabel?.toLowerCase().includes(termino);
    });

    return coincideNombre || coincideRubro || coincideLabel;
  });

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center pt-20">
        <p className="text-xl animate-pulse">Cargando buscador...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-4 md:px-8">
      
      {/* CABECERA Y BUSCADOR */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
          ¿Qué estás buscando en <span className="text-amber-400">La Punta</span>?
        </h1>
        <p className="text-gray-400 text-sm md:text-base mb-6">
          Encontrá comercios por su nombre, rubro o etiquetas de productos.
        </p>

        {/* INPUT DE BÚSQUEDA */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribí una palabra clave (ej: cerveza, helado, ropa, taller)..."
            className="w-full py-4 pl-12 pr-10 rounded-2xl bg-slate-800 border border-amber-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm md:text-base shadow-xl"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 text-lg">
            🔍
          </span>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* TAGS RÁPIDAS DE EJEMPLO */}
        <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400">
          <span className="self-center">Populares:</span>
          {['Delivery', 'Panadería', 'Cervecería', 'Indumentaria', 'Mecánica'].map((tag) => (
            <button
              key={tag}
              onClick={() => setBusqueda(tag)}
              className="bg-slate-800 hover:bg-amber-500 hover:text-black border border-slate-700 px-3 py-1 rounded-full transition-all"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADOS */}
      {comerciosFiltrados.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <p className="text-xl font-bold text-amber-400 mb-2">Sin resultados</p>
          <p className="text-gray-400 text-sm mb-6">
            No encontramos comercios que coincidan con "<b>{busqueda}</b>".
          </p>
          <button
            onClick={() => setBusqueda('')}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs uppercase font-bold tracking-wider"
          >
            Ver todos
          </button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-12">
          {comerciosFiltrados.map((comercio) => (
            <div key={comercio.id} className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <BloqueComercio comercio={comercio} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}