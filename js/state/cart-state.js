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
      return saved ? JSON.parse(saved) : [];
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
    document.documentElement.setAttribute('lang', lang);
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }

  addItem(product) {
    // Check if exact same item exists (same id and same configuration specs)
    const specsKey = JSON.stringify(product.specs || {});
    const existingIndex = this.items.findIndex(
      item => item.id === product.id && JSON.stringify(item.specs || {}) === specsKey
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += (product.quantity || 1);
    } else {
      this.items.push({
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
  }

  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.saveCart();
    }
  }

  updateQuantity(index, quantity) {
    if (index >= 0 && index < this.items.length) {
      if (quantity <= 0) {
        this.removeItem(index);
      } else {
        this.items[index].quantity = quantity;
        this.saveCart();
      }
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
