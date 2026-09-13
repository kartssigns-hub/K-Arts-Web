import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RequirementCta from '@/components/RequirementCta';
import CategoryView from '@/components/catalog/CategoryView';
import ProductDetail from '@/components/catalog/ProductDetail';
import NotFound from './NotFound';
import { getCategory, getProduct } from '@/data/catalog';

/**
 * /catalog/:slug
 *
 * Categories and products share one flat slug namespace so URLs stay clean
 * (/catalog/led-name-plates rather than /catalog/product/led-name-plates).
 * This resolver decides which of the two a slug refers to; uniqueness across
 * both is asserted at import time in development — see data/catalog/index.ts.
 */
const CatalogEntryPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();

  const category = getCategory(slug);
  const product = category ? undefined : getProduct(slug);

  if (!category && !product) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {category ? <CategoryView category={category} /> : <ProductDetail product={product!} />}
        <RequirementCta />
      </main>
      <Footer />
    </div>
  );
};

export default CatalogEntryPage;
