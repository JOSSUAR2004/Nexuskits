import React, { useState } from 'react';

const ImageZoom = ({ src }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  // Esta función detecta mágicamente si el dispositivo tiene un mouse/cursor real
  const hasMouse = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const handleMouseMove = (e) => {
    // Si no tiene mouse (es un celular/tablet), abortamos la función
    if (!hasMouse()) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    // Solo activamos el zoom si el dispositivo tiene un mouse real
    if (hasMouse()) {
      setShowZoom(true);
    }
  };

  return (
    <div 
      className="relative overflow-hidden lg:cursor-zoom-in bg-zinc-900 rounded-sm w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowZoom(false)}
    >
      <img 
        src={src} 
        alt="Producto" 
        className={`w-full h-full object-cover transition-opacity duration-300 ${showZoom ? 'opacity-0' : 'opacity-100'}`}
      />
      {showZoom && (
        <div 
          className="absolute inset-0 bg-no-repeat transition-transform duration-200"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: '250%' 
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;