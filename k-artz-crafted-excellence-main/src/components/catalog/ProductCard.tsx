import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/data/catalog';
import ProductImage from './ProductImage';

/**
 * Catalog product card.
 *
 * The card is a plain container rather than one big <a>, because it holds two
 * separate actions. The title link is stretched over the card with an absolute
 * ::after, so clicking anywhere opens the product — while the WhatsApp button
 * sits above it and stays independently clickable and focusable. This keeps a
 * single tab stop for the card without nesting interactive elements.
 *
 * Text is kept deliberately thin: the photograph is what sells a name plate,
 * and a grid of eleven cards each carrying a description, a material and a
 * price becomes a wall of prose nobody reads. Only the name and the headline
 * material stay; the full description lives on the product page. "Price on
 * Request" is dropped because it was identical on every card — a price shows
 * only where a real `startingPrice` exists.
 */

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard = ({ product, priority = false }: ProductCardProps) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_40px_-24px_hsl(28_100%_55%/0.4)] focus-within:border-accent/50">
    <ProductImage
      src={product.image}
      alt={`${product.name} — ${product.shortDescription}`}
      isPlaceholder={product.imageIsPlaceholder}
      aspect="wide"
      fit="contain"
      zoomOnHover
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="border-b border-border/60"
    />

    <div className="flex flex-1 items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
          <Link
            to={`/catalog/${product.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {product.name}
          </Link>
        </h3>

        {product.materials.length > 0 && (
          <p className="mt-1 truncate text-xs text-muted-foreground/80">
            <span className="sr-only">Material: </span>
            {product.materials[0]}
          </p>
        )}

        {product.startingPrice && (
          <p className="mt-1 text-xs font-medium text-accent">
            From ₹{product.startingPrice.toLocaleString('en-IN')}
          </p>
        )}
      </div>

      <ArrowRight
        className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
        aria-hidden="true"
      />
    </div>
  </article>
);

export default ProductCard;
