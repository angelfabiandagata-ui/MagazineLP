import React from 'react';

export default function BloqueComercio({ comercio }) {
  // 1. Extraemos el array de imágenes
  const listaImagenes = comercio?.images || comercio?.Images || [];

  // 2. Buscamos las URLs para FONDO, PROMO_1 y PROMO_2
  const objFondo = listaImagenes.find(img => img.tipo === 'FONDO');
  const objPromo1 = listaImagenes.find(img => img.tipo === 'PROMO_1');
  const objPromo2 = listaImagenes.find(img => img.tipo === 'PROMO_2');

  const fallbackFondo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'><rect width='100%' height='100%' fill='%230f172a'/><text x='50%' y='50%' fill='%23334155' text-anchor='middle' font-family='sans-serif' font-size='48'>Magazine La Punta</text></svg>";

  const imgFondo = objFondo ? `http://localhost:3000${objFondo.url}` : fallbackFondo;
  const imgPromo1 = objPromo1 ? `http://localhost:3000${objPromo1.url}` : null;
  const imgPromo2 = objPromo2 ? `http://localhost:3000${objPromo2.url}` : null;

  // 3. Extraemos las etiquetas
  const listaLabels = comercio?.Labels || comercio?.labels || [];

  // 4. Armado limpio de links de redes (procesados como constantes antes del return)
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
      className="scroll-area relative w-full h-screen bg-cover bg-center flex flex-col justify-between p-6 text-white"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('${imgFondo}')` }}
    >
      {/* Encabezado del Comercio */}
      <div className="pt-16">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-wide uppercase">
          {comercio?.name}
        </h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {listaLabels.map((l, index) => (
            <span key={index} className="bg-blue-600/80 text-xs px-3 py-1 rounded-full text-white">
              #{typeof l === 'object' ? (l.label || l.name) : l}
            </span>
          ))}
        </div>
      </div>

      {/* Bloque Medio: Promociones + Descripción */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Descripción */}
        <div className="md:col-span-2 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-2">Sobre Nosotros</h3>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed">
            {comercio?.description || 'Sin descripción disponible por el momento.'}
          </p>
        </div>

        {/* Bloques de Promociones */}
        <div className="flex flex-col gap-4">
          {imgPromo1 && (
            <div className="h-28 bg-white/10 rounded-lg overflow-hidden border border-white/20">
              <img src={imgPromo1} alt="Promo 1" className="w-full h-full object-cover" />
            </div>
          )}
          {imgPromo2 && (
            <div className="h-28 bg-white/10 rounded-lg overflow-hidden border border-white/20">
              <img src={imgPromo2} alt="Promo 2" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Pie del Bloque: Contacto, Ubicación y Redes */}
      <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-wrap justify-between items-center text-sm">
        <div>
          <p>📍 {comercio?.direccion || 'La Punta, San Luis'}</p>
          <p>📞 {comercio?.tel || 'Sin teléfono de contacto'}</p>
        </div>

        <div className="flex flex-wrap gap-4 mt-2 md:mt-0 items-center">
          {urlInstagram && (
            <a 
              href={urlInstagram} 
              target="_blank" 
              rel="noreferrer" 
              className="text-pink-400 font-semibold hover:underline"
            >
              Instagram
            </a>
          )}

          {urlWhatsApp && (
            <a 
              href={urlWhatsApp} 
              target="_blank" 
              rel="noreferrer" 
              className="text-green-400 font-semibold hover:underline"
            >
              WhatsApp
            </a>
          )}

          {/* 🌐 NUEVO: Sitio Web */}
          {urlWeb && (
            <a 
              href={urlWeb} 
              target="_blank" 
              rel="noreferrer" 
              className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
            >
              🌐 Sitio Web
            </a>
          )}
        </div>
      </div>
    </div>
  );
}