/**
 * ZAPHIRA — Customizer Options & Pricing Configuration
 * name/description are localized { en, fr, ar }; read them with loc() from utils/i18n.js.
 */

export const CUSTOMIZER_CONFIG = {
  basePriceDZD: 18500,
  basePriceEUR: 125,
  basePriceUSD: 135,

  colors: [
    {
      id: 'ivory',
      name: { en: 'Warm Ivory', fr: 'Ivoire Chaud', ar: 'عاجي دافئ' },
      hex: '#F7F2E8',
      previewFilter: 'none',
      tintColor: 'transparent',
      priceModifierDZD: 0,
      imageRef: 'assets/images/products/product-pearl-ivory.jpg'
    },
    {
      id: 'noir',
      name: { en: 'Noir Prestige', fr: 'Noir Prestige', ar: 'أسود فاخر' },
      hex: '#191817',
      previewFilter: 'brightness(0.2) contrast(1.2)',
      tintColor: 'rgba(25, 24, 23, 0.75)',
      priceModifierDZD: 1300,
      imageRef: 'assets/images/products/product-noir-prestige.jpg'
    },
    {
      id: 'blush',
      name: { en: 'Dusty Rose', fr: 'Vieux Rose', ar: 'وردي غباري' },
      hex: '#B88D8D',
      previewFilter: 'sepia(0.3) hue-rotate(310deg) saturate(1.2)',
      tintColor: 'rgba(184, 141, 141, 0.4)',
      priceModifierDZD: 0,
      imageRef: 'assets/images/products/product-blush-organza.jpg'
    },
    {
      id: 'taupe',
      name: { en: 'Warm Taupe', fr: 'Taupe Chaud', ar: 'رمادي بني دافئ' },
      hex: '#756B61',
      previewFilter: 'sepia(0.3) saturate(0.8) brightness(0.6)',
      tintColor: 'rgba(117, 107, 97, 0.55)',
      priceModifierDZD: 2500,
      imageRef: 'assets/images/products/product-taupe-elegance.jpg'
    },
    {
      id: 'champagne',
      name: { en: 'Champagne Glow', fr: 'Éclat Champagne', ar: 'توهج شمباني' },
      hex: '#D6B98C',
      previewFilter: 'sepia(0.4) saturate(1.3) brightness(0.95)',
      tintColor: 'rgba(214, 185, 140, 0.45)',
      priceModifierDZD: 1800,
      imageRef: 'assets/images/products/hero-bag.jpg'
    }
  ],

  materials: [
    {
      id: 'organza',
      name: { en: 'Sheer Silk Organza', fr: 'Organza de Soie Transparent', ar: 'أورجانزا حريرية شفافة' },
      description: { en: 'Airy, ethereal hand-pleated side cascades', fr: 'Cascades latérales aériennes plissées à la main', ar: 'شلالات جانبية خفيفة مطوية يدوياً' },
      priceModifierDZD: 0
    },
    {
      id: 'satin',
      name: { en: 'Italian Silk Satin', fr: 'Satin de Soie Italien', ar: 'ساتان حريري إيطالي' },
      description: { en: 'Lustrous, ultra-smooth formal finish', fr: 'Fini habillé lustré et ultra-lisse', ar: 'لمسة نهائية رسمية لامعة وناعمة للغاية' },
      priceModifierDZD: 1500
    },
    {
      id: 'velvet',
      name: { en: 'Crushed Royal Velvet', fr: 'Velours Royal Froissé', ar: 'مخمل ملكي مجعّد' },
      description: { en: 'Rich, tactile depth and warmth', fr: 'Profondeur et chaleur riches au toucher', ar: 'عمق ودفء غنيّان بالملمس' },
      priceModifierDZD: 2200
    },
    {
      id: 'leather',
      name: { en: 'Fine Grain Leather', fr: 'Cuir Grainé Fin', ar: 'جلد ناعم الحبيبات' },
      description: { en: 'Structured, durable Mediterranean calfskin', fr: 'Cuir de veau méditerranéen structuré et durable', ar: 'جلد عجل متوسطي منظَّم ومتين' },
      priceModifierDZD: 3000
    }
  ],

  pearls: [
    {
      id: 'small',
      name: { en: 'Small Seed Pearls', fr: 'Petites Perles Semences', ar: 'لآلئ صغيرة دقيقة' },
      description: { en: 'Delicate 4mm lustrous micro-pearls', fr: 'Délicates micro-perles lustrées de 4 mm', ar: 'لآلئ دقيقة لامعة بقطر 4 مم' },
      priceModifierDZD: 0
    },
    {
      id: 'medium',
      name: { en: 'Medium Luster Pearls', fr: 'Perles Lustrées Moyennes', ar: 'لآلئ لامعة متوسطة' },
      description: { en: 'Classic 8mm graduated spherical pearls', fr: 'Perles rondes graduées classiques de 8 mm', ar: 'لآلئ كروية متدرجة كلاسيكية بقطر 8 مم' },
      priceModifierDZD: 800
    },
    {
      id: 'baroque',
      name: { en: 'Natural Baroque Pearls', fr: 'Perles Baroques Naturelles', ar: 'لآلئ باروكية طبيعية' },
      description: { en: 'Organic, irregular high-sheen freshwater pearls', fr: 'Perles d’eau douce organiques, irrégulières et très brillantes', ar: 'لآلئ مياه عذبة طبيعية غير منتظمة شديدة اللمعان' },
      priceModifierDZD: 2000
    },
    {
      id: 'mixed',
      name: { en: 'Mixed Pearl & Gold Beads', fr: 'Perles & Billes d’Or Mêlées', ar: 'مزيج من اللؤلؤ والخرز الذهبي' },
      description: { en: 'Alternating pearls and 18k gold beads', fr: 'Alternance de perles et de billes d’or 18 carats', ar: 'تناوب بين اللؤلؤ وخرز الذهب عيار 18' },
      priceModifierDZD: 2500
    }
  ],

  chains: [
    {
      id: 'gold',
      name: { en: 'Champagne Gold Link', fr: 'Maille Or Champagne', ar: 'سلسلة ذهبية شمبانية' },
      description: { en: '18k gold-plated delicate woven link chain', fr: 'Délicate chaîne tressée plaquée or 18 carats', ar: 'سلسلة رقيقة منسوجة مطلية بذهب عيار 18' },
      priceModifierDZD: 0
    },
    {
      id: 'silver',
      name: { en: 'Sterling Silver Link', fr: 'Maille Argent Sterling', ar: 'سلسلة فضة استرلينية' },
      description: { en: 'Polished rhodium-plated silver chain', fr: 'Chaîne en argent poli plaqué rhodium', ar: 'سلسلة فضية مصقولة مطلية بالروديوم' },
      priceModifierDZD: 0
    },
    {
      id: 'pearl-strand',
      name: { en: 'Pearl Beaded Strap', fr: 'Bandoulière en Perles', ar: 'حزام من خرز اللؤلؤ' },
      description: { en: 'Full crossbody strand of natural pearls', fr: 'Bandoulière complète de perles naturelles', ar: 'حزام كتف كامل من اللؤلؤ الطبيعي' },
      priceModifierDZD: 3500
    },
    {
      id: 'rose-gold',
      name: { en: 'Rose Gold Chain', fr: 'Chaîne Or Rose', ar: 'سلسلة ذهب وردي' },
      description: { en: 'Warm pink-gold delicate link chain', fr: 'Délicate chaîne en or rose chaud', ar: 'سلسلة رقيقة بلون الذهب الوردي الدافئ' },
      priceModifierDZD: 500
    }
  ],

  monogramCostDZD: 1500
};
