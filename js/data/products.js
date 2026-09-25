/**
 * ZAPHIRA — Product Catalog Data
 */

export const PRODUCTS = [
  {
    id: 'pearl-ivory',
    name: 'Pearl Ivory',
    collection: 'Signature Couture',
    tag: 'Bestseller',
    badgeClass: 'badge-champagne',
    priceDZD: 18500,
    priceEUR: 125,
    priceUSD: 135,
    shortDescription: 'Warm ivory structured silhouette adorned with cascading sheer organza and an arched handle of lustrous freshwater pearls.',
    fullDescription: 'The quintessential expression of Zaphira craftsmanship. Hand-assembled in our Algiers atelier using fine Italian textured fabric, delicate hand-pleated ivory organza side accents, and a bespoke handle strung with natural graduated freshwater pearls and 18k gold-plated accents.',
    materials: 'Textured Ivory Fabric, Sheer Silk Organza, Natural Freshwater Pearls',
    dimensions: '22cm (W) x 16cm (H) x 8cm (D)',
    hardware: 'Champagne Gold Clasp & Chain',
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
    collection: 'Evening Noir',
    tag: 'Haute Couture',
    badgeClass: 'badge-charcoal',
    priceDZD: 19800,
    priceEUR: 135,
    priceUSD: 145,
    shortDescription: 'Deep charcoal satin structured handbag with midnight black organza pleats and polished Tahitian dark pearl handle.',
    fullDescription: 'An opulent statement for evening galas and soirees. Crafted from midnight charcoal silk satin with sculpted black organza ruffles along each flank. Features an arched handle composed of alternating iridescent dark pearls and golden spheres.',
    materials: 'Midnight Silk Satin, Dark Organza, Tahitian Dark Pearl Elements',
    dimensions: '21cm (W) x 15cm (H) x 7.5cm (D)',
    hardware: '18k Champagne Gold Lock Clasp',
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
    collection: 'Rose Garden',
    tag: 'Limited Edition',
    badgeClass: 'badge-rose',
    priceDZD: 18500,
    priceEUR: 125,
    priceUSD: 135,
    shortDescription: 'Dusty rose fine grain leather with ethereal pleated organza ruffles and rose-tinted natural freshwater pearls.',
    fullDescription: 'Subtle feminine romance encapsulated in leather and silk. The Blush Organza features delicate hand-gathered dusty rose organza ruffles bordering a structured calfskin body, complemented by soft pink freshwater pearls across the top handle.',
    materials: 'Dusty Rose Leather, Translucent Blush Organza, Rose Baroque Pearls',
    dimensions: '22cm (W) x 16cm (H) x 8cm (D)',
    hardware: 'Rose Gold & Champagne Hardware',
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
    collection: 'Quiet Luxury',
    tag: 'Artisan Signature',
    badgeClass: 'badge-champagne',
    priceDZD: 21000,
    priceEUR: 142,
    priceUSD: 155,
    shortDescription: 'Warm taupe structured handbag with sheer organza gussets and lustrous baroque champagne pearls.',
    fullDescription: 'The epitome of quiet North African luxury. Hand-stitched in rich warm taupe with accordion organza side panels, a classic padlock key clochette, and an arched handle strung with irregular natural baroque pearls.',
    materials: 'Fine Grain Taupe Leather, Warm Taupe Organza, Baroque Champagne Pearls',
    dimensions: '24cm (W) x 18cm (H) x 9cm (D)',
    hardware: 'Burnished Champagne Gold Lock & Key',
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
