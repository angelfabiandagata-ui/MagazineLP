import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GestionComercios() {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar la lista de comercios
  const obtenerComercios = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/comercios');
      // Ajustá 'res.data.comercios' según la estructura que devuelva tu backend
      setComercios(Array.isArray(res.data) ? res.data : res.data.comercios || []);
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

  // Función para eliminar un comercio
  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(
      `⚠️ ¿Estás seguro de que querés eliminar el comercio "${nombre}"?\nEsta acción borró todas sus imágenes y no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3000/api/comercios/${id}`);
      alert(`✅ "${nombre}" fue eliminado con éxito.`);
      
      // Actualizamos el estado local filtrando el comercio eliminado
      setComercios(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar comercio:', error);
      alert('Ocurrió un error al intentar eliminar el comercio.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl font-semibold">Cargando comercios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2 uppercase tracking-wide border-b border-white/20 pb-4">
          Panel de Gestión de Comercios
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Administrá las publicaciones activas en Magazine La Punta.
        </p>

        {comercios.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 text-center text-gray-400">
            No hay comercios registrados actualmente.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {comercios.map((comercio) => (
              <div
                key={comercio.id}
                className="bg-black/40 backdrop-blur-md p-5 rounded-xl border border-white/10 flex flex-wrap justify-between items-center gap-4 hover:border-white/30 transition-all"
              >
                <div>
                  <h3 className="text-xl font-bold">{comercio.name}</h3>
                  <p className="text-sm text-gray-400">
                    📍 {comercio.direccion || 'Sin dirección'} | 📞 {comercio.tel || 'Sin teléfono'}
                  </p>
                  <span className="inline-block bg-blue-600/60 text-xs px-2.5 py-0.5 rounded-full mt-2">
                    {comercio.rubro || 'General'}
                  </span>
                </div>

                <button
                  onClick={() => handleEliminar(comercio.id, comercio.name)}
                  className="bg-red-600/80 hover:bg-red-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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