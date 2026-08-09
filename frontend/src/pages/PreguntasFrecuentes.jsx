import React from 'react';

export default function PreguntasFrecuentes() {
  const preguntas = [
    {
      q: '¿Tengo que registrarme para ver las ofertas y comercios?',
      a: 'No. El acceso a Magazine La Punta es completamente libre y gratuito para todos los vecinos y visitantes.'
    },
    {
      q: '¿Cómo me contacto con un comercio?',
      a: 'Dentro de cada perfil comercial vas a encontrar botones de acceso directo a su WhatsApp, teléfono o dirección en mapa.'
    },
    {
      q: '¿Cómo sumo mi negocio a la plataforma?',
      a: 'Podés solicitar tu alta comunicándote con el equipo de administración o registrándote directamente desde la sección "Sumar mi Comercio".'
    },
    {
      q: '¿Puedo actualizar mis fotos y promociones?',
      a: 'Sí. Iniciar sesión con tu correo y contraseña te permite ingresar a tu Panel de Perfil para cambiar la información en tiempo real.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-300">
      <h1 className="text-3xl font-extrabold uppercase text-amber-400 mb-6">
        Preguntas Frecuentes
      </h1>

      <div className="flex flex-col gap-6 mt-8">
        {preguntas.map((item, index) => (
          <div key={index} className="bg-slate-800/60 p-6 rounded-xl border border-slate-700">
            <h2 className="text-base font-bold text-white mb-2">
              {item.q}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}