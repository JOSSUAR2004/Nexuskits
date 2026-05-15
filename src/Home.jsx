import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { ProductCard } from './components/ProductCard'



export function Home() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState(['Todos'])
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function obtenerDatos() {
      setCargando(true)
      const { data, error } = await supabase.from('productos').select('*')
      
      if (!error && data) {
        setProductos(data)
        // Extrae categorías únicas de tu base de datos automáticamente
        const unicas = [...new Set(data.map(p => p.categoria))].filter(Boolean)
        setCategorias(['Todos', ...unicas])
      }
      setCargando(false)
    }
    obtenerDatos()
  }, [])

  const filtrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  return (
    <div className="bg-[#050505] min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Menú de Categorías Dinámico */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 mt-8">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                categoriaActiva === cat 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                  : 'bg-transparent border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grilla de Catálogo */}
        {cargando ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtrados.map(p => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}

        {!cargando && filtrados.length === 0 && (
          <div className="text-center py-20 opacity-20 uppercase font-black tracking-widest text-xs">
            No hay productos en esta categoría
          </div>
        )}
      </div>
    </div>
  )
}