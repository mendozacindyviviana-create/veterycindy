import { useState, useEffect, useRef } from 'react';
import { appointmentService } from '../../../services/endpoints';
import { useAuth } from '../../../context/AuthContext';

const normalizeAppointment = (appt) => ({
  ...appt,
  Patient: appt.Patient || appt.patient,
  Client: appt.Client || appt.client,
  Vet: appt.Vet || appt.vet,
});

export default function VetDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const clinicalFormRef = useRef(null);
  
  // Selected appointment for adding clinical notes
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [notesForm, setNotesForm] = useState({
    clinical_notes: '',
    diagnosis: '',
    treatment: '',
    follow_up_date: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAll({ vet_id: user.id });
      setAppointments(response.data.data.map(normalizeAppointment));
    } catch (err) {
      setError('Error al cargar la agenda médica.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await appointmentService.addClinicalNotes(selectedAppt.id, {
        ...notesForm,
        status: 'COMPLETED',
      });
      setSelectedAppt(null);
      setNotesForm({ clinical_notes: '', diagnosis: '', treatment: '', follow_up_date: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar notas clínicas.');
    }
  };

  const startClinicalNotes = (appt) => {
    setSelectedAppt(appt);
    setNotesForm({
      clinical_notes: appt.clinical_notes || '',
      diagnosis: appt.diagnosis || '',
      treatment: appt.treatment || '',
      follow_up_date: appt.follow_up_date || '',
    });
    window.setTimeout(() => {
      clinicalFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#14532D] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#6B7280]">Cargando agenda médica de {user.first_name}... 🐾</p>
      </div>
    );
  }

  const pendingCount = appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="space-y-10">
      {/* Vet Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-sm">
        <div>
          <span className="text-xs bg-[#14532D]/10 text-[#14532D] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Veterinario Activo</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#14532D] mb-1">{user.first_name} {user.last_name}</h1>
          <p className="text-[#6B7280] text-sm">Especialidad: {user.specialty || 'Medicina General'} | Licencia: {user.license_number || 'MV-ACTIVO'}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#FDF8F0] border border-[#E5E0D8] px-5 py-3 rounded-2xl text-center">
            <span className="text-2xl font-bold text-[#14532D] block">{pendingCount}</span>
            <span className="text-xs text-[#6B7280] font-semibold">Pendientes</span>
          </div>
          <div className="bg-[#FDF8F0] border border-[#E5E0D8] px-5 py-3 rounded-2xl text-center">
            <span className="text-2xl font-bold text-[#B45309] block">{completedCount}</span>
            <span className="text-xs text-[#6B7280] font-semibold">Atendidas</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Clinical Notes Form Modal/Panel */}
      {selectedAppt && (
        <div ref={clinicalFormRef} className="scroll-mt-28 bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#14532D] mb-1">📋 Historia Clínica & Diagnóstico</h3>
              <p className="text-xs text-gray-500">Paciente: <strong className="text-[#14532D]">{selectedAppt.Patient?.name}</strong> | Motivo de cita: {selectedAppt.reason}</p>
            </div>
            <button onClick={() => setSelectedAppt(null)} className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer text-xl">✕</button>
          </div>

          <form onSubmit={handleNotesSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Notas Clínicas / Síntomas *</label>
              <textarea
                required
                rows={3}
                value={notesForm.clinical_notes}
                onChange={(e) => setNotesForm({...notesForm, clinical_notes: e.target.value})}
                className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                placeholder="Ingresar descripción física, comportamiento, temperatura, peso verificado, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Diagnóstico Clínico *</label>
                <input
                  type="text"
                  required
                  value={notesForm.diagnosis}
                  onChange={(e) => setNotesForm({...notesForm, diagnosis: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl"
                  placeholder="Gastroenteritis alimentaria, otitis bacteriana, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Próximo Control (Opcional)</label>
                <input
                  type="date"
                  value={notesForm.follow_up_date}
                  onChange={(e) => setNotesForm({...notesForm, follow_up_date: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Tratamiento & Medicamentos Recetados *</label>
              <textarea
                required
                rows={3}
                value={notesForm.treatment}
                onChange={(e) => setNotesForm({...notesForm, treatment: e.target.value})}
                className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl"
                placeholder="Indicar dosis exactas, frecuencia y duración del tratamiento (Ej: Meloxicam 0.5ml cada 24h por 3 días)."
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setSelectedAppt(null)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl cursor-pointer border-none">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F766E] text-white font-semibold rounded-2xl cursor-pointer border-none shadow-md">Completar Consulta & Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Table / List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#14532D] flex items-center gap-2">🗓️ Tu Agenda de Citas</h2>

        {appointments.length === 0 ? (
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-12 text-center">
            <span className="text-4xl block mb-2">🐾</span>
            <p className="text-[#6B7280] font-medium">No tienes citas agendadas en tu historial.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-[#F5EDE3]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#B45309]/10 rounded-2xl flex items-center justify-center text-3xl">
                      {appt.Patient?.species === 'Perro' ? '🐶' : appt.Patient?.species === 'Gato' ? '🐱' : '🐾'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#14532D]">{appt.Patient?.name}</h4>
                        <span className="text-xs text-[#6B7280] bg-[#FDF8F0] border border-[#F5EDE3] px-2.5 py-0.5 rounded-full">{appt.Patient?.breed || appt.Patient?.species}</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">Propietario: {appt.Client?.first_name} {appt.Client?.last_name} | {appt.Client?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      appt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Cita: {appt.status}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      appt.payment_status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      Pago: {appt.payment_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 text-sm text-[#374151] mb-4">
                  <div>🗓️ <strong>Fecha:</strong> {appt.date}</div>
                  <div>⏰ <strong>Hora:</strong> {appt.time || 'N/A (Urgencia)'}</div>
                  <div>🩺 <strong>Motivo:</strong> {appt.reason}</div>
                </div>

                {appt.observations && (
                  <div className="bg-[#FDF8F0] border border-[#F5EDE3] p-4 rounded-2xl text-xs text-gray-600 mb-4">
                    <strong>Motivo de consulta detallado:</strong> {appt.observations}
                  </div>
                )}

                {appt.clinical_notes && (
                  <div className="bg-green-50/50 border border-green-100 p-4 rounded-2xl text-xs text-gray-700 space-y-2">
                    <div>🩺 <strong>Notas Clínicas:</strong> {appt.clinical_notes}</div>
                    <div>🧬 <strong>Diagnóstico:</strong> {appt.diagnosis}</div>
                    <div>💊 <strong>Tratamiento:</strong> {appt.treatment}</div>
                    {appt.follow_up_date && <div>🗓️ <strong>Fecha de Control:</strong> {appt.follow_up_date}</div>}
                  </div>
                )}

                {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => startClinicalNotes(appt)}
                      className="px-5 py-2.5 bg-[#14532D] hover:bg-[#0F766E] text-white text-xs font-bold rounded-xl border-none cursor-pointer active:scale-95 transition-all shadow-sm"
                    >
                      🩺 Iniciar Atención & Guardar Diagnóstico
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
