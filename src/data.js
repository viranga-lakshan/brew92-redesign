import PRODUCTS from './products.json';

// Real data taken from brew92.com (products API + locations page). Prices on the live site are shown with 15% VAT.
export const VAT = 1.15;
export const price = (p) => Math.round(p.price * VAT * 100) / 100;
export const money = (n) => (Number.isInteger(n) ? n : n.toFixed(2));

const ORIGINS = ['Costa Rica', 'El Salvador', 'Ethiopia', 'Colombia', 'Guatemala', 'Nicaragua', 'Honduras', 'Mexico', 'Peru', 'Rwanda'];
export const products = PRODUCTS.map((p) => {
  const origin = ORIGINS.find((o) => p.name.startsWith(o)) || (p.id === 12 ? 'Ethiopia' : p.id === 83 ? 'Colombia' : '');
  const tag = /elite/i.test(p.sub) ? 'Elite single origin' : /single/i.test(p.sub) ? 'Single origin' : /espresso/i.test(p.sub) ? 'Espresso house' : '';
  const process = /honey/i.test(p.name) ? 'Honey' : /natural/i.test(p.name) ? 'Natural' : '';
  return { ...p, name: p.name.replace(/\s+/g, ' ').replace(/\.$/, '').trim(), sub: p.sub.trim(), origin, tag, process, final: price(p), img: `img/p/${p.id}.webp` };
});
export const byId = (id) => products.find((p) => p.id === +id);
export const CATS = ['Coffee Beans', 'Coffee Tools', 'Merch'];
export const featured = [12, 83, 90, 14, 108, 163, 198, 210, 223, 184].map(byId).filter(Boolean);

const H = {
  std: 'Sat–Wed 6:00–00:00 · Thu 6:00–00:30 · Fri 8:00–00:30',
  late: 'Sun–Tue 6:00–00:00 · Wed, Thu, Sat 6:00–02:00 · Fri 8:00–02:00',
  micro: 'Sat–Thu 6:00–22:00 · Fri 8:00–22:00',
  daily: 'Daily 8:00–00:00', sheraa: 'Sun–Thu 6:00–00:00 · Sat 6:00–00:30', open24: 'Open 24 hours', haram: 'Daily 6:00–00:00'
};
// [id, city, name, area, hours, image]
const B = [
  ['khaladiyah', 'Jeddah', 'Al Khaladiyah', 'Prince Saud Al Faisal Street', H.std, 'jeddah-khaladiyah'],
  ['khayyat', 'Jeddah', 'Al Khayyat', 'Ar Rawdah · Prince Sultan Street', '', 'jeddah-bar-spiral'],
  ['malik', 'Jeddah', 'Al Malik', 'King Abdulaziz Branch Rd, Ash Shati', '', 'malik'],
  ['sari', 'Jeddah', 'Sari', 'Sari Road · King Abdulaziz Branch Rd', H.late, 'sari'],
  ['hamdaniyyah', 'Jeddah', 'Al Hamdaniyyah', 'Al Hamdaniyyah', '', 'drive-thru-sign'],
  ['microbar', 'Jeddah', 'Micro Bar', 'Al Khansa Road, Ash Shati', H.micro, 'microbar'],
  ['obhur', 'Jeddah', 'Obhur', 'Obhur Al-Shamaliyah', H.late, 'obhur-interior'],
  ['padel', 'Jeddah', 'Padel District', 'Al Mohammadiyya · Ibrahim Al-Anqari St', H.daily, 'padel-district'],
  ['sheraa', 'Jeddah', 'Obhur Al Shera’a', 'Obhur Al-Shamaliyah', H.sheraa, 'obhur-sheraa'],
  ['zahra', 'Jeddah', 'Al-Zahra Drive Thru', 'Prince Sultan Road', H.open24, 'drive-thru-night'],
  ['dammam-dep', 'Dammam', 'King Fahd Airport · Departures', 'International Departures', '', 'dammam-92'],
  ['dammam-arr', 'Dammam', 'King Fahd Airport · Arrivals', 'Airport Entrance', '', 'dammam-entrance'],
  ['zaidi', 'Makkah', 'Al Zaidi', 'Jeddah Express Highway · Al Hamra Umm Al Jud', '', 'zaidi'],
  ['clocktower', 'Makkah', 'Clock Tower', 'P3 floor, opposite Abraj Avenue', '', 'clock-tower'],
  ['makkah-company', 'Makkah', 'Makkah Company', 'Makkah Company tower, floor 1', '', 'makkah-company'],
  ['clocktower-2', 'Makkah', 'Clock Tower · Floor −2', 'The Clock Tower, ground floor −2', '', 'makkah-clocktower-cafe'],
  ['madinah', 'Madinah', 'Al Madinah', 'North central area of Al Haram · behind Dar Al Iman Hotel', H.haram, 'madinah-sign'],
  ['riyadh-imam', 'Riyadh', 'Al Imam', 'Usman bin Affan Street, Al Imam District', '', 'riyadh-imam']
];
export const branches = B.map(([id, city, name, area, hours, img]) => ({ id, city, name, area, hours, img: `img/s/${img}.webp` }));
export const CITIES = ['Jeddah', 'Makkah', 'Madinah', 'Dammam', 'Riyadh'];
export const cityCount = (c) => branches.filter((b) => b.city === c).length;
export const mapLink = (b) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Brew92 ${b.name} ${b.city} Saudi Arabia`)}`;
export const IMG = (n) => `img/s/${n}.webp`;
