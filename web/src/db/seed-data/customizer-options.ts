/**
 * ZAPHIRA bespoke atelier: options of the made-to-order bag, matching the real
 * handmade line (woven, chenille, bouclé, damier and chevron stitches).
 * name/description are localized { en, fr, ar }. Every colour and stitch shows a
 * photo of a real bag; the admin can change all of it in Admin → Bespoke options.
 */

const photo = (path: string) => `assets/images/products/${path}`;

export const CUSTOMIZER_CONFIG = {
  basePriceDZD: 8500,
  monogramCostDZD: 1000,

  colors: [
    { id: 'azur', name: { en: 'Azure Blue', fr: 'Bleu Azur', ar: 'أزرق سماوي' }, hex: '#9DB4CF', priceModifierDZD: 0, imageRef: photo('ceremonie/perle-dazur-1.jpg') },
    { id: 'nuit', name: { en: 'Picasso Blue', fr: 'Bleu Picasso', ar: 'أزرق بيكاسو' }, hex: '#1F3F9A', priceModifierDZD: 0, imageRef: photo('hiver/nuit-bleue-1.jpg') },
    { id: 'emeraude', name: { en: 'Emerald', fr: 'Émeraude', ar: 'زمردي' }, hex: '#1E6B52', priceModifierDZD: 0, imageRef: photo('hiver/yakouren-1.jpg') },
    { id: 'carmin', name: { en: 'Carmine Red', fr: 'Rouge Carmin', ar: 'أحمر قرمزي' }, hex: '#9C1C2B', priceModifierDZD: 0, imageRef: photo('hiver/carmin-1.jpg') },
    { id: 'bordeaux', name: { en: 'Burgundy Velvet', fr: 'Bordeaux Velours', ar: 'عنابي مخملي' }, hex: '#5E1426', priceModifierDZD: 0, imageRef: photo('luxe/imperatrice-1.jpg') },
    { id: 'rose', name: { en: 'Powder Pink', fr: 'Rose Poudré', ar: 'وردي بودري' }, hex: '#DDA3A9', priceModifierDZD: 0, imageRef: photo('printemps/rose-de-blida-1.jpg') },
    { id: 'blanc', name: { en: 'Algiers White', fr: 'Blanc d’Alger', ar: 'أبيض جزائري' }, hex: '#F3EFE6', priceModifierDZD: 0, imageRef: photo('printemps/blanche-dalger-1.jpg') },
    { id: 'sable', name: { en: 'Golden Sand', fr: 'Sable Doré', ar: 'رملي ذهبي' }, hex: '#CDB78E', priceModifierDZD: 0, imageRef: photo('printemps/sable-dore-1.jpg') },
    { id: 'noir', name: { en: 'Casbah Black', fr: 'Noir Casbah', ar: 'أسود القصبة' }, hex: '#1A1A1C', priceModifierDZD: 0, imageRef: photo('printemps/nuit-de-casbah-1.jpg') }
  ],

  // "Stitch" in the storefront (kind: material)
  materials: [
    {
      id: 'tresse',
      name: { en: 'Woven Basket Stitch', fr: 'Point Tressé', ar: 'غرزة مضفورة' },
      description: { en: 'A dense woven relief, firm and structured.', fr: 'Un relief tressé dense, ferme et structuré.', ar: 'نقش مضفور كثيف، متين ومتماسك.' },
      priceModifierDZD: 0,
      imageRef: photo('ceremonie/perle-dazur-1.jpg')
    },
    {
      id: 'chenille',
      name: { en: 'Velvet Chenille', fr: 'Chenille Velours', ar: 'شنيل مخملي' },
      description: { en: 'Soft, glowing chenille quilted in diamonds.', fr: 'Une chenille douce et lumineuse, matelassée en losanges.', ar: 'شنيل ناعم لامع مبطّن على شكل معيّنات.' },
      priceModifierDZD: 1000,
      imageRef: photo('hiver/carmin-1.jpg')
    },
    {
      id: 'bouclette',
      name: { en: 'Bouclé Fur', fr: 'Bouclette', ar: 'فرو مجعّد' },
      description: { en: 'A cloud-soft bouclé, the winter favourite.', fr: 'Une bouclette douce comme un nuage, la favorite de l’hiver.', ar: 'فرو ناعم كالسحاب، المفضّل في الشتاء.' },
      priceModifierDZD: 1500,
      imageRef: photo('hiver/flocon-1.jpg')
    },
    {
      id: 'damier',
      name: { en: 'Damier Checks', fr: 'Damier', ar: 'مربعات الداما' },
      description: { en: 'Two-tone checks stitched square by square.', fr: 'Un damier bicolore brodé carré par carré.', ar: 'مربعات بلونين تُطرَّز مربعاً مربعاً.' },
      priceModifierDZD: 1500,
      imageRef: photo('hiver/damier-bordeaux-1.jpg')
    },
    {
      id: 'chevron',
      name: { en: 'Mediterranean Chevron', fr: 'Chevron Méditerranée', ar: 'زخرفة متموّجة' },
      description: { en: 'Wave-like chevrons, like the sea at Tipaza.', fr: 'Des chevrons en vagues, comme la mer à Tipaza.', ar: 'زخارف متموّجة كبحر تيبازة.' },
      priceModifierDZD: 1000,
      imageRef: photo('hiver/ondine-1.jpg')
    }
  ],

  // "Finishing touch" in the storefront (kind: pearls)
  pearls: [
    { id: 'aucun', name: { en: 'Pure, no ornament', fr: 'Épuré, sans ornement', ar: 'بسيط بلا زينة' }, description: { en: 'Let the stitch speak.', fr: 'Laisser parler le point.', ar: 'لتتحدّث الغرزة وحدها.' }, priceModifierDZD: 0 },
    { id: 'perles', name: { en: 'Pearl handle', fr: 'Anse en perles', ar: 'مقبض من اللؤلؤ' }, description: { en: 'A row of pearly beads to carry by hand.', fr: 'Une rangée de perles nacrées à porter à la main.', ar: 'صفّ من اللآلئ يُحمل باليد.' }, priceModifierDZD: 1200 },
    { id: 'foulard', name: { en: 'Silk scarf bow', fr: 'Nœud foulard en soie', ar: 'عقدة وشاح حريري' }, description: { en: 'A printed scarf knotted on the handle.', fr: 'Un foulard imprimé noué sur l’anse.', ar: 'وشاح مطبوع معقود على المقبض.' }, priceModifierDZD: 900 },
    { id: 'breloque', name: { en: 'Gold charm', fr: 'Breloque dorée', ar: 'تعليقة ذهبية' }, description: { en: 'A small gilded charm by the clasp.', fr: 'Un petit bijou doré près du fermoir.', ar: 'حلية ذهبية صغيرة قرب القفل.' }, priceModifierDZD: 600 }
  ],

  // "Strap" in the storefront (kind: chain)
  chains: [
    { id: 'or', name: { en: 'Gold chain', fr: 'Chaîne dorée', ar: 'سلسلة ذهبية' }, priceModifierDZD: 0 },
    { id: 'argent', name: { en: 'Silver chain', fr: 'Chaîne argentée', ar: 'سلسلة فضية' }, priceModifierDZD: 0 },
    { id: 'chaine-perles', name: { en: 'Chain & pearls', fr: 'Chaîne et perles', ar: 'سلسلة ولؤلؤ' }, priceModifierDZD: 1500 },
    { id: 'sangle', name: { en: 'Woven shoulder strap', fr: 'Bandoulière tissée', ar: 'حزام كتف منسوج' }, priceModifierDZD: 800 }
  ]
};

/** Ids of the first mock-up's options (organza, satin…): replaced on the next seed. */
export const LEGACY_OPTION_IDS = ['organza', 'satin', 'velvet', 'leather'];
