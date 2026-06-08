import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    const roleRoutes = { CLIENT: '/dashboard/client', VET: '/dashboard/vet', CASHIER: '/dashboard/cashier', ADMIN: '/dashboard' };
    return roleRoutes[user.role] || '/dashboard/client';
  };

  return (
    <nav className="nav sticky top-0 z-50 bg-white/95 border-b border-[#F5EDE3]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-11 h-11 bg-[#14532D] rounded-2xl flex items-center justify-center text-white text-3xl">🐾</div>
          <div>
            <div className="font-bold text-3xl tracking-tight text-[#14532D]">VeteryCindy</div>
            <div className="text-[10px] text-[#B45309] -mt-1 font-medium">CLÍNICA VETERINARIA</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => scrollTo('servicios')} className="px-5 py-2 text-sm font-medium text-[#14532D] hover:text-[#0F766E] bg-transparent border-none cursor-pointer">
            Servicios
          </button>
          <button onClick={() => scrollTo('costos')} className="px-5 py-2 text-sm font-medium text-[#14532D] hover:text-[#0F766E] bg-transparent border-none cursor-pointer">
            Costos
          </button>
          <button onClick={() => scrollTo('agendar')} className="px-5 py-2 text-sm font-medium text-[#14532D] hover:text-[#0F766E] bg-transparent border-none cursor-pointer">
            Contacto
          </button>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} className="px-5 py-2 text-sm font-medium text-[#0F766E] hover:text-[#14532D] no-underline">
                Mi Panel
              </Link>
              <button onClick={handleLogout} className="px-6 py-2.5 border-2 border-[#14532D] text-[#14532D] text-sm font-semibold rounded-full hover:bg-[#14532D] hover:text-white transition-all cursor-pointer bg-transparent">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 text-sm font-medium text-[#14532D] hover:text-[#0F766E] no-underline">
                Iniciar sesión
              </Link>
              <Link to="/register" className="px-8 py-2.5 bg-[#14532D] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-full transition-all no-underline">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#14532D] text-2xl bg-transparent border-none cursor-pointer" aria-label="Menu">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#F5EDE3] px-6 py-4 space-y-3">
          <button onClick={() => scrollTo('servicios')} className="block w-full text-left py-2 text-[#14532D] font-medium bg-transparent border-none cursor-pointer">Servicios</button>
          <button onClick={() => scrollTo('costos')} className="block w-full text-left py-2 text-[#14532D] font-medium bg-transparent border-none cursor-pointer">Costos</button>
          <button onClick={() => scrollTo('agendar')} className="block w-full text-left py-2 text-[#14532D] font-medium bg-transparent border-none cursor-pointer">Contacto</button>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} className="block py-2 text-[#0F766E] font-medium no-underline" onClick={() => setMobileOpen(false)}>Mi Panel</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-[#9F1239] font-medium bg-transparent border-none cursor-pointer">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-[#14532D] font-medium no-underline" onClick={() => setMobileOpen(false)}>Iniciar sesión</Link>
              <Link to="/register" className="block py-2 text-[#0F766E] font-medium no-underline" onClick={() => setMobileOpen(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
