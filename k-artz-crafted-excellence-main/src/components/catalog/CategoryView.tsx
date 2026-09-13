import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Category } from '@/data/catalog';
import { getProductsByCategory, sortedCategories } from '@/data/catalog';
import {
  BUSINESS,
  categoryEnquiryMessage,
  namePlateEnquiryMessage,
} from '@/config/business';
import { useSeo } from '@/hooks/useSeo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import NamePlateBanner from './NamePlateBanner';
import ProductGrid from './ProductGrid';
import WhatsAppQuoteButton from './WhatsAppQuoteButton';
import { cn } from '@/lib/utils';

/**
 * Only this category's banner carries a blank plate to letter, so only it gets
 * the name field — see NamePlateBanner for the geometry that ties them.
 */
const PERSONALISED_CATEGORY = 'home-name-plates';
const MAX_PLATE_NAME = 18;

/** A single catalog category: /catalog/:categorySlug */
const CategoryView = ({ category }: { category: Category }) => {
  const Icon = category.icon;
  const categoryProducts = getProductsByCategory(category.slug);

  const isPersonalised = category.slug === PERSONALISED_CATEGORY;
  const [plateName, setPlateName] = useState('');
  const engravedName = plateName.trim();

  useSeo({
    title: `${category.name} — Signage Catalog | K'artz`,
    description: `${category.description} Made to order by K'artz Signage, ${BUSINESS.city}.`,
    path: `/catalog/${category.slug}`,
    image: category.imageIsPlaceholder ? undefined : category.image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Catalog',
          item: `${BUSINESS.site}/catalog`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category.name,
          item: `${BUSINESS.site}/catalog/${category.slug}`,
        },
      ],
    },
  });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border pb-12 pt-32 md:pb-14 md:pt-40">
        {/* Category banner. Anchored right so the lit subject stays in frame
            while the header text sits over the darker left side. */}
        {category.bannerImage && (
          <div className="absolute inset-0" aria-hidden="true">
            {isPersonalised ? (
              <NamePlateBanner name={plateName} />
            ) : (
              <img
                src={category.bannerImage}
                alt=""
                fetchPriority="high"
                className="h-full w-full object-cover object-right"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-background/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>
        )}

        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]"
          aria-hidden="true"
        />

        <div className="container relative mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link to="/catalog" className="transition-colors hover:text-accent">
                  Catalog
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
              <li aria-current="page" className="text-foreground">
                {category.name}
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>

            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {category.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {category.description}
            </p>

            {isPersonalised && (
              <div className="mt-8 max-w-sm">
                <Label htmlFor="plate-name" className="text-sm font-medium text-foreground">
                  See your name on the plate
                </Label>
                <Input
                  id="plate-name"
                  value={plateName}
                  onChange={(event) =>
                    setPlateName(event.target.value.slice(0, MAX_PLATE_NAME))
                  }
                  placeholder="e.g. Kulkarni"
                  maxLength={MAX_PLATE_NAME}
                  autoComplete="off"
                  className="mt-2 h-12 rounded-xl border-border bg-card/80 text-base backdrop-blur"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Type a name to letter it onto the plate. This is a preview —
                  font, size and finish are decided with you before we make it.
                </p>
              </div>
            )}

            <div className="mt-8">
              <WhatsAppQuoteButton
                message={
                  isPersonalised
                    ? namePlateEnquiryMessage(engravedName)
                    : categoryEnquiryMessage(category.name)
                }
                label={
                  isPersonalised && engravedName
                    ? `Enquire about the ${engravedName} plate`
                    : `Enquire about ${category.shortName} signage`
                }
                className="h-12 rounded-full px-6"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sibling categories — keeps browsing going without a trip back. */}
      <section aria-label="Other catalog categories" className="border-b border-border py-6">
        <div className="container mx-auto px-6">
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:px-0">
            {sortedCategories.map((sibling) => (
              <Link
                key={sibling.slug}
                to={`/catalog/${sibling.slug}`}
                aria-current={sibling.slug === category.slug ? 'page' : undefined}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  sibling.slug === category.slug
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground',
                )}
              >
                {sibling.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20" aria-label={`${category.name} products`}>
        <div className="container mx-auto px-6">
          <p className="mb-8 text-sm text-muted-foreground">
            {categoryProducts.length}{' '}
            {categoryProducts.length === 1 ? 'design' : 'designs'} in this category
          </p>
          <ProductGrid
            products={categoryProducts}
            emptyMessage="We're still photographing this range."
          />
        </div>
      </section>
    </>
  );
};

export default CategoryView;
