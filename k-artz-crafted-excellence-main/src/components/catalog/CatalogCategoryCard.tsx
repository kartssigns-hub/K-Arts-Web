import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/data/catalog';
import { getCategoryProductCount } from '@/data/catalog';
import ProductImage from './ProductImage';

/**
 * Category tile used on the homepage teaser and the catalog landing page.
 * The whole tile is one link, so the entire card is a single tab stop.
 *
 * Two variants:
 * - `photo` (catalog page): the label sits over the image and only fades in on
 *   hover/focus so the grid reads as a wall of photographs. Devices without a
 *   hover pointer keep it permanently visible.
 * - `tile` (homepage): no photograph — icon, name and tagline only, so the
 *   section reads as a quick menu of categories rather than a second gallery.
 */

interface CatalogCategoryCardProps {
  category: Category;
  priority?: boolean;
  variant?: 'photo' | 'tile';
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const CatalogCategoryCard = ({
  category,
  priority = false,
  variant = 'photo',
}: CatalogCategoryCardProps) => {
  const Icon = category.icon;
  const count = getCategoryProductCount(category.slug);

  if (variant === 'tile') {
    return (
      <Link
        to={`/catalog/${category.slug}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_24px_48px_-24px_hsl(28_100%_55%/0.45)] ${focusRing}`}
      >
        {/* Corner glow that blooms on hover. */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Oversized watermark of the category icon. */}
        <Icon
          className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 text-accent/[0.06] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-accent/[0.12]"
          aria-hidden="true"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground group-hover:shadow-[0_0_28px_hsl(28_100%_55%/0.55)]">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>

          {count > 0 && (
            <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              {count} designs
            </span>
          )}
        </div>

        <h3 className="relative mt-6 text-lg font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent">
          {category.name}
        </h3>
        <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {category.tagline}
        </p>

        <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          Explore
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>

        {/* Accent underline that sweeps in from the left. */}
        <span
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent via-accent/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <Link
      to={`/catalog/${category.slug}`}
      className={`group relative block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_20px_40px_-20px_hsl(28_100%_55%/0.35)] ${focusRing}`}
    >
      <ProductImage
        src={category.image}
        alt={`${category.name} signage by K'artz`}
        isPlaceholder={category.imageIsPlaceholder}
        aspect="landscape"
        zoomOnHover
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="h-full w-full"
      />

      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background/80 text-accent backdrop-blur-sm">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight text-foreground">{category.name}</h3>
          {count > 0 && (
            <span className="mt-1 shrink-0 text-xs text-muted-foreground">{count} designs</span>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          View Designs
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
};

export default CatalogCategoryCard;
