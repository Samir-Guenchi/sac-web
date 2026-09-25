/**
 * ZAPHIRA — Customizer Options & Pricing Configuration
 */

export const CUSTOMIZER_CONFIG = {
  basePriceDZD: 18500,
  basePriceEUR: 125,
  basePriceUSD: 135,

  colors: [
    {
      id: 'ivory',
      name: 'Warm Ivory',
      hex: '#F7F2E8',
      previewFilter: 'none',
      tintColor: 'transparent',
      priceModifierDZD: 0,
      imageRef: 'assets/images/products/product-pearl-ivory.jpg'
    },
    {
      id: 'noir',
      name: 'Noir Prestige',
      hex: '#191817',
      previewFilter: 'brightness(0.2) contrast(1.2)',
      tintColor: 'rgba(25, 24, 23, 0.75)',
      priceModifierDZD: 1300,
      imageRef: 'assets/images/products/product-noir-prestige.jpg'
    },
    {
      id: 'blush',
      name: 'Dusty Rose',
      hex: '#B88D8D',
      previewFilter: 'sepia(0.3) hue-rotate(310deg) saturate(1.2)',
      tintColor: 'rgba(184, 141, 141, 0.4)',
      priceModifierDZD: 0,
      imageRef: 'assets/images/products/product-blush-organza.jpg'
    },
    {
      id: 'taupe',
      name: 'Warm Taupe',
      hex: '#756B61',
      previewFilter: 'sepia(0.3) saturate(0.8) brightness(0.6)',
      tintColor: 'rgba(117, 107, 97, 0.55)',
      priceModifierDZD: 2500,
      imageRef: 'assets/images/products/product-taupe-elegance.jpg'
    },
    {
      id: 'champagne',
      name: 'Champagne Glow',
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
      name: 'Sheer Silk Organza',
      description: 'Airy, ethereal hand-pleated side cascades',
      priceModifierDZD: 0
    },
    {
      id: 'satin',
      name: 'Italian Silk Satin',
      description: 'Lustrous, ultra-smooth formal finish',
      priceModifierDZD: 1500
    },
    {
      id: 'velvet',
      name: 'Crushed Royal Velvet',
      description: 'Rich, tactile depth and warmth',
      priceModifierDZD: 2200
    },
    {
      id: 'leather',
      name: 'Fine Grain Leather',
      description: 'Structured, durable Mediterranean calfskin',
      priceModifierDZD: 3000
    }
  ],

  pearls: [
    {
      id: 'small',
      name: 'Small Seed Pearls',
      description: 'Delicate 4mm lustrous micro-pearls',
      priceModifierDZD: 0
    },
    {
      id: 'medium',
      name: 'Medium Luster Pearls',
      description: 'Classic 8mm graduated spherical pearls',
      priceModifierDZD: 800
    },
    {
      id: 'baroque',
      name: 'Natural Baroque Pearls',
      description: 'Organic, irregular high-sheen freshwater pearls',
      priceModifierDZD: 2000
    },
    {
      id: 'mixed',
      name: 'Mixed Pearl & Gold Beads',
      description: 'Alternating pearls and 18k gold beads',
      priceModifierDZD: 2500
    }
  ],

  chains: [
    {
      id: 'gold',
      name: 'Champagne Gold Link',
      description: '18k gold-plated delicate woven link chain',
      priceModifierDZD: 0
    },
    {
      id: 'silver',
      name: 'Sterling Silver Link',
      description: 'Polished rhodium-plated silver chain',
      priceModifierDZD: 0
    },
    {
      id: 'pearl-strand',
      name: 'Pearl Beaded Strap',
      description: 'Full crossbody strand of natural pearls',
      priceModifierDZD: 3500
    },
    {
      id: 'rose-gold',
      name: 'Rose Gold Chain',
      description: 'Warm pink-gold delicate link chain',
      priceModifierDZD: 500
    }
  ],

  monogramCostDZD: 1500
};
