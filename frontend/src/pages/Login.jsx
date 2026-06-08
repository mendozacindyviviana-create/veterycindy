import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'CLIENT') navigate('/dashboard/client');
      else if (user.role === 'VET') navigate('/dashboard/vet');
      else if (user.role === 'CASHIER') navigate('/dashboard/cashier');
      else if (user.role === 'ADMIN') navigate('/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas o error de servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center py-12 px-6 font-display">
      <div className="max-w-md w-full bg-white border border-[#E5E0D8] rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 relative overflow-hidden">
        {/* Decorative backdrop elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F766E]/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
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
            <h2 className="text-3xl font-bold tracking-tight text-[#14532D] mb-2">Ingresar a tu Portal</h2>
            <p className="text-sm text-[#6B7280]">Bienvenido de nuevo, tus peluditos te esperan 🐶🐱</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#14532D] mb-1.5">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all text-base text-[#1F2937]"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-[#14532D]">Contraseña</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Por favor contacta con soporte al +57 301 000 3030 para restaurar tu cuenta.'); }} className="text-xs font-semibold text-[#0F766E] hover:underline no-underline">¿Olvidaste tu contraseña?</a>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#FDF8F0] border border-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all text-base text-[#1F2937]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#14532D] hover:bg-[#0F766E] disabled:bg-[#14532D]/60 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.985] cursor-pointer border-none text-base mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm border-t border-[#F5EDE3] pt-6">
            <span className="text-[#6B7280]">¿No tienes una cuenta aún? </span>
            <Link to="/register" className="font-semibold text-[#0F766E] hover:underline no-underline">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
