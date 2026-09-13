import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/catalog/ProductCard';
import { getFeaturedProducts } from '@/data/catalog';

/**
 * "Popular Designs" — the most requested products, pulled from the catalog
 * data by the `featured` flag. To change what appears here, flip `featured` on
 * a product in data/catalog/products.ts. No edits needed in this file.
 */
const PopularDesigns = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const featured = getFeaturedProducts(8);

  if (featured.length === 0) return null;

  return (
    <section
      aria-labelledby="popular-designs-heading"
      className="border-t border-border py-20 md:py-24"
    >
      <div ref={ref} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left"
        >
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              Popular Designs
            </span>
            <h2
              id="popular-designs-heading"
              className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl"
            >
              Customer Favourites
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Our most requested signage solutions.
            </p>
          </div>

          <Link
            to="/catalog"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent"
          >
            Browse all designs
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDesigns;
