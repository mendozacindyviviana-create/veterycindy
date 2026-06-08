import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import ServicesList from '../components/landing/ServicesList';
import WhyUs from '../components/landing/WhyUs';
import Testimonials from '../components/landing/Testimonials';
import ContactForm from '../components/landing/ContactForm';
import Footer from '../components/common/Footer';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-[#1F2937] font-display">
      <Navbar />
      <Hero />
      <div className="bg-white border-b border-[#F5EDE3]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-[#14532D]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 8.944 11.922 5.12-1.632 8.944-6.33 8.944-11.922 0-1.11-.16-2.18-.47-3.2z" />
            </svg>
            <span className="font-semibold">Clínica registrada ante el ICA</span>
          </div>
          <div>⭐⭐⭐⭐⭐ <span className="font-medium">+480 reseñas en Google</span></div>
          <div className="font-medium text-[#B45309]">Respuesta en menos de 2 horas</div>
        </div>
      </div>
      <ServicesList />
      <WhyUs />
      
      {/* Patient gallery section */}
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
            { img: 'https://picsum.photos/id/1012/600/600', name: 'Luna', desc: 'Golden • 3 años' },
            { img: 'https://picsum.photos/id/1005/600/600', name: 'Michi', desc: 'Gato • Vacunas' },
            { img: 'https://picsum.photos/id/160/600/600', name: 'Rocky', desc: 'Beagle • Dermatitis' },
            { img: 'https://picsum.photos/id/201/600/600', name: 'Coco', desc: 'Cocker • Control' },
            { img: 'https://picsum.photos/id/251/600/600', name: 'Simba', desc: 'Mestizo • Sano' },
            { img: 'https://picsum.photos/id/133/600/600', name: 'Nina', desc: 'Gata • Dental' },
          ].map((p, i) => (
            <div key={i} className="patient-photo relative aspect-square bg-zinc-200 overflow-hidden rounded-2xl group shadow-sm hover:shadow-md transition-all duration-300">
              <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <div className="font-semibold text-lg leading-none">{p.name}</div>
                <div className="text-xs text-white/80 mt-1">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactForm />
      <Testimonials />
      
      {/* Final CTA */}
      <div className="bg-[#14532D] py-16 text-center text-white">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-4xl font-bold tracking-tight mb-4">Tu mascota no puede decirte lo que siente.<br />Nosotros sí podemos escucharla.</div>
          <button 
            onClick={() => document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })} 
            className="mt-6 btn-vet px-12 py-4 rounded-2xl text-xl font-semibold border-none cursor-pointer text-white"
          >
            Agendar cita ahora
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
