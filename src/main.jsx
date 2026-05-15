import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider, useCart } from './context/CartContext'
import App from './App'
import ProductDetail from './components/ProductDetail';
import { Terms } from './Terms' 
import { CartDrawer } from './components/CartDrawer'
import './index.css'

function Layout({ children }) {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  return (
    <>
      {children}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onRemove={removeFromCart} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/terminos" element={<Terms />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
)