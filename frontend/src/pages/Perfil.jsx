import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Perfil() {
  const navigate = useNavigate();
  const [comercio, setComercio] = useState(null);
  const [labels, setLabels] = useState([]);
  const [nuevaLabel, setNuevaLabel] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [cargando, setCargando] = useState(false);

  // Estados para los archivos
  const [archivoFondo, setArchivoFondo] = useState(null);
  const [archivoPromo1, setArchivoPromo1] = useState(null);
  const [archivoPromo2, setArchivoPromo2] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    direccion: '',
    tel: '',
    rubro: '',
    instagram: '',
    whatsapp: '',
    paginaWeb: ''
  });

  // Base URL para resolver estáticos (imágenes viejas) apuntando al backend real
  const API_URL = import.meta.env.VITE_API_URL || 'https://magazinelp.onrender.com/api';
  const BACKEND_URL = API_URL.replace('/api', '');

  // Helper seguro para resolver la URL de la imagen
  const getImagenUrl = (tipo) => {
    if (comercio && comercio.images && Array.isArray(comercio.images)) {
      const img = comercio.images.find((i) => i.tipo === tipo);
      if (!img || !img.url) return null;

      // 1. Si es una URL completa (Cloudinary), se devuelve intacta
      if (img.url.startsWith('http://') || img.url.startsWith('https://')) {
        return img.url;
      }

      // 2. Si es una ruta relativa (/uploads/...), se le adosa la dirección del backend
      return `${BACKEND_URL}${img.url.startsWith('/') ? '' : '/'}${img.url}`;
    }
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const datosComercio = localStorage.getItem('comercio');

    if (!token || !datosComercio) {
      navigate('/login');
      return;
    }

    const comLocal = JSON.parse(datosComercio);

    // 1. Cargar estado básico con localStorage
    setComercio(comLocal);

    // 2. Pedir información actualizada al backend
    API.get(`/comercios/${comLocal.id}`)
      .then((res) => {
        const comDB = res.data;
        
        setComercio(comDB);
        localStorage.setItem('comercio', JSON.stringify(comDB));

        // Actualizar inputs del formulario
        setFormData({
          name: comDB.name || '',
          description: comDB.description || '',
          direccion: comDB.direccion || '',
          tel: comDB.tel || '',
          rubro: comDB.rubro || '',
          instagram: comDB.redSocial?.instagram || '',
          whatsapp: comDB.redSocial?.whatsapp || '',
          paginaWeb: comDB.redSocial?.paginaWeb || ''
        });

        // Sincronizar etiquetas
        const listaLabels = comDB.Labels || comDB.labels || [];
        const etiquetasLimpia = listaLabels.map((lbl) => 
          typeof lbl === 'object' ? (lbl.label || lbl.name) : lbl
        ).filter(Boolean);

        setLabels(etiquetasLimpia);
      })
      .catch((err) => {
        console.error('Error al sincronizar comercio con el servidor:', err);
        
        // Fallback usando localStorage
        setFormData({
          name: comLocal.name || '',
          description: comLocal.description || '',
          direccion: comLocal.direccion || '',
          tel: comLocal.tel || '',
          rubro: comLocal.rubro || '',
          instagram: comLocal.redSocial?.instagram || '',
          whatsapp: comLocal.redSocial?.whatsapp || '',
          paginaWeb: comLocal.redSocial?.paginaWeb || ''
        });

        const listaLabelsLocal = comLocal.Labels || comLocal.labels || [];
        const etiquetasLocal = listaLabelsLocal.map((lbl) => 
          typeof lbl === 'object' ? (lbl.label || lbl.name) : lbl
        ).filter(Boolean);
        
        setLabels(etiquetasLocal);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LÓGICA DE ETIQUETAS ---
  const handleAgregarLabel = (e) => {
    e.preventDefault();
    const textoLimpio = nuevaLabel.trim().toLowerCase().replace('#', '');
    
    if (textoLimpio !== '' && !labels.includes(textoLimpio)) {
      setLabels([...labels, textoLimpio]);
      setNuevaLabel('');
    }
  };

  const handleEliminarLabel = (labelAEliminar) => {
    setLabels(labels.filter((lbl) => lbl !== labelAEliminar));
  };

  // --- GUARDAR CAMBIOS ---
  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    setCargando(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('direccion', formData.direccion);
      data.append('tel', formData.tel);
      data.append('rubro', formData.rubro);
      data.append('instagram', formData.instagram);
      data.append('whatsapp', formData.whatsapp);
      data.append('labels', JSON.stringify(labels));
      data.append('paginaWeb', formData.paginaWeb);

      if (archivoFondo) data.append('imagenFondo', archivoFondo);
      if (archivoPromo1) data.append('promo1', archivoPromo1);
      if (archivoPromo2) data.append('promo2', archivoPromo2);

      const res = await API.put(`/comercios/${comercio.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Se contempla si el backend responde { comercio: {...} } o directo {...}
      const comercioActualizado = res.data.comercio || res.data;

      localStorage.setItem('comercio', JSON.stringify(comercioActualizado));
      setComercio(comercioActualizado);

      // Limpiamos los archivos seleccionados de los inputs
      setArchivoFondo(null);
      setArchivoPromo1(null);
      setArchivoPromo2(null);

      setMensaje({ tipo: 'exito', texto: '¡Perfil e imágenes actualizados con éxito!' });
    } catch (err) {
      console.error('Error al guardar datos:', err);
      setMensaje({ 
        tipo: 'error', 
        texto: err.response?.data?.mensaje || 'Error al subir los datos e imágenes.' 
      });
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!comercio) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 px-6 md:px-12 pb-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera del Panel */}
        <div className="flex flex-wrap justify-between items-center mb-8 border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold uppercase text-amber-400">Panel de Control</h1>
            <p className="text-gray-400 text-sm">Administrá tu espacio, imágenes y etiquetas en Magazine La Punta</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-xs uppercase font-bold rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Mensaje de respuesta */}
        {mensaje.texto && (
          <div className={`p-4 rounded-xl text-sm mb-6 text-center border font-semibold ${
            mensaje.tipo === 'exito' 
              ? 'bg-green-500/20 border-green-500/50 text-green-300' 
              : 'bg-red-500/20 border-red-500/50 text-red-300'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna Principal: Datos Generales y Labels */}
          <div className="md:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col gap-4 shadow-xl">
            <h2 className="text-xl font-bold text-gray-200 border-b border-slate-700 pb-2">Información del Comercio</h2>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nombre Comercial</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Descripción / Sobre Nosotros</label>
              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Contá qué productos o servicios ofrecés..."
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* SECCIÓN ETIQUETAS */}
            <div className="border-t border-slate-700 pt-5 mt-2">
              <label className="block text-xs font-bold uppercase text-amber-400 mb-1">
                Etiquetas de Búsqueda (Labels)
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Agregá palabras clave por las que los vecinos te puedan encontrar (ej: <i>medialunas</i>, <i>delivery</i>, <i>cerveza</i>).
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={nuevaLabel}
                  onChange={(e) => setNuevaLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAgregarLabel(e);
                    }
                  }}
                  placeholder="Escribí una etiqueta y presioná Enter o Agregar"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAgregarLabel}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 font-bold text-black text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
                {labels.length === 0 ? (
                  <span className="text-xs text-gray-500 italic">No hay etiquetas cargadas. ¡Agregá algunas!</span>
                ) : (
                  labels.map((lbl, index) => (
                    <span
                      key={index}
                      className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 transition-all hover:border-amber-400"
                    >
                      #{lbl}
                      <button
                        type="button"
                        onClick={() => handleEliminarLabel(lbl)}
                        className="text-gray-400 hover:text-red-400 font-bold text-sm leading-none ml-1 transition-colors"
                        title="Eliminar etiqueta"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="mt-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-black uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              {cargando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          {/* Columna Secundaria: Imágenes y Redes Sociales */}
          <div className="flex flex-col gap-6">

            {/* SECCIÓN DE IMÁGENES */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-lg font-bold mb-4 text-gray-200 border-b border-slate-700 pb-2">Imágenes del Comercio</h2>

              <div className="flex flex-col gap-4">
                
                {/* Imagen de Fondo */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Imagen de Fondo (100vh)</label>
                  {getImagenUrl('FONDO') && (
                    <img
                      src={getImagenUrl('FONDO')}
                      alt="Fondo actual"
                      className="w-full h-24 object-cover rounded-xl mb-2 border border-amber-500/40"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setArchivoFondo(e.target.files[0])}
                    className="w-full text-xs text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 cursor-pointer"
                  />
                </div>

                {/* Promociones */}
                <div className="border-t border-slate-700/60 pt-3">
                  <label className="block text-xs font-bold text-gray-300 mb-2">Bloques Promocionales</label>
                  
                  <div className="flex flex-col gap-4">
                    {/* Promo 1 */}
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Promo 1:</span>
                      {getImagenUrl('PROMO_1') && (
                        <img
                          src={getImagenUrl('PROMO_1')}
                          alt="Promo 1 actual"
                          className="w-full h-20 object-cover rounded-lg mb-2 border border-slate-700"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setArchivoPromo1(e.target.files[0])}
                        className="w-full text-xs text-gray-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white cursor-pointer"
                      />
                    </div>

                    {/* Promo 2 */}
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Promo 2:</span>
                      {getImagenUrl('PROMO_2') && (
                        <img
                          src={getImagenUrl('PROMO_2')}
                          alt="Promo 2 actual"
                          className="w-full h-20 object-cover rounded-lg mb-2 border border-slate-700"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setArchivoPromo2(e.target.files[0])}
                        className="w-full text-xs text-gray-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white cursor-pointer"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* REDES SOCIALES */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-lg font-bold mb-4 text-gray-200 border-b border-slate-700 pb-2">Redes Sociales</h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Instagram (sin @)</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="ej: panaderialapunta"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">WhatsApp (número)</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="ej: 2664001122"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Página Web / Catálogo</label>
                  <input
                    type="text"
                    name="paginaWeb"
                    value={formData.paginaWeb}
                    onChange={handleChange}
                    placeholder="Ej: www.micomercio.com"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}