import React, { useState, useEffect } from 'react';
import API from '../api';

export default function GestionNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Cargar noticias desde la BD usando la API centralizada
  useEffect(() => {
    API.get('/noticias')
      .then(res => {
        if (Array.isArray(res.data)) {
          setNoticias(res.data);
        }
      })
      .catch(err => console.error("Error al obtener noticias:", err))
      .finally(() => setCargando(false));
  }, []);

  // Permitir borrar y escribir en cualquier campo en tiempo real
  const handleChange = (id, campo, valor) => {
    setNoticias(prev =>
      prev.map(n => (n.id === id ? { ...n, [campo]: valor } : n))
    );
  };

  // Guardar cambios en el backend
  const handleGuardar = async (id) => {
    setGuardando(true);
    const noticiaAEditar = noticias.find(n => n.id === id);

    try {
      await API.put(`/noticias/${id}`, noticiaAEditar);
      alert(`✅ Noticia #${id} guardada con éxito.`);
    } catch (error) {
      console.error('Error al actualizar la noticia:', error);
      alert('❌ Ocurrió un error al guardar los cambios en la base de datos.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-24">
        <p className="text-amber-400 font-semibold animate-pulse">Cargando gestión de noticias...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-8 border-b border-white/10 pb-4">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            Panel de Control
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide mt-1">
            Gestión de Novedades Locales
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Modificá las noticias y links de imágenes de la revista digital.
          </p>
        </div>

        {/* Lista de noticias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {noticias.map((item, index) => (
            <div 
              key={item.id}
              className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-amber-400 text-sm uppercase">
                    Noticia #{index + 1}
                  </span>
                  <span className="text-xs bg-black/50 px-2 py-0.5 rounded text-gray-400">
                    ID: {item.id}
                  </span>
                </div>

                {/* Previsualización de Imagen */}
                <div className="relative h-36 rounded-lg overflow-hidden bg-slate-800 border border-white/10">
                  <img 
                    src={item.imagen} 
                    alt="Vista previa" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Sin+Imagen'; }}
                  />
                </div>

                {/* Link/URL de la Imagen (Permite borrar y escribir) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    URL de la Imagen
                  </label>
                  <input 
                    type="text" 
                    value={item.imagen || ''}
                    onChange={(e) => handleChange(item.id, 'imagen', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                    placeholder="https://..."
                  />
                </div>

                {/* Categoría y Fecha */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Categoría</label>
                    <input 
                      type="text" 
                      value={item.categoria || ''}
                      onChange={(e) => handleChange(item.id, 'categoria', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Fecha</label>
                    <input 
                      type="text" 
                      value={item.fecha || ''}
                      onChange={(e) => handleChange(item.id, 'fecha', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Título */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Título</label>
                  <textarea 
                    rows="2"
                    value={item.titulo || ''}
                    onChange={(e) => handleChange(item.id, 'titulo', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Resumen */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Resumen</label>
                  <textarea 
                    rows="3"
                    value={item.resumen || ''}
                    onChange={(e) => handleChange(item.id, 'resumen', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Botón Guardar */}
              <button
                onClick={() => handleGuardar(item.id)}
                disabled={guardando}
                className="mt-5 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-colors flex justify-center items-center gap-1 shadow-lg disabled:opacity-50"
              >
                💾 Guardar Noticia #{index + 1}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}