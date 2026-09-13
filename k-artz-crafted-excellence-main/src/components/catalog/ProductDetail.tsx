import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Check, Ruler, Wrench, Palette, IndianRupee } from 'lucide-react';
import type { Product } from '@/data/catalog';
import { getCategory, getRelatedProducts } from '@/data/catalog';
import { BUSINESS, productEnquiryMessage } from '@/config/business';
import { useSeo } from '@/hooks/useSeo';
import { Button } from '@/components/ui/button';
import ProductImage from './ProductImage';
import ProductCard from './ProductCard';
import WhatsAppQuoteButton from './WhatsAppQuoteButton';
import { cn } from '@/lib/utils';

/** A single catalog product: /catalog/:productSlug */
const ProductDetail = ({ product }: { product: Product }) => {
  const category = getCategory(product.categorySlug);
  const related = getRelatedProducts(product);

  const gallery = [product.image, ...product.gallery];
  const [activeImage, setActiveImage] = useState(0);

  useSeo({
    title: `${product.name} | K'artz Signage Catalog`,
    description: `${product.shortDescription} ${product.name} made to order by K'artz Signage, ${BUSINESS.city}. Request a quotation on WhatsApp.`,
    path: `/catalog/${product.slug}`,
    image: product.imageIsPlaceholder ? undefined : product.image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      category: category?.name,
      material: product.materials.join(', '),
      brand: { '@type': 'Brand', name: BUSINESS.name },
      ...(product.imageIsPlaceholder
        ? {}
        : { image: `${BUSINESS.site}${product.image}` }),
    },
  });

  const specs = [
    { icon: Palette, label: 'Materials', values: product.materials },
    { icon: Ruler, label: 'Sizes', values: product.sizes },
    { icon: Check, label: 'Customisation', values: product.customization },
  ];

  return (
    <>
      <section className="pb-16 pt-32 md:pt-40">
        <div className="container mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link to="/catalog" className="transition-colors hover:text-accent">
                  Catalog
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
              {category && (
                <>
                  <li>
                    <Link
                      to={`/catalog/${category.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {category.name}
                    </Link>
                  </li>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                </>
              )}
              <li aria-current="page" className="text-foreground">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* --- Imagery --- */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProductImage
                src={gallery[activeImage]}
                alt={`${product.name} — ${product.shortDescription}`}
                isPlaceholder={product.imageIsPlaceholder}
                aspect="wide"
                fit="contain"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="rounded-2xl border border-border"
              />

              {gallery.length > 1 && (
                <div className="mt-4 flex gap-3" role="group" aria-label="Product images">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show image ${index + 1} of ${gallery.length}`}
                      aria-pressed={index === activeImage}
                      className={cn(
                        'w-20 overflow-hidden rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                        index === activeImage
                          ? 'border-accent'
                          : 'border-border opacity-60 hover:opacity-100',
                      )}
                    >
                      <ProductImage
                        src={image}
                        alt=""
                        isPlaceholder={product.imageIsPlaceholder}
                        aspect="square"
                        fit="contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* --- Details --- */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {category && (
                <Link
                  to={`/catalog/${category.slug}`}
                  className="text-sm font-semibold uppercase tracking-widest text-accent transition-opacity hover:opacity-80"
                >
                  {category.name}
                </Link>
              )}

              <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                {product.name}
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Price policy — the business quotes per job rather than listing prices. */}
              <div className="mt-7 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <IndianRupee className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {product.startingPrice
                      ? `Starting from ₹${product.startingPrice.toLocaleString('en-IN')}`
                      : 'Price on Request'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Priced by size, material and finish — send us your requirement for an
                    exact quotation.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <WhatsAppQuoteButton
                  message={productEnquiryMessage(product.name)}
                  label="Get Quote on WhatsApp"
                  size="lg"
                  className="h-12 flex-1 rounded-full"
                />
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-border hover:border-accent hover:bg-transparent hover:text-accent"
                >
                  <Link to="/contact">Enquire by Form</Link>
                </Button>
              </div>

              {product.installation && (
                <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Wrench className="h-4 w-4 text-accent" aria-hidden="true" />
                  Installation available across {BUSINESS.cityShort}
                </p>
              )}

              {/* --- Specifications --- */}
              <dl className="mt-9 space-y-6 border-t border-border pt-8">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                      <spec.icon className="h-4 w-4 text-accent" aria-hidden="true" />
                      {spec.label}
                    </dt>
                    <dd>
                      <ul className="space-y-1.5">
                        {spec.values.map((value) => (
                          <li
                            key={value}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span
                              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                              aria-hidden="true"
                            />
                            {value}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="border-t border-border py-14 md:py-20"
          aria-labelledby="related-heading"
        >
          <div className="container mx-auto px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="related-heading" className="text-2xl font-bold text-foreground md:text-3xl">
                  You may also like
                </h2>
                {category && (
                  <p className="mt-2 text-muted-foreground">
                    More from {category.name}
                  </p>
                )}
              </div>
              {category && (
                <Link
                  to={`/catalog/${category.slug}`}
                  className="text-sm font-semibold text-accent transition-opacity hover:opacity-80"
                >
                  View all →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetail;
