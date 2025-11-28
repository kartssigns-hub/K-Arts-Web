import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from './ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'CEO, TechCorp Solutions',
    content: 'K\'artz delivered exceptional quality LED boards for our office. The attention to detail and professional service exceeded our expectations!',
    rating: 5,
    // image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Owner, Boutique Café',
    content: 'The custom name plates and signage transformed our café\'s aesthetic. Their design team understood our vision perfectly.',
    rating: 5,
    // image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Marketing Director, RetailHub',
    content: 'Outstanding craftsmanship and quick turnaround time. K\'artz has been our go-to partner for all signage needs for 5 years now.',
    rating: 5,
    // image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client <span className="text-green-200">Testimonials</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="glass p-12 rounded-3xl"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  // src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary glow-primary"
                />
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  <p className="text-lg md:text-xl mb-6 text-foreground italic">
                    "{testimonials[currentIndex].content}"
                  </p>
                  
                  <div>
                    <h4 className="font-bold text-lg">{testimonials[currentIndex].name}</h4>
                    <p className="text-muted-foreground">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={prev}
              variant="outline"
              size="icon"
              className="rounded-full border-accent hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={next}
              variant="outline"
              size="icon"
              className="rounded-full border-accent hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-accent w-8' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
