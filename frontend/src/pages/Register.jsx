import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    document_id: '',
    address: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // Role defaults to CLIENT for self-registration
      const dataToSubmit = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        document_id: formData.document_id,
        address: formData.address,
        password: formData.password,
        role: 'CLIENT'
      };

      await register(dataToSubmit);
      navigate('/dashboard/client');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center py-12 px-6 font-display">
      <div className="max-w-xl w-full bg-white border border-[#E5E0D8] rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F766E]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#B45309]/5 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] hover:text-[#14532D] no-underline mb-6">
            <span aria-hidden="true">←</span>
            Volver al inicio
          </Link>

          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group no-underline">
              <span className="text-3xl">🐾</span>
              <span className="font-bold text-2xl text-[#14532D] group-hover:text-[#0F766E] transition-colors">VeteryCindy</span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-[#14532D] mb-2">Crear Cuenta de Propietario</h2>
            <p className="text-sm text-[#6B7280]">Regístrate para agendar y gestionar las citas de tus mascotas.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Nombre *</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all text-base text-[#1F2937]"
                  placeholder="María"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Apellidos *</label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all text-base text-[#1F2937]"
                  placeholder="Gómez Rodríguez"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Cédula / Documento *</label>
                <input
                  type="text"
                  name="document_id"
                  required
                  value={formData.document_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all text-base text-[#1F2937]"
                  placeholder="1020345678"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Celular / Teléfono *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all text-base text-[#1F2937]"
                  placeholder="3011234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Correo Electrónico *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all text-base text-[#1F2937]"
                placeholder="maria@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Dirección *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all text-base text-[#1F2937]"
                placeholder="Calle 72 # 10-34, Bogotá"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all text-base text-[#1F2937]"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#14532D] mb-1.5">Confirmar Contraseña *</label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] transition-all text-base text-[#1F2937]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#14532D] hover:bg-[#0F766E] disabled:bg-[#14532D]/60 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.985] cursor-pointer border-none text-base mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm border-t border-[#F5EDE3] pt-6">
            <span className="text-[#6B7280]">¿Ya tienes una cuenta? </span>
            <Link to="/login" className="font-semibold text-[#0F766E] hover:underline no-underline">Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
