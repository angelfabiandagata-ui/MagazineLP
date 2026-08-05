import React from 'react';

export default function BloqueComercio({ comercio }) {
  const listaImagenes = comercio?.images || comercio?.Images || [];

  const objFondo = listaImagenes.find(img => img.tipo === 'FONDO');
  const objPromo1 = listaImagenes.find(img => img.tipo === 'PROMO_1');
  const objPromo2 = listaImagenes.find(img => img.tipo === 'PROMO_2');

  const fallbackFondo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'><rect width='100%' height='100%' fill='%230f172a'/><text x='50%' y='50%' fill='%23334155' text-anchor='middle' font-family='sans-serif' font-size='48'>Magazine La Punta</text></svg>";

  // Construcción dinámica del dominio base del backend
  const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

  const imgFondo = objFondo ? `${BASE_URL}${objFondo.url}` : fallbackFondo;
  const imgPromo1 = objPromo1 ? `${BASE_URL}${objPromo1.url}` : null;
  const imgPromo2 = objPromo2 ? `${BASE_URL}${objPromo2.url}` : null;

  const listaLabels = comercio?.Labels || comercio?.labels || [];

  const rawIg = comercio?.redSocial?.instagram || '';
  const cleanIg = rawIg.replace('@', '');
  const urlInstagram = cleanIg ? `https://instagram.com/${cleanIg}` : null;

  const rawWa = comercio?.redSocial?.whatsapp || comercio?.tel || '';
  const numWhatsApp = String(rawWa).replace(/[^0-9]/g, '');
  const urlWhatsApp = numWhatsApp ? `https://wa.me/${numWhatsApp}` : null;

  const rawWeb = comercio?.redSocial?.paginaWeb || '';
  const urlWeb = rawWeb ? (rawWeb.startsWith('http') ? rawWeb : `https://${rawWeb}`) : null;

  return (
    <div 
      className="scroll-area relative w-full min-h-screen md:h-screen bg-cover bg-center flex flex-col justify-between p-4 sm:p-6 md:p-8 text-white"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${imgFondo}')` }}
    >
      {/* Encabezado: Título y Etiquetas */}
      <div className="pt-14 sm:pt-16">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wide uppercase break-words">
          {comercio?.name}
        </h2>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
          {listaLabels.map((l, index) => (
            <span key={index} className="bg-blue-600/80 text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full text-white">
              #{typeof l === 'object' ? (l.label || l.name) : l}
            </span>
          ))}
        </div>
      </div>

      {/* Bloque Medio: Sobre Nosotros y Promociones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center my-4">
        {/* Descripción */}
        <div className="md:col-span-2 bg-black/50 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/10">
          <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-blue-400">Sobre Nosotros</h3>
          <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed max-h-36 overflow-y-auto sm:max-h-none">
            {comercio?.description || 'Sin descripción disponible por el momento.'}
          </p>
        </div>

        {/* Galería de Promociones */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {imgPromo1 && (
            <div className="h-24 sm:h-28 bg-white/10 rounded-lg overflow-hidden border border-white/20">
              <img src={imgPromo1} alt="Promo 1" className="w-full h-full object-cover" />
            </div>
          )}
          {imgPromo2 && (
            <div className="h-24 sm:h-28 bg-white/10 rounded-lg overflow-hidden border border-white/20">
              <img src={imgPromo2} alt="Promo 2" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Pie del Bloque: Ubicación y Redes */}
      <div className="bg-black/70 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs sm:text-sm">
        <div className="space-y-0.5">
          <p className="truncate">📍 {comercio?.direccion || 'La Punta, San Luis'}</p>
          <p>📞 {comercio?.tel || 'Sin teléfono de contacto'}</p>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 items-center w-full sm:w-auto justify-start sm:justify-end border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
          {urlInstagram && (
            <a href={urlInstagram} target="_blank" rel="noreferrer" className="text-pink-400 font-semibold hover:underline">
              Instagram
            </a>
          )}

          {urlWhatsApp && (
            <a href={urlWhatsApp} target="_blank" rel="noreferrer" className="text-green-400 font-semibold hover:underline">
              WhatsApp
            </a>
          )}

          {urlWeb && (
            <a href={urlWeb} target="_blank" rel="noreferrer" className="text-amber-400 font-semibold hover:underline flex items-center gap-1">
              🌐 Sitio Web
            </a>
          )}
        </div>
      </div>
    </div>
  );
}