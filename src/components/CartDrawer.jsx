import { useCart } from '../context/CartContext';

export function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

  const handleWhatsAppClick = () => {
    const numero = "573225166527";
    
    const lista = cart.map(i => {
      const c = i.customization 
        ? `\n   ↳ Personalización: *${i.customization.nombre}* (#${i.customization.numero})\n   ↳ Parches: *${i.customization.parches}*` 
        : "";
      return `👕 *${i.nombre}*\n   Talla: [ ${i.size} ] | Cant: ${i.quantity}${c}\n   Subtotal: $${(i.precio * i.quantity).toLocaleString('es-CO')}`;
    }).join('\n\n');

    const msg = encodeURIComponent(
      `🚀 *NUEVO PEDIDO - ORBITA90*\n` +
      `------------------------------------------\n\n` +
      `${lista}\n\n` +
      `------------------------------------------\n` +
      `💰 *TOTAL A PAGAR: $${total.toLocaleString('es-CO')}*\n` +
      `------------------------------------------\n\n` +
      `✅ *Estado:* Pedido sobre pedido\n` +
      `⏱️ *Entrega:* 15-20 días hábiles\n` +
      `📍 *Ciudad:* [Ingresa tu ciudad]`
    );

    window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${msg}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* OVERLAY CON BLUR */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-white/5 h-full flex flex-col p-8 shadow-2xl text-white transform-gpu">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter">
            TU <span className="text-white/40 font-black">BOLSA</span>
          </h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-2xl"
          >
            ×
          </button>
        </div>

        {/* CONTENIDO DEL CARRITO */}
        <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pr-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
               <div className="w-16 h-16 border border-dashed border-gray-500 rounded-full flex items-center justify-center text-xl italic font-black">!</div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em]">Bolsa vacía</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-5 p-5 bg-white/[0.03] rounded-[2.5rem] border border-white/5 group hover:border-white/20 transition-all duration-500">
                {/* IMAGEN PRODUCTO */}
                <div className="w-24 h-28 flex-shrink-0 overflow-hidden rounded-2xl bg-white/5">
                  <img src={item.imagen} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="jersey" />
                </div>
                
                {/* INFO PRODUCTO */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[11px] font-[1000] uppercase italic leading-tight tracking-tight max-w-[120px]">{item.nombre}</h4>
                    <span className="font-[1000] italic text-xs whitespace-nowrap">
                      ${(item.precio * item.quantity).toLocaleString('es-CO')}
                    </span>
                  </div>

                  <p className="text-[9px] text-gray-500 font-bold uppercase mt-1 tracking-widest">
                    Talla: {item.size} • Cant: {item.quantity}
                  </p>
                  
                  {/* DETALLE DE PERSONALIZACIÓN MEJORADO */}
                  {item.customization && (
                    <div className="mt-3 p-3 bg-white/10 rounded-xl border border-white/10 shadow-inner">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-500">Dorsal Oficial</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-[13px] font-[1000] uppercase italic tracking-tight text-white leading-none">
                          {item.customization.nombre}
                        </p>
                        <p className="text-base font-[1000] italic text-white leading-none">
                          #{item.customization.numero}
                        </p>
                      </div>
                      {item.customization.parches && item.customization.parches !== 'Sin Parches' && (
                        <p className="text-[8px] font-black text-gray-400 uppercase mt-1.5 tracking-tighter">
                          + {item.customization.parches}
                        </p>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => removeFromCart(item.id, item.size, item.customization)}
                    className="text-[8px] text-gray-600 font-black uppercase mt-4 hover:text-red-500 transition-colors w-fit tracking-widest"
                  >
                    Eliminar ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER TOTAL */}
        {cart.length > 0 && (
          <div className="pt-8 border-t border-white/5 space-y-6 bg-[#0a0a0a]">
            <div className="flex justify-between items-end px-2">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-1">Subtotal</span>
              <span className="text-3xl font-[1000] italic tracking-tighter text-white">
                ${total.toLocaleString('es-CO')}
              </span>
            </div>
            
            <button 
              onClick={handleWhatsAppClick} 
              className="w-full bg-white hover:bg-gray-200 text-black py-6 rounded-[2rem] font-[1000] italic text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] active:scale-95"
            >
              Finalizar por WhatsApp 🚀
            </button>
            
            <p className="text-[8px] text-center text-gray-700 font-black uppercase tracking-[0.4em]">
              Envío nacional asegurado • Orbita90 
            </p>
          </div>
        )}
      </div>
    </div>
  );
}