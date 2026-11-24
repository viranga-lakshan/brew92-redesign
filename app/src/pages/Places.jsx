import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useI18n } from '../i18n.jsx';
import { branches, CITIES, cityCount, IMG, mapLink } from '../data.js';

export function Cafes() {
  const { t, num } = useI18n();
  const [sp, setSp] = useSearchParams();
  const city = sp.get('city') || 'All';
  const list = branches.filter((b) => city === 'All' || b.city === city);
  useEffect(() => { gsap.fromTo('.bcard', { y: 50, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.06, ease: 'power3.out' }); }, [city]);
  return (
    <main className="page wrap">
      <header className="page-head" data-reveal><div><h1 className="h1">{t('loc_title')}</h1><p className="lead">{t('loc_sub').replace('{n}', num(branches.length))}</p></div></header>
      <div className="pills" data-reveal>
        <button className={city === 'All' ? 'on' : ''} onClick={() => setSp({})}>{t('all')} · {num(branches.length)}</button>
        {CITIES.map((c) => <button key={c} className={city === c ? 'on' : ''} onClick={() => setSp({ city: c })}>{c} · {num(cityCount(c))}</button>)}
      </div>
      <div className="bgrid">
        {list.map((b) => (
          <article className="bcard" key={b.id}>
            <div className="bimg"><img src={b.img} alt={`Brew92 ${b.name}`} loading="lazy" /><span>{b.city}</span></div>
            <div className="bbody">
              <h3>{b.name}</h3><p>{b.area}</p>
              <p className="bh"><small>{t('hours')}</small>{b.hours || t('hours_ask')}</p>
              <a className="arrowlink" href={mapLink(b)} target="_blank" rel="noreferrer">{t('open_maps')} →</a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export function Story() {
  const { t } = useI18n();
  const [temp, setTemp] = useState(92);
  const note = temp < 90 ? t('t_under') : temp > 96 ? t('t_over') : temp === 92 ? t('t_92') : t('t_sweet');
  const mood = temp < 90 ? 'under' : temp > 96 ? 'over' : 'good';
  return (
    <main className="page story-page">
      <section className="wrap st-hero">
        <h1 className="h1 huge" data-reveal>{t('about_title')}</h1>
        <div className="st-cols"><p className="lead" data-reveal>{t('about_p1')}</p><p data-reveal>{t('about_p2')}</p></div>
      </section>
      <section className="st-img wrap" data-reveal><img src={IMG('flagship')} alt="" /><img src={IMG('sari')} alt="" /><img src={IMG('espresso-bw')} alt="" /></section>

      <section className="wrap st-blocks">
        <article data-reveal><h2>{t('why_h')}</h2><p>{t('why_p')}</p></article>
        <article data-reveal><h2>{t('our_h')}</h2><p>{t('our_p')}</p></article>
        <article data-reveal><h2>{t('mis_h')}</h2><p>{t('mis1')}</p><p>{t('mis2')}</p></article>
      </section>

      <section className="try">
        <div className="wrap">
          <p className="eyebrow light">{t('try_k')}</p>
          <h2 className="h2 light">{t('try_h')}</h2>
          <div className={`gauge ${mood}`}>
            <div className="readout-big"><b>{temp}</b><sup>°C</sup></div>
            <input type="range" min="80" max="100" value={temp} onChange={(e) => setTemp(+e.target.value)} aria-label="Water temperature" />
            <div className="zones"><span style={{ flex: 10 }}>80</span><span className="sweet" style={{ flex: 6 }}>90–96</span><span style={{ flex: 4 }}>100</span></div>
            <p className="verdict">{note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
