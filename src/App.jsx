import { useState } from 'react';

// Iconos SVG simples y bonitos (estilo junior pero premium)
const PawIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.25 9.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 015 14.25v-3a2.25 2.25 0 012.25-2.25h10.5A2.25 2.25 0 0120 11.25v3z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 01-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 8.944 11.922 5.12-1.632 8.944-6.33 8.944-11.922 0-1.11-.16-2.18-.47-3.2z" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

function App() {
  const [formData, setFormData] = useState({
    motivo: '',
    tipoMascota: '',
    fecha: '',
    hora: '',
    nombre: '',
    correo: '',
    celular: '',
    observaciones: ''
  });

  const [errorFecha, setErrorFecha] = useState('');
  const [success, setSuccess] = useState(false);

  // Motivos de cita (clínica veterinaria real en Colombia)
  const motivos = [
    'Consulta general', 'Vacunación', 'Desparasitación', 'Emergencia',
    'Cirugía', 'Esterilización / Castración', 'Problemas de piel o alergias',
    'Problemas digestivos', 'Revisión dental', 'Control post-operatorio',
    'Certificado de salud para viajes', 'Otro'
  ];

  // Tipos de mascota - solo mascotas urbanas de ciudad (Bogotá)
  const tiposMascota = [
    { emoji: '🐶', nombre: 'Perro' },
    { emoji: '🐱', nombre: 'Gato' },
    { emoji: '🐦', nombre: 'Ave' },
    { emoji: '🐰', nombre: 'Conejo' },
    { emoji: '🐹', nombre: 'Hámster' },
    { emoji: '🐢', nombre: 'Tortuga' },
    { emoji: '🐠', nombre: 'Peces' },
    { emoji: '🦎', nombre: 'Reptil' },
    { emoji: '🐾', nombre: 'Otro' },
  ];

  // Genera horarios bonitos según el día
  function generarHorarios(fechaStr) {
    if (!fechaStr) return [];
    const date = new Date(fechaStr + 'T12:00:00');
    const dia = date.getDay();
    const esSabado = dia === 6;
    const inicio = 9;
    const fin = esSabado ? 15 : 17;
    const slots = [];
    for (let h = inicio; h <= fin; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < fin) slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }

  function esFechaValida(fechaStr) {
    if (!fechaStr) return true;
    const d = new Date(fechaStr + 'T12:00:00');
    const dia = d.getDay();
    return dia >= 1 && dia <= 6;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFechaChange = (e) => {
    const val = e.target.value;
    if (val && !esFechaValida(val)) {
      setErrorFecha('Solo atendemos de lunes a sábado');
      setFormData(prev => ({ ...prev, fecha: '', hora: '' }));
    } else {
      setErrorFecha('');
      setFormData(prev => ({ ...prev, fecha: val, hora: '' }));
    }
  };

  const handleMotivoChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      motivo: val,
      hora: val === 'Emergencia' ? '' : prev.hora
    }));
  };

  // Seleccionar hora con pills bonitos
  const seleccionarHora = (hora) => {
    setFormData(prev => ({ ...prev, hora }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.motivo || !formData.tipoMascota || !formData.fecha || !formData.nombre || !formData.correo || !formData.celular) {
      alert('Por favor completa todos los campos obligatorios (incluyendo tipo de mascota).');
      return;
    }
    if (formData.motivo !== 'Emergencia' && !formData.hora) {
      alert('Por favor selecciona una hora para tu cita.');
      return;
    }

    let cuerpo = `Hola VeteryCindy,\n\nQuiero agendar una cita para mi mascota.\n\n`;
    cuerpo += `MOTIVO: ${formData.motivo}\n`;
    cuerpo += `TIPO DE MASCOTA: ${formData.tipoMascota}\n`;
    cuerpo += `FECHA: ${formData.fecha}\n`;
    if (formData.hora) cuerpo += `HORA: ${formData.hora}\n`;
    if (formData.motivo === 'Emergencia') cuerpo += `HORA: Atención de emergencia (sin hora específica)\n`;
    cuerpo += `\nCONTACTO:\n${formData.nombre}\n${formData.correo}\n${formData.celular}\n`;
    if (formData.observaciones) cuerpo += `\nObservaciones:\n${formData.observaciones}\n`;
    cuerpo += `\n¡Gracias!`;

    const asunto = `Cita ${formData.motivo} - ${formData.tipoMascota} - ${formData.fecha} - ${formData.nombre}`;
    const link = `mailto:prueba@veterycindy.com.co?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    window.location.href = link;
    setSuccess(true);
  };

  const reiniciar = () => {
    setFormData({ motivo: '', tipoMascota: '', fecha: '', hora: '', nombre: '', correo: '', celular: '', observaciones: '' });
    setErrorFecha('');
    setSuccess(false);
  };

  const irAlFormulario = () => {
    document.getElementById('agendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const horarios = formData.fecha && formData.motivo !== 'Emergencia' ? generarHorarios(formData.fecha) : [];
  const hoy = new Date().toISOString().split('T')[0];

  // Resumen en vivo (se ve muy premium)
  const mostrarResumen = formData.motivo && formData.tipoMascota && formData.fecha;

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-[#1F2937] font-display">
      {/* ==================== NAVBAR ==================== */}
      <nav className="nav sticky top-0 z-50 bg-white/95 border-b border-[#F5EDE3]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#14532D] rounded-2xl flex items-center justify-center text-white text-3xl">🐾</div>
            <div>
              <div className="font-bold text-3xl tracking-tight text-[#14532D]">VeteryCindy</div>
              <div className="text-[10px] text-[#B45309] -mt-1 font-medium">CLÍNICA VETERINARIA</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:block px-5 py-2 text-sm font-medium text-[#14532D] hover:text-[#0F766E]">
              Servicios
            </button>
            <button onClick={irAlFormulario}
              className="px-8 py-2.5 bg-[#14532D] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-full transition-all active:scale-95">
              Agendar cita
            </button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ESPECTACULAR ==================== */}
      <header 
        className="hero relative min-h-[100dvh] flex items-center justify-center text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(20,83,45,0.92) 0%, rgba(15,118,110,0.88) 100%), url('https://picsum.photos/id/1012/2000/1400') center/cover no-repeat`
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
            <button onClick={irAlFormulario} 
              className="btn-vet px-14 py-5 text-xl font-semibold rounded-2xl text-white flex items-center justify-center gap-3 shadow-2xl">
              Agendar cita ahora
              <span className="text-2xl">→</span>
            </button>
            <button onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 text-xl font-semibold rounded-2xl border-2 border-white/70 hover:bg-white/10 transition-all">
              Ver todos los servicios
            </button>
          </div>

          {/* Trust bar flotante */}
          <div className="mt-16 grid grid-cols-3 max-w-md mx-auto gap-px bg-white/20 rounded-2xl p-px">
            {[
              { n: '2.400+', l: 'Mascotas felices' },
              { n: '4.97', l: 'Promedio reseñas' },
              { n: '8 años', l: 'De experiencia' }
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur py-4 rounded-[14px]">
                <div className="font-semibold text-2xl">{s.n}</div>
                <div className="text-xs tracking-widest text-white/75">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ==================== STATS BAR ==================== */}
      <div className="bg-white border-b border-[#F5EDE3]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-[#14532D]">
            <ShieldIcon /> <span className="font-semibold">Clínica registrada ante el ICA</span>
          </div>
          <div>⭐⭐⭐⭐⭐ <span className="font-medium">+480 reseñas en Google</span></div>
          <div className="font-medium text-[#B45309]">Respuesta en menos de 2 horas</div>
        </div>
      </div>

      {/* ==================== SERVICIOS ==================== */}
      <section id="servicios" className="section max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <div className="text-[#B45309] text-sm font-semibold tracking-[2px] mb-2">LO QUE HACEMOS CON AMOR</div>
          <h2 className="text-5xl font-bold tracking-tighter text-[#14532D]">Servicios para tu familia peluda</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🩺', title: 'Consulta General', desc: 'Revisión completa, diagnóstico y plan de tratamiento personalizado.' },
            { icon: '💉', title: 'Vacunación', desc: 'Esquemas completos y recordatorios automáticos para perros y gatos.' },
            { icon: '🚨', title: 'Emergencias 24/7', desc: 'Atención inmediata. Nunca estás solo cuando tu mascota te necesita.' },
            { icon: '✂️', title: 'Esterilización', desc: 'Cirugía segura con los más altos estándares de bienestar animal.' },
            { icon: '🏥', title: 'Cirugías', desc: 'Procedimientos con anestesia moderna y monitoreo constante.' },
            { icon: '🦷', title: 'Odontología', desc: 'Limpieza, extracciones y cuidado dental profesional.' },
            { icon: '🐾', title: 'Piel y Alergias', desc: 'Tratamiento especializado en dermatitis y problemas dermatológicos.' },
            { icon: '❤️', title: 'Control Post-Op', desc: 'Seguimiento cercano después de cualquier procedimiento.' },
          ].map((s, i) => (
            <div key={i} className="service-card group bg-white p-8 rounded-3xl hover:shadow-xl">
              <div className="icon-circle w-14 h-14 bg-[#F5EDE3] text-[#14532D] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-[#0F766E] group-hover:text-white">
                {s.icon}
              </div>
              <h3 className="font-semibold text-2xl tracking-tight mb-3 text-[#14532D]">{s.title}</h3>
              <p className="text-[#4B5563] leading-relaxed text-[15px]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== POR QUÉ ELEGIRNOS ==================== */}
      <section className="bg-[#14532D] text-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[#B45309] text-sm tracking-[3px] font-semibold mb-2">LA DIFERENCIA VETERYCINDY</div>
            <h3 className="text-4xl font-bold tracking-tight">Cuidamos como si fueran nuestros</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <PawIcon />, title: 'Amor real', text: 'Cada mascota que entra recibe cariño y respeto como parte de nuestra familia.' },
              { icon: <ClockIcon />, title: 'Tiempo de calidad', text: 'No corremos. Dedicamos el tiempo necesario para explicar y tranquilizarte.' },
              { icon: <ShieldIcon />, title: 'Seguridad primero', text: 'Protocolos estrictos, equipo moderno y seguimiento después de cada visita.' },
              { icon: <HeartIcon />, title: 'Corazón & ciencia', text: 'Combinamos medicina de vanguardia con el trato humano que tu mascota merece.' },
            ].map((b, idx) => (
              <div key={idx} className="text-center">
                <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#B45309]">
                  {b.icon}
                </div>
                <div className="font-semibold text-xl mb-2 tracking-tight">{b.title}</div>
                <p className="text-white/80 text-sm leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== GALERÍA DE PACIENTES (muy visual) ==================== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <div className="text-[#B45309] text-sm font-semibold tracking-widest">NUESTRA FAMILIA PELUDA</div>
            <h2 className="text-5xl font-bold tracking-tighter text-[#14532D]">Ellos ya confiaron en nosotros</h2>
          </div>
          <p className="max-w-sm text-[#4B5563]">Cada carita feliz es una historia de recuperación, prevención y mucho amor.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { img: 'https://picsum.photos/id/1012/600/600', name: 'Luna', desc: 'Golden • 3 años • Post cirugía' },
            { img: 'https://picsum.photos/id/1005/600/600', name: 'Michi', desc: 'Gato • Vacunación anual' },
            { img: 'https://picsum.photos/id/160/600/600', name: 'Rocky', desc: 'Beagle • Control de alergias' },
            { img: 'https://picsum.photos/id/201/600/600', name: 'Coco', desc: 'Cocker • Esterilización' },
            { img: 'https://picsum.photos/id/251/600/600', name: 'Simba', desc: 'Mestizo • Emergencia' },
            { img: 'https://picsum.photos/id/133/600/600', name: 'Nina', desc: 'Gata • Revisión dental' },
          ].map((p, i) => (
            <div key={i} className="patient-photo relative aspect-square bg-zinc-200">
              <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <div className="font-semibold text-lg leading-none">{p.name}</div>
                <div className="text-xs text-white/80 mt-1">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FORMULARIO PREMIUM ==================== */}
      <section id="agendar" className="section bg-white py-20 border-t border-[#F5EDE3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[#B45309] text-xs tracking-[3px] font-bold mb-2">RESERVA EN 60 SEGUNDOS</div>
            <h2 className="text-5xl font-bold tracking-[-2px] text-[#14532D]">Agenda la cita de tu mascota</h2>
            <p className="text-xl text-[#4B5563] mt-3">Te contactaremos en menos de 2 horas para confirmar</p>
          </div>

          {success ? (
            /* ÉXITO - mucho más emocional */
            <div className="success-card max-w-lg mx-auto bg-[#FDF8F0] border border-[#D1D5DB] rounded-3xl p-12 text-center">
              <div className="text-7xl mb-6">💚</div>
              <h3 className="text-4xl font-bold tracking-tight text-[#14532D] mb-4">¡Gracias! Ya casi está lista.</h3>
              <p className="text-lg text-[#4B5563] leading-relaxed mb-8">
                Se abrió tu correo con todos los datos. Solo envía el mensaje y en menos de dos horas 
                nuestro equipo te escribirá o llamará para confirmar el horario.
              </p>
              <button onClick={reiniciar} 
                className="btn-vet text-white px-10 py-4 rounded-2xl font-semibold text-lg">
                Agendar otra cita
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Lado izquierdo - mensaje de confianza */}
              <div className="lg:col-span-5 xl:col-span-5 pt-3">
                <div className="sticky top-24">
                  <div className="text-[#B45309] text-sm font-semibold tracking-widest mb-3">ESTÁS EN BUENAS MANOS</div>
                  <h3 className="text-4xl font-bold tracking-tight leading-none text-[#14532D] mb-6">
                    Tu mascota<br />está a punto de<br />recibir el mejor cuidado.
                  </h3>

                  <div className="space-y-6 text-[15px] text-[#374151]">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 mt-1 shrink-0 text-[#0F766E]">✓</div>
                      <div>Te atendemos con respeto, paciencia y explicaciones claras.</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 mt-1 shrink-0 text-[#0F766E]">✓</div>
                      <div>Si es emergencia, te daremos prioridad absoluta.</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 mt-1 shrink-0 text-[#0F766E]">✓</div>
                      <div>Después de la cita te enviamos un resumen por WhatsApp.</div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-[#F5EDE3] text-sm">
                    <div className="font-semibold text-[#14532D]">¿Necesitas ayuda inmediata?</div>
                    <a href="tel:+573010003030" className="text-2xl font-semibold text-[#0F766E] hover:underline block mt-1">+57 301 000 3030</a>
                    <div className="text-[#6B7280] text-xs mt-1">Disponible 24/7 para emergencias</div>
                  </div>
                </div>
              </div>

              {/* FORMULARIO - el corazón de la experiencia */}
              <div className="lg:col-span-7 xl:col-span-7">
                <form onSubmit={handleSubmit} className="bg-[#FDF8F0] border border-[#E5E0D8] rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 space-y-8">

                  {/* Motivo */}
                  <div>
                    <label className="form-label mb-2 block">Motivo de la cita *</label>
                    <select 
                      name="motivo" 
                      value={formData.motivo} 
                      onChange={handleMotivoChange}
                      className="form-input w-full px-5 py-[17px] text-base border-[#D1D5DB]" 
                      required
                    >
                      <option value="">Selecciona el motivo...</option>
                      {motivos.map((m, i) => <option key={i} value={m}>{m}</option>)}
                    </select>
                  </div>

                  {/* TIPO DE MASCOTA - solo mascotas de ciudad */}
                  <div>
                    <label className="form-label mb-3 block">¿Qué tipo de mascota es? *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {tiposMascota.map((tipo, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tipoMascota: tipo.nombre }))}
                          className={`flex flex-col items-center justify-center gap-1 px-3 py-4 rounded-2xl border-2 transition-all text-center text-xs sm:text-sm font-medium leading-tight ${
                            formData.tipoMascota === tipo.nombre 
                              ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-md' 
                              : 'bg-white border-[#D1D5DB] hover:border-[#0F766E] text-[#374151]'
                          }`}
                        >
                          <span className="text-2xl">{tipo.emoji}</span>
                          <span>{tipo.nombre}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fecha + Hora en dos columnas cuando aplica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label mb-2 block">Día de la cita * (Lun-Sáb)</label>
                      <input 
                        type="date" 
                        min={hoy}
                        value={formData.fecha} 
                        onChange={handleFechaChange}
                        className="form-input w-full px-5 py-4 text-base" 
                        required 
                      />
                      {errorFecha && <p className="text-[#9F1239] text-sm mt-2">{errorFecha}</p>}
                    </div>

                    {/* HORARIOS COMO PILLS - este es el gran salto visual */}
                    {formData.motivo && formData.motivo !== 'Emergencia' && (
                      <div>
                        <label className="form-label mb-2 block">Hora preferida *</label>
                        {horarios.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {horarios.map(h => (
                              <button
                                key={h}
                                type="button"
                                onClick={() => seleccionarHora(h)}
                                className={`time-pill ${formData.hora === h ? 'selected' : ''}`}
                              >
                                {h}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-[#6B7280] py-2">Elige primero una fecha válida</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Banner de emergencia (mucho más humano) */}
                  {formData.motivo === 'Emergencia' && (
                    <div className="emergency-banner p-6 text-[#9F1239]">
                      <div className="font-bold text-lg mb-1">Esto es una emergencia</div>
                      <p className="text-sm leading-relaxed">
                        No es necesario elegir hora. Llámanos ahora al <span className="font-semibold">301 000 3030</span> o 
                        envía este formulario y te daremos atención prioritaria. 
                        Estamos aquí para ayudarte.
                      </p>
                    </div>
                  )}

                  {/* Datos del contacto */}
                  <div className="pt-4">
                    <div className="text-[#14532D] font-semibold text-sm tracking-wider mb-4">TUS DATOS DE CONTACTO</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="form-label mb-1.5 block">Nombre completo *</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                          className="form-input w-full px-5 py-3.5" placeholder="María Camila Gómez" />
                      </div>
                      <div>
                        <label className="form-label mb-1.5 block">Celular *</label>
                        <input type="tel" name="celular" value={formData.celular} onChange={handleChange} required
                          className="form-input w-full px-5 py-3.5" placeholder="301 000 3030" />
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="form-label mb-1.5 block">Correo electrónico *</label>
                      <input type="email" name="correo" value={formData.correo} onChange={handleChange} required
                        className="form-input w-full px-5 py-3.5" placeholder="tu@email.com" />
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <label className="form-label mb-1.5 block">¿Algo que debamos saber? (opcional)</label>
                    <textarea 
                      name="observaciones" 
                      value={formData.observaciones} 
                      onChange={handleChange}
                      rows={3}
                      className="form-input w-full px-5 py-4 resize-y" 
                      placeholder="Ej: Es muy ansioso con las agujas, prefiere que lo llamen por su apodo..." 
                    />
                  </div>

                  {/* RESUMEN EN VIVO - detalle premium que enamora */}
                  {mostrarResumen && (
                    <div className="appointment-summary p-5 text-sm">
                      <div className="uppercase tracking-[1px] text-[#B45309] text-xs mb-2 font-semibold">Resumen de tu solicitud</div>
                      <div className="font-medium text-lg text-[#14532D]">
                        {formData.motivo} para {formData.tipoMascota} — {formData.fecha}
                        {formData.hora && ` a las ${formData.hora}`}
                      </div>
                      <div className="text-[#6B7280] mt-0.5">Para {formData.nombre || 'ti'}</div>
                    </div>
                  )}

                  <button type="submit" 
                    className="btn-vet w-full py-5 text-xl font-bold text-white rounded-2xl shadow-xl active:scale-[0.985]">
                    Enviar solicitud por correo
                  </button>

                  <p className="text-center text-xs text-[#6B7280]">
                    Al hacer clic se abrirá tu correo con los datos listos. Solo presiona enviar.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== TESTIMONIOS ==================== */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <div className="text-[#B45309] tracking-[2px] text-sm font-semibold">HISTORIAS REALES</div>
          <h2 className="text-4xl font-bold tracking-tight text-[#14532D]">Lo que dicen quienes ya nos conocen</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { foto: 'https://picsum.photos/id/1005/80/80', nombre: 'Laura Martínez', mascota: 'Luna • Golden', texto: 'Mi perrita casi se muere de una obstrucción. El doctor la operó a medianoche. Hoy está perfecta. Eternamente agradecida.' },
            { foto: 'https://picsum.photos/id/1009/80/80', nombre: 'Andrés Velásquez', mascota: 'Simón • Gato', texto: 'Siempre son tan pacientes explicando todo. Nunca sentí que me estaban apurando. La mejor clínica de Bogotá sin duda.' },
            { foto: 'https://picsum.photos/id/1011/80/80', nombre: 'Valentina Ruiz', mascota: 'Coco y Nina', texto: 'Vacunación, desparasitación, emergencias… confío en ellos con mis dos gatos desde hace 5 años. Son parte de la familia.' },
          ].map((t, i) => (
            <div key={i} className="testimonial bg-white border border-[#F5EDE3] p-8 rounded-3xl">
              <div className="flex gap-1 text-[#B45309] text-xl mb-6">★★★★★</div>
              <p className="text-[#374151] leading-relaxed mb-8 text-[15px]">“{t.texto}”</p>
              <div className="flex items-center gap-4">
                <img src={t.foto} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-white" />
                <div>
                  <div className="font-semibold text-[#14532D]">{t.nombre}</div>
                  <div className="text-xs text-[#6B7280]">{t.mascota}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <div className="bg-[#14532D] py-16 text-center text-white">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-4xl font-bold tracking-tight mb-4">Tu mascota no puede decirte lo que siente.<br />Nosotros sí podemos escucharla.</div>
          <button onClick={irAlFormulario} className="mt-6 btn-vet px-12 py-4 rounded-2xl text-xl font-semibold">
            Agendar cita ahora
          </button>
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
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
    </div>
  );
}

export default App;
