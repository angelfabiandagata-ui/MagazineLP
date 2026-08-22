import React, { useEffect, useState } from 'react';
import API from '../api';

export default function GestionComercios() {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'activos' | 'pendientes'

  const obtenerComercios = async () => {
    setLoading(true);
    try {
      // Pedimos todos los comercios (incluyendo inactivos/pendientes para el admin)
      const res = await API.get('/comercios/admin/todos');

      let lista = [];
      if (Array.isArray(res.data)) {
        lista = res.data;
      } else if (res.data && typeof res.data === 'object') {
        lista = res.data.comercios || res.data.data || res.data.result || [];
      }

      setComercios(lista);
    } catch (error) {
      console.error('Error al obtener comercios:', error);
      // Fallback si la ruta de admin no existe aún
      try {
        const resFallback = await API.get('/comercios');
        setComercios(Array.isArray(resFallback.data) ? resFallback.data : []);
      } catch (err) {
        alert('Error al conectar con la base de datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerComercios();
  }, []);

  // 🟢 / ⏸️ Alternar estado: Dar de Alta / Dar de Baja
  const handleToggleEstado = async (id, estadoActual, nombre) => {
    const nuevoEstado = !estadoActual;
    const accion = nuevoEstado ? 'dar de ALTA' : 'dar de BAJA (pausar)';

    try {
      await API.put(`/comercios/${id}/estado`, { activo: nuevoEstado });

      // Actualizar estado local inmediato
      setComercios(prev =>
        prev.map(c => (c.id === id ? { ...c, activo: nuevoEstado } : c))
      );
    } catch (error) {
      console.error(`Error al ${accion}:`, error);
      alert(`No se pudo cambiar el estado de "${nombre}".`);
    }
  };

  // 🗑️ Eliminar comercio definitivamente
  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`⚠️ ¿Eliminar permanentemente a "${nombre || 'este comercio'}" de la BD?`);
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

  // Filtrado reactivo
  const comerciosFiltrados = comercios.filter(c => {
    if (filtro === 'activos') return Boolean(c.activo);
    if (filtro === 'pendientes') return !c.activo;
    return true;
  });

  const pendientesCount = comercios.filter(c => !c.activo).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse text-amber-400">
          Cargando panel de comercios...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 md:p-12 pt-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 mb-6 gap-4">
          <div>
            <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
              Panel Administrativo
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mt-1">
              Gestión de Comercios
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Total: <b className="text-white">{comercios.length}</b> | Pendientes de alta:{' '}
              <b className={pendientesCount > 0 ? 'text-amber-400 font-bold' : 'text-green-400'}>
                {pendientesCount}
              </b>
            </p>
          </div>

          <button
            onClick={obtenerComercios}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all border border-white/10"
          >
            🔄 Actualizar Lista
          </button>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFiltro('todos')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              filtro === 'todos'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Todos ({comercios.length})
          </button>
          <button
            onClick={() => setFiltro('pendientes')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              filtro === 'pendientes'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Pendientes / Pausados ({pendientesCount})
          </button>
          <button
            onClick={() => setFiltro('activos')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              filtro === 'activos'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Activos ({comercios.length - pendientesCount})
          </button>
        </div>

        {/* Listado */}
        {comerciosFiltrados.length === 0 ? (
          <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10 text-center text-gray-400">
            No se encontraron comercios bajo este filtro.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {comerciosFiltrados.map((comercio) => {
              const estaActivo = Boolean(comercio.activo);

              return (
                <div
                  key={comercio.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                    estaActivo
                      ? 'bg-slate-800/80 border-slate-700/80'
                      : 'bg-slate-900/90 border-amber-500/30'
                  }`}
                >
                  {/* Información */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {comercio.name || 'Sin Nombre'}
                      </h3>
                      
                      {/* Badge de Estado */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          estaActivo
                            ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {estaActivo ? '● Publicado / Activo' : '○ Pendiente / Pausado'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      📧 {comercio.email || 'Sin email'} | 📞 {comercio.tel || 'Sin teléfono'} | 🏷️ {comercio.rubro || 'General'}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      📍 {comercio.direccion || 'Sin dirección'}
                    </p>
                  </div>

                  {/* Acciones: Toggle Estado + Eliminar */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <button
                      onClick={() => handleToggleEstado(comercio.id, estaActivo, comercio.name)}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 ${
                        estaActivo
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                          : 'bg-green-600 hover:bg-green-500 text-white'
                      }`}
                    >
                      {estaActivo ? '⏸️ Dar de Baja' : '✅ Dar de Alta'}
                    </button>

                    <button
                      onClick={() => handleEliminar(comercio.id, comercio.name)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                      title="Eliminar de la BD"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}