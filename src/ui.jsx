import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useI18n } from './i18n.jsx';
import { useCart } from './cart.jsx';
import { money } from './data.js';

gsap.registerPlugin(ScrollTrigger);

export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return undefined;
    const xt = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }); const yt = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const mv = (e) => { const r = el.getBoundingClientRect(); xt((e.clientX - (r.left + r.width / 2)) * strength); yt((e.clientY - (r.top + r.height / 2)) * strength * 1.2); };
    const lv = () => { xt(0); yt(0); };
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', lv);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv); };
  }, [strength]);
  return <span className="mag" ref={ref}>{children}</span>;
}

/* Lenis smooth scroll wired to ScrollTrigger, route transition, [data-reveal] fade-ups and a cursor follower */
export function Motion({ children }) {
  const { pathname } = useLocation();
  const lenis = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const l = new Lenis({ lerp: 0.09 }); lenis.current = l;
    l.on('scroll', ScrollTrigger.update);
    const tick = (t) => l.raf(t * 1000); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); l.destroy(); };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    const d = dot.current; const xt = gsap.quickTo(d, 'x', { duration: 0.25, ease: 'power3' }); const yt = gsap.quickTo(d, 'y', { duration: 0.25, ease: 'power3' });
    const mv = (e) => { xt(e.clientX); yt(e.clientY); const c = e.target.closest?.('[data-cursor]'); d.dataset.label = c ? c.dataset.cursor : ''; d.classList.toggle('big', !!c); d.classList.toggle('link', !c && !!e.target.closest?.('a,button')); };
    window.addEventListener('mousemove', mv); return () => window.removeEventListener('mousemove', mv);
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true }); window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // clearProps matters: a leftover transform on .page would break position:fixed (the pinned story)
      gsap.fromTo('.page', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity', onComplete: () => ScrollTrigger.refresh() });
      gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: (i % 3) * 0.06, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
    });
    const r = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { ctx.revert(); clearTimeout(r); };
  }, [pathname]);

  return (<>{children}<div className="cursor" ref={dot} aria-hidden="true" /></>);
}

export function Header() {
  const { t, toggle, isAr, num } = useI18n();
  const { count, setOpen } = useCart();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const loc = useLocation();
  useEffect(() => { const f = () => setSolid(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => setMenu(false), [loc.pathname]);
  const links = [['/shop', t('nav_shop')], ['/cafes', t('nav_cafes')], ['/story', t('nav_story')]];
  return (
    <header className={`hdr ${solid ? 'solid' : ''} ${menu ? 'menu-open' : ''}`}>
      <nav className="nav">{links.map(([to, l]) => <NavLink key={to} to={to}>{l}</NavLink>)}<a href="https://wholesale.brew92.com/" target="_blank" rel="noreferrer">{t('nav_wholesale')}</a></nav>
      <Link to="/" className="wordmark" aria-label="Brew92 home">BREW92<sup>°</sup></Link>
      <div className="hdr-r">
        <button className="pillbtn" onClick={toggle} aria-label="Switch language">{t('lang')}</button>
        <button className="pillbtn cartbtn" onClick={() => setOpen(true)} aria-label={t('cart')}>{t('cart')} <b>{num(count)}</b></button>
        <button className="burger" onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}><i /><i /></button>
      </div>
      <div className="mnav" aria-hidden={!menu}>
        {links.map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}
        <a href="https://wholesale.brew92.com/" target="_blank" rel="noreferrer">{t('nav_wholesale')}</a>
      </div>
      {isAr && null}
    </header>
  );
}

export function CartDrawer() {
  const { t, num } = useI18n();
  const { open, setOpen, lines, setQty, total, toast } = useCart();
  const [msg, setMsg] = useState(false);
  return (
    <>
      <div className={`toast ${toast ? 'on' : ''}`} role="status">✓ {t('added')}</div>
      <div className={`drawer-wrap ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="scrim" onClick={() => setOpen(false)} />
        <aside className="drawer" role="dialog" aria-label={t('cart')}>
          <header><h2>{t('cart')}</h2><button onClick={() => setOpen(false)} aria-label="Close">✕</button></header>
          <div className="lines">
            {lines.length === 0 && <p className="empty">{t('cart_empty')}</p>}
            {lines.map((l) => (
              <div className="line" key={l.id}>
                <img src={l.p.img} alt="" />
                <div><b>{l.p.name}</b><small>{l.p.size} · SAR {money(l.p.final)}</small>
                  <span className="qty"><button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Less">−</button>{num(l.qty)}<button onClick={() => setQty(l.id, l.qty + 1)} aria-label="More">+</button></span>
                </div>
                <strong>SAR {money(Math.round(l.qty * l.p.final * 100) / 100)}</strong>
              </div>
            ))}
          </div>
          {lines.length > 0 && (
            <footer>
              <p className="sub"><span>{t('subtotal')}</span><b>SAR {money(Math.round(total * 100) / 100)}</b></p>
              <small>{t('vat')}</small>
              <button className="btn" onClick={() => setMsg(true)}>{t('checkout')}</button>
              {msg && <p className="note">{t('checkout_msg')}</p>}
            </footer>
          )}
        </aside>
      </div>
    </>
  );
}

export function Footer() {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  return (
    <footer className="ftr">
      <div className="ftr-big" aria-hidden="true">BREW92°</div>
      <div className="ftr-in">
        <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="news">
          <label htmlFor="em">{t('f_news')}</label>
          {done ? <p>{t('f_thanks')}</p> : <span><input id="em" type="email" required placeholder={t('f_email')} /><button className="btn sm">{t('f_join')}</button></span>}
        </form>
        <nav>
          <Link to="/story">{t('f_about')}</Link><Link to="/shop">{t('f_shop')}</Link><Link to="/cafes">{t('f_cafes')}</Link>
          <a href="https://www.brew92.com/privacy-policy" target="_blank" rel="noreferrer">{t('f_privacy')}</a>
          <a href="https://www.brew92.com/terms-and-conditions" target="_blank" rel="noreferrer">{t('f_terms')}</a>
        </nav>
        <nav className="soc"><a href="https://www.instagram.com/brew92cafe/" target="_blank" rel="noreferrer">Instagram</a><a href="https://twitter.com/brew92cafe" target="_blank" rel="noreferrer">X</a><a href="https://www.facebook.com/Brew92cafe/" target="_blank" rel="noreferrer">Facebook</a></nav>
        <p className="fine">© 2016 BREW92° Specialty café &amp; roastery · {t('f_note')}</p>
      </div>
    </footer>
  );
}

export function ProductCard({ p }) {
  const { t, num } = useI18n();
  const { add } = useCart();
  return (
    <article className="pc">
      <Link to={`/product/${p.id}`} className="pc-img" data-cursor="View"><img src={p.img} alt={p.name} loading="lazy" />{p.tag && <span className="pc-tag">{p.tag}</span>}</Link>
      <div className="pc-body">
        <Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link>
        <p className="pc-meta">{[p.origin, p.process, p.size].filter(Boolean).join(' · ')}</p>
        <div className="pc-row"><strong>SAR {num(money(p.final))}</strong><button className="addbtn" onClick={() => add(p.id)} aria-label={`${t('add')}: ${p.name}`}>+</button></div>
      </div>
    </article>
  );
}
