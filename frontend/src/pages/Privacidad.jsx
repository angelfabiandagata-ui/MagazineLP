import React from 'react';

export default function Privacidad() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-300">
      <h1 className="text-3xl font-extrabold uppercase text-amber-400 mb-6">
        Política de Privacidad
      </h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: Agosto 2026</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Recopilación de Datos</h2>
          <p>
            Para el funcionamiento del perfil comercial, recopilamos información básica provista voluntariamente por los usuarios: nombre del comercio, correo electrónico, teléfono de contacto, redes sociales y fotos promocionales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Uso de la Información</h2>
          <p>
            Los datos proporcionados se utilizan exclusivamente para la autenticación en el sistema, la gestión de perfiles comerciales y la visualización pública de la guía para los vecinos de La Punta. No vendemos ni compartimos datos con terceros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Almacenamiento e Imágenes</h2>
          <p>
            Las imágenes cargadas por los usuarios se procesan a través de la infraestructura segura de Cloudinary para optimizar su velocidad de carga en la web.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. Derechos del Usuario</h2>
          <p>
            Conforme a la Ley N° 25.326 de Protección de Datos Personales, cualquier titular puede solicitar la modificación, actualización o eliminación definitiva de sus datos de nuestra base de datos contactando al equipo de administración.
          </p>
        </section>
      </div>
    </div>
  );
}