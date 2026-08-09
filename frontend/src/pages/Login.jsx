import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Petición unificada al Backend (Maneja tanto comercios como admin)
      const res = await API.post('/auth/login', {
        email,
        password
      });

      const { token, comercio, esAdmin } = res.data;

      // Guardamos el token JWT firmado correctamente por el Backend
      localStorage.setItem('token', token);

      if (esAdmin) {
        localStorage.setItem('rol', 'admin');
        navigate('/admin');
      } else {
        localStorage.setItem('rol', 'comercio');
        if (comercio) {
          localStorage.setItem('comercio', JSON.stringify(comercio));
        }
        navigate('/perfil');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Credenciales incorrectas o servidor no disponible.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-extrabold uppercase text-center mb-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Iniciar Sesión
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Ingresá con tu cuenta para acceder a la plataforma de Magazine La Punta
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-black uppercase tracking-wider rounded-xl transition-all shadow-lg"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}