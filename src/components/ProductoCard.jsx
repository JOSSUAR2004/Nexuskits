const ProductCard = ({ prod }) => {
  const precioDisplay = prod.precio > 1000
    ? Math.round(prod.precio / 4000)
    : prod.precio;

  return (
    <div className="group cursor-pointer flex flex-col mb-10">
      {/* Contenedor de Imagen: Fondo negro puro y cuadrado */}
      <div className="relative aspect-square bg-black overflow-hidden mb-4">
        <img
          src={Array.isArray(producto.imagenes) ? producto.imagenes[0] : producto.imagenes}
          alt={producto.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info del Producto */}
      <div className="flex flex-col text-left">
        {/* Título: Blanco suave, tamaño exacto y sin negrita pesada */}
        <h3 className="text-[14.5px] leading-tight text-white/80 group-hover:text-white transition-colors font-normal tracking-tight">
          {prod.nombre}
        </h3>

        {/* Precio: Más separado (mt-5) y un gris más claro para que sea legible */}
        <p className="text-[11px] mt-5 text-[#999] font-medium tracking-wide">
          {precioDisplay},99€
        </p>
      </div>
    </div>
  );
};