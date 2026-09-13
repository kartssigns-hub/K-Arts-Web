import { categories } from './categories';
import { products } from './products';
import type { Category, CategorySlug, Product } from './types';

export { categories, products };
export { IMAGES } from './images';
export type { Category, CategorySlug, Product } from './types';

/**
 * Query layer for the catalog.
 *
 * Lookups are backed by Maps built once at module load rather than by scanning
 * the array on every render, so the catalog stays fast as the product count
 * grows into the hundreds.
 */

const categoryBySlug = new Map<string, Category>(
  categories.map((category) => [category.slug, category]),
);

const productBySlug = new Map<string, Product>(
  products.map((product) => [product.slug, product]),
);

/**
 * categorySlug → products, honouring `alsoIn` cross-listing and each
 * category's `hidePlaceholderProducts` flag.
 */
const productsByCategory = new Map<CategorySlug, Product[]>(
  categories.map((category) => [category.slug, [] as Product[]]),
);

for (const product of products) {
  for (const slug of [product.categorySlug, ...(product.alsoIn ?? [])]) {
    if (product.imageIsPlaceholder && categoryBySlug.get(slug)?.hidePlaceholderProducts) {
      continue;
    }
    productsByCategory.get(slug)?.push(product);
  }
}

/** Pre-lowercased search text, so searching never rebuilds strings per keystroke. */
const searchIndex = new Map<string, string>(
  products.map((product) => [
    product.slug,
    [
      product.name,
      product.shortDescription,
      product.materials.join(' '),
      product.tags.join(' '),
      categoryBySlug.get(product.categorySlug)?.name ?? '',
    ]
      .join(' ')
      .toLowerCase(),
  ]),
);

export const sortedCategories: Category[] = [...categories].sort(
  (a, b) => a.order - b.order,
);

export const getCategory = (slug: string): Category | undefined =>
  categoryBySlug.get(slug);

export const getProduct = (slug: string): Product | undefined =>
  productBySlug.get(slug);

export const getProductsByCategory = (slug: CategorySlug): Product[] =>
  productsByCategory.get(slug) ?? [];

export const getCategoryProductCount = (slug: CategorySlug): number =>
  productsByCategory.get(slug)?.length ?? 0;

/** Products shown in the homepage "Popular Designs" section. */
export const getFeaturedProducts = (limit = 8): Product[] =>
  products.filter((product) => product.featured).slice(0, limit);

/**
 * Other products in the same category, excluding the one being viewed.
 * Used for "You may also like" on the product page.
 */
export const getRelatedProducts = (product: Product, limit = 4): Product[] =>
  getProductsByCategory(product.categorySlug)
    .filter((candidate) => candidate.slug !== product.slug)
    .slice(0, limit);

/**
 * Case-insensitive multi-term search across name, description, materials, tags
 * and category name. Every term must match (AND), which narrows results the way
 * people expect as they keep typing.
 */
export const searchProducts = (query: string, pool: Product[] = products): Product[] => {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return pool;

  return pool.filter((product) => {
    const haystack = searchIndex.get(product.slug) ?? '';
    return terms.every((term) => haystack.includes(term));
  });
};

/**
 * Categories and products share the /catalog/:slug namespace, so a collision
 * would silently make one of them unreachable. Fail loudly in development
 * instead — this runs once at import time and is stripped from production
 * builds by Vite's dead-code elimination.
 */
if (import.meta.env.DEV) {
  const seen = new Map<string, string>();
  const collisions: string[] = [];

  for (const category of categories) {
    seen.set(category.slug, `category "${category.name}"`);
  }

  for (const product of products) {
    const existing = seen.get(product.slug);
    if (existing) {
      collisions.push(`"${product.slug}" — product "${product.name}" clashes with ${existing}`);
    } else {
      seen.set(product.slug, `product "${product.name}"`);
    }
  }

  if (collisions.length > 0) {
    throw new Error(
      `[catalog] Duplicate slug(s) detected. Categories and products share the ` +
        `/catalog/:slug namespace, so every slug must be unique:\n  ${collisions.join('\n  ')}`,
    );
  }
}
