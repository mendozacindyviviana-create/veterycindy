import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { appointmentService } from '../../../services/endpoints';
import { useAuth } from '../../../context/AuthContext';

const normalizeAppointment = (appt) => ({
  ...appt,
  Patient: appt.Patient || appt.patient,
  Client: appt.Client || appt.client,
  Vet: appt.Vet || appt.vet,
});

export default function CashierDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const paymentFormRef = useRef(null);

  // Payment simulation overlay
  const [payingAppt, setPayingAppt] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardholder_name: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
    amount: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAll();
      setAppointments(response.data.data.map(normalizeAppointment));
    } catch (err) {
      setError('Error al cargar la lista de cobros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenPayment = (appt) => {
    setPayingAppt(appt);
    setPaymentForm({
      cardholder_name: appt.Client ? `${appt.Client.first_name} ${appt.Client.last_name}` : '',
      card_number: '4000 1234 5678 9010',
      expiry_date: '12/28',
      cvv: '123',
      amount: appt.reason === 'Consulta general' ? '65000' :
              appt.reason === 'Vacunación' ? '45000' :
              appt.reason === 'Cirugía' ? '350000' :
              appt.reason === 'Esterilización / Castración' ? '180000' : '85000',
    });
    window.setTimeout(() => {
      paymentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await Swal.fire({
      title: 'Confirmar pago',
      text: `Se procesara un pago simulado por $${Number(paymentForm.amount).toLocaleString()} COP y la cita quedara confirmada.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, procesar pago',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#14532D',
      cancelButtonColor: '#6B7280',
    });

    if (!result.isConfirmed) return;

    try {
      await appointmentService.processPayment(payingAppt.id, {
        approved: true,
        amount: parseFloat(paymentForm.amount),
        cardholder_name: paymentForm.cardholder_name,
        card_number: paymentForm.card_number,
      });
      setPayingAppt(null);
      loadData();
      await Swal.fire({
        title: 'Pago aprobado',
        text: 'La transaccion fue procesada y la cita quedo confirmada.',
        icon: 'success',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#14532D',
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Error al procesar el pago.';
      setError(message);
      await Swal.fire({
        title: 'No se pudo procesar',
        text: message,
        icon: 'error',
        confirmButtonText: 'Revisar',
        confirmButtonColor: '#9F1239',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#14532D] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#6B7280]">Cargando módulo de caja y cobros... 🐾</p>
      </div>
    );
  }

  const pendingPayments = appointments.filter(a => a.payment_status === 'PENDING');
  const approvedPayments = appointments.filter(a => a.payment_status === 'APPROVED');

  return (
    <div className="space-y-10">
      {/* Cashier Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-sm">
        <div>
          <span className="text-xs bg-[#B45309]/10 text-[#B45309] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Cajero / Facturación</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#14532D] mb-1">Módulo de Caja de Juliana</h1>
          <p className="text-[#6B7280] text-sm">Procesa transacciones, confirma citas y gestiona pagos de clientes de manera ágil.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#FDF8F0] border border-[#E5E0D8] px-5 py-3 rounded-2xl text-center">
            <span className="text-2xl font-bold text-red-600 block">{pendingPayments.length}</span>
            <span className="text-xs text-[#6B7280] font-semibold">Cuentas por Cobrar</span>
          </div>
          <div className="bg-[#FDF8F0] border border-[#E5E0D8] px-5 py-3 rounded-2xl text-center">
            <span className="text-2xl font-bold text-green-600 block">{approvedPayments.length}</span>
            <span className="text-xs text-[#6B7280] font-semibold">Pagos Aprobados</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Payment Portal Simulation Overlay */}
      {payingAppt && (
        <div ref={paymentFormRef} className="scroll-mt-28 bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#14532D] mb-1">💳 Simulación de Pasarela de Pagos</h3>
              <p className="text-xs text-gray-500">Facturando cita de {payingAppt.Patient?.name} | Propietario: {payingAppt.Client?.first_name} {payingAppt.Client?.last_name}</p>
            </div>
            <button onClick={() => setPayingAppt(null)} className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer text-xl">✕</button>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="bg-[#14532D] text-white p-6 rounded-2xl shadow-inner relative overflow-hidden max-w-sm mx-auto mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8"></div>
              <div className="text-xs tracking-widest opacity-60 mb-8 uppercase">VeteryCindy Payment Gateway</div>
              <div className="text-xl font-mono tracking-widest mb-6">xxxx xxxx xxxx 9010</div>
              <div className="flex justify-between items-end text-sm">
                <div>
                  <div className="text-[9px] uppercase tracking-wider opacity-60">Cardholder</div>
                  <div className="font-semibold font-mono">{paymentForm.cardholder_name}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider opacity-60">Expires</div>
                  <div className="font-semibold font-mono">12/28</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Nombre en la Tarjeta *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.cardholder_name}
                  onChange={(e) => setPaymentForm({...paymentForm, cardholder_name: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Número de Tarjeta *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.card_number}
                  onChange={(e) => setPaymentForm({...paymentForm, card_number: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Monto a Cobrar ($ COP) *</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl text-lg font-bold text-[#14532D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Expiración *</label>
                  <input
                    type="text"
                    required
                    value={paymentForm.expiry_date}
                    onChange={(e) => setPaymentForm({...paymentForm, expiry_date: e.target.value})}
                    className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl text-center"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#14532D] mb-1.5">CVV *</label>
                  <input
                    type="password"
                    required
                    maxLength="3"
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                    className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl text-center"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setPayingAppt(null)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl cursor-pointer border-none">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F766E] text-white font-semibold rounded-2xl cursor-pointer border-none shadow-md">Procesar Transacción Real</button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Receivables */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#14532D]">💸 Facturación de Consultas</h2>

        {appointments.length === 0 ? (
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-12 text-center">
            <span className="text-4xl block mb-2">🐾</span>
            <p className="text-[#6B7280] font-medium">No hay registros de citas facturadas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-[#F5EDE3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#B45309]/10 rounded-xl flex items-center justify-center text-lg">💰</div>
                    <div>
                      <h4 className="font-bold text-[#14532D]">Mascota: {appt.Patient?.name} <span className="text-xs text-[#6B7280]">({appt.Patient?.species})</span></h4>
                      <p className="text-xs text-[#6B7280]">Propietario: {appt.Client?.first_name} {appt.Client?.last_name} | Tel: {appt.Client?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      appt.payment_status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Pago: {appt.payment_status}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      appt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Estado Cita: {appt.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-3 gap-x-6 text-sm text-[#374151] mb-4">
                  <div>🗓️ <strong>Fecha:</strong> {appt.date}</div>
                  <div>⏰ <strong>Hora:</strong> {appt.time || 'N/A (Urgencia)'}</div>
                  <div>🩺 <strong>Motivo:</strong> {appt.reason}</div>
                  <div>💰 <strong>Monto:</strong> {appt.payment_amount ? `$${appt.payment_amount.toLocaleString()} COP` : 'Pendiente liquidación'}</div>
                </div>

                {appt.payment_reference && (
                  <div className="text-xs text-gray-500 font-mono mb-2">
                    Ref. Transacción: {appt.payment_reference}
                  </div>
                )}

                {appt.payment_status === 'PENDING' && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleOpenPayment(appt)}
                      className="px-5 py-2.5 bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold rounded-xl border-none cursor-pointer active:scale-95 transition-all shadow-sm flex items-center gap-2"
                    >
                      💳 Recibir Pago & Confirmar Cita
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
