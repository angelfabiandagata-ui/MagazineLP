import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    direccion: '',
    tel: '',
    rubro: ''
  });
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cargando) return;

    if (!aceptaTerminos) {
      setMensaje({
        tipo: 'error',
        texto: 'Debés aceptar los términos, condiciones y políticas de imágenes para registrarte.'
      });
      return;
    }
    
    setMensaje({ tipo: '', texto: '' });
    setCargando(true);

    try {
      await API.post('/auth/register', formData);

      setMensaje({
        tipo: 'exito',
        texto: '¡Registro enviado con éxito! Tu comercio está en proceso de revisión. Una vez aprobado recibirás el alta para aparecer en la revista.'
      });

      // Redirección con margen para que el comerciante lea el mensaje
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.mensaje || 'Error al registrar el comercio. Verificá los datos ingresados.'
      });
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 sm:px-6 pt-24 pb-12">
      <div className="w-full max-w-lg bg-slate-800/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl">
        
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-center mb-1 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Sumá tu Comercio
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm text-center mb-6">
          Completá tus datos para solicitar tu espacio en Magazine La Punta
        </p>

        {mensaje.texto && (
          <div className={`p-3.5 rounded-xl text-xs sm:text-sm mb-4 text-center border leading-relaxed ${
            mensaje.tipo === 'exito' 
              ? 'bg-green-500/20 border-green-500/50 text-green-300' 
              : 'bg-red-500/20 border-red-500/50 text-red-300'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Nombre del Comercio</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Panadería La Punta"
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Email de Acceso</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="comercio@ejemplo.com"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Rubro / Categoría</label>
              <input
                type="text"
                name="rubro"
                value={formData.rubro}
                onChange={handleChange}
                placeholder="Ej: Gastronomía, Taller..."
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="2664000000"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Dirección / Licitación</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej: Maza 12, Mza 5"
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Checkbox de Términos y Condiciones */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="terminos"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="mt-1 h-4 w-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <label htmlFor="terminos" className="text-xs text-gray-400 cursor-pointer leading-tight">
              Acepto los <Link to="/terminos" target="_blank" className="text-amber-400 underline">Términos y Condiciones</Link> y la política de subida de imágenes responsables.
            </label>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-3 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-slate-950 uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50 cursor-pointer text-sm"
          >
            {cargando ? 'Enviando Solicitud...' : 'Solicitar Registro'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-400">
          ¿Ya tenés cuenta aprobada?{' '}
          <Link to="/login" className="text-amber-400 font-semibold hover:underline">
            Iniciá sesión acá
          </Link>
        </div>

      </div>
    </div>
  );
}