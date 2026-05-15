import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData as staticMenuData } from '../data/navigation';

// Añadimos setBusqueda a las props
export default function Navbar({ setCategoriaActual, setBusqueda, onNavAction, camisetas = [] }) {
  const [activeTab, setActiveTab] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeThird, setActiveThird] = useState(null);

  // --- LÓGICA DE AUTO-DETECCIÓN UNIVERSAL (Tu código original) ---
  const menuData = useMemo(() => {
    const newMenuData = JSON.parse(JSON.stringify(staticMenuData));
    const ligasEnBase = [...new Set(camisetas.map(c => c.liga?.trim().toUpperCase()))];

    ligasEnBase.forEach(ligaNombre => {
      const equiposDeEstaLiga = [...new Set(
        camisetas
          .filter(c => c.liga?.trim().toUpperCase() === ligaNombre)
          .map(c =>
            c.equipo
              ?.trim()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

      const categoriaPrincipal = Object.keys(newMenuData).find(
        k => k.toUpperCase().includes("FÚTBOL") || k.toUpperCase().includes("FUTBOL")
      );

      if (equiposDeEstaLiga.length > 0 && categoriaPrincipal) {
        const keyLigaEnMenu = Object.keys(newMenuData[categoriaPrincipal]).find(
          k => k.trim().toUpperCase() === ligaNombre
        );

        if (keyLigaEnMenu) {
          newMenuData[categoriaPrincipal][keyLigaEnMenu] = equiposDeEstaLiga;
        }
      }
    });

    return newMenuData;
  }, [camisetas]);

  const resetMenu = () => {
    setActiveTab(null);
    setActiveSub(null);
    setActiveThird(null);
  };

// En src/components/Navbar.jsx busca la función handleSelect y cámbiala por esta:

const handleSelect = (cat) => {
  //cat puede ser "Costa de Marfil", "África", etc.
  setCategoriaActual(cat); 
  
  // IMPORTANTE: Si tienes el setBusqueda, límpialo al cambiar de categoría
  if (setBusqueda) setBusqueda(''); 
  
  if (onNavAction) onNavAction();
  resetMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.02 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <nav
      className="sticky top-0 z-[1000] bg-black flex items-center h-[85px] px-12 border-b border-white/5"
      onMouseLeave={resetMenu}
    >
      {/* LOGO */}
      <div className="flex-none mr-14">
        <Link
          to="/"
          onClick={() => handleSelect('Todas')}
          className="flex flex-col leading-[0.75] select-none italic"
        >
          <span className="text-[30px] font-[1000] tracking-tighter text-[#5ec6ed] uppercase">NEXUS</span>
          <span className="text-[30px] font-[1000] tracking-tighter uppercase text-transparent" style={{ WebkitTextStroke: '1.2px rgba(255,255,255,0.8)' }}>KITS</span>
        </Link>
      </div>

      {/* MENÚ PRINCIPAL */}
      <div className="flex flex-1 items-center justify-start gap-9 h-full">
        {Object.keys(menuData).map((tab) => (
          <div
            key={tab}
            className="relative h-full flex items-center"
            onMouseEnter={() => {
              setActiveTab(tab);
              setActiveSub(null);
              setActiveThird(null);
            }}
          >
            <button
              onClick={() => handleSelect(tab)}
              className="h-full text-[13.5px] font-medium uppercase tracking-[0.15em] text-white/90 hover:text-[#5ec6ed] transition-all duration-300"
            >
              {tab}
            </button>

            <AnimatePresence>
              {activeTab === tab && Object.keys(menuData[tab]).length > 0 && (
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="absolute top-[85px] left-[-15px] w-[240px] bg-[#0a0a0a] py-5 flex flex-col shadow-2xl border-t border-[#5ec6ed]/50 z-[1001]"
                >
                  <div className="absolute -top-[20px] left-0 w-full h-[20px] bg-transparent" />

                  {Object.keys(menuData[tab]).map((sub) => (
                    <div
                      key={sub}
                      className="relative"
                      onMouseEnter={() => { setActiveSub(sub); setActiveThird(null); }}
                    >
                      <motion.button
                        variants={itemVariants}
                        className={`w-full text-left px-8 py-[12px] text-[12px] font-bold uppercase tracking-widest transition-all ${activeSub === sub ? 'text-white bg-[#5ec6ed]/15' : 'text-zinc-400 hover:text-white'}`}
                      >
                        {sub}
                      </motion.button>

                      {activeSub === sub && (
                        <motion.div
                          key={sub}
                          variants={listVariants}
                          initial="hidden"
                          animate="visible"
                          className="absolute top-0 left-[100%] min-w-[250px] bg-[#0a0a0a] py-2 flex flex-col shadow-2xl border-l border-white/5"
                        >
                          <div className="absolute top-0 -left-[20px] w-[20px] h-full bg-transparent" />
                          <div className="flex flex-col">
                            {Array.isArray(menuData[tab][sub]) ? (
                              menuData[tab][sub].map((team) => (
                                <motion.button
                                  key={team}
                                  variants={itemVariants}
                                  onClick={() => handleSelect(team)}
                                  className="w-full text-left px-8 py-[10px] text-[11px] font-bold uppercase text-zinc-400 hover:text-[#5ec6ed] transition-colors"
                                >
                                  {team}
                                </motion.button>
                              ))
                            ) : (
                              Object.keys(menuData[tab][sub]).map((continent) => (
                                <div key={continent} className="relative w-full" onMouseEnter={() => setActiveThird(continent)}>
                                  <motion.button
                                    variants={itemVariants}
                                    className={`w-full text-left px-8 py-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeThird === continent ? 'text-white bg-[#5ec6ed]/15' : 'text-zinc-400 hover:text-white'}`}
                                  >
                                    {continent}
                                  </motion.button>
                                  {activeThird === continent && (
                                    <motion.div
                                      variants={listVariants}
                                      initial="hidden"
                                      animate="visible"
                                      className="absolute top-0 left-[100%] w-[250px] bg-[#0a0a0a] py-2 flex flex-col shadow-2xl border-l border-white/5"
                                    >
                                      {menuData[tab][sub][continent].map((country) => (
                                        <motion.button
                                          key={country}
                                          variants={itemVariants}
                                          onClick={() => handleSelect(country)}
                                          className="w-full text-left px-8 py-[9px] text-[11px] font-bold uppercase text-zinc-400 hover:text-[#5ec6ed] transition-colors"
                                        >
                                          {country}
                                        </motion.button>
                                      ))}
                                    </motion.div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* --- BARRA DE BÚSQUEDA NUEVA (Añadida al final del nav) --- */}
      <div className="flex-none ml-auto w-[220px] md:w-[300px]">
        <div className="relative group">
          <input
            type="text"
            placeholder="BUSCAR EQUIPO..."
            className="w-full bg-white/5 border border-white/10 px-4 py-2 rounded-sm text-[10px] tracking-[0.2em] uppercase focus:border-[#5ec6ed]/50 outline-none transition-all placeholder:text-zinc-700 text-white"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3 text-[#5ec6ed]" 
              fill="none" viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}