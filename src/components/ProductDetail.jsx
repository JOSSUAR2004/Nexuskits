import React, { useState, useMemo, useEffect } from 'react';
import ImageZoom from './ImageZoom';

const ProductDetail = ({ producto, onBack, todasLasCamisetas = [] }) => {
  if (!producto) return null;

  // --- CORRECCIÓN DE REFERENCIAS (Nueva Estructura) ---
  const imagenes = Array.isArray(producto.imagenes) ? producto.imagenes : [];
  const precioBase = parseFloat(producto.precio || 0);

  // --- ESTADOS ---
  // Inicializamos la foto principal con la primera del array de Cloudinary
  const [fotoPrincipal, setFotoPrincipal] = useState(imagenes[0] || '');
  const [patchSelected, setPatchSelected] = useState(null); 
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');

  // Efecto para resetear la foto si cambia el producto
  useEffect(() => {
    setFotoPrincipal(imagenes[0] || '');
  }, [producto]);

  // --- LÓGICA DE DETECCIÓN DE CATEGORÍAS ---
  const nombreProductoLower = (producto.nombre || "").toLowerCase();
  
  const esShort = nombreProductoLower.includes('short') || nombreProductoLower.includes('pantalon');
  const esBaby = nombreProductoLower.includes('baby');
  const esKids = nombreProductoLower.includes('niño') || nombreProductoLower.includes('kids') || nombreProductoLower.includes('enfant');
  const esPrendaBasica = nombreProductoLower.includes('training') || 
                         nombreProductoLower.includes('vest') || 
                         esBaby;

  // --- SISTEMA DE TALLAS DINÁMICO ---
  const opcionesTallas = useMemo(() => {
    if (esBaby) return ['3-6 Meses', '6-9 Meses', '9-12 Meses', '12-18 Meses', '18-24 Meses', '24-36 Meses'];
    if (esKids) return ['2-3 años', '4-5 años', '5-6 años', '7-8 años', '8-9 años', '10-11 años', '12-13 años'];
    return ['S', 'M', 'L', 'XL', 'XXL'];
  }, [esBaby, esKids]);

  // --- LÓGICA DE FILTRADO DE PARCHES (Ajustada a 'imagenes') ---
 // --- LÓGICA DE FILTRADO DE PARCHES (Ajustada para Mundial 2026) ---
  const patchesRaw = useMemo(() => {
    if (esShort || esPrendaBasica) return [];

    const ligaProducto = (producto.liga || "").toLowerCase().trim();
    const categoriaProducto = (producto.categoria || "").toLowerCase().trim(); // Nueva variable
    const nombreProductoLower = (producto.nombre || "").toLowerCase();

    return todasLasCamisetas.filter(c => {
      const nombreItem = (c.nombre || "").toLowerCase();
      const ligaItem = (c.liga || "").toLowerCase().trim();
      const equipoItem = (c.equipo || "").toLowerCase().trim();

      // Identificar si el ítem es un parche
      const esParche = nombreItem.includes("parche") || equipoItem.includes("parches");
      if (!esParche) return false;

      // REGLA PARA MUNDIAL 2026
      if (categoriaProducto === "mundial 2026" || ligaProducto === "otros") {
        return equipoItem.includes("parches mundial 2026") || nombreItem.includes("2026");
      }

      // REGLA PARA RETRO
      if (nombreProductoLower.includes("retro")) {
        return nombreItem.includes("retro") && ligaItem === ligaProducto;
      }

      // REGLA GENERAL (Ligas normales)
      return ligaItem === ligaProducto && !nombreItem.includes("retro");
    });
  }, [todasLasCamisetas, producto, esShort, esPrendaBasica]);

  // --- CÁLCULO DE PRECIOS ---
  const costoPersonalizacion = (!esShort && !esPrendaBasica && (nombre.trim() !== '' || numero.trim() !== '')) ? 2.99 : 0;
  const costoParche = (patchSelected) ? 1.00 : 0;
  
  const totalOpciones = costoPersonalizacion + costoParche;
  const precioFinal = precioBase + totalOpciones;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:px-12 md:py-6 animate-in fade-in duration-500 font-sans">
      <button 
        onClick={onBack} 
        className="mb-4 text-zinc-600 hover:text-[#5ec6ed] text-[10px] uppercase tracking-widest transition-colors"
      >
        ← Volver al catálogo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 max-w-[1300px] mx-auto">
        
        {/* GALERÍA (Usando el array 'imagenes') */}
        <div className="hidden md:flex flex-col gap-2 md:col-span-1">
          {imagenes.map((foto, index) => (
            <img 
              key={index} 
              src={foto} 
              onClick={() => setFotoPrincipal(foto)}
              className={`w-full aspect-square object-cover cursor-pointer border-2 transition-all ${
                fotoPrincipal === foto ? 'border-[#5ec6ed]' : 'border-transparent bg-zinc-900/50'
              }`} 
              alt={`Thumbnail ${index}`}
            />
          ))}
        </div>

        <div className="md:col-span-6 h-[65vh] bg-zinc-900/20 rounded-sm overflow-hidden">
          <ImageZoom src={fotoPrincipal} />
        </div>

        {/* CONFIGURACIÓN */}
        <div className="md:col-span-5 flex flex-col gap-6 pr-2">
          <div className="border-b border-zinc-800 pb-4">
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">{producto.equipo}</p>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic mt-1 leading-tight">{producto.nombre}</h1>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
              Talla {esKids ? '(Niño)' : esBaby ? '(Bebé)' : '(Adulto)'}
            </label>
            <select 
              value={tallaSeleccionada}
              onChange={(e) => setTallaSeleccionada(e.target.value)}
              className="bg-transparent border border-zinc-800 p-3 text-xs outline-none focus:border-[#5ec6ed] transition-colors"
            >
              <option className="bg-black" value="">Elija una opción</option>
              {opcionesTallas.map((t) => (
                <option key={t} className="bg-black" value={t}>{t}</option>
              ))}
            </select>
          </div>

          {!esPrendaBasica && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              {!esShort && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase text-zinc-500 font-bold">Nombre dorsal (+2.99$)</label>
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="EJ: MESSI"
                    className="bg-transparent border border-zinc-800 p-3 text-xs outline-none focus:border-zinc-600 uppercase tracking-widest" 
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-zinc-500 font-bold">Número</label>
                <input 
                  type="text" 
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="10"
                  className="bg-transparent border border-zinc-800 p-3 text-xs outline-none focus:border-zinc-600" 
                />
              </div>

              {!esShort && patchesRaw.length > 0 && (
                <div className="flex flex-col gap-4 pt-2">
                  <label className="text-[11px] uppercase text-zinc-500 font-bold tracking-[0.2em]">Badges (+1.00$)</label>
                  <div className="flex flex-wrap gap-4">
                    {patchesRaw.flatMap((patch) => 
                      (Array.isArray(patch.imagenes) ? patch.imagenes : []).map((fotoUrl, imgIndex) => {
                        const uniqueId = `${patch.id}-${imgIndex}`;
                        const isSelected = patchSelected === uniqueId;

                        return (
                          <div 
                            key={uniqueId}
                            onClick={() => setPatchSelected(isSelected ? null : uniqueId)}
                            className={`flex flex-col items-center pt-6 pb-8 px-3 border transition-all duration-300 w-[110px] min-h-[220px] cursor-pointer ${
                              isSelected 
                              ? 'border-[#5ec6ed] bg-[#5ec6ed]/5' 
                              : 'border-zinc-800 bg-[#0d0d0d] hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex justify-center items-center mb-6 w-full h-12">
                              <img src={fotoUrl} className="w-12 h-12 object-contain" alt="Badge" />
                            </div>
                            <div className="flex-1 flex flex-col justify-start w-full text-center">
                              {patch.nombre.replace(/Parche /i, "").split(" ").map((word, idx) => (
                                <p key={idx} className="text-[10px] font-light leading-[1.2] text-zinc-200 tracking-wide uppercase">
                                  {word}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-zinc-800 pt-6 space-y-2 mt-4 bg-zinc-900/10 p-4 rounded-sm">
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-zinc-500">
              <span>Total del producto</span>
              <span>{precioBase.toFixed(2)}$</span>
            </div>
            {totalOpciones > 0 && (
              <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#5ec6ed]">
                <span>Total opciones</span>
                <span>{totalOpciones.toFixed(2)}$</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black uppercase tracking-[0.2em] text-white border-t border-zinc-800 pt-3 mt-2">
              <span>Total</span>
              <span>{precioFinal.toFixed(2)}$</span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center border border-zinc-800 bg-zinc-900/50">
              <button className="px-4 py-2 text-zinc-500 hover:text-white transition-colors">-</button>
              <span className="px-2 text-xs font-bold">1</span>
              <button className="px-4 py-2 text-zinc-500 hover:text-white transition-colors">+</button>
            </div>
            <button className="flex-1 bg-zinc-800 text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#5ec6ed] hover:text-black transition-all duration-300">
              Añadir a la cesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;