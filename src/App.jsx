import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDetail from './components/ProductDetail';

// --- COMPONENTE HERO ---
const Hero = () => (
  <section className="relative w-full h-[60vh] bg-[#000] flex items-center justify-center overflow-hidden pt-16">
    <img
      src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000"
      className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
      alt="Nexus Supply Chain"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
    <div className="relative z-10 text-center px-4 font-sans">
      <p className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase mb-4 animate-pulse">
        Direct Factory Connection / Global Logistics
      </p>
      <h1 className="text-6xl md:text-[8rem] font-black italic tracking-tighter leading-[0.8] text-white uppercase">
        NEXUS <br />
        <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>
          KITS
        </span>
      </h1>
    </div>
  </section>
);

// --- PRODUCT CARD (INTELIGENTE AL SCROLL) ---
const ProductCard = ({ prod, onClick, index }) => {
  const imgFront = Array.isArray(prod.imagenes) ? prod.imagenes[0] : (prod.imagenes || '');
  const imgBack = Array.isArray(prod.imagenes) && prod.imagenes.length > 1
    ? prod.imagenes[1]
    : imgFront;

  return (
    <motion.div
      // 1. Inicia abajo y transparente
      initial={{ opacity: 0, y: 40 }}
      // 2. Se anima SOLO cuando entra en el campo de visión de la pantalla
      whileInView={{ opacity: 1, y: 0 }}
      // 3. amount: 0.1 asegura que se dispare cuando asome el 10% de la tarjeta. once: true evita que se vuelva a animar si subes y bajas.
      viewport={{ once: true, amount: 0.1 }}
      // 4. El delay calculado crea la cascada de izquierda a derecha en cada fila nueva que descubres
      transition={{ duration: 0.6, ease: "easeOut", delay: (index % 6) * 0.1 }}
      
      className="group cursor-pointer flex flex-col font-sans"
      onClick={onClick}
    >
      <div className="aspect-[4/5] overflow-hidden bg-transparent relative rounded-sm">
        <img
          src={imgFront}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={prod.nombre}
          loading="lazy"
        />
        <img
          src={imgBack}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          alt={`${prod.nombre} back`}
        />
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-zinc-100 text-[13px] font-light tracking-wide group-hover:text-white transition-colors leading-snug line-clamp-2">
          {prod.nombre}
        </h3>
        <p className="text-zinc-400 font-bold text-xs">
          {prod.precio}$
        </p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [camisetas, setCamisetas] = useState([]);
  const [menuData, setMenuData] = useState([]); 

  const [categoriaActual, setCategoriaActual] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const productosPorPagina = 20;

  const [slideHomeIndex, setSlideHomeIndex] = useState(0);
  const productosPorSlide = 6;
  const maxSlidesHome = 4;

useEffect(() => {
  async function cargarDatosMenu() {
    // Cargamos 3 lotes para cubrir hasta 3,000 productos en el Navbar
    const { data: lote1 } = await supabase.from('productos').select('liga, equipo, categoria').range(0, 999);
    const { data: lote2 } = await supabase.from('productos').select('liga, equipo, categoria').range(1000, 1999);
    const { data: lote3 } = await supabase.from('productos').select('liga, equipo, categoria').range(2000, 2999);

    let datosCompletos = [];
    if (lote1) datosCompletos = [...lote1];
    if (lote2) datosCompletos = [...datosCompletos, ...lote2];
    if (lote3) datosCompletos = [...datosCompletos, ...lote3];

    setMenuData(datosCompletos);
  }
  cargarDatosMenu();
}, []);

  useEffect(() => {
    async function traerProductos() {
      setCargando(true);
      
      const isHome = categoriaActual === 'Todas' && busqueda === '';
      const limite = isHome ? (productosPorSlide * maxSlidesHome) : productosPorPagina;
      
      const desde = isHome ? 0 : (paginaActual - 1) * productosPorPagina;
      const hasta = desde + limite - 1;

      let query = supabase.from('productos').select('*', { count: 'exact' });

      if (busqueda !== '') {
        query = query.or(`nombre.ilike.%${busqueda}%,equipo.ilike.%${busqueda}%,liga.ilike.%${busqueda}%`);
      } else if (categoriaActual !== 'Todas') {
        const catNav = categoriaActual.toLowerCase();
        if (catNav === 'futbol') query = query.eq('categoria', 'jerseys');
        else if (catNav === 'mundial 2026') query = query.eq('categoria', 'MUNDIAL 2026');
        else query = query.or(`nombre.ilike.%${categoriaActual}%,equipo.ilike.%${categoriaActual}%,liga.ilike.%${categoriaActual}%`);
      }

      const { data, error, count } = await query.range(desde, hasta).order('id', { ascending: false });

      if (!error && data) {
        setCamisetas(data);
        setTotalRegistros(count || 0);
      }
      setCargando(false);
    }
    traerProductos();
  }, [paginaActual, categoriaActual, busqueda]);

  useEffect(() => {
    setSelectedProduct(null);
    setPaginaActual(1);
    setSlideHomeIndex(0);
  }, [categoriaActual, busqueda]);

  useEffect(() => {
    if (categoriaActual !== 'Todas' || busqueda !== '' || cargando) return;
    
    const interval = setInterval(() => {
      setSlideHomeIndex((prev) => (prev + 1) % maxSlidesHome);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [categoriaActual, busqueda, cargando]);

  const isHome = categoriaActual === 'Todas' && busqueda === '';
  const totalPaginas = Math.ceil(totalRegistros / productosPorPagina);
  const todasLasPaginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  const productosSlider = useMemo(() => {
    const inicio = slideHomeIndex * productosPorSlide;
    return camisetas.slice(inicio, inicio + productosPorSlide);
  }, [camisetas, slideHomeIndex]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased text-white overflow-x-hidden">
      <Navbar
        setCategoriaActual={setCategoriaActual}
        setBusqueda={setBusqueda}
        busqueda={busqueda} // <--- ¡Asegúrate de que esta línea exista!
        categoriaActual={categoriaActual}
        onNavAction={() => setSelectedProduct(null)}
        camisetas={menuData}
      />

      {selectedProduct ? (
        <ProductDetail
          producto={selectedProduct}
          todasLasCamisetas={camisetas}
          onBack={() => setSelectedProduct(null)}
        />
      ) : (
        <>
          {isHome && <Hero />}

          <main className="w-full px-4 md:px-10 xl:px-16 mx-auto py-16">
            
            {isHome ? (
              /* ================= SECCIÓN HOME ================= */
              <div className="mb-20">
                <div className="relative flex flex-col md:flex-row md:justify-between md:items-center border-b border-zinc-800 pb-4 mb-8 gap-6 md:gap-0">
                  <h2 className="text-white uppercase tracking-[0.1em] text-[16px] md:text-[20px] font-black italic flex items-center gap-3 relative z-10">
                    CAMISETAS MÁS VENDIDAS <span className="not-italic text-xl">🔥</span>
                  </h2>

                  <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center gap-6 text-zinc-400 text-[10px] md:text-xs tracking-[0.2em] w-full md:w-auto">
                    <button
                      onClick={() => setSlideHomeIndex(p => (p === 0 ? maxSlidesHome - 1 : p - 1))}
                      className="hover:text-white transition-all flex items-center gap-3 group"
                    >
                      <span className="w-8 md:w-12 h-[1px] bg-zinc-600 group-hover:bg-white transition-colors"></span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path></svg>
                    </button>

                    <span className="font-mono font-medium">
                      {String(slideHomeIndex + 1).padStart(2, '0')} - {String(maxSlidesHome).padStart(2, '0')}
                    </span>

                    <button
                      onClick={() => setSlideHomeIndex(p => (p + 1) % maxSlidesHome)}
                      className="hover:text-white transition-all flex items-center gap-3 group"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
                      <span className="w-8 md:w-12 h-[1px] bg-zinc-600 group-hover:bg-white transition-colors"></span>
                    </button>
                  </div>

                  <a href="#" className="hidden md:block text-[10px] tracking-[0.15em] uppercase border-b border-zinc-600 pb-1 font-bold text-zinc-300 hover:text-white hover:border-white transition-colors relative z-10">
                    COMPRAR AHORA
                  </a>
                </div>

                {!cargando && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slideHomeIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-10"
                    >
                      {productosSlider.map((prod, idx) => (
                        /* Le pasamos el index para que calcule el delay */
                        <ProductCard key={`${slideHomeIndex}-${prod.id || idx}`} prod={prod} index={idx} onClick={() => setSelectedProduct(prod)} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            ) : (
              /* ================= SECCIÓN CATÁLOGO ================= */
              <div>
                <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
                  <h2 className="text-white uppercase tracking-[0.15em] text-[14px] md:text-[18px] font-black italic">
                    RESULTADOS PARA {categoriaActual !== 'Todas' ? categoriaActual : busqueda}
                  </h2>
                  <div className="text-zinc-500 text-[10px] font-medium tracking-widest">
                    <span>{totalRegistros} PRODUCTOS</span>
                  </div>
                </div>

                {cargando ? (
                  <div className="flex justify-center py-32">
                    <div className="w-8 h-8 border-2 border-[#5ec6ed] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {/* Quitamos el motion.div complejo de aquí, porque cada tarjeta ahora se anima sola */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                      {camisetas.map((prod, idx) => (
                        /* El index aquí es la clave de la cascada al scrollear */
                        <ProductCard key={prod.id || idx} prod={prod} index={idx} onClick={() => setSelectedProduct(prod)} />
                      ))}
                    </div>

                    {totalPaginas > 1 && (
                      <div className="flex flex-col items-center gap-8 mt-24 mb-12">
                        <div className="flex items-center flex-wrap justify-center gap-2">
                          <button
                            onClick={() => { setPaginaActual(p => Math.max(p - 1, 1)); window.scrollTo(0, 0); }}
                            disabled={paginaActual === 1}
                            className="px-4 py-2 border border-zinc-800 text-[10px] hover:border-white disabled:opacity-20 transition-all cursor-pointer"
                          >
                            ANTERIOR
                          </button>

                          {todasLasPaginas.map(num => (
                            <button
                              key={num}
                              onClick={() => { setPaginaActual(num); window.scrollTo(0, 0); }}
                              className={`w-10 h-10 text-[11px] font-bold transition-all border ${
                                paginaActual === num ? 'bg-white text-black border-white' : 'text-zinc-400 border-zinc-800 hover:border-zinc-500'
                              }`}
                            >
                              {num}
                            </button>
                          ))}

                          <button
                            onClick={() => { setPaginaActual(p => Math.min(p + 1, totalPaginas)); window.scrollTo(0, 0); }}
                            disabled={paginaActual === totalPaginas}
                            className="px-4 py-2 border border-zinc-800 text-[10px] hover:border-white disabled:opacity-20 transition-all cursor-pointer"
                          >
                            SIGUIENTE
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}