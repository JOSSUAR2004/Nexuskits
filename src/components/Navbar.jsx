import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData as staticMenuData } from '../data/navigation';

export default function Navbar({ setCategoriaActual, setBusqueda, onNavAction, camisetas = [] }) {
  const [activeTab, setActiveTab] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeThird, setActiveThird] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- LÓGICA DE AUTO-DETECCIÓN UNIVERSAL ---
  const menuData = useMemo(() => {
    const newMenuData = JSON.parse(JSON.stringify(staticMenuData));
    const ligasEnBase = [...new Set(camisetas.map(c => c.liga?.trim().toUpperCase()))];

    ligasEnBase.forEach(ligaNombre => {
      const equiposDeEstaLiga = [...new Set(
        camisetas
          .filter(c => c.liga?.trim().toUpperCase() === ligaNombre)
          .map(c => c.equipo?.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

      const categoriaPrincipal = Object.keys(newMenuData).find(
        k => k.toUpperCase().includes("FÚTBOL") || k.toUpperCase().includes("FUTBOL")
      );

      if (equiposDeEstaLiga.length > 0 && categoriaPrincipal) {
        const keyLigaEnMenu = Object.keys(newMenuData[categoriaPrincipal]).find(
          k => k.trim().toUpperCase() === ligaNombre
        );
        if (keyLigaEnMenu) newMenuData[categoriaPrincipal][keyLigaEnMenu] = equiposDeEstaLiga;
      }
    });
    return newMenuData;
  }, [camisetas]);

  const resetMenu = () => {
    setActiveTab(null);
    setActiveSub(null);
    setActiveThird(null);
  };

  const handleSelect = (cat) => {
    setCategoriaActual(cat);
    if (setBusqueda) setBusqueda('');
    if (onNavAction) onNavAction();
    resetMenu();
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.02 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <>
      <nav
        className="sticky top-0 z-[1000] bg-black flex items-center h-[85px] px-6 md:px-12 border-b border-white/5"
        onMouseLeave={resetMenu}
      >
        {/* LOGO */}
        <div className="flex-none mr-8 md:mr-14">
          <Link to="/" onClick={() => handleSelect('Todas')} className="flex flex-col leading-[0.75] select-none italic">
            <span className="text-[24px] md:text-[30px] font-[1000] tracking-tighter text-[#5ec6ed] uppercase">NEXUS</span>
            <span className="text-[24px] md:text-[30px] font-[1000] tracking-tighter uppercase text-transparent" style={{ WebkitTextStroke: '1.2px rgba(255,255,255,0.8)' }}>KITS</span>
          </Link>
        </div>

        {/* MENÚ PRINCIPAL (ESCRITORIO) */}
        <div className="hidden lg:flex flex-1 items-center justify-start gap-9 h-full">
          {Object.keys(menuData).map((tab) => (
            <div
              key={tab}
              className="relative h-full flex items-center"
              onMouseEnter={() => { setActiveTab(tab); setActiveSub(null); setActiveThird(null); }}
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
                    variants={listVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }}
                    className="absolute top-[85px] left-[-15px] w-[240px] bg-[#0a0a0a] py-5 flex flex-col shadow-2xl border-t border-[#5ec6ed]/50 z-[1001]"
                  >
                    <div className="absolute -top-[20px] left-0 w-full h-[20px] bg-transparent" />
                    {Object.keys(menuData[tab]).map((sub) => (
                      <div key={sub} className="relative" onMouseEnter={() => { setActiveSub(sub); setActiveThird(null); }}>
                        <motion.button
                          variants={itemVariants}
                          className={`w-full text-left px-8 py-[12px] text-[12px] font-bold uppercase tracking-widest transition-all ${activeSub === sub ? 'text-white bg-[#5ec6ed]/15' : 'text-zinc-400 hover:text-white'}`}
                        >
                          {sub}
                        </motion.button>

                        {/* TERCER NIVEL (EQUIPOS/PAÍSES) */}
                        {activeSub === sub && (
                          <motion.div
                            variants={listVariants} initial="hidden" animate="visible"
                            className="absolute top-0 left-[100%] min-w-[250px] bg-[#0a0a0a] py-2 flex flex-col shadow-2xl border-l border-white/5"
                          >
                            <div className="absolute top-0 -left-[20px] w-[20px] h-full bg-transparent" />
                            {Array.isArray(menuData[tab][sub]) ? (
                              menuData[tab][sub].map((team) => (
                                <motion.button
                                  key={team} variants={itemVariants} onClick={() => handleSelect(team)}
                                  className="w-full text-left px-8 py-[10px] text-[11px] font-bold uppercase text-zinc-400 hover:text-[#5ec6ed] transition-colors"
                                >
                                  {team}
                                </motion.button>
                              ))
                            ) : (
                              Object.keys(menuData[tab][sub]).map((cont) => (
                                <div key={cont} className="relative w-full" onMouseEnter={() => setActiveThird(cont)}>
                                  <motion.button
                                    variants={itemVariants}
                                    className={`w-full text-left px-8 py-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeThird === cont ? 'text-white bg-[#5ec6ed]/15' : 'text-zinc-400 hover:text-white'}`}
                                  >
                                    {cont}
                                  </motion.button>
                                  {activeThird === cont && (
                                    <motion.div
                                      variants={listVariants} initial="hidden" animate="visible"
                                      className="absolute top-0 left-[100%] w-[250px] bg-[#0a0a0a] py-2 flex flex-col shadow-2xl border-l border-white/5"
                                    >
                                      {menuData[tab][sub][cont].map((country) => (
                                        <motion.button
                                          key={country} variants={itemVariants} onClick={() => handleSelect(country)}
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

        {/* BUSCADOR */}
        <div className="flex-1 lg:flex-none ml-auto max-w-[180px] md:max-w-[300px]">
          <div className="relative group">
            <input
              type="text"
              placeholder="BUSCAR..."
              className="w-full bg-white/5 border border-white/10 px-4 py-2 rounded-sm text-[10px] tracking-[0.2em] uppercase focus:border-[#5ec6ed]/50 outline-none transition-all text-white placeholder:text-zinc-700"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* BOTÓN HAMBURGUESA (MÓVIL) */}
        <button className="ml-4 lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* MENÚ LATERAL MÓVIL (DRAWER) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[1001]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-[85%] bg-[#0a0a0a] z-[1002] p-8 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <span className="text-[#5ec6ed] font-bold tracking-[0.3em] text-sm uppercase">NEXUS MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white">✕</button>
              </div>
              
              <div className="flex flex-col gap-8">
                {Object.keys(menuData).map((tab) => (
                  <div key={tab} className="flex flex-col gap-4">
                    <button onClick={() => handleSelect(tab)} className="text-left text-white text-xl font-black italic tracking-tighter uppercase">
                      {tab}
                    </button>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 pl-4 border-l border-[#5ec6ed]/20">
                      {Object.keys(menuData[tab]).map(sub => (
                        <button key={sub} onClick={() => handleSelect(sub)} className="text-left text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:text-[#5ec6ed]">
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}