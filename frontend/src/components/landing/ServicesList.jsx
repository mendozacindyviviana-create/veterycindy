const services = [
  { icon: '🩺', title: 'Consulta General', desc: 'Revisión completa, diagnóstico y plan de tratamiento personalizado.' },
  { icon: '💉', title: 'Vacunación', desc: 'Esquemas completos y recordatorios automáticos para perros y gatos.' },
  { icon: '🚨', title: 'Emergencias 24/7', desc: 'Atención inmediata. Nunca estás solo cuando tu mascota te necesita.' },
  { icon: '✂️', title: 'Esterilización', desc: 'Cirugía segura con los más altos estándares de bienestar animal.' },
  { icon: '🏥', title: 'Cirugías', desc: 'Procedimientos con anestesia moderna y monitoreo constante.' },
  { icon: '🦷', title: 'Odontología', desc: 'Limpieza, extracciones y cuidado dental profesional.' },
  { icon: '🐾', title: 'Piel y Alergias', desc: 'Tratamiento especializado en dermatitis y problemas dermatológicos.' },
  { icon: '❤️', title: 'Control Post-Op', desc: 'Seguimiento cercano después de cualquier procedimiento.' },
];

const costs = [
  { service: 'Consulta general', price: '$65.000 COP', detail: 'Valor base para valoracion medica.' },
  { service: 'Vacunacion', price: '$45.000 COP', detail: 'Aplicacion y registro del esquema.' },
  { service: 'Piel y alergias', price: '$85.000 COP', detail: 'Revision dermatologica inicial.' },
  { service: 'Esterilizacion', price: 'Desde $180.000 COP', detail: 'Depende de especie, peso y condicion.' },
  { service: 'Cirugia', price: 'Desde $350.000 COP', detail: 'Se confirma despues de valoracion.' },
];

export default function ServicesList() {
  return (
    <section id="servicios" className="section max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <div className="text-[#B45309] text-sm font-semibold tracking-[2px] mb-2">LO QUE HACEMOS CON AMOR</div>
        <h2 className="text-5xl font-bold tracking-tighter text-[#14532D]">Servicios para tu familia peluda</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <div key={i} className="service-card group bg-white p-8 rounded-3xl hover:shadow-xl">
            <div className="icon-circle w-14 h-14 bg-[#F5EDE3] text-[#14532D] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-[#0F766E] group-hover:text-white">
              {s.icon}
            </div>
            <h3 className="font-semibold text-2xl tracking-tight mb-3 text-[#14532D]">{s.title}</h3>
            <p className="text-[#4B5563] leading-relaxed text-[15px]">{s.desc}</p>
          </div>
        ))}
      </div>

      <div id="costos" className="section scroll-mt-28 mt-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="text-[#B45309] text-sm font-semibold tracking-[2px] mb-2">TARIFAS DE REFERENCIA</div>
            <h2 className="text-4xl font-bold tracking-tighter text-[#14532D]">Costos transparentes antes de confirmar</h2>
          </div>
          <p className="max-w-md text-[#4B5563] text-sm leading-relaxed">
            Los valores pueden cambiar segun el paciente y el procedimiento. En caja se liquida el monto final antes de aprobar el pago.
          </p>
        </div>

        <div className="bg-white border border-[#E5E0D8] rounded-3xl overflow-hidden">
          {costs.map((item, index) => (
            <div key={item.service} className={`grid md:grid-cols-[1.3fr_0.8fr_1.4fr] gap-3 px-6 py-5 ${index !== costs.length - 1 ? 'border-b border-[#F5EDE3]' : ''}`}>
              <div className="font-semibold text-[#14532D]">{item.service}</div>
              <div className="font-bold text-[#B45309]">{item.price}</div>
              <div className="text-sm text-[#4B5563]">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
