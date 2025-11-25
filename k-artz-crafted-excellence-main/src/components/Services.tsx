// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { Sparkles, Lightbulb, Zap, PenTool } from 'lucide-react';

// const services = [
//   {
//     icon: PenTool,
//     title: 'Custom Name Plates',
//     description: 'Personalized name plates in brass, acrylic, steel, and premium materials with precision engraving.',
//     features: ['Laser Engraving', '3D Designs', 'Premium Materials'],
//   },
//   {
//     icon: Lightbulb,
//     title: 'LED Board Solutions',
//     description: 'Eye-catching LED displays for storefronts, events, and advertising with vibrant colors.',
//     features: ['RGB LEDs', 'Weatherproof', 'Energy Efficient'],
//   },
//   {
//     icon: Zap,
//     title: 'Commercial Signage',
//     description: 'Professional signage solutions for businesses, offices, and commercial spaces.',
//     features: ['Indoor & Outdoor', 'Illuminated Options', 'Custom Sizes'],
//   },
//   {
//     icon: Sparkles,
//     title: 'Design Consultation',
//     description: 'Expert guidance on design, materials, and installation for your perfect signage solution.',
//     features: ['Free Mockups', '3D Previews', 'Expert Advice'],
//   },
// ];

// const Services = () => {
//   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

//   return (
//     <section id="services" className="py-24 relative overflow-hidden">
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
//       </div>

//       <div ref={ref} className="container mx-auto px-6 relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Our <span className="text-gradient">Services</span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Comprehensive signage solutions tailored to your needs
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {services.map((service, index) => (
//             <motion.div
//               key={service.title}
//               initial={{ opacity: 0, y: 50 }}
//               animate={inView ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.6, delay: index * 0.15 }}
//               whileHover={{
//                 rotateY: 5,
//                 rotateX: 5,
//                 scale: 1.05,
//               }}
//               style={{ transformStyle: 'preserve-3d' }}
//               className="glass p-8 rounded-2xl group cursor-pointer relative overflow-hidden"
//             >
//               {/* Animated background gradient */}
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                 initial={false}
//               />

//               <div className="relative z-10">
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 360 }}
//                   transition={{ duration: 0.6 }}
//                   className="w-16 h-16 mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center glow-primary"
//                 >
//                   <service.icon className="h-8 w-8 text-primary-foreground" />
//                 </motion.div>

//                 <h3 className="text-2xl font-bold mb-4 group-hover:text-gradient transition-all">
//                   {service.title}
//                 </h3>
                
//                 <p className="text-muted-foreground mb-6">
//                   {service.description}
//                 </p>

//                 <ul className="space-y-2">
//                   {service.features.map((feature) => (
//                     <motion.li
//                       key={feature}
//                       whileHover={{ x: 10 }}
//                       className="flex items-center text-sm"
//                     >
//                       <span className="w-2 h-2 bg-accent rounded-full mr-3" />
//                       {feature}
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Services;
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Lightbulb, Zap, PenTool } from 'lucide-react';

const services = [
  {
    icon: PenTool,
    title: 'Signature Name Plates',
    description: 'Acrylic, brass, and steel name plates crafted to reflect your identity with unmatched clarity and detail.',
    features: ['Deep Engraving', 'Floating Acrylic Designs', 'Premium Finishes'],
  },
  {
    icon: Lightbulb,
    title: 'Illuminated LED Sign Boards',
    description: 'Modern LED signage that makes your name or brand stand out—day or night.',
    features: ['Soft Glow LEDs', 'Weather-Resistant', 'Energy Efficient'],
  },
  {
    icon: Zap,
    title: 'Brand & Business Signage',
    description: 'High-impact signage crafted for offices, shops, and commercial spaces that demand attention.',
    features: ['Indoor & Outdoor Builds', 'Illuminated Options', 'Custom Dimensions'],
  },
  {
    icon: Sparkles,
    title: 'Design & Concept Consultation',
    description: 'Personalized guidance to help you choose the perfect design, material, and finish for your unique style.',
    features: ['Free Visual Mockups', '3D Previews', 'Expert Recommendations'],
  },
];


const ServiceCard = ({ service }: { service: typeof services[0] }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      // rotateZ: 2,
    }}
    className="glass p-8 rounded-2xl group cursor-pointer relative overflow-hidden flex-shrink-0 w-[350px] md:w-[400px] mx-4"
  >
    {/* Animated background gradient */}
    <motion.div
      className="absolute inset-0  from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      initial={false}
    />

    <div className="relative z-10">
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.9 }}
        className="w-16 h-16 mb-6 bg-yellow-500 from-primary to-accent rounded-2xl flex items-center justify-center glow-primary"
      >
        <service.icon className="h-8 w-8 text-primary-foreground" />
      </motion.div>

      <h3 className="text-2xl font-bold mb-4 group-hover:text-gradient transition-all">
        {service.title}
      </h3>

      <p className="text-muted-foreground mb-6 text-sm">
        {service.description}
      </p>

      <ul className="space-y-2">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center text-sm">
            <span className="w-2 h-2 bg-accent rounded-full mr-3" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
      </div>

      <div ref={ref} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16 container mx-auto px-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-blue-300">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive signage solutions tailored to your needs
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="flex flex-col gap-8 overflow-hidden mask-gradient-horizontal">
          
          {/* Row 1: Left to Right (>>>>>) */}
          {/* We animate from -50% to 0% to create the illusion of moving right */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex"
              initial={{ x: "-50%" }}
              animate={{ x: "0%" }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 90, // Adjust speed here
              }}
            >
              {/* Render list twice to create seamless loop */}
              {[...services, ...services, ...services].map((service, index) => (
                <ServiceCard key={`row1-${index}`} service={service} />
              ))}
            </motion.div>
          </div>

          {/* Row 2: Right to Left (<<<<<) */}
          {/* We animate from 0% to -50% to create the illusion of moving left */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex"
              initial={{ x: "0%" }}
              animate={{ x: "-50%" }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 90, // Adjust speed here
              }}
            >
               {/* Render list twice to create seamless loop */}
               {[...services, ...services, ...services].map((service, index) => (
                <ServiceCard key={`row2-${index}`} service={service} />
              ))}
            </motion.div>
          </div>

        </div>
      </div>
      
      {/* Optional: Add gradient masks to sides to fade content out */}
      <style >{`
        .mask-gradient-horizontal {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
};

export default Services;