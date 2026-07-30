import React, { useState } from 'react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    comercio: '',
    telefono: '',
    mensaje: ''
  });

  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- ENVÍO DE EMAIL VÍA FORMSPREE ---
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      // Reemplazá 'TU_FORM_ID' con tu ID de Formspree (ej: https://formspree.io/f/x3qv2a1z)
      const response = await fetch('https://formspree.io/f/xbdnbnvn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEnviado(true);
        setFormData({ nombre: '', comercio: '', telefono: '', mensaje: '' });
      } else {
        alert('Ocurrió un problema al enviar el correo. Por favor intenta por WhatsApp.');
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      alert('Error de conexión al enviar el mensaje.');
    } finally {
      setEnviando(false);
    }
  };

  // Mensaje pre-armado para el botón directo de WhatsApp
  const miTelefono = '5492664759571'; // 👈 Tu número real aquí
  const mensajeWhatsApp = encodeURIComponent(
    `*¡Hola Magazine La Punta!*\nQuisiera hacer una consulta sobre la plataforma o publicar mi comercio.`
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase mb-4">
            Contactate con <span className="text-amber-400">Nosotros</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            ¿Querés publicar tu comercio o servicio en Magazine La Punta? Escribinos y sumate a la guía comercial digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COLUMNA 1: CONTACTO DIRECTO POR WHATSAPP & INFO */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-amber-400 mb-6 border-b border-slate-700 pb-3">
                Atención Inmediata
              </h2>

              <div className="space-y-6 text-gray-300 text-sm md:text-base">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h3 className="font-bold text-white">Ubicación</h3>
                    <p className="text-gray-400 text-sm">La Punta, San Luis, Argentina.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h3 className="font-bold text-white">WhatsApp Directo</h3>
                    <p className="text-gray-400 text-sm">Respuesta rápida para consultas comerciales y adhesiones.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="font-bold text-white">Producciones Digitales D'Agata</h3>
                    <p className="text-gray-400 text-sm">Desarrollo y diseño de espacios digitales.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Directo a WhatsApp */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <a
                href={`https://wa.me/${miTelefono}?text=${mensajeWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 font-bold py-3.5 px-6 rounded-xl text-white transition-all shadow-lg"
              >
                <span>💬</span> Chatear por WhatsApp
              </a>
            </div>
          </div>

          {/* COLUMNA 2: FORMULARIO DE ENVÍO POR EMAIL */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 border-b border-slate-700 pb-3">
              Envianos un Email
            </h2>

            {enviado ? (
              <div className="bg-green-500/20 border border-green-500/40 text-green-300 p-6 rounded-xl text-center my-8">
                <h3 className="text-lg font-bold mb-2">¡Email enviado con éxito! 📧</h3>
                <p className="text-xs text-green-200 mb-4">
                  Recibimos tu mensaje en nuestra casilla de correo. Te responderemos a la brevedad.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="text-xs bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitEmail} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Tu Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nombre del Comercio / Rubro</label>
                  <input
                    type="text"
                    name="comercio"
                    value={formData.comercio}
                    onChange={handleChange}
                    placeholder="Tu nombre comercial o rubro"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    name="telefono"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 2664001122"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Consulta o Mensaje</label>
                  <textarea
                    name="mensaje"
                    rows="4"
                    required
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Contanos qué querés anunciar o tus dudas sobre la plataforma..."
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="mt-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-black uppercase tracking-wider rounded-xl transition-all shadow-lg text-sm disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {enviando ? 'Enviando email...' : '✉️ Enviar por Email'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}