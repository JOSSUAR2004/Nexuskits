import { Link } from 'react-router-dom';
import logoMarca from './assets/logo-orbita.png';

export function Terms() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans antialiased">
      <nav className="p-8 border-b border-white/5 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 bg-[#0a0a0a]/90">
        <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">← Volver al Studio</Link>
        <img src={logoMarca} alt="Logo" className="h-10 w-auto" />
        <div className="w-20"></div>
      </nav>

      <main className="max-w-4xl mx-auto p-8 md:p-20">
        <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter mb-8">
          Términos de <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>Encargo</span>
        </h1>
        <div className="space-y-8 text-gray-400 text-sm">
          <p>• Los productos se procesan bajo la modalidad de importación por encargo.</p>
          <p>• Tiempo de entrega estimado: 10 a 15 días hábiles.</p>
          <p>• Al ser productos personalizados o importados específicamente, no se aceptan cambios por talla.</p>
        </div>
      </main>
    </div>
  );
}