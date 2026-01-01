
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust path as needed

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'CEO, TechCorp Solutions',
    content: 'K\'artz delivered exceptional quality LED boards for our office. The attention to detail and professional service exceeded our expectations!',
    rating: 5.0,
    initials: 'RK',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Owner, Boutique Café',
    content: 'The custom name plates and signage transformed our café\'s aesthetic. Their design team understood our vision perfectly.',
    rating: 5.0,
    initials: 'PS',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Marketing Director, RetailHub',
    content: 'Outstanding craftsmanship and quick turnaround time. K\'artz has been our go-to partner for all signage needs for 5 years now.',
    rating: 4.9,
    initials: 'AP',
    gradient: 'from-orange-500 to-yellow-500'
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Decor - consistent with Services */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Client Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
             Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Industry Leaders</span>
          </h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative min-h-[400px]"> {/* Fixed height container to prevent layout jumping */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="relative z-10"
              >
                {/* Main Testimonial Card */}
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  
                  {/* Left: The "Digital Name Plate" (Avatar Replacement) */}
                  <div className="flex-shrink-0 relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentIndex].gradient} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                    <div className="relative w-40 h-40 rounded-full border border-white/10 bg-background/50 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-2xl">
                      {/* Metallic sheen effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                      
                      <span className="text-4xl font-bold tracking-tighter text-foreground/80">
                        {testimonials[currentIndex].initials}
                      </span>
                    </div>
                    {/* Floating Rating Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-background border border-border/50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                         <Star className="w-4 h-4 fill-primary text-primary" />
                         <span className="font-mono font-bold text-sm">{testimonials[currentIndex].rating}/5.0</span>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 text-center md:text-left relative">
                    {/* The "Good Thing": Giant Architectural Quote Mark */}
                    <Quote className="absolute -top-12 -left-8 w-32 h-32 text-primary/5 rotate-180 -z-10" />
                    
                    <p className="text-xl md:text-xl font-light leading-relaxed mb-8 text-foreground/90 font-serif italic">
                      "{testimonials[currentIndex].content}"
                    </p>
                    
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold tracking-tight">{testimonials[currentIndex].name}</h4>
                      <p className="text-primary text-sm uppercase tracking-wide font-medium">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls - Minimalist and Clean */}
          <div className="flex items-center justify-between mt-2 border-t border-border/10 pt-2">
            <div className="flex gap-2">
               {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-12 bg-primary' : 'w-4 bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={prev}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={next}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
