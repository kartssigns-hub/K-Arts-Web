import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
// import Features from '@/components/About';
import Works from '@/components/Works';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import About from '@/components/About';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Works />
      <Services />
      <Testimonials />
     
      <Footer />
    </div>
  );
};

export default Index;
