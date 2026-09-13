

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { IMAGES } from '@/data/catalog/images';

const categories = ['All', 'Name Plates', 'LED Boards'];

// A hand-picked showcase — only the strongest photographs. Titles describe what
// each one actually shows. Name plates and boards alternate so "All" mixes both.
const works = [
  { id: 1, category: 'LED Boards', image: IMAGES.vardaanBacklitBoard, title: 'Salon & Spa Shop Board', description: 'Halo-lit gold mirror letters and lotus logo' },
  { id: 2, category: 'Name Plates', image: IMAGES.backlitAcrylicPlate, title: 'Backlit Acrylic Name Plate', description: 'Warm LED glow behind laser-cut acrylic' },
  { id: 3, category: 'LED Boards', image: IMAGES.cakeOClockAcpBoard, title: 'Bakery Shop Board', description: 'Raised acrylic letters and a lit logo panel on ACP' },
  { id: 4, category: 'Name Plates', image: IMAGES.haloLitDoorPlate, title: 'Halo-Lit Door Name Plate', description: 'Backlit letters on a frosted panel' },
  { id: 5, category: 'Name Plates', image: IMAGES.backlitWoodenPlate, title: 'Backlit Wooden Name Plate', description: 'Cut-out lettering and Ram motif lit from behind' },
  { id: 6, category: 'LED Boards', image: IMAGES.kalashreeAcrylicBoard, title: '3D Letter Shop Board', description: 'Raised acrylic Devanagari lettering on a brown panel' },
  { id: 7, category: 'Name Plates', image: IMAGES.woodGrainPlate, title: 'Wood Grain Name Plate', description: 'Raised white letters on a wood-grain panel' },
];

const Works = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWork, setSelectedWork] = useState<typeof works[0] | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Escape closes the lightbox — expected behaviour for any modal image view.
  useEffect(() => {
    if (!selectedWork) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedWork(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedWork]);

  const filteredWorks = selectedCategory === 'All'
    ? works
    : works.filter((work) => work.category === selectedCategory);

  return (
    <section id="works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Our Recent Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-3">
            See Our Work in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Real signage we have designed, built and installed for our customers.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-8">
            Looking for what you can order?{' '}
            <Link to="/catalog" className="font-semibold text-accent hover:underline">
              Browse the full catalog →
            </Link>
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={selectedCategory === category ? 'bg-primary glow-primary' : 'hover:border-accent'}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredWorks.map((work, index) => (
            <motion.div
              // FIX: Using ID + index guarantees uniqueness even if IDs are duplicated
              key={`${work.id}-${index}`} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedWork(work)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedWork(work);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${work.title} larger`}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                src={work.image}
                alt={`${work.title} — ${work.description}`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold mb-2">{work.title}</h3>
                  <p className="text-muted-foreground">{work.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedWork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedWork(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedWork.title}
          className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center p-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedWork(null)}
            className="absolute top-6 right-6 text-foreground hover:text-accent"
          >
            <X className="h-6 w-6" />
          </Button>
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={selectedWork.image}
            alt={selectedWork.title}
            className="max-w-4xl max-h-[80vh] object-contain rounded-2xl"
          />
        </motion.div>
      )}
    </section>
  );
};

export default Works;