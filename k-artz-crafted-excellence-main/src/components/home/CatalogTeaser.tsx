import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CatalogCategoryCard from '@/components/catalog/CatalogCategoryCard';
import { sortedCategories } from '@/data/catalog';

/**
 * "Explore Our Catalog" — the homepage's answer to "what can you make for me?".
 *
 * A curated preview only: eight category doors, then out to /catalog. The full
 * product grid deliberately does not live on the homepage.
 */
const CatalogTeaser = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="catalog"
      aria-labelledby="catalog-teaser-heading"
      className="relative overflow-hidden py-20 md:py-24"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-accent/5 blur-[130px]"
        aria-hidden="true"
      />

      <div ref={ref} className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Explore Our Catalog
          </span>
          <h2
            id="catalog-teaser-heading"
            className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-5xl"
          >
            What are you looking for?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Find the perfect signage solution for your home, shop, office or business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sortedCategories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.06 }}
            >
              <CatalogCategoryCard category={category} variant="tile" />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-accent px-8 text-accent-foreground hover:bg-accent/90"
          >
            <Link to="/catalog">
              View Full Catalog
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CatalogTeaser;
