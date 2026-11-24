import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { I18nProvider } from './i18n.jsx';
import { CartProvider } from './cart.jsx';
import { CartDrawer, Footer, Header, Motion } from './ui.jsx';
import Home from './pages/Home.jsx';
import { Product, Shop } from './pages/Shop.jsx';
import { Cafes, Story } from './pages/Places.jsx';
import './styles.css';

/* Safety net: if any page ever throws, show a recovery screen instead of a blank page.
   It resets itself when the route changes. */
class Guard extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.error('Brew92 page error:', e); }
  componentDidUpdate(prev) { if (prev.path !== this.props.path && this.state.failed) this.setState({ failed: false }); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="page narrow" style={{ textAlign: 'center' }}>
        <h1 className="h1">Something slipped</h1>
        <p className="lead" style={{ margin: '14px auto 24px' }}>This page hit a problem. Reloading usually fixes it.</p>
        <button className="btn" onClick={() => window.location.reload()}>Reload the page</button>
      </main>
    );
  }
}

function Shell() {
  const { pathname } = useLocation();
  return (
    <Motion>
      <Header />
      <Guard path={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cafes" element={<Cafes />} />
          <Route path="/story" element={<Story />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Guard>
      <Footer />
      <CartDrawer />
    </Motion>
  );
}

createRoot(document.getElementById('root')).render(
  <I18nProvider>
    <CartProvider>
      <HashRouter><Shell /></HashRouter>
    </CartProvider>
  </I18nProvider>
);
