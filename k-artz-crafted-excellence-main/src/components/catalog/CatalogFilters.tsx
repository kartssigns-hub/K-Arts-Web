import type { CategorySlug } from '@/data/catalog';
import { sortedCategories } from '@/data/catalog';
import { cn } from '@/lib/utils';

/**
 * Category chips for the catalog page.
 *
 * Scrolls horizontally on mobile rather than wrapping into four cramped rows,
 * and uses the same pill language as the existing Works filter so the two
 * sections feel like one site.
 */

interface CatalogFiltersProps {
  active: CategorySlug | 'all';
  onChange: (value: CategorySlug | 'all') => void;
  counts?: Record<string, number>;
}

const CatalogFilters = ({ active, onChange, counts }: CatalogFiltersProps) => {
  const options: Array<{ value: CategorySlug | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    ...sortedCategories.map((category) => ({
      value: category.slug,
      label: category.shortName,
    })),
  ];

  return (
    <div
      role="group"
      aria-label="Filter catalog by category"
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
    >
      {options.map((option) => {
        const isActive = active === option.value;
        const count = counts?.[option.value];

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isActive
                ? 'border-accent bg-accent text-accent-foreground shadow-[0_0_20px_-6px_hsl(28_100%_55%/0.6)]'
                : 'border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground',
            )}
          >
            {option.label}
            {count !== undefined && (
              <span className={cn('ml-1.5 text-xs', isActive ? 'opacity-80' : 'opacity-60')}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CatalogFilters;
