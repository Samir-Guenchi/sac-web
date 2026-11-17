/**
 * ZAPHIRA — Reactive Shopping Cart State Store
 */

const STORAGE_KEY = 'zaphira_cart_v1';
const CURRENCY_KEY = 'zaphira_currency_v1';
const LANG_KEY = 'zaphira_lang_v1';

export const RATES = {
  DZD: 1,
  EUR: 1 / 148, // 1 EUR ≈ 148 DZD
  USD: 1 / 136  // 1 USD ≈ 136 DZD
};

export const SYMBOLS = {
  DZD: 'DZD',
  EUR: '€',
  USD: '$'
};

/** A cart line is identified by product id + its configuration. */
export function lineKey(id, specs) {
  return `${id}|${JSON.stringify(specs || {})}`;
}

class CartStore {
  constructor() {
    this.items = this.loadCart();
    this.currency = localStorage.getItem(CURRENCY_KEY) || 'DZD';
    this.language = localStorage.getItem(LANG_KEY) || 'en';
    this.listeners = [];
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const items = JSON.parse(saved);
      return Array.isArray(items) ? items.map(item => {
        if (item && item.image) {
          item.image = item.image
            .replace('assests/', 'assets/')
            .replace('assets/images/product-', 'assets/images/products/product-')
            .replace('assets/images/hero-bag.jpg', 'assets/images/products/hero-bag.jpg')
            .replace('assets/images/logo-zaphira.svg', 'assets/images/branding/logo-zaphira.svg')
            .replace('assets/images/journal-', 'assets/images/editorial/journal-');
        }
        if (item && !item.key) item.key = lineKey(item.id, item.specs);
        return item;
      }).filter(item => item && item.key) : [];
    } catch (e) {
      console.warn('Could not load cart from storage', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      this.notify();
    } catch (e) {
      console.warn('Could not save cart to storage', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.items, this.currency));
  }

  setCurrency(curr) {
    if (RATES[curr]) {
      this.currency = curr;
      localStorage.setItem(CURRENCY_KEY, curr);
      this.notify();
    }
  }

  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem(LANG_KEY, lang);
    // utils/i18n.js listens for this to re-apply translations, lang and dir
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  }

  addItem(product) {
    // Check if exact same item exists (same id and same configuration specs)
    const key = lineKey(product.id, product.specs);
    const existing = this.items.find(item => item.key === key);

    if (existing) {
      existing.quantity += (product.quantity || 1);
    } else {
      this.items.push({
        key,
        id: product.id,
        name: product.name,
        priceDZD: product.priceDZD,
        image: product.image,
        specs: product.specs || null,
        quantity: product.quantity || 1,
        isCustom: product.isCustom || false
      });
    }

    this.saveCart();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart:item-added', { detail: { product } }));
    }
  }

  getItem(key) {
    return this.items.find(item => item.key === key);
  }

  removeItem(key) {
    const before = this.items.length;
    this.items = this.items.filter(item => item.key !== key);
    if (this.items.length !== before) this.saveCart();
  }

  updateQuantity(key, quantity) {
    const item = this.getItem(key);
    if (!item) return;
    if (quantity <= 0) {
      this.removeItem(key);
    } else {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotalDZD() {
    return this.items.reduce((total, item) => total + (item.priceDZD * item.quantity), 0);
  }

  formatPrice(amountDZD) {
    if (this.currency === 'DZD') {
      return `${amountDZD.toLocaleString()} DZD`;
    } else if (this.currency === 'EUR') {
      const eur = Math.round(amountDZD * RATES.EUR);
      return `€${eur.toLocaleString()}`;
    } else if (this.currency === 'USD') {
      const usd = Math.round(amountDZD * RATES.USD);
      return `$${usd.toLocaleString()}`;
    }
    return `${amountDZD} DZD`;
  }

  clear() {
    this.items = [];
    this.saveCart();
  }
}

export const cartStore = new CartStore();
