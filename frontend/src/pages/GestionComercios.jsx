import React, { useEffect, useState } from 'react';
import API from '../api';

export default function GestionComercios() {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar la lista de comercios inspeccionando cualquier tipo de respuesta
  const obtenerComercios = async () => {
    setLoading(true);
    try {
      const res = await API.get('/comercios');
      console.log('Respuesta cruda de la API:', res.data);

      let lista = [];
      if (Array.isArray(res.data)) {
        lista = res.data;
      } else if (res.data && typeof res.data === 'object') {
        lista = res.data.comercios || res.data.data || res.data.result || [];
      }

      setComercios(lista);
    } catch (error) {
      console.error('Error al obtener comercios:', error);
      alert('Error al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerComercios();
  }, []);

  // Eliminar un solo comercio
  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`⚠️ ¿Eliminar "${nombre || 'este comercio'}"?`);
    if (!confirmar) return;

    try {
      await API.delete(`/comercios/${id}`);
      setComercios(prev => prev.filter(c => c.id !== id));
      alert('✅ Eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Ocurrió un error al intentar eliminar.');
    }
  };

  // Vaciar TODOS los comercios duplicados de una sola vez
  const handleVaciarTodo = async () => {
    const confirmar = window.confirm(
      `🚨 ATENCIÓN: Se intentará eliminar los ${comercios.length} comercios registrados en la BD.\n\n¿Deseas continuar?`
    );
    if (!confirmar) return;

    setLoading(true);
    try {
      for (const c of comercios) {
        if (c.id) {
          await API.delete(`/comercios/${c.id}`);
        }
      }
      alert('✅ Limpieza completada.');
      await obtenerComercios();
    } catch (error) {
      console.error('Error durante la limpieza masiva:', error);
      alert('Hubo un error al eliminar algunos registros.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse text-amber-400">
          Consultando base de datos PostgreSQL...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/20 pb-4 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-wide">
              Panel de Gestión de Comercios
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Comercios encontrados en la BD: <span className="text-amber-400 font-bold">{comercios.length}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={obtenerComercios}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all"
            >
              🔄 Recargar
            </button>
            {comercios.length > 0 && (
              <button
                onClick={handleVaciarTodo}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg"
              >
                🔥 Vaciar Todos
              </button>
            )}
          </div>
        </div>

        {comercios.length === 0 ? (
          <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center text-gray-400">
            No hay comercios registrados en la base de datos.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {comercios.map((comercio, index) => (
              <div
                key={comercio.id || index}
                className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 flex flex-wrap justify-between items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{comercio.name || 'Sin Nombre'}</h3>
                    <span className="text-[10px] bg-slate-900 text-amber-400 px-2 py-0.5 rounded font-mono">
                      ID: {comercio.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    📍 {comercio.direccion || 'Sin dirección'} | 📞 {comercio.tel || 'Sin teléfono'}
                  </p>
                </div>

                <button
                  onClick={() => handleEliminar(comercio.id, comercio.name)}
                  className="bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors"
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