import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const D = {
  en: {
    nav_shop: 'Shop', nav_cafes: 'Cafés', nav_story: 'Our story', nav_wholesale: 'Wholesale', cart: 'Cart', lang: 'عربي',
    hero_eyebrow: 'Specialty café & roastery · KSA · Est. 2016', hero_a: 'Brewed at', hero_b: 'exactly', hero_c: '92°',
    hero_sub: 'Saudi Arabia’s specialty roastery. 100% specialty-grade Arabica, roasted fresh and brewed at the temperature where it tastes best.',
    cta_shop: 'Shop beans', cta_cafes: 'Find a café', pill1: 'Q-Grader approved', pill2: 'Roasted in KSA', pill3: 'SCA-trained baristas', water: 'Water temperature',
    story_k: 'The 92° method', s1_t: 'Selected', s1_d: 'Only 100% specialty-grade Arabica from farms, estates and cooperatives. Every green-bean sample is roasted and cupped by our Q-Grader before it earns a place on the shelf.',
    s2_t: 'Roasted', s2_d: 'Artistic roasters, trained to the SCA professional level, roast each lot with its season and origin in mind.', s3_t: 'Brewed at 92°', s3_d: 'Water between 90° and 96° extracts the flavour you paid for. The average is 92°, and that is where our journey began.',
    shop_k: 'Fresh from the roastery', shop_h: 'The shelf', all: 'All', see_all: 'See the full shop', add: 'Add to cart', added: 'Added', drag: 'Drag', from: 'From', vat: 'incl. 15% VAT',
    cafes_k: 'Find us', cafes_h: 'Cafés across the Kingdom', cafes_sub: 'From Jeddah’s seafront to the Clock Tower in Makkah and the Haram in Madinah.', locations: 'locations', location: 'location', view_cafes: 'View all cafés',
    st_year: 'Founded', st_loc: 'Locations', st_arabica: 'Specialty-grade Arabica', st_temp: 'Brew temperature',
    cta_k: 'For business', cta_h: 'Serve Brew92 at your place.', cta_p: 'We supply cafés, restaurants and grocery stores, and offer consultancy and training for our global partners.', cta_b: 'Wholesale enquiry',
    f_about: 'About us', f_shop: 'Shop online', f_cafes: 'Stores & menus', f_privacy: 'Privacy policy', f_terms: 'Terms & conditions', f_news: 'Stay updated', f_email: 'Your email', f_join: 'Join', f_thanks: 'Thank you, we will be in touch.',
    f_note: 'Redesign concept for Brew92 · all photography and product data belong to Brew92.',
    shop_title: 'Shop', beans: 'Coffee Beans', tools: 'Coffee Tools', merch: 'Merch', sort: 'Sort', sort_none: 'Featured', sort_lo: 'Price: low to high', sort_hi: 'Price: high to low', items: 'items',
    origin: 'Origin', grade: 'Grade', size: 'Size', process: 'Process', roast: 'Roasted', roast_v: 'In Saudi Arabia, fresh', tip_k: 'Brew tip', tip: 'Brew with water at 90–96°C. We recommend 92°C for balanced sweetness.', qty: 'Quantity',
    back_shop: '← Back to shop', you_like: 'You may also like', cart_empty: 'Your cart is empty.', subtotal: 'Subtotal', checkout: 'Checkout', checkout_msg: 'Checkout connects to your payment gateway in the full build.', continue: 'Keep shopping',
    loc_title: 'Cafés & menus', loc_sub: 'Find your 92° in {n} places across the Kingdom.', open_maps: 'Open in Maps', hours: 'Hours', hours_ask: 'Hours on request',
    about_title: 'Our story', about_p1: 'Brew92 is a KSA-based specialty café and roastery founded in 2016 by a team of talented coffee experts, artistic roasters and passionate baristas.',
    about_p2: 'We care about quality over quantity, so we trained our team to SCA professional level: barista, green beans, sensory and roasting. They keep learning at exhibitions, competitions and on coffee farms around the world.',
    why_h: 'Why Brew92?', why_p: 'Once the coffee is roasted, it must be brewed properly to extract the exact flavours, without under or over extraction. Water temperature is one of the main factors: between 90°C and 96°C, averaging 92°C. From here our journey began, and we started to brew our coffee at 92°.',
    our_h: 'Our coffee', our_p: 'We select only 100% specialty-grade Arabica from farms, estates and cooperatives. Mindful of each country’s seasonality, we roast green-bean samples and our Q-Grader evaluates aroma and taste. Some of our beans come from Cup of Excellence auctions, among the highest quality in the industry.',
    mis_h: 'Our mission', mis1: 'To be a leading coffee brand that helps advance the knowledge of the coffee community.', mis2: 'To serve our global business partners as a source of artisan coffee, with consultancy and training.',
    try_k: 'Try it', try_h: 'Find your temperature', t_under: 'Under-extracted · sour and thin', t_sweet: 'The sweet spot', t_92: 'Brew92 · balanced and sweet', t_over: 'Over-extracted · bitter and harsh'
  },
  ar: {
    nav_shop: 'المتجر', nav_cafes: 'الفروع', nav_story: 'قصتنا', nav_wholesale: 'الجملة', cart: 'السلة', lang: 'EN',
    hero_eyebrow: 'مقهى ومحمصة قهوة مختصة · السعودية · منذ ٢٠١٦', hero_a: 'نحضّرها على', hero_b: 'بالضبط', hero_c: '٩٢°',
    hero_sub: 'محمصة القهوة المختصة في المملكة. بن أرابيكا مختص ١٠٠٪، محمّص طازجاً ومحضّر على الحرارة التي يكون فيها طعمه الأفضل.',
    cta_shop: 'تسوّق البن', cta_cafes: 'اعثر على فرع', pill1: 'معتمد من Q-Grader', pill2: 'محمّص في السعودية', pill3: 'باريستا معتمدون من SCA', water: 'درجة حرارة الماء',
    story_k: 'طريقة ٩٢°', s1_t: 'الاختيار', s1_d: 'أرابيكا مختصة ١٠٠٪ من المزارع والتعاونيات. كل عينة بن أخضر تُحمّص ويقيّمها Q-Grader لدينا قبل أن تدخل رفوفنا.',
    s2_t: 'التحميص', s2_d: 'محمّصون فنانون مدرّبون على المستوى الاحترافي من SCA، يحمّصون كل دفعة بما يناسب موسمها وأصلها.', s3_t: 'التحضير على ٩٢°', s3_d: 'الماء بين ٩٠° و٩٦° يستخرج النكهة كما يجب. المتوسط ٩٢°، ومن هنا بدأت رحلتنا.',
    shop_k: 'طازج من المحمصة', shop_h: 'الرف', all: 'الكل', see_all: 'شاهد المتجر كاملاً', add: 'أضف إلى السلة', added: 'تمت الإضافة', drag: 'اسحب', from: 'من', vat: 'شامل ضريبة ١٥٪',
    cafes_k: 'تجدنا', cafes_h: 'فروع في أنحاء المملكة', cafes_sub: 'من كورنيش جدة إلى برج الساعة في مكة والحرم في المدينة.', locations: 'فرع', location: 'فرع', view_cafes: 'عرض كل الفروع',
    st_year: 'التأسيس', st_loc: 'فرع', st_arabica: 'أرابيكا مختصة', st_temp: 'حرارة التحضير',
    cta_k: 'للأعمال', cta_h: 'قدّم برو٩٢ في مكانك.', cta_p: 'نزوّد المقاهي والمطاعم والبقالات، ونقدّم الاستشارات والتدريب لشركائنا حول العالم.', cta_b: 'طلب الجملة',
    f_about: 'من نحن', f_shop: 'التسوق', f_cafes: 'الفروع والقوائم', f_privacy: 'سياسة الخصوصية', f_terms: 'الشروط والأحكام', f_news: 'ابقَ على اطلاع', f_email: 'بريدك الإلكتروني', f_join: 'اشترك', f_thanks: 'شكراً لك، سنتواصل معك.',
    f_note: 'تصميم مقترح لبرو٩٢ · جميع الصور وبيانات المنتجات ملك لبرو٩٢.',
    shop_title: 'المتجر', beans: 'حبوب القهوة', tools: 'أدوات القهوة', merch: 'منتجات العلامة', sort: 'ترتيب', sort_none: 'المميز', sort_lo: 'السعر: من الأقل', sort_hi: 'السعر: من الأعلى', items: 'منتج',
    origin: 'المنشأ', grade: 'الدرجة', size: 'الحجم', process: 'المعالجة', roast: 'التحميص', roast_v: 'في السعودية، طازج', tip_k: 'نصيحة التحضير', tip: 'حضّر بماء حرارته ٩٠–٩٦° م. ننصح بـ ٩٢° لحلاوة متوازنة.', qty: 'الكمية',
    back_shop: 'العودة إلى المتجر →', you_like: 'قد يعجبك أيضاً', cart_empty: 'سلتك فارغة.', subtotal: 'المجموع', checkout: 'إتمام الشراء', checkout_msg: 'سيتصل الدفع ببوابة الدفع الخاصة بكم في النسخة الكاملة.', continue: 'تابع التسوق',
    loc_title: 'الفروع والقوائم', loc_sub: 'اعثر على ٩٢° الخاصة بك في {n} فرعاً في أنحاء المملكة.', open_maps: 'افتح في الخرائط', hours: 'ساعات العمل', hours_ask: 'ساعات العمل عند الطلب',
    about_title: 'قصتنا', about_p1: 'برو٩٢ مقهى ومحمصة قهوة مختصة في المملكة، تأسست عام ٢٠١٦ على يد فريق من خبراء القهوة والمحمّصين الفنانين والباريستا الشغوفين.',
    about_p2: 'نهتم بالجودة قبل الكمية، لذا دربنا فريقنا على المستوى الاحترافي من SCA: الباريستا والبن الأخضر والتذوق والتحميص، ويواصلون التعلم في المعارض والمسابقات ومزارع القهوة حول العالم.',
    why_h: 'لماذا برو٩٢؟', why_p: 'بعد تحميص القهوة يجب تحضيرها بشكل صحيح لاستخراج النكهات المطلوبة دون نقص أو زيادة في الاستخلاص. ودرجة حرارة الماء من أهم العوامل: بين ٩٠° و٩٦° مئوية بمتوسط ٩٢°. من هنا بدأت رحلتنا وبدأنا نحضّر قهوتنا على ٩٢°.',
    our_h: 'قهوتنا', our_p: 'نختار فقط أرابيكا مختصة ١٠٠٪ من المزارع والتعاونيات. مع مراعاة موسم كل بلد نحمّص عينات البن الأخضر ويقيّم Q-Grader لدينا الرائحة والطعم. وبعض حبوبنا من مزادات كأس التميز، من أعلى الجودة في القطاع.',
    mis_h: 'رسالتنا', mis1: 'أن نكون علامة قهوة رائدة تُسهم في تطوير معرفة مجتمع القهوة.', mis2: 'أن نخدم شركاءنا حول العالم كمصدر للقهوة الحرفية مع الاستشارات والتدريب.',
    try_k: 'جرّب', try_h: 'اكتشف درجتك', t_under: 'استخلاص ناقص · حامض وخفيف', t_sweet: 'النقطة المثالية', t_92: 'برو٩٢ · متوازن وحلو', t_over: 'استخلاص زائد · مرّ وقاسٍ'
  }
};
const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);
export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('b92-lang') || 'en'; } catch { return 'en'; } });
  useEffect(() => {
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('b92-lang', lang); } catch { /* ignore */ }
  }, [lang]);
  const v = useMemo(() => ({ lang, isAr: lang === 'ar', t: (k) => D[lang][k] ?? D.en[k] ?? k, toggle: () => setLang((l) => (l === 'en' ? 'ar' : 'en')), num: (n) => (lang === 'ar' ? String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n)) }), [lang]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
