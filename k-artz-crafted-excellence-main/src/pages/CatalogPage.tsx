import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RequirementCta from '@/components/RequirementCta';
import CatalogCategoryCard from '@/components/catalog/CatalogCategoryCard';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import CatalogSearch from '@/components/catalog/CatalogSearch';
import ProductGrid from '@/components/catalog/ProductGrid';
import { useSeo } from '@/hooks/useSeo';
import { BUSINESS } from '@/config/business';
import {
  getCategoryProductCount,
  getProductsByCategory,
  products,
  searchProducts,
  sortedCategories,
  type CategorySlug,
} from '@/data/catalog';

/**
 * /catalog — the full digital showroom.
 *
 * Search query and category live in the URL (?q=&category=) so a filtered view
 * can be shared, bookmarked and reached with the browser back button.
 */

const isCategorySlug = (value: string | null): value is CategorySlug =>
  !!value && sortedCategories.some((category) => category.slug === value);

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category');
  const activeCategory: CategorySlug | 'all' = isCategorySlug(categoryParam)
    ? categoryParam
    : 'all';

  useSeo({
    title: "Signage Catalog — LED Signs, Name Plates & Shop Boards | K'artz",
    description:
      "Browse K'artz Signage's full catalog: LED and illuminated signage, acrylic name plates, shop boards, office and reception signs, restaurant menu boards and custom signage. Made to order in Pune.",
    path: '/catalog',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: "K'artz Signage Catalog",
      description:
        'LED signage, acrylic name plates, shop boards, office signage and custom signs.',
      url: `${BUSINESS.site}/catalog`,
      hasPart: sortedCategories.map((category) => ({
        '@type': 'CollectionPage',
        name: category.name,
        url: `${BUSINESS.site}/catalog/${category.slug}`,
      })),
    },
  });

  const updateParams = (next: { q?: string; category?: CategorySlug | 'all' }) => {
    const params = new URLSearchParams(searchParams);

    if (next.q !== undefined) {
      if (next.q) params.set('q', next.q);
      else params.delete('q');
    }
    if (next.category !== undefined) {
      if (next.category === 'all') params.delete('category');
      else params.set('category', next.category);
    }

    setSearchParams(params, { replace: true });
  };

  const visibleProducts = useMemo(() => {
    const pool =
      activeCategory === 'all' ? products : getProductsByCategory(activeCategory);
    return searchProducts(query, pool);
  }, [activeCategory, query]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: products.length };
    for (const category of sortedCategories) {
      result[category.slug] = getCategoryProductCount(category.slug);
    }
    return result;
  }, []);

  const isBrowsingAll = activeCategory === 'all' && !query;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* --- Page header --- */}
        <section className="relative overflow-hidden border-b border-border pb-12 pt-32 md:pb-16 md:pt-40">
          {/* Workshop banner sits behind the header; the artwork keeps its
              centre empty so the heading and search stay readable on top. */}
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/background_banner/catalog_banner.webp"
              alt=""
              fetchPriority="high"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-background/10 md:bg-background/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/10 to-background" />
          </div>

          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]"
            aria-hidden="true"
          />

          <div className="container relative mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-accent">
                Our Catalog
              </span>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Our Signage Catalog
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Explore our range of custom signage solutions designed for homes,
                businesses and brands — every piece made to order.
              </p>
            </motion.div>

            <div className="mx-auto mt-10 max-w-2xl">
              <CatalogSearch
                value={query}
                onChange={(value) => updateParams({ q: value })}
                resultCount={visibleProducts.length}
              />
            </div>
          </div>
        </section>

        {/* --- Category tiles (only while browsing everything) --- */}
        {isBrowsingAll && (
          <section className="border-b border-border py-14 md:py-20" aria-labelledby="browse-heading">
            <div className="container mx-auto px-6">
              <h2
                id="browse-heading"
                className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl"
              >
                What are you looking for?
              </h2>
              <p className="mb-10 text-center text-muted-foreground">
                Start with the kind of space you need signage for.
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {sortedCategories.map((category, index) => (
                  <CatalogCategoryCard
                    key={category.slug}
                    category={category}
                    priority={index < 4}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- Products --- */}
        <section className="py-14 md:py-20" aria-labelledby="products-heading">
          <div className="container mx-auto px-6">
            <div className="mb-8 text-center">
              <h2 id="products-heading" className="text-2xl font-bold text-foreground md:text-3xl">
                {isBrowsingAll ? 'All Designs' : 'Matching Designs'}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {visibleProducts.length}{' '}
                {visibleProducts.length === 1 ? 'product' : 'products'}
                {query && <> matching “{query}”</>}
              </p>
            </div>

            <div className="mb-10">
              <CatalogFilters
                active={activeCategory}
                onChange={(value) => updateParams({ category: value })}
                counts={counts}
              />
            </div>

            <ProductGrid products={visibleProducts} />
          </div>
        </section>

        <RequirementCta />
      </main>

      <Footer />
    </div>
  );
};

export default CatalogPage;
