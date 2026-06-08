export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white/70 pt-16 pb-8 text-sm">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-y-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 text-white mb-4">
            <div className="text-4xl">🐾</div>
            <div className="font-bold text-3xl tracking-tighter">VeteryCindy</div>
          </div>
          <div className="max-w-xs text-white/60">
            Cuidamos a las mascotas de Bogotá con profesionalismo, calidez y tecnología de primer nivel desde 2017.
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="font-semibold text-white mb-4 tracking-wider text-xs">CONTACTO</div>
          <div className="space-y-2">
            <div>+57 301 000 3030</div>
            <div>prueba@veterycindy.com.co</div>
            <div>Calle 15 # 8-42, Bogotá</div>
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="font-semibold text-white mb-4 tracking-wider text-xs">HORARIOS</div>
          <div className="space-y-1 text-white/80">
            <div>Lunes a viernes: 9:00 am – 5:00 pm</div>
            <div>Sábados: 9:00 am – 3:00 pm</div>
            <div className="text-[#B45309] font-medium pt-1">Emergencias 24 horas • 7 días</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-16 pt-8 text-center text-xs text-white/50">
        © {new Date().getFullYear()} VeteryCindy Clínica Veterinaria • Bogotá, Colombia
      </div>
    </footer>
  );
}
