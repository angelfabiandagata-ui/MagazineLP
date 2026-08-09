import React from 'react';

export default function Terminos() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-300">
      <h1 className="text-3xl font-extrabold uppercase text-amber-400 mb-6">
        Términos y Condiciones
      </h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: Agosto 2026</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sitio web <strong>Magazine La Punta</strong>, el usuario y los comercios adheridos aceptan cumplir con los presentes Términos y Condiciones. Si no está de acuerdo con alguno de los puntos, le solicitamos abstenerse de utilizar la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Naturaleza del Servicio</h2>
          <p>
            Magazine La Punta es una plataforma digital de difusión comercial e informativa local. No interviene en las transacciones comerciales, pagos, envíos ni acuerdos entre los clientes y los comercios anunciantes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Responsabilidad del Contenido</h2>
          <p>
            Cada comercio registrado es único responsable de la veracidad de los precios, promociones, direcciones, imágenes y horarios publicados en su perfil. La administración se reserva el derecho de remover cualquier contenido o cuenta que incumpla las normas comunitarias o publique información engañosa.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. Propiedad Intelectual</h2>
          <p>
            El diseño, código fuente, logotipos y marca de Magazine La Punta son propiedad exclusiva de <strong>Producciones Digitales D'Agata</strong>. Queda prohibida su reproducción total o parcial sin autorización expresa.
          </p>
        </section>
      </div>
    </div>
  );
}