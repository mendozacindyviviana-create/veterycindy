export default function Testimonials() {
  const testimonials = [
    { foto: 'https://i.pravatar.cc/80?img=1', nombre: 'Laura Martínez', mascota: 'Luna • Golden', texto: 'Mi perrita casi se muere de una obstrucción. El doctor la operó a medianoche. Hoy está perfecta. Eternamente agradecida.' },
    { foto: 'https://i.pravatar.cc/80?img=3', nombre: 'Andrés Velásquez', mascota: 'Simón • Gato', texto: 'Siempre son tan pacientes explicando todo. Nunca sentí que me estaban apurando. La mejor clínica de Bogotá sin duda.' },
    { foto: 'https://i.pravatar.cc/80?img=5', nombre: 'Valentina Ruiz', mascota: 'Coco y Nina', texto: 'Vacunación, desparasitación, emergencias… confío en ellos con mis dos gatos desde hace 5 años. Son parte de la familia.' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <div className="text-[#B45309] tracking-[2px] text-sm font-semibold">HISTORIAS REALES</div>
        <h2 className="text-4xl font-bold tracking-tight text-[#14532D]">Lo que dicen quienes ya nos conocen</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial bg-white border border-[#F5EDE3] p-8 rounded-3xl">
            <div className="flex gap-1 text-[#B45309] text-xl mb-6">★★★★★</div>
            <p className="text-[#374151] leading-relaxed mb-8 text-[15px]">"{t.texto}"</p>
            <div className="flex items-center gap-4">
              <img src={t.foto} alt={t.nombre} className="w-12 h-12 rounded-full object-cover ring-2 ring-white" />
              <div>
                <div className="font-semibold text-[#14532D]">{t.nombre}</div>
                <div className="text-xs text-[#6B7280]">{t.mascota}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
