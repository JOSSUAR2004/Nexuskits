import React, { useState } from 'react';

const ImageZoom = ({ src }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      className="relative overflow-hidden cursor-zoom-in bg-zinc-900 rounded-sm w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
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