import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './i18n.jsx';
import { CartProvider } from './cart.jsx';
import { CartDrawer, Footer, Header, Motion } from './ui.jsx';
import Home from './pages/Home.jsx';
import { Product, Shop } from './pages/Shop.jsx';
import { Cafes, Story } from './pages/Places.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <I18nProvider>
    <CartProvider>
      <HashRouter>
        <Motion>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cafes" element={<Cafes />} />
            <Route path="/story" element={<Story />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
          <CartDrawer />
        </Motion>
      </HashRouter>
    </CartProvider>
  </I18nProvider>
);
