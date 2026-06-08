import { useState, useEffect, useRef } from 'react';
import { patientService, appointmentService } from '../../../services/endpoints';
import { useAuth } from '../../../context/AuthContext';

const normalizeAppointment = (appt) => ({
  ...appt,
  Patient: appt.Patient || appt.patient,
  Client: appt.Client || appt.client,
  Vet: appt.Vet || appt.vet,
});

export default function ClientDashboard() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [showAddPet, setShowAddPet] = useState(false);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const addPetFormRef = useRef(null);
  const bookAppointmentFormRef = useRef(null);
  
  const [petForm, setPetForm] = useState({
    name: '', species: 'Perro', breed: '', color: '', birth_date: '', weight: '', sex: 'MALE', notes: ''
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patient_id: '', reason: 'Consulta general', date: '', time: '', observations: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [petsRes, apptsRes] = await Promise.all([
        patientService.getMyPets(),
        appointmentService.getAll()
      ]);
      setPets(petsRes.data.data);
      setAppointments(apptsRes.data.data.map(normalizeAppointment));
    } catch (err) {
      setError('Error al cargar datos del panel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToPanel = (ref) => {
    window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const openAddPetForm = () => {
    const shouldOpen = !showAddPet;
    setShowAddPet(shouldOpen);
    setShowBookAppointment(false);
    if (shouldOpen) scrollToPanel(addPetFormRef);
  };

  const openBookAppointmentForm = () => {
    const shouldOpen = !showBookAppointment;
    setShowBookAppointment(shouldOpen);
    setShowAddPet(false);
    if (shouldOpen) scrollToPanel(bookAppointmentFormRef);
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await patientService.create(petForm);
      setShowAddPet(false);
      setPetForm({ name: '', species: 'Perro', breed: '', color: '', birth_date: '', weight: '', sex: 'MALE', notes: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar mascota.');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await appointmentService.create({
        ...appointmentForm,
        client_id: user.id,
      });
      setShowBookAppointment(false);
      setAppointmentForm({ patient_id: '', reason: 'Consulta general', date: '', time: '', observations: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agendar cita.');
    }
  };

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;
    setError('');
    try {
      await appointmentService.cancel(apptId);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cancelar cita.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#14532D] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#6B7280]">Cargando tu panel de control 🐾...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#14532D] mb-1">¡Hola, {user.first_name}!</h1>
          <p className="text-[#6B7280] text-sm">Administra las mascotas de tu familia y tus citas médicas en un solo lugar.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openAddPetForm} className="px-5 py-3 bg-[#B45309] hover:bg-[#92400E] text-white text-sm font-semibold rounded-2xl transition-all border-none cursor-pointer active:scale-95 flex items-center gap-2">
            <span>➕</span> Registrar Mascota
          </button>
          <button onClick={openBookAppointmentForm} className="px-5 py-3 bg-[#14532D] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-2xl transition-all border-none cursor-pointer active:scale-95 flex items-center gap-2">
            <span>📅</span> Agendar Cita
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Forms Section */}
      {showAddPet && (
        <div ref={addPetFormRef} className="scroll-mt-28 bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-[#14532D] mb-6 flex items-center gap-2">🐾 Registrar Nueva Mascota</h3>
          <form onSubmit={handleAddPet} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Nombre *</label>
              <input type="text" required value={petForm.name} onChange={(e) => setPetForm({...petForm, name: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl" placeholder="Luna" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Especie *</label>
              <select value={petForm.species} onChange={(e) => setPetForm({...petForm, species: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl">
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Conejo">Conejo</option>
                <option value="Hámster">Hámster</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Raza</label>
              <input type="text" value={petForm.breed} onChange={(e) => setPetForm({...petForm, breed: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl" placeholder="Golden Retriever" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Color</label>
              <input type="text" value={petForm.color} onChange={(e) => setPetForm({...petForm, color: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl" placeholder="Dorado" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Fecha de Nacimiento</label>
              <input type="date" value={petForm.birth_date} onChange={(e) => setPetForm({...petForm, birth_date: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Peso (kg)</label>
              <input type="number" step="0.1" value={petForm.weight} onChange={(e) => setPetForm({...petForm, weight: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl" placeholder="25.5" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Género *</label>
              <select value={petForm.sex} onChange={(e) => setPetForm({...petForm, sex: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl">
                <option value="MALE">Macho</option>
                <option value="FEMALE">Hembra</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Notas o Alergias</label>
              <input type="text" value={petForm.notes} onChange={(e) => setPetForm({...petForm, notes: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl" placeholder="Alergia a la penicilina..." />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowAddPet(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all cursor-pointer border-none">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 bg-[#B45309] hover:bg-[#92400E] text-white font-semibold rounded-2xl transition-all cursor-pointer border-none">Guardar Mascota</button>
            </div>
          </form>
        </div>
      )}

      {showBookAppointment && (
        <div ref={bookAppointmentFormRef} className="scroll-mt-28 bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-[#14532D] mb-6 flex items-center gap-2">📅 Agendar Cita Médica</h3>
          {pets.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[#6B7280] mb-4">Primero debes registrar al menos una mascota para agendar una cita.</p>
              <button type="button" onClick={() => { setShowBookAppointment(false); setShowAddPet(true); scrollToPanel(addPetFormRef); }} className="px-5 py-2.5 bg-[#B45309] text-white rounded-2xl">Registrar Mascota</button>
            </div>
          ) : (
            <form onSubmit={handleBookAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Seleccionar Mascota *</label>
                <select required value={appointmentForm.patient_id} onChange={(e) => setAppointmentForm({...appointmentForm, patient_id: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl">
                  <option value="">Selecciona...</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.species})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Motivo *</label>
                <select required value={appointmentForm.reason} onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl">
                  <option value="Consulta general">Consulta general</option>
                  <option value="Vacunación">Vacunación</option>
                  <option value="Desparasitación">Desparasitación</option>
                  <option value="Cirugía">Cirugía</option>
                  <option value="Esterilización / Castración">Esterilización / Castración</option>
                  <option value="Revisión dental">Revisión dental</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Fecha *</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={appointmentForm.date} onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Hora *</label>
                <select required value={appointmentForm.time} onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})} className="w-full px-4 py-2.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl">
                  <option value="">Selecciona...</option>
                  {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Observaciones</label>
                <textarea rows={3} value={appointmentForm.observations} onChange={(e) => setAppointmentForm({...appointmentForm, observations: e.target.value})} className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl" placeholder="Comportamiento, síntomas, notas particulares..." />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowBookAppointment(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all cursor-pointer border-none">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F766E] text-white font-semibold rounded-2xl transition-all cursor-pointer border-none">Agendar Cita</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Grid of Pets and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pets section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#14532D]">Mis Mascotas</h2>
            <span className="bg-[#14532D]/10 text-[#14532D] text-xs font-semibold px-3 py-1 rounded-full">{pets.length} registradas</span>
          </div>

          {pets.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 text-center">
              <span className="text-4xl block mb-2">🐾</span>
              <p className="text-[#6B7280] font-medium mb-4">No tienes mascotas registradas.</p>
              <button onClick={() => { setShowAddPet(true); setShowBookAppointment(false); scrollToPanel(addPetFormRef); }} className="px-4 py-2 bg-[#B45309] text-white rounded-xl font-semibold border-none cursor-pointer">Registrar Primera Mascota</button>
            </div>
          ) : (
            <div className="space-y-4">
              {pets.map(pet => (
                <div key={pet.id} className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FDF8F0] border border-[#F5EDE3] rounded-2xl flex items-center justify-center text-2xl">
                      {pet.species === 'Perro' ? '🐶' : pet.species === 'Gato' ? '🐱' : pet.species === 'Ave' ? '🐦' : '🐾'}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#14532D]">{pet.name}</h4>
                      <p className="text-xs text-[#6B7280]">{pet.breed || pet.species} • {pet.color || 'Sin color definido'}</p>
                      {pet.weight && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block">{pet.weight} kg</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#B45309] font-medium">{pet.sex === 'MALE' ? 'Macho' : 'Hembra'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#14532D]">Próximas Citas y Diagnósticos</h2>
            <span className="bg-[#14532D]/10 text-[#14532D] text-xs font-semibold px-3 py-1 rounded-full">{appointments.length} totales</span>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 text-center">
              <span className="text-4xl block mb-2">📅</span>
              <p className="text-[#6B7280] font-medium">No tienes citas programadas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(appt => {
                const isUpcoming = appt.status === 'PENDING' || appt.status === 'CONFIRMED';
                return (
                  <div key={appt.id} className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-[#F5EDE3]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#14532D]/10 rounded-xl flex items-center justify-center text-lg">🩺</div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">{appt.reason}</span>
                          <h4 className="font-bold text-[#14532D]">{appt.Patient?.name} <span className="text-xs text-gray-400 font-normal">({appt.Patient?.species})</span></h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          appt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                          appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {appt.status}
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          appt.payment_status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          Pago: {appt.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-[#374151] mb-4">
                      <div>🗓️ <strong className="text-[#14532D]">Fecha:</strong> {appt.date}</div>
                      <div>⏰ <strong className="text-[#14532D]">Hora:</strong> {appt.time || 'N/A (Emergencia)'}</div>
                      {appt.Vet && <div className="md:col-span-2">🩺 <strong className="text-[#14532D]">Veterinario:</strong> {appt.Vet.first_name} {appt.Vet.last_name}</div>}
                    </div>

                    {appt.observations && (
                      <div className="bg-[#FDF8F0] border border-[#F5EDE3] p-4 rounded-2xl text-xs text-gray-600 mb-3">
                        <strong>Observaciones:</strong> {appt.observations}
                      </div>
                    )}

                    {appt.clinical_notes && (
                      <div className="bg-green-50/50 border border-green-100 p-4 rounded-2xl text-xs text-gray-700 space-y-2 mt-4">
                        <div>🩺 <strong className="text-[#14532D]">Notas Clínicas:</strong> {appt.clinical_notes}</div>
                        {appt.diagnosis && <div>🧬 <strong>Diagnóstico:</strong> {appt.diagnosis}</div>}
                        {appt.treatment && <div>💊 <strong>Tratamiento:</strong> {appt.treatment}</div>}
                      </div>
                    )}

                    {isUpcoming && (
                      <div className="flex justify-end mt-4">
                        <button onClick={() => handleCancelAppointment(appt.id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 cursor-pointer active:scale-95 transition-all">
                          Cancelar Cita
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
