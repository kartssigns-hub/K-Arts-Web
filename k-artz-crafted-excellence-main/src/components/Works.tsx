

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const categories = ['All', 'Name Plates', 'LED Boards', 'Signage'];

const works = [
  { id: 1, category: 'Name Plates', image: '/Aadams.png', title: 'Brass Name Plate', description: 'Premium engraved brass finish' },
  { id: 2, category: 'LED Boards', image: '/ledb2.png', title: 'Storefront LED', description: 'Vibrant outdoor LED display' },
  { id: 3, category: 'Signage', image: '/sign1.png', title: 'Corporate Signage', description: '3D illuminated company logo' },
  { id: 4, category: 'Name Plates', image: '/plate2.png', title: 'Acrylic Name Plate', description: 'Modern transparent design' },
  { id: 5, category: 'LED Boards', image: '/ledb1.png', title: 'Digital Menu Board', description: 'Restaurant LED display' },
  { id: 6, category: 'Signage', image: '/sign2.png', title: 'Directional Signs', description: 'Interior wayfinding system' },
  
  { id: 7, category: 'Name Plates', image: '/plate3.png', title: 'Directional Signs', description: 'Interior wayfinding system' },
];

const Works = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWork, setSelectedWork] = useState<typeof works[0] | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-yellow-100">  Works </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our portfolio of stunning signage solutions
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
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl"
            >
              <img
                src={work.image}
                alt={work.title}
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