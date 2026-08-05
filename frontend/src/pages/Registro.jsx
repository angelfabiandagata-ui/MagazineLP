import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cargando) return; // Evita ejecuciones dobles si se presiona varias veces
    
    setMensaje({ tipo: '', texto: '' });
    setCargando(true);

    try {
      await API.post('/auth/register', formData);

      setMensaje({
        tipo: 'exito',
        texto: '¡Comercio dado de alta con éxito! Redirigiendo al login...'
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.mensaje || 'Error al registrar el comercio. Verificá los datos.'
      });
      setCargando(false); // Solo rehabilitamos si hubo error
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-lg bg-slate-800/90 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-extrabold uppercase text-center mb-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Alta de Comercio
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Registrá un nuevo establecimiento en Magazine La Punta
        </p>

        {mensaje.texto && (
          <div className={`p-3 rounded-lg text-sm mb-4 text-center border ${
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
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Email de Acceso</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="comercio@ejemplo.com"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-amber-400"
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
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Rubro / Categoría</label>
              <input
                type="text"
                name="rubro"
                value={formData.rubro}
                onChange={handleChange}
                placeholder="Ej: Gastronomía, Indumentaria..."
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-amber-400"
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
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-amber-400"
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
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-black uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {cargando ? 'Registrando...' : 'Dar de Alta Comercio'}
          </button>
        </form>
      </div>
    </div>
  );
}