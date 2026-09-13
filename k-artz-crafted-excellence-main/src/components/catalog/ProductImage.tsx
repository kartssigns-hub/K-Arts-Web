import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Image wrapper used everywhere in the catalog.
 *
 * - Locks the aspect ratio so the grid never shifts while images load.
 * - Lazy-loads and decodes off the main thread (important here: the source
 *   photographs are several megabytes each).
 * - Degrades to a branded panel if the file is missing, rather than showing a
 *   broken-image icon.
 *
 * Fit: name plate photographs are much wider than the tile (source ratios run
 * from 1.4 to 2.4 against a 1.5 box), so `cover` chops the lettering off at
 * both ends — exactly the part a customer is shopping for. `contain` shows the
 * whole plate and fills the leftover space with a blurred, dimmed copy of the
 * same image, so tiles stay visually solid instead of letterboxed.
 */

interface ProductImageProps {
  src: string;
  alt: string;
  /** Show the "Sample image" ribbon for products awaiting real photography. */
  isPlaceholder?: boolean;
  aspect?: 'square' | 'landscape' | 'wide' | 'portrait';
  /** `contain` never crops the product; `cover` fills the box. */
  fit?: 'cover' | 'contain';
  /** Zoom the photo (not the frame) while the parent `group` is hovered. */
  zoomOnHover?: boolean;
  className?: string;
  /** Set on above-the-fold images so the browser fetches them immediately. */
  priority?: boolean;
  sizes?: string;
}

const aspectClasses = {
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[3/2]',
  portrait: 'aspect-[3/4]',
} as const;

const ProductImage = ({
  src,
  alt,
  isPlaceholder = false,
  aspect = 'landscape',
  fit = 'cover',
  zoomOnHover = false,
  className,
  priority = false,
  sizes,
}: ProductImageProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const showFallback = status === 'error' || isPlaceholder;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-secondary/40',
        aspectClasses[aspect],
        className,
      )}
    >
      {showFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary/60 to-background text-muted-foreground">
          <ImageIcon className="h-8 w-8 opacity-40" aria-hidden="true" />
          <span className="px-4 text-center text-[11px] uppercase tracking-widest opacity-60">
            Photo coming soon
          </span>
        </div>
      ) : (
        <>
          {status === 'loading' && (
            <div className="absolute inset-0 animate-pulse bg-secondary/60" aria-hidden="true" />
          )}

          {/* Fills the letterbox gaps. Same URL as the photo, so it costs a
              second decode but no second download. */}
          {fit === 'contain' && status === 'loaded' && (
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-125 object-cover opacity-35 blur-2xl saturate-150"
            />
          )}

          <img
            src={src}
            alt={alt}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            className={cn(
              'relative h-full w-full transition-all duration-700',
              fit === 'contain' ? 'object-contain p-3' : 'object-cover',
              zoomOnHover && 'group-hover:scale-[1.04]',
              status === 'loaded' ? 'opacity-100' : 'opacity-0',
            )}
          />
        </>
      )}
    </div>
  );
};

export default ProductImage;
