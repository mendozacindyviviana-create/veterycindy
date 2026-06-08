import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ClientDashboard from '../components/dashboard/client/ClientDashboard';
import VetDashboard from '../components/dashboard/vet/VetDashboard';
import CashierDashboard from '../components/dashboard/cashier/CashierDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const renderDashboard = () => {
    // If the logged-in user is ADMIN, render the simulated panel based on the sub-route path
    if (user?.role === 'ADMIN') {
      if (path.includes('/dashboard/client')) return <ClientDashboard />;
      if (path.includes('/dashboard/vet')) return <VetDashboard />;
      if (path.includes('/dashboard/cashier')) return <CashierDashboard />;
    }

    switch (user?.role) {
      case 'CLIENT':
        return <ClientDashboard />;
      case 'VET':
        return <VetDashboard />;
      case 'CASHIER':
        return <CashierDashboard />;
      case 'ADMIN':
        return (
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 text-center">
            <h2 className="text-3xl font-bold text-[#14532D] mb-4">Panel de Administrador</h2>
            <p className="text-[#6B7280] mb-6">
              Como Administrador, tienes acceso a todas las secciones. Por favor, selecciona un perfil a simular:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Link to="/dashboard/client" className="p-6 bg-[#FDF8F0] border border-[#E5E0D8] rounded-2xl font-bold text-[#14532D] hover:bg-[#0F766E] hover:text-white transition-all no-underline">
                Simular Cliente
              </Link>
              <Link to="/dashboard/vet" className="p-6 bg-[#FDF8F0] border border-[#E5E0D8] rounded-2xl font-bold text-[#14532D] hover:bg-[#0F766E] hover:text-white transition-all no-underline">
                Simular Veterinario
              </Link>
              <Link to="/dashboard/cashier" className="p-6 bg-[#FDF8F0] border border-[#E5E0D8] rounded-2xl font-bold text-[#14532D] hover:bg-[#0F766E] hover:text-white transition-all no-underline">
                Simular Cajero
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <p className="text-red-500 font-semibold">Rol de usuario no reconocido.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-[#1F2937] font-display flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-12">
          {user?.role === 'ADMIN' && path !== '/dashboard' && path !== '/dashboard/admin' && (
            <div className="mb-6">
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:underline no-underline">
                ← Volver al Panel de Simulación
              </Link>
            </div>
          )}
          {renderDashboard()}
        </main>
      </div>
      <Footer />
    </div>
  );
}
