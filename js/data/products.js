/**
 * ZAPHIRA — Product Catalog Data
 * Text fields are localized as { en, fr, ar } and read through loc() from utils/i18n.js.
 * Product names are proper names and stay untranslated.
 */

export const PRODUCTS = [
  {
    id: 'pearl-ivory',
    name: 'Pearl Ivory',
    collection: { en: 'Signature Couture', fr: 'Couture Signature', ar: 'تشكيلة التوقيع' },
    tag: { en: 'Bestseller', fr: 'Best-seller', ar: 'الأكثر مبيعاً' },
    badgeClass: 'badge-champagne',
    priceDZD: 18500,
    priceEUR: 125,
    priceUSD: 135,
    shortDescription: {
      en: 'Warm ivory structured silhouette adorned with cascading sheer organza and an arched handle of lustrous freshwater pearls.',
      fr: 'Silhouette structurée ivoire chaud, ornée de cascades d’organza transparent et d’une anse arquée en perles d’eau douce lustrées.',
      ar: 'تصميم منظَّم بلون العاجي الدافئ، تزيّنه شلالات من الأورجانزا الشفافة ومقبض مقوَّس من لآلئ المياه العذبة اللامعة.'
    },
    fullDescription: {
      en: 'The quintessential expression of Zaphira craftsmanship. Hand-assembled in our Algiers atelier using fine Italian textured fabric, delicate hand-pleated ivory organza side accents, and a bespoke handle strung with natural graduated freshwater pearls and 18k gold-plated accents.',
      fr: 'L’expression par excellence du savoir-faire Zaphira. Assemblé à la main dans notre atelier d’Alger à partir d’un fin tissu texturé italien, de délicats plissés latéraux en organza ivoire et d’une anse sur-mesure enfilée de perles d’eau douce naturelles graduées et d’accents plaqués or 18 carats.',
      ar: 'التعبير الأسمى عن حِرفية زفيرة. تُجمَّع يدوياً في ورشتنا بالجزائر العاصمة من قماش إيطالي فاخر ذي ملمس مميز، مع ثنيات جانبية رقيقة من الأورجانزا العاجية، ومقبض مصمم خصيصاً من لآلئ المياه العذبة الطبيعية المتدرجة ولمسات مطلية بذهب عيار 18.'
    },
    materials: {
      en: 'Textured Ivory Fabric, Sheer Silk Organza, Natural Freshwater Pearls',
      fr: 'Tissu texturé ivoire, Organza de soie transparent, Perles d’eau douce naturelles',
      ar: 'قماش عاجي بملمس مميز، أورجانزا حريرية شفافة، لآلئ مياه عذبة طبيعية'
    },
    dimensions: {
      en: '22cm (W) x 16cm (H) x 8cm (D)',
      fr: '22 cm (L) x 16 cm (H) x 8 cm (P)',
      ar: 'العرض 22 سم × الارتفاع 16 سم × العمق 8 سم'
    },
    hardware: {
      en: 'Champagne Gold Clasp & Chain',
      fr: 'Fermoir et chaîne or champagne',
      ar: 'قفل وسلسلة بلون الذهب الشمباني'
    },
    images: {
      primary: 'assets/images/products/product-pearl-ivory.jpg',
      gallery: [
        'assets/images/products/product-pearl-ivory.jpg',
        'assets/images/products/hero-bag.jpg',
        'assets/images/editorial/craftsmanship-macro.jpg'
      ]
    },
    defaultConfig: {
      color: 'ivory',
      material: 'organza',
      pearls: 'medium',
      chain: 'gold'
    }
  },
  {
    id: 'noir-prestige',
    name: 'Noir Prestige',
    collection: { en: 'Evening Noir', fr: 'Noir du Soir', ar: 'تشكيلة السهرة السوداء' },
    tag: { en: 'Haute Couture', fr: 'Haute Couture', ar: 'أزياء راقية' },
    badgeClass: 'badge-charcoal',
    priceDZD: 19800,
    priceEUR: 135,
    priceUSD: 145,
    shortDescription: {
      en: 'Deep charcoal satin structured handbag with midnight black organza pleats and polished Tahitian dark pearl handle.',
      fr: 'Sac structuré en satin anthracite profond, plissés d’organza noir minuit et anse en perles sombres de Tahiti polies.',
      ar: 'حقيبة منظَّمة من الساتان الفحمي العميق، بثنيات من الأورجانزا السوداء ومقبض من لآلئ تاهيتي الداكنة المصقولة.'
    },
    fullDescription: {
      en: 'An opulent statement for evening galas and soirees. Crafted from midnight charcoal silk satin with sculpted black organza ruffles along each flank. Features an arched handle composed of alternating iridescent dark pearls and golden spheres.',
      fr: 'Une pièce opulente pour les galas et les soirées. Façonné en satin de soie anthracite minuit, orné de volants d’organza noir sculptés sur chaque flanc. Son anse arquée alterne perles sombres irisées et sphères dorées.',
      ar: 'قطعة فاخرة لحفلات المساء والسهرات الراقية. مصنوعة من ساتان الحرير بلون الفحم الليلي، مع كشكشة منحوتة من الأورجانزا السوداء على كل جانب، ومقبض مقوَّس يتناوب فيه اللؤلؤ الداكن المتلألئ مع كرات ذهبية.'
    },
    materials: {
      en: 'Midnight Silk Satin, Dark Organza, Tahitian Dark Pearl Elements',
      fr: 'Satin de soie minuit, Organza sombre, Perles sombres de Tahiti',
      ar: 'ساتان حريري ليلي، أورجانزا داكنة، عناصر من لؤلؤ تاهيتي الداكن'
    },
    dimensions: {
      en: '21cm (W) x 15cm (H) x 7.5cm (D)',
      fr: '21 cm (L) x 15 cm (H) x 7,5 cm (P)',
      ar: 'العرض 21 سم × الارتفاع 15 سم × العمق 7.5 سم'
    },
    hardware: {
      en: '18k Champagne Gold Lock Clasp',
      fr: 'Fermoir cadenas or champagne 18 carats',
      ar: 'قفل بلون الذهب الشمباني عيار 18'
    },
    images: {
      primary: 'assets/images/products/product-noir-prestige.jpg',
      gallery: [
        'assets/images/products/product-noir-prestige.jpg',
        'assets/images/editorial/craftsmanship-macro.jpg'
      ]
    },
    defaultConfig: {
      color: 'noir',
      material: 'satin',
      pearls: 'baroque',
      chain: 'gold'
    }
  },
  {
    id: 'blush-organza',
    name: 'Blush Organza',
    collection: { en: 'Rose Garden', fr: 'Jardin de Roses', ar: 'حديقة الورود' },
    tag: { en: 'Limited Edition', fr: 'Édition Limitée', ar: 'إصدار محدود' },
    badgeClass: 'badge-rose',
    priceDZD: 18500,
    priceEUR: 125,
    priceUSD: 135,
    shortDescription: {
      en: 'Dusty rose fine grain leather with ethereal pleated organza ruffles and rose-tinted natural freshwater pearls.',
      fr: 'Cuir grainé vieux rose, volants d’organza plissé aériens et perles d’eau douce naturelles aux reflets rosés.',
      ar: 'جلد ناعم الحبيبات بلون الوردي الغباري، مع كشكشة أورجانزا مثنية خفيفة ولآلئ مياه عذبة طبيعية بلمسة وردية.'
    },
    fullDescription: {
      en: 'Subtle feminine romance encapsulated in leather and silk. The Blush Organza features delicate hand-gathered dusty rose organza ruffles bordering a structured calfskin body, complemented by soft pink freshwater pearls across the top handle.',
      fr: 'Un romantisme féminin tout en subtilité, entre cuir et soie. Le Blush Organza associe de délicats volants d’organza vieux rose froncés à la main, bordant un corps structuré en cuir de veau, à une anse ornée de tendres perles d’eau douce rosées.',
      ar: 'رومانسية أنثوية رقيقة تجمع بين الجلد والحرير. تتميز Blush Organza بكشكشة رقيقة من الأورجانزا الوردية مجموعة يدوياً تحيط بجسم منظَّم من جلد العجل، يكمّلها مقبض من لآلئ المياه العذبة الوردية الناعمة.'
    },
    materials: {
      en: 'Dusty Rose Leather, Translucent Blush Organza, Rose Baroque Pearls',
      fr: 'Cuir vieux rose, Organza rosé translucide, Perles baroques roses',
      ar: 'جلد وردي غباري، أورجانزا وردية شفافة، لآلئ باروكية وردية'
    },
    dimensions: {
      en: '22cm (W) x 16cm (H) x 8cm (D)',
      fr: '22 cm (L) x 16 cm (H) x 8 cm (P)',
      ar: 'العرض 22 سم × الارتفاع 16 سم × العمق 8 سم'
    },
    hardware: {
      en: 'Rose Gold & Champagne Hardware',
      fr: 'Finitions or rose et champagne',
      ar: 'إكسسوارات بالذهب الوردي والشمباني'
    },
    images: {
      primary: 'assets/images/products/product-blush-organza.jpg',
      gallery: [
        'assets/images/products/product-blush-organza.jpg',
        'assets/images/editorial/journal-2.jpg'
      ]
    },
    defaultConfig: {
      color: 'blush',
      material: 'organza',
      pearls: 'medium',
      chain: 'rose-gold'
    }
  },
  {
    id: 'taupe-elegance',
    name: 'Taupe Elegance',
    collection: { en: 'Quiet Luxury', fr: 'Luxe Discret', ar: 'الفخامة الهادئة' },
    tag: { en: 'Artisan Signature', fr: 'Signature Artisan', ar: 'توقيع الحرفي' },
    badgeClass: 'badge-champagne',
    priceDZD: 21000,
    priceEUR: 142,
    priceUSD: 155,
    shortDescription: {
      en: 'Warm taupe structured handbag with sheer organza gussets and lustrous baroque champagne pearls.',
      fr: 'Sac structuré taupe chaud, soufflets en organza transparent et perles baroques champagne lustrées.',
      ar: 'حقيبة منظَّمة بلون الرمادي البني الدافئ، بجوانب من الأورجانزا الشفافة ولآلئ باروكية شمبانية لامعة.'
    },
    fullDescription: {
      en: 'The epitome of quiet North African luxury. Hand-stitched in rich warm taupe with accordion organza side panels, a classic padlock key clochette, and an arched handle strung with irregular natural baroque pearls.',
      fr: 'L’incarnation du luxe discret nord-africain. Cousu main dans un taupe chaud et profond, avec panneaux latéraux en organza plissé accordéon, une clochette porte-clé classique et une anse arquée enfilée de perles baroques naturelles irrégulières.',
      ar: 'تجسيد للفخامة الهادئة في شمال أفريقيا. مخيطة يدوياً بلون الرمادي البني الدافئ الغني، مع ألواح جانبية من الأورجانزا المطوية على شكل أكورديون، وجرس مفتاح كلاسيكي، ومقبض مقوَّس من اللآلئ الباروكية الطبيعية غير المنتظمة.'
    },
    materials: {
      en: 'Fine Grain Taupe Leather, Warm Taupe Organza, Baroque Champagne Pearls',
      fr: 'Cuir grainé taupe, Organza taupe chaud, Perles baroques champagne',
      ar: 'جلد ناعم الحبيبات بلون رمادي بني، أورجانزا دافئة، لآلئ باروكية شمبانية'
    },
    dimensions: {
      en: '24cm (W) x 18cm (H) x 9cm (D)',
      fr: '24 cm (L) x 18 cm (H) x 9 cm (P)',
      ar: 'العرض 24 سم × الارتفاع 18 سم × العمق 9 سم'
    },
    hardware: {
      en: 'Burnished Champagne Gold Lock & Key',
      fr: 'Cadenas et clé or champagne bruni',
      ar: 'قفل ومفتاح بالذهب الشمباني المصقول'
    },
    images: {
      primary: 'assets/images/products/product-taupe-elegance.jpg',
      gallery: [
        'assets/images/products/product-taupe-elegance.jpg',
        'assets/images/editorial/journal-4.jpg'
      ]
    },
    defaultConfig: {
      color: 'taupe',
      material: 'organza',
      pearls: 'baroque',
      chain: 'gold'
    }
  }
];
