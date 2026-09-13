import { SearchX } from 'lucide-react';
import type { Product } from '@/data/catalog';
import { generalEnquiryMessage } from '@/config/business';
import ProductCard from './ProductCard';
import WhatsAppQuoteButton from './WhatsAppQuoteButton';

/**
 * Responsive product grid with an empty state.
 *
 * Cards are deliberately not animated individually — a catalog page can render
 * sixty of them, and per-card enter animations would cost far more than they
 * add. Section headers carry the motion instead.
 */

interface ProductGridProps {
  products: Product[];
  /** Number of leading images to load eagerly (those above the fold). */
  priorityCount?: number;
  emptyMessage?: string;
}

const ProductGrid = ({
  products,
  priorityCount = 4,
  emptyMessage = 'No products matched your search.',
}: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
        <SearchX className="mb-4 h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
        <p className="mb-2 text-lg font-semibold text-foreground">{emptyMessage}</p>
        <p className="mb-6 max-w-md text-sm text-muted-foreground">
          We make a great deal more than we can list here. Tell us what you need and we'll
          tell you whether we can make it.
        </p>
        <WhatsAppQuoteButton
          message={generalEnquiryMessage()}
          label="Ask on WhatsApp"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.slug}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
