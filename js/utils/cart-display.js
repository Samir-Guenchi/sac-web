/**
 * ZAPHIRA — Display text for a cart line, in the active language
 *
 * Cart items are saved with ids (product id, customizer option ids), so names
 * are resolved at render time and follow the language selector. Carts saved by
 * older versions stored English names instead ({ color, material, pearls, chain }
 * or { colorName, materialName, pearlName }); those are shown as saved.
 */

import { PRODUCTS } from '../data/products.js';
import { CUSTOMIZER_CONFIG } from '../data/customizer-options.js';
import { loc, t } from './i18n.js';

const byId = (list, id) => (id ? list.find(entry => entry.id === id) : undefined);

function optionName(list, id, ...legacyValues) {
  const option = byId(list, id);
  if (option) return loc(option.name);
  return legacyValues.find(Boolean) || '';
}

/**
 * @returns {{ name: string, collection: string, specs: Array<[string, string]>, monogram: string }}
 */
export function describeCartItem(item) {
  const s = item.specs || {};

  if (item.isCustom) {
    const color = optionName(CUSTOMIZER_CONFIG.colors, s.colorId, s.color, s.colorName);
    const specs = [
      [t('panier.specColor'), color],
      [t('panier.specMaterial'), optionName(CUSTOMIZER_CONFIG.materials, s.materialId, s.material, s.materialName)],
      [t('panier.specPearls'), optionName(CUSTOMIZER_CONFIG.pearls, s.pearlsId, s.pearls, s.pearlName)],
      [t('panier.specChain'), optionName(CUSTOMIZER_CONFIG.chains, s.chainId, s.chain, s.chainName)]
    ].filter(([, value]) => value);

    return {
      name: s.colorId && color ? t('studio.itemName', { color }) : item.name,
      collection: '',
      specs,
      monogram: s.monogram && s.monogram !== 'None' ? s.monogram : ''
    };
  }

  const product = byId(PRODUCTS, item.id);
  return {
    name: product ? product.name : item.name,
    collection: product ? loc(product.collection) : loc(s.collection),
    specs: [],
    monogram: ''
  };
}
