export default function Hero() {
  const scrollToForm = () => {
    document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToServices = () => {
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className="hero relative min-h-[100dvh] flex items-center justify-center text-white overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(20,83,45,0.92) 0%, rgba(15,118,110,0.88) 100%), url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=2000&q=80') center/cover no-repeat`,
      }}
    >
      <div className="max-w-5xl px-6 text-center relative z-10 pt-10">
        <h1 className="text-6xl md:text-7xl font-bold leading-[1.05] tracking-tighter mb-6">
          Tu mascota<br />merece lo mejor
        </h1>

        <p className="max-w-lg mx-auto text-2xl text-white/90 mb-10 tracking-tight">
          Atención veterinaria con alma, tecnología y mucho cariño.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToForm}
            className="btn-vet px-14 py-5 text-xl font-semibold rounded-2xl text-white flex items-center justify-center gap-3 shadow-2xl border-none cursor-pointer"
          >
            Agendar cita ahora
            <span className="text-2xl">→</span>
          </button>
          <button
            onClick={scrollToServices}
            className="px-10 py-5 text-xl font-semibold rounded-2xl border-2 border-white/70 hover:bg-white/10 transition-all bg-transparent text-white cursor-pointer"
          >
            Ver todos los servicios
          </button>
        </div>

        {/* Trust bar */}
        <div className="mt-16 grid grid-cols-3 max-w-md mx-auto gap-px bg-white/20 rounded-2xl p-px">
          {[
            { n: '2.400+', l: 'Mascotas felices' },
            { n: '4.97', l: 'Promedio reseñas' },
            { n: '8 años', l: 'De experiencia' },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur py-4 rounded-[14px]">
              <div className="font-semibold text-2xl">{s.n}</div>
              <div className="text-xs tracking-widest text-white/75">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
