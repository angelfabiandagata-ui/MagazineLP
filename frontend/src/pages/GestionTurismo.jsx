import React, { useState, useEffect } from 'react';
import API from '../api';

export default function GestionTurismo() {
  const [atractivos, setAtractivos] = useState([
    {
      id: 1,
      titulo: "Réplica del Cabildo Histórico de 1810",
      categoria: "Patrimonio",
      ubicacion: "Av. Serrana s/n",
      resumen: "Monumento histórico nacional a escala real que recrea el edificio de la Revolución de Mayo con muestras interactivas y visitas guiadas.",
      imagen: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      titulo: "Parque Astronómico La Punta (PALP)",
      categoria: "Ciencia & Familia",
      ubicacion: "Campus ULP",
      resumen: "Un espacio único para explorar el universo con su Planetario digital, el Solar de las Miradas y el observatorio astronómico.",
      imagen: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      titulo: "Réplica de la Casa de Tucumán",
      categoria: "Cultura",
      ubicacion: "Av. Serrana",
      resumen: "Fiel recreación del histórico sitio de la Declaración de la Independencia, ambientada con mobiliario y reliquias de la época.",
      imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    }
  ]);

  const [guardando, setGuardando] = useState(false);

  // Cargar datos de la BD usando el cliente API
  useEffect(() => {
    API.get('/turismo')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAtractivos(res.data);
        }
      })
      .catch(() => {
        // Mantiene el borrador inicial si aún no se han creado registros en la BD
      });
  }, []);

  // Modificar valores de las tarjetas en tiempo real
  const handleChange = (id, campo, valor) => {
    setAtractivos(prev =>
      prev.map(item => (item.id === id ? { ...item, [campo]: valor } : item))
    );
  };

  // Guardar cambios
  const handleGuardar = async (id) => {
    setGuardando(true);
    const puntoAEditar = atractivos.find(item => item.id === id);

    try {
      await API.put(`/turismo/${id}`, puntoAEditar);
      alert(`✅ Punto turístico "${puntoAEditar.titulo}" guardado en la Base de Datos.`);
      
      // Volvemos a traer los datos frescos de la BD
      const res = await API.get('/turismo');
      setAtractivos(res.data);
    } catch (error) {
      console.error('Error al actualizar punto turístico:', error);
      alert('❌ Error al guardar en la base de datos.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-8 border-b border-white/10 pb-4">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
            Panel de Control
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide mt-1">
            Gestión de Puntos Turísticos
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Edita las tarjetas informativas de los atractivos locales que se muestran en la sección Turismo.
          </p>
        </div>

        {/* Formulario en tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {atractivos.map((item, index) => (
            <div 
              key={item.id}
              className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-amber-400 text-sm uppercase">
                    Punto Turístico #{index + 1}
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
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Imagen+No+Valida'; }}
                  />
                </div>

                {/* URL de Imagen */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">URL de la Imagen</label>
                  <input 
                    type="text" 
                    value={item.imagen}
                    onChange={(e) => handleChange(item.id, 'imagen', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Categoría y Ubicación */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Categoría</label>
                    <input 
                      type="text" 
                      value={item.categoria}
                      onChange={(e) => handleChange(item.id, 'categoria', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Ubicación</label>
                    <input 
                      type="text" 
                      value={item.ubicacion}
                      onChange={(e) => handleChange(item.id, 'ubicacion', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Título */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Título / Nombre</label>
                  <textarea 
                    rows="2"
                    value={item.titulo}
                    onChange={(e) => handleChange(item.id, 'titulo', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Resumen */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Descripción / Resumen</label>
                  <textarea 
                    rows="3"
                    value={item.resumen}
                    onChange={(e) => handleChange(item.id, 'resumen', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Botón de Guardar por tarjeta */}
              <button
                onClick={() => handleGuardar(item.id)}
                disabled={guardando}
                className="mt-5 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-colors flex justify-center items-center gap-1 shadow-lg disabled:opacity-50"
              >
                💾 Guardar Punto #{index + 1}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}