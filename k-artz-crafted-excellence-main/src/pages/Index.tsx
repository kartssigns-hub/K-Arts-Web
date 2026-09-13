import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Works from '@/components/Works';
import Services from '@/components/Services';
// Hidden until real client reviews are collected — the current entries are placeholders.
// import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import TrustStrip from '@/components/home/TrustStrip';
import CatalogTeaser from '@/components/home/CatalogTeaser';
import RequirementCta from '@/components/RequirementCta';
import { useSeo } from '@/hooks/useSeo';
import { BUSINESS, yearsInBusiness } from '@/config/business';

const Index = () => {
  useSeo({
    title: "K'artz Signage — LED Signs, Name Plates & Custom Signage in Pune",
    description: `Premium signage for homes, shops, offices and restaurants. LED and illuminated signs, acrylic name plates, shop boards and custom signage, made to order in Pune for over ${yearsInBusiness()} years.`,
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `${BUSINESS.name} Signage`,
      alternateName: BUSINESS.legalName,
      description:
        'Custom signage manufacturer — LED signs, acrylic name plates, shop boards, office and restaurant signage.',
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      url: BUSINESS.site,
      foundingDate: String(BUSINESS.established),
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <CatalogTeaser />
        <About />
        <Services />
        <Works />
        {/* <Testimonials /> — re-enable once real reviews are added */}
        <RequirementCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
