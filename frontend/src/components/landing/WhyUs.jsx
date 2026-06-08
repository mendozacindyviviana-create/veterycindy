export default function WhyUs() {
  const benefits = [
    { icon: '🐾', title: 'Amor real', text: 'Cada mascota que entra recibe cariño y respeto como parte de nuestra familia.' },
    { icon: '⏰', title: 'Tiempo de calidad', text: 'No corremos. Dedicamos el tiempo necesario para explicar y tranquilizarte.' },
    { icon: '🛡️', title: 'Seguridad primero', text: 'Protocolos estrictos, equipo moderno y seguimiento después de cada visita.' },
    { icon: '💚', title: 'Corazón & ciencia', text: 'Combinamos medicina de vanguardia con el trato humano que tu mascota merece.' },
  ];

  return (
    <section className="bg-[#14532D] text-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[#B45309] text-sm tracking-[3px] font-semibold mb-2">LA DIFERENCIA VETERYCINDY</div>
          <h3 className="text-4xl font-bold tracking-tight">Cuidamos como si fueran nuestros</h3>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {benefits.map((b, idx) => (
            <div key={idx} className="text-center">
              <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                {b.icon}
              </div>
              <div className="font-semibold text-xl mb-2 tracking-tight">{b.title}</div>
              <p className="text-white/80 text-sm leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
