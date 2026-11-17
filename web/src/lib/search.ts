import type { Catalog, Product } from './catalog-types';

/** Case-insensitive match across every language of name, collection, materials and description. */
export function searchProducts(catalog: Catalog, query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const category = (id: string | null) => catalog.categories.find(c => c.id === id)?.name;
  return catalog.products.filter(p =>
    [p.name, p.collection, p.materials, p.shortDescription, p.fullDescription, category(p.categoryId)]
      .flatMap(value => (!value ? [] : typeof value === 'string' ? [value] : Object.values(value)))
      .some(text => text.toLowerCase().includes(q))
  );
}
