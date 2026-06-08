import { useState } from 'react';
import { contactService } from '../../services/endpoints';

const motivos = [
  'Consulta general', 'Vacunación', 'Desparasitación', 'Emergencia',
  'Cirugía', 'Esterilización / Castración', 'Problemas de piel o alergias',
  'Problemas digestivos', 'Revisión dental', 'Control post-operatorio',
  'Certificado de salud para viajes', 'Otro',
];

const tiposMascota = [
  { emoji: '🐶', nombre: 'Perro' }, { emoji: '🐱', nombre: 'Gato' },
  { emoji: '🐦', nombre: 'Ave' }, { emoji: '🐰', nombre: 'Conejo' },
  { emoji: '🐹', nombre: 'Hámster' }, { emoji: '🐢', nombre: 'Tortuga' },
  { emoji: '🐠', nombre: 'Peces' }, { emoji: '🦎', nombre: 'Reptil' },
  { emoji: '🐾', nombre: 'Otro' },
];

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

export default function ContactForm() {
  const [formData, setFormData] = useState({
    motivo: '', tipoMascota: '', fecha: '', hora: '',
    nombre: '', correo: '', celular: '', observaciones: '',
  });
  const [errorFecha, setErrorFecha] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFechaChange = (e) => {
    const val = e.target.value;
    if (val && !esFechaValida(val)) {
      setErrorFecha('Solo atendemos de lunes a sábado');
      setFormData((prev) => ({ ...prev, fecha: '', hora: '' }));
    } else {
      setErrorFecha('');
      setFormData((prev) => ({ ...prev, fecha: val, hora: '' }));
    }
  };

  const handleMotivoChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev, motivo: val,
      hora: val === 'Emergencia' ? '' : prev.hora,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.motivo || !formData.tipoMascota || !formData.fecha || !formData.nombre || !formData.correo || !formData.celular) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (formData.motivo !== 'Emergencia' && !formData.hora) {
      setError('Por favor selecciona una hora para tu cita.');
      return;
    }

    setLoading(true);
    try {
      await contactService.send({
        name: formData.nombre,
        email: formData.correo,
        phone: formData.celular,
        pet_type: formData.tipoMascota,
        reason: formData.motivo,
        preferred_date: formData.fecha,
        preferred_time: formData.hora || null,
        message: formData.observaciones,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Hubo un error al enviar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const reiniciar = () => {
    setFormData({ motivo: '', tipoMascota: '', fecha: '', hora: '', nombre: '', correo: '', celular: '', observaciones: '' });
    setErrorFecha('');
    setSuccess(false);
    setError('');
  };

  const horarios = formData.fecha && formData.motivo !== 'Emergencia' ? generarHorarios(formData.fecha) : [];
  const hoy = new Date().toISOString().split('T')[0];
  const mostrarResumen = formData.motivo && formData.tipoMascota && formData.fecha;

  return (
    <section id="agendar" className="section bg-white py-20 border-t border-[#F5EDE3]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[#B45309] text-xs tracking-[3px] font-bold mb-2">RESERVA EN 60 SEGUNDOS</div>
          <h2 className="text-5xl font-bold tracking-[-2px] text-[#14532D]">Agenda la cita de tu mascota</h2>
          <p className="text-xl text-[#4B5563] mt-3">Te contactaremos en menos de 2 horas para confirmar</p>
        </div>

        {success ? (
          <div className="success-card max-w-lg mx-auto bg-[#FDF8F0] border border-[#D1D5DB] rounded-3xl p-12 text-center">
            <div className="text-7xl mb-6">💚</div>
            <h3 className="text-4xl font-bold tracking-tight text-[#14532D] mb-4">¡Gracias! Tu solicitud fue enviada.</h3>
            <p className="text-lg text-[#4B5563] leading-relaxed mb-8">
              Hemos recibido tu mensaje. Nuestro equipo te contactará en menos de 2 horas para confirmar tu cita.
            </p>
            <button onClick={reiniciar} className="btn-vet text-white px-10 py-4 rounded-2xl font-semibold text-lg border-none cursor-pointer">
              Agendar otra cita
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Trust sidebar */}
            <div className="lg:col-span-5 xl:col-span-5 pt-3">
              <div className="sticky top-24">
                <div className="text-[#B45309] text-sm font-semibold tracking-widest mb-3">ESTÁS EN BUENAS MANOS</div>
                <h3 className="text-4xl font-bold tracking-tight leading-none text-[#14532D] mb-6">
                  Tu mascota<br />está a punto de<br />recibir el mejor cuidado.
                </h3>
                <div className="space-y-6 text-[15px] text-[#374151]">
                  {[
                    'Te atendemos con respeto, paciencia y explicaciones claras.',
                    'Si es emergencia, te daremos prioridad absoluta.',
                    'Después de la cita te enviamos un resumen por WhatsApp.',
                  ].map((text, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 mt-1 shrink-0 text-[#0F766E]">✓</div>
                      <div>{text}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-8 border-t border-[#F5EDE3] text-sm">
                  <div className="font-semibold text-[#14532D]">¿Necesitas ayuda inmediata?</div>
                  <a href="tel:+573010003030" className="text-2xl font-semibold text-[#0F766E] hover:underline block mt-1">+57 301 000 3030</a>
                  <div className="text-[#6B7280] text-xs mt-1">Disponible 24/7 para emergencias</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 xl:col-span-7">
              <form onSubmit={handleSubmit} className="bg-[#FDF8F0] border border-[#E5E0D8] rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
                )}

                {/* Motivo */}
                <div>
                  <label className="form-label mb-2 block">Motivo de la cita *</label>
                  <select name="motivo" value={formData.motivo} onChange={handleMotivoChange} className="form-input w-full px-5 py-[17px] text-base border-[#D1D5DB]" required>
                    <option value="">Selecciona el motivo...</option>
                    {motivos.map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Tipo mascota */}
                <div>
                  <label className="form-label mb-3 block">¿Qué tipo de mascota es? *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {tiposMascota.map((tipo, index) => (
                      <button key={index} type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, tipoMascota: tipo.nombre }))}
                        className={`flex flex-col items-center justify-center gap-1 px-3 py-4 rounded-2xl border-2 transition-all text-center text-xs sm:text-sm font-medium leading-tight cursor-pointer ${
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

                {/* Fecha + Hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label mb-2 block">Día de la cita * (Lun-Sáb)</label>
                    <input type="date" min={hoy} value={formData.fecha} onChange={handleFechaChange} className="form-input w-full px-5 py-4 text-base" required />
                    {errorFecha && <p className="text-[#9F1239] text-sm mt-2">{errorFecha}</p>}
                  </div>

                  {formData.motivo && formData.motivo !== 'Emergencia' && (
                    <div>
                      <label className="form-label mb-2 block">Hora preferida *</label>
                      {horarios.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {horarios.map((h) => (
                            <button key={h} type="button" onClick={() => setFormData((prev) => ({ ...prev, hora: h }))}
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

                {/* Emergency banner */}
                {formData.motivo === 'Emergencia' && (
                  <div className="emergency-banner p-6 text-[#9F1239]">
                    <div className="font-bold text-lg mb-1">Esto es una emergencia</div>
                    <p className="text-sm leading-relaxed">
                      No es necesario elegir hora. Llámanos ahora al <span className="font-semibold">301 000 3030</span> o envía este formulario y te daremos atención prioritaria.
                    </p>
                  </div>
                )}

                {/* Contact data */}
                <div className="pt-4">
                  <div className="text-[#14532D] font-semibold text-sm tracking-wider mb-4">TUS DATOS DE CONTACTO</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label mb-1.5 block">Nombre completo *</label>
                      <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-input w-full px-5 py-3.5" placeholder="María Camila Gómez" />
                    </div>
                    <div>
                      <label className="form-label mb-1.5 block">Celular *</label>
                      <input type="tel" name="celular" value={formData.celular} onChange={handleChange} required className="form-input w-full px-5 py-3.5" placeholder="301 000 3030" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="form-label mb-1.5 block">Correo electrónico *</label>
                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} required className="form-input w-full px-5 py-3.5" placeholder="tu@email.com" />
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <label className="form-label mb-1.5 block">¿Algo que debamos saber? (opcional)</label>
                  <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows={3} className="form-input w-full px-5 py-4 resize-y" placeholder="Ej: Es muy ansioso con las agujas..." />
                </div>

                {/* Live summary */}
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

                <button type="submit" disabled={loading}
                  className="btn-vet w-full py-5 text-xl font-bold text-white rounded-2xl shadow-xl active:scale-[0.985] border-none cursor-pointer disabled:opacity-60">
                  {loading ? 'Enviando...' : 'Enviar solicitud de cita'}
                </button>

                <p className="text-center text-xs text-[#6B7280]">
                  Tu mensaje será enviado a nuestro equipo y te contactaremos pronto.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
