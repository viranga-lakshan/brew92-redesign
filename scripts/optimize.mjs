// Creates web-ready WebP files from the downloaded originals in /source (originals are NOT shipped).
import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const P = JSON.parse(fs.readFileSync('src/products.json', 'utf8'));
let n = 0;
fs.mkdirSync('public/img/p', { recursive: true }); fs.mkdirSync('public/img/s', { recursive: true });
for (const p of P) {
  const src = path.join('source/product-images', p.img);
  if (!fs.existsSync(src)) { console.log('missing product', p.img); continue; }
  await sharp(src).flatten({ background: '#ffffff' }).resize({ height: 1000, width: 800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/img/p/${p.id}.webp`); n++;
}
const S = {
  'assets__images__makkah_company.jpg': 'makkah-company', 'assets__images__makkah_lower_grand_floor.jpg': 'makkah-clocktower-cafe',
  'assets__images__jeddah_khala.png': 'jeddah-khaladiyah', 'assets__images__riyadh_al.png': 'riyadh-imam',
  'assets__images__jeddah_al.png': 'jeddah-bar-spiral', 'assets__images__padel_district.jpg': 'padel-district',
  'assets__images__WEBSITE_Dammam_Enterance.jpg': 'dammam-entrance', 'assets__images__WEBSITE_Al-sheraa.jpg': 'obhur-sheraa',
  'assets__images__WEBSITE_Dammam_copy.jpg': 'dammam-92', 'assets__images__riyadh_palazzo.png': 'barista-walk',
  'assets__images__brew92-obhour.jpeg': 'obhur-interior', 'assets__icons__coffee.jpg': 'bags-red', 'assets__images__microbar_jeddah.jpg': 'microbar',
  'assets__images__brew92-malik.jpg': 'malik', 'assets__images__Brew92_zaiydi_branch_(1)-min.jpg': 'zaidi',
  'assets__images__WEBSITE_drive-thru.jpg': 'drive-thru-night', 'assets__images__sari.jpg': 'sari', 'assets__icons__gear.jpg': 'col-chemex',
  'assets__images__al_madniah.jpg': 'madinah-sign', 'assets__images__makkahclocktower.jpg': 'clock-tower', 'assets__icons__subscription.jpg': 'latte-art',
  'assets__images__hamdhania.jpg': 'drive-thru-sign', 'public__img__bannerlogo1-1782031225281.jpeg': 'cherries', 'assets__images__homeImages__tools.jpg': 'espresso-bw',
  'assets__icons__flagship.jpg': 'flagship', 'assets__images__homeImages__combinations.jpg': 'bag-dark'
};
for (const [f, name] of Object.entries(S)) {
  const src = path.join('source/site-images', f);
  if (!fs.existsSync(src)) { console.log('missing', f); continue; }
  await sharp(src).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 76 }).toFile(`public/img/s/${name}.webp`); n++;
}
console.log('wrote', n, 'webp files');
