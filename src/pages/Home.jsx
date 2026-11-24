import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useI18n } from '../i18n.jsx';
import { Magnetic, ProductCard } from '../ui.jsx';
import { branches, CITIES, cityCount, featured, IMG } from '../data.js';

const TICKS = Array.from({ length: 101 }, (_, i) => i);
const ang = (v) => (135 + (v / 100) * 270) * (Math.PI / 180);
const CIRC = 2 * Math.PI * 236;
const CITY_IMG = { Jeddah: 'jeddah-khaladiyah', Makkah: 'clock-tower', Madinah: 'madinah-sign', Dammam: 'dammam-92', Riyadh: 'riyadh-imam' };

function Dial({ temp }) {
  return (
    <svg className="dial" viewBox="0 0 600 600" aria-hidden="true">
      <circle cx="300" cy="300" r="286" className="dial-bg" />
      <g className="ticks">
        {TICKS.map((v) => {
          const a = ang(v); const major = v % 10 === 0; const r1 = major ? 252 : 262; const r2 = 276;
          return <line key={v} data-v={v} x1={300 + Math.cos(a) * r1} y1={300 + Math.sin(a) * r1} x2={300 + Math.cos(a) * r2} y2={300 + Math.sin(a) * r2} />;
        })}
      </g>
      {[0, 20, 40, 60, 80, 100].map((v) => { const a = ang(v); return <text key={v} x={300 + Math.cos(a) * 222} y={300 + Math.sin(a) * 222 + 5} textAnchor="middle" className="dial-n">{v}</text>; })}
      <circle cx="300" cy="300" r="236" className="dial-track" strokeDasharray={`${CIRC * 0.75} ${CIRC}`} transform="rotate(135 300 300)" />
      <circle ref={temp} cx="300" cy="300" r="236" className="dial-arc" strokeDasharray={`${CIRC * 0.75} ${CIRC}`} strokeDashoffset={CIRC * 0.75} transform="rotate(135 300 300)" />
    </svg>
  );
}

export default function Home() {
  const { t, num } = useI18n();
  const nav = useNavigate();
  const root = useRef(null); const arc = useRef(null);
  const [cat, setCat] = useState('all');
  const [hover, setHover] = useState(null);
  const shown = useMemo(() => featured.filter((p) => cat === 'all' || (cat === 'single' ? /single/i.test(p.sub) : p.sub.toLowerCase().includes('espresso'))), [cat]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root_ = root.current;
      const setTemp = (v, arcEl, readout, ticks) => {
        arcEl.style.strokeDashoffset = CIRC * 0.75 * (1 - v / 100);
        if (readout) readout.forEach((r) => (r.textContent = Math.round(v)));
        ticks.forEach((tk) => tk.classList.toggle('on', +tk.dataset.v <= v));
      };
      /* ---------- hero: dial heats up to 92 ---------- */
      const ticks = [...root_.querySelectorAll('.hero .ticks line')];
      const heroRead = [...root_.querySelectorAll('.hero [data-temp]')];
      const o = { v: 18 };
      gsap.to(o, { v: 92, duration: 3.2, ease: 'power3.out', delay: 0.4, onUpdate: () => setTemp(o.v, arc.current, heroRead, ticks) });
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.hero .w', { yPercent: 118, duration: 1.2, stagger: 0.09 })
        .from('.hero .fade', { opacity: 0, y: 26, duration: 0.9, stagger: 0.1 }, '-=0.7')
        .from('.hero .bag', { yPercent: 18, opacity: 0, scale: 0.92, duration: 1.4, stagger: 0.12 }, 0.2)
        .from('.hero .dial', { scale: 0.86, opacity: 0, rotate: -40, duration: 1.8 }, 0)
        .from('.hero .pill', { scale: 0, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(2.2)' }, 1);
      gsap.utils.toArray('.steam i').forEach((el, i) => gsap.fromTo(el, { yPercent: 0, opacity: 0, scale: 0.6 }, { yPercent: -160, opacity: 0.5, scale: 1.5, duration: 4 + i * 0.6, repeat: -1, ease: 'sine.out', delay: i * 0.7 }));
      const hero = root_.querySelector('.hero');
      const mv = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5; const ny = e.clientY / window.innerHeight - 0.5;
        gsap.to('.bag.b1', { x: nx * -30, y: ny * -14, duration: 1.2, ease: 'power3.out' }); gsap.to('.bag.b2', { x: nx * 36, y: ny * -10, duration: 1.4, ease: 'power3.out' });
        gsap.to('.bag.b3', { x: nx * -50, y: ny * -18, duration: 1.6, ease: 'power3.out' }); gsap.to('.hero .dial', { x: nx * 18, y: ny * 12, duration: 1.8, ease: 'power3.out' });
      };
      hero.addEventListener('mousemove', mv);
      gsap.to('.hero .stage', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero .copy', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.mq-track', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });

      /* ---------- pinned story: temperature scrubs 20 -> 92 while three beats cross-fade ---------- */
      const sticks = [...root_.querySelectorAll('.story .ticks line')];
      const sread = [...root_.querySelectorAll('.story [data-temp]')];
      const sarc = root_.querySelector('.story .dial-arc');
      const so = { v: 20 }; setTemp(20, sarc, sread, sticks);
      const panels = gsap.utils.toArray('.beat');
      gsap.set(panels, { autoAlpha: 0 }); gsap.set(panels[0], { autoAlpha: 1 });
      const st = gsap.timeline({ scrollTrigger: { trigger: '.story', start: 'top top', end: '+=330%', pin: true, scrub: 0.7, anticipatePin: 1 } });
      st.to(so, { v: 92, duration: 3, ease: 'none', onUpdate: () => setTemp(so.v, sarc, sread, sticks) }, 0)
        .fromTo('.story-dial', { rotate: -20, scale: 0.9 }, { rotate: 20, scale: 1.05, duration: 3, ease: 'none' }, 0)
        .fromTo('.story-bar i', { scaleX: 0 }, { scaleX: 1, duration: 3, ease: 'none' }, 0);
      panels.forEach((p, i) => {
        if (i > 0) st.fromTo(p, { autoAlpha: 0, yPercent: 10 }, { autoAlpha: 1, yPercent: 0, duration: 0.4 }, i);
        if (i < panels.length - 1) st.to(p, { autoAlpha: 0, yPercent: -10, duration: 0.3 }, i + 0.7);
        st.fromTo(p.querySelector('.beat-img'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power2.out' }, i === 0 ? 0 : i - 0.05);
      });

      /* ---------- stats count up ---------- */
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const end = +el.dataset.count; const c = { n: 0 };
        gsap.to(c, { n: end, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(c.n); } });
      });
      gsap.from('.cta-92', { yPercent: 30, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '.cta', start: 'top 80%' } });
      return () => hero.removeEventListener('mousemove', mv);
    }, root);
    return () => ctx.revert();
  }, []);

  /* cafés: image follows the cursor */
  const peek = useRef(null);
  useEffect(() => {
    const el = peek.current; if (!el || window.matchMedia('(pointer: coarse)').matches) return undefined;
    const xt = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }); const yt = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const mv = (e) => { xt(e.clientX); yt(e.clientY); };
    window.addEventListener('mousemove', mv); return () => window.removeEventListener('mousemove', mv);
  }, []);

  const beats = [
    { k: 's1', img: 'cherries' }, { k: 's2', img: 'bags-red' }, { k: 's3', img: 'latte-art' }
  ];
  const mq = ['100% specialty-grade Arabica', 'Q-Grader approved', 'Cup of Excellence beans', 'SCA-trained team', 'Roasted in Saudi Arabia', 'Brewed at 92°'];

  return (
    <main className="page home" ref={root}>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="copy">
          <p className="eyebrow fade">{t('hero_eyebrow')}</p>
          <h1>
            <span className="mask"><span className="w">{t('hero_a')}</span></span>{' '}
            <span className="mask"><em className="w">{t('hero_b')}</em></span>
            <span className="mask big"><span className="w blue">{t('hero_c')}</span></span>
          </h1>
          <p className="sub fade">{t('hero_sub')}</p>
          <div className="ctas fade">
            <Magnetic><Link to="/shop" className="btn">{t('cta_shop')}</Link></Magnetic>
            <Magnetic><Link to="/cafes" className="btn ghost">{t('cta_cafes')}</Link></Magnetic>
          </div>
        </div>

        <div className="stage">
          <div className="steam" aria-hidden="true"><i /><i /><i /><i /></div>
          <Dial temp={arc} />
          <div className="readout fade"><small>{t('water')}</small><b><span data-temp>18</span>°C</b></div>
          <img className="bag b2" src="img/p/83.webp" alt="Jaguar, Colombia, Brew92 coffee bag" />
          <img className="bag b3" src="img/p/90.webp" alt="Ethiopia Sidama Bura, Brew92 coffee bag" />
          <img className="bag b1" src="img/p/12.webp" alt="Cheetah, Ethiopia, Brew92 coffee bag" />
          <span className="pill p1">{t('pill1')}</span><span className="pill p2">{t('pill2')}</span><span className="pill p3">{t('pill3')}</span>
        </div>

        <div className="mq" aria-hidden="true"><div className="mq-track">{[...mq, ...mq, ...mq, ...mq].map((m, i) => <span key={i}>{m}<i>✦</i></span>)}</div></div>
      </section>

      {/* ================= PINNED STORY ================= */}
      <section className="story">
        <div className="story-in">
          <div className="story-l">
            <p className="eyebrow light">{t('story_k')}</p>
            <div className="story-num"><span data-temp>20</span><sup>°C</sup></div>
            <p className="light-sub">{t('water')}</p>
            <div className="story-bar"><i /></div>
          </div>
          <div className="story-dial"><Dial temp={{ current: null }} /></div>
          <div className="story-r">
            {beats.map((b, i) => (
              <article className="beat" key={b.k}>
                <div className="beat-img"><img src={IMG(b.img)} alt="" /></div>
                <div className="beat-txt"><span className="beat-n">0{i + 1}</span><h2>{t(`${b.k}_t`)}</h2><p>{t(`${b.k}_d`)}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SHOP ================= */}
      <section className="shop-sec wrap">
        <div className="sec-head" data-reveal>
          <div><p className="eyebrow">{t('shop_k')}</p><h2 className="h2">{t('shop_h')}</h2></div>
          <div className="pills">
            {[['all', t('all')], ['esp', 'Espresso'], ['single', 'Single origin']].map(([k, l]) => <button key={k} className={cat === k ? 'on' : ''} onClick={() => setCat(k)}>{l}</button>)}
          </div>
        </div>
        <Track items={shown} t={t} />
        <div className="center" data-reveal><Magnetic><Link to="/shop" className="btn ghost">{t('see_all')}</Link></Magnetic></div>
      </section>

      {/* ================= CAFES ================= */}
      <section className="cafes">
        <div className="wrap">
          <div className="sec-head light" data-reveal><div><p className="eyebrow light">{t('cafes_k')}</p><h2 className="h2">{t('cafes_h')}</h2></div><p className="lead">{t('cafes_sub')}</p></div>
          <ul className="citylist" onMouseLeave={() => setHover(null)}>
            {CITIES.map((c) => (
              <li key={c} data-reveal onMouseEnter={() => setHover(c)}>
                <button onClick={() => nav(`/cafes?city=${c}`)}><span className="cn">{c}</span><span className="cc">{num(cityCount(c))} {cityCount(c) === 1 ? t('location') : t('locations')}</span><span className="arrow">→</span></button>
              </li>
            ))}
          </ul>
          <div className="center" data-reveal><Magnetic><Link to="/cafes" className="btn white">{t('view_cafes')}</Link></Magnetic></div>
        </div>
        <div className={`peek ${hover ? 'on' : ''}`} ref={peek} aria-hidden="true">{hover && <img src={IMG(CITY_IMG[hover])} alt="" />}</div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats wrap">
        {[[2016, t('st_year')], [branches.length, t('st_loc')], [100, t('st_arabica'), '%'], [92, t('st_temp'), '°C']].map(([n, l, u], i) => (
          <div key={i} data-reveal><b><span data-count={n}>0</span>{u || ''}</b><small>{l}</small></div>
        ))}
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <div className="cta-92" aria-hidden="true">92°</div>
        <div className="wrap cta-in">
          <p className="eyebrow light" data-reveal>{t('cta_k')}</p>
          <h2 className="h2 light" data-reveal>{t('cta_h')}</h2>
          <p className="lead light" data-reveal>{t('cta_p')}</p>
          <div data-reveal><Magnetic><a className="btn white" href="https://wholesale.brew92.com/" target="_blank" rel="noreferrer">{t('cta_b')}</a></Magnetic></div>
        </div>
      </section>
    </main>
  );
}

function Track({ items, t }) {
  const ref = useRef(null); const drag = useRef({ on: false, x: 0, s: 0, moved: 0 });
  const down = (e) => { drag.current = { on: true, x: e.clientX, s: ref.current.scrollLeft, moved: 0 }; ref.current.classList.add('drag'); };
  const move = (e) => { const d = drag.current; if (!d.on) return; d.moved = Math.abs(e.clientX - d.x); ref.current.scrollLeft = d.s - (e.clientX - d.x); };
  const up = () => { drag.current.on = false; ref.current?.classList.remove('drag'); };
  return (
    <div className="track" ref={ref} data-cursor={t('drag')} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
      onClickCapture={(e) => { if (drag.current.moved > 6) { e.preventDefault(); e.stopPropagation(); } }}>
      {items.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
