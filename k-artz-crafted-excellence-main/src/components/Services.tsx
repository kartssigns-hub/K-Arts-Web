
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    id: '01',
    title: 'Signature Name Plates',
    description: 'Acrylic, brass, and steel name plates crafted to reflect your identity with unmatched clarity.',
    features: ['Deep Engraving', 'Floating Designs', 'Premium Finishes'],
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    id: '02',
    title: 'Illuminated LED Signage',
    description: 'Modern LED signage that makes your brand stand out day or night with energy-efficient glows.',
    features: ['Soft Glow LEDs', 'Weather-Resistant', 'Energy Efficient'],
    accent: 'from-yellow-400 to-orange-500',
  },
  {
    id: '03',
    title: 'Commercial Branding',
    description: 'High-impact signage crafted for offices, shops, and commercial spaces that demand attention.',
    features: ['Indoor & Outdoor', '3D Lettering', 'Custom Dimensions'],
    accent: 'from-purple-500 to-pink-500',
  },
  {
    id: '04',
    title: 'Design Consultation',
    description: 'Personalized guidance to help you choose the perfect design, material, and finish.',
    features: ['Visual Mockups', '3D Previews', 'Expert Guidance'],
    accent: 'from-emerald-400 to-teal-500',
  },
];

const ServiceCard = ({ service }: { service: typeof services[0] }) => {
  return (
    <div className="relative w-[400px] h-[420px] mx-4 flex-shrink-0 group">
      <div className="h-full bg-background/50 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden transition-all duration-500 hover:border-white/20">
        
        {/* Background Gradient Blob (Visible on Hover) */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-700 rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2`} />

        {/* Top Section: Stylized Number */}
        <div className="mb-8 relative">
           <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-foreground/10 to-transparent select-none font-mono tracking-tighter">
            {service.id}
          </span>
          <div className={`absolute bottom-2 left-1 w-12 h-1 bg-gradient-to-r ${service.accent} rounded-full`} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {service.description}
          </p>

          {/* Features */}
          <ul className="space-y-2">
            {service.features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-muted-foreground/80">
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.accent} mr-3`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] -z-10" />

      <div ref={ref} className="container mx-auto px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6">
            Services Designed for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Impact & Durability
            </span>
          </h2>
        </motion.div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Side Fades for smooth entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div className="flex">
          <motion.div
            className="flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40, // Adjust speed: Higher = Slower
            }}
          >
            {/* We duplicate the array twice to ensure a seamless loop without gaps */}
            {[...services, ...services].map((service, index) => (
              <ServiceCard key={`${service.id}-${index}`} service={service} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;