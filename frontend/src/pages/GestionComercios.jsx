import React, { useEffect, useState } from 'react';
import API from '../api';

export default function GestionComercios() {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar la lista de comercios probando diferentes estructuras de datos
  const obtenerComercios = async () => {
    try {
      const res = await API.get('/comercios');
      console.log('Respuesta completa del backend:', res.data);

      // Evaluación exhaustiva de formatos de respuesta comunes
      let lista = [];
      if (Array.isArray(res.data)) {
        lista = res.data;
      } else if (Array.isArray(res.data?.comercios)) {
        lista = res.data.comercios;
      } else if (Array.isArray(res.data?.data)) {
        lista = res.data.data;
      } else if (Array.isArray(res.data?.result)) {
        lista = res.data.result;
      }

      setComercios(lista);
    } catch (error) {
      console.error('Error al obtener comercios:', error);
      alert('Error al cargar la lista de comercios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerComercios();
  }, []);

  // Función para eliminar un solo comercio
  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(
      `⚠️ ¿Estás seguro de que querés eliminar el comercio "${nombre}"?\nEsta acción borrará todas sus imágenes y no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      await API.delete(`/comercios/${id}`);
      setComercios(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar comercio:', error);
      alert('Ocurrió un error al intentar eliminar el comercio.');
    }
  };

  // Función para vaciar/limpiar la lista completa de comercios
  const handleEliminarTodos = async () => {
    const confirmar = window.confirm(
      `🚨 ATENCIÓN: Vas a borrar LOS ${comercios.length} COMERCIOS de la base de datos.\n\n¿Estás seguro de que querés vaciar todo?`
    );

    if (!confirmar) return;

    setLoading(true);

    try {
      // Intentamos eliminar secuencialmente los comercios mapeados
      await Promise.all(comercios.map(c => API.delete(`/comercios/${c.id}`)));
      alert('✅ Todos los comercios fueron eliminados con éxito.');
      setComercios([]);
    } catch (error) {
      console.error('Error al vaciar comercios:', error);
      alert('Ocurrió un error durante la eliminación masiva. Refrescá e intentá de nuevo.');
      obtenerComercios();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">Cargando comercios de la base de datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera y Botón de Limpieza Masiva */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/20 pb-4 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-wide">
              Panel de Gestión de Comercios
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Comercios registrados actualmente: <span className="text-amber-400 font-bold">{comercios.length}</span>
            </p>
          </div>

          {comercios.length > 0 && (
            <button
              onClick={handleEliminarTodos}
              className="bg-red-700 hover:bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              🔥 Vaciar / Eliminar Todos
            </button>
          )}
        </div>

        {comercios.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 text-center text-gray-400">
            No hay comercios registrados actualmente en la base de datos.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {comercios.map((comercio, index) => (
              <div
                key={comercio.id || index}
                className="bg-black/40 backdrop-blur-md p-5 rounded-xl border border-white/10 flex flex-wrap justify-between items-center gap-4 hover:border-white/30 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{comercio.name}</h3>
                    <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-0.5 rounded">
                      ID: {comercio.id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    📍 {comercio.direccion || 'Sin dirección'} | 📞 {comercio.tel || 'Sin teléfono'}
                  </p>
                  <span className="inline-block bg-blue-600/60 text-xs px-2.5 py-0.5 rounded-full mt-2">
                    {comercio.rubro || 'General'}
                  </span>
                </div>

                <button
                  onClick={() => handleEliminar(comercio.id, comercio.name)}
                  className="bg-red-600/80 hover:bg-red-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  🗑️ Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}