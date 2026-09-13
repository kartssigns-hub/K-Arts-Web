import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  resultCount?: number;
}

const CatalogSearch = ({
  value,
  onChange,
  placeholder = 'Search signage, name plates, LED boards…',
  className,
  resultCount,
}: CatalogSearchProps) => (
  <div className={cn('relative', className)}>
    <label htmlFor="catalog-search" className="sr-only">
      Search the catalog
    </label>
    <Search
      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
    <Input
      id="catalog-search"
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      className="h-12 rounded-full border-border bg-card pl-11 pr-11 text-base focus-visible:ring-accent md:text-sm"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    )}

    {/* Announces result counts to screen readers as the query changes. */}
    <p aria-live="polite" className="sr-only">
      {value && resultCount !== undefined
        ? `${resultCount} ${resultCount === 1 ? 'product' : 'products'} found`
        : ''}
    </p>
  </div>
);

export default CatalogSearch;
