import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { useI18n } from '../i18n.jsx';
import { useCart } from '../cart.jsx';
import { Magnetic, ProductCard } from '../ui.jsx';
import { byId, CATS, money, products } from '../data.js';

export function Shop() {
  const { t, num } = useI18n();
  const [cat, setCat] = useState('All');
  const [sub, setSub] = useState('All');
  const [sort, setSort] = useState('none');
  const names = { 'Coffee Beans': t('beans'), 'Coffee Tools': t('tools'), Merch: t('merch') };
  const subs = useMemo(() => [...new Set(products.filter((p) => p.cat === cat).map((p) => p.sub))], [cat]);
  const list = useMemo(() => {
    let l = products.filter((p) => (cat === 'All' || p.cat === cat) && (sub === 'All' || p.sub === sub));
    if (sort === 'lo') l = [...l].sort((a, b) => a.final - b.final); if (sort === 'hi') l = [...l].sort((a, b) => b.final - a.final);
    return l;
  }, [cat, sub, sort]);
  useEffect(() => { gsap.fromTo('.grid .pc', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out' }); }, [cat, sub, sort]);

  return (
    <main className="page wrap">
      <header className="page-head" data-reveal><h1 className="h1">{t('shop_title')}</h1><p className="count">{num(list.length)} {t('items')}</p></header>
      <div className="toolbar" data-reveal>
        <div className="pills">
          {['All', ...CATS].map((c) => <button key={c} className={cat === c ? 'on' : ''} onClick={() => { setCat(c); setSub('All'); }}>{c === 'All' ? t('all') : names[c]}</button>)}
        </div>
        <label className="sortsel">{t('sort')}
          <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="none">{t('sort_none')}</option><option value="lo">{t('sort_lo')}</option><option value="hi">{t('sort_hi')}</option></select>
        </label>
      </div>
      {cat !== 'All' && subs.length > 1 && <div className="pills sub" data-reveal>{['All', ...subs].map((s) => <button key={s} className={sub === s ? 'on' : ''} onClick={() => setSub(s)}>{s === 'All' ? t('all') : s}</button>)}</div>}
      <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </main>
  );
}

export function Product() {
  const { id } = useParams();
  const { t, num } = useI18n();
  const { add, setOpen } = useCart();
  const p = byId(id);
  const [qty, setQty] = useState(1);
  useEffect(() => setQty(1), [id]);
  if (!p) return <main className="page narrow"><p className="empty"><Link to="/shop">{t('back_shop')}</Link></p></main>;
  const related = products.filter((x) => x.sub === p.sub && x.id !== p.id).slice(0, 4);
  const specs = [[t('origin'), p.origin], [t('grade'), p.tag], [t('process'), p.process], [t('size'), p.size], p.cat === 'Coffee Beans' ? [t('roast'), t('roast_v')] : null].filter((s) => s && s[1]);
  return (
    <main className="page wrap">
      <Link to="/shop" className="back" data-reveal>{t('back_shop')}</Link>
      <div className="pd">
        <div className="pd-img" data-reveal><img src={p.img} alt={p.name} /></div>
        <div className="pd-info" data-reveal>
          <p className="eyebrow">{p.cat} · {p.sub}</p>
          <h1 className="h1">{p.name}</h1>
          <p className="pd-price">SAR {num(money(p.final))} <small>{t('vat')}</small></p>
          <dl className="specs">{specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <div className="buy">
            <span className="qty big"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less">−</button>{num(qty)}<button onClick={() => setQty(qty + 1)} aria-label="More">+</button></span>
            <Magnetic><button className="btn" onClick={() => { add(p.id, qty); setOpen(true); }}>{t('add')} · SAR {num(money(Math.round(p.final * qty * 100) / 100))}</button></Magnetic>
          </div>
          {p.cat === 'Coffee Beans' && <aside className="tip"><b>92°</b><div><small>{t('tip_k')}</small><p>{t('tip')}</p></div></aside>}
        </div>
      </div>
      {related.length > 0 && <section data-reveal><h2 className="h2">{t('you_like')}</h2><div className="grid four">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>}
    </main>
  );
}
