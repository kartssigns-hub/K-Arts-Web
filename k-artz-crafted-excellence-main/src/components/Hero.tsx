// import { motion, useScroll, useTransform } from 'framer-motion';
// import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
// import { Button } from './ui/button';
// import heroImage from '@/assets/hero-signage.jpg';

// const Hero = () => {
//   const { scrollY } = useScroll();
//   const y = useTransform(scrollY, [0, 500], [0, 150]);
//   const opacity = useTransform(scrollY, [0, 300], [1, 0]);

//   return (
//     <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Parallax Background */}
//       <motion.div
//         style={{ y }}
//         className="absolute inset-0 z-0"
//       >
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage: `url(${heroImage})`,
//             filter: 'brightness(0.4)',
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
//       </motion.div>

//       {/* Animated Glow Orbs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.5, 0.3],
//           }}
//           transition={{ duration: 4, repeat: Infinity }}
//           className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{
//             scale: [1, 1.3, 1],
//             opacity: [0.3, 0.5, 0.3],
//           }}
//           transition={{ duration: 5, repeat: Infinity, delay: 1 }}
//           className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
//         />
//       </div>

//       {/* Content */}
//       <motion.div
//         style={{ opacity }}
//         className="relative z-10 container mx-auto px-6 text-center"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="mb-6"
//         >
//           <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/20 rounded-full border border-accent/30 mb-8">
//             <Sparkles className="h-4 w-4 text-accent" />
//             <span className="text-sm text-accent font-medium">Crafting Excellence Since 1997</span>
//           </div>
//         </motion.div>

//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
//         >
//           <span className="block">28 Years of</span>
//           <span className="text-gradient">Crafting Excellence</span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//           className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
//         >
//           Premium name plates, LED boards, and signage solutions that illuminate your brand's identity
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.6 }}
//           className="flex flex-col sm:flex-row items-center justify-center gap-4"
//         >
//           <Button
//             size="lg"
//             className="bg-primary hover:bg-primary/90 glow-primary text-lg px-8 py-6 group"
//           >
//             Explore Our Works
//             <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//           </Button>
//           <Button
//             size="lg"
//             variant="outline"
//             className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-6"
//           >
//             Get a Quote
//           </Button>
//         </motion.div>

//         {/* Scroll Indicator */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.2 }}
//           className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
//         >
//           <motion.div
//             animate={{ y: [0, 10, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//             className="w-6 h-10 border-2 border-accent rounded-full flex items-start justify-center p-2"
//           >
//             <motion.div className="w-1 h-2 bg-accent rounded-full" />
//           </motion.div>
//         </motion.div>
//       </motion.div>

//       {/* Floating WhatsApp Button */}
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         transition={{ delay: 1, type: 'spring' }}
//         className="fixed bottom-8 right-8 z-50"
//       >
//         <motion.div
//           animate={{ y: [0, -10, 0] }}
//           transition={{ duration: 2, repeat: Infinity }}
//         >
//           <Button
//             size="lg"
//             className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 glow-accent shadow-2xl"
//           >
//             <MessageCircle className="h-8 w-8" />
//           </Button>
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// };

// export default Hero;

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowRight, Play, Star, Quote, Award, ArrowUpRight } from 'lucide-react';
// import { Button } from './ui/button';

// // --- DATA: Mock Projects for the Right Side Card Deck ---
// const projects = [
//   {
//     id: 1,
//     client: "Luxe Hotel & Spa",
//     type: "Architectural Signage",
//     material: "Brushed Gold & LED",
//     videoColor: "bg-amber-900", // Placeholder for actual video
//   },
//   {
//     id: 2,
//     client: "TechSpace Hub",
//     type: "Neon Branding",
//     material: "Acrylic & Neon Flex",
//     videoColor: "bg-blue-900",
//   },
//   {
//     id: 3,
//     client: "Urban Coffee Co.",
//     type: "3D Lettering",
//     material: "Matte Black Steel",
//     videoColor: "bg-stone-800",
//   }
// ];

// const Hero = () => {
//   const [activeCard, setActiveCard] = useState(0);

//   // Auto-cycle the cards on the right
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveCard((prev) => (prev + 1) % projects.length);
//     }, 4000); // Change every 4 seconds
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center p-4 lg:p-12">
      
//       {/* --- BACKGROUND: Lightweight 3D Mesh Gradient --- */}
//       <div className="absolute inset-0 z-0 overflow-hidden">
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             rotate: [0, 15, 0],
//           }}
//           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//           className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[120px]"
//         />
//         <motion.div
//           animate={{
//             scale: [1, 1.3, 1],
//             rotate: [0, -20, 0],
//           }}
//           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//           className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-amber-600/10 rounded-full blur-[120px]"
//         />
//         {/* Grain overlay for texture */}
//         <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
//       </div>

//       <div className="container mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
//         {/* --- LEFT COL: Content & Narrative --- */}
//         <div className="space-y-8 text-left">
          
//           {/* Badge */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
//           >
//             <Award className="w-4 h-4 text-amber-400" />
//             <span className="text-xs font-semibold tracking-widest text-slate-300 uppercase">
//               Family Owned Since 1997
//             </span>
//           </motion.div>

//           {/* Headline */}
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
//           >
//             We don't just make signs. <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
//               We build legacies.
//             </span>
//           </motion.h1>

//           {/* Quote / Subhead */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="relative pl-6 border-l-2 border-amber-500/50"
//           >
//             <p className="text-lg text-slate-400 font-light italic leading-relaxed">
//               "A sign is the first handshake between you and your customer. For 28 years, my father taught us that this handshake must be firm, warm, and unforgettable."
//             </p>
//           </motion.div>

//           {/* CTAs */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="flex flex-wrap gap-4 pt-4"
//           >
//             <Button className="h-14 px-8 text-base bg-white text-black hover:bg-slate-200 rounded-full transition-transform hover:scale-105">
//               Start Your Project
//               <ArrowRight className="ml-2 w-4 h-4" />
//             </Button>
//             <Button variant="outline" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 rounded-full">
//               View Showreel
//               <Play className="ml-2 w-4 h-4 fill-current" />
//             </Button>
//           </motion.div>

//           {/* Social Proof / Stats */}
//           <motion.div 
//              initial={{ opacity: 0 }}
//              animate={{ opacity: 1 }}
//              transition={{ delay: 1 }}
//              className="pt-8 flex items-center gap-8 border-t border-white/5"
//           >
//             <div>
//               <h4 className="text-3xl font-bold text-white">2k+</h4>
//               <p className="text-sm text-slate-500">Brands Crafted</p>
//             </div>
//             <div>
//               <h4 className="text-3xl font-bold text-white">100%</h4>
//               <p className="text-sm text-slate-500">Handmade Quality</p>
//             </div>
//           </motion.div>
//         </div>

//         {/* --- RIGHT COL: Visual Deck & Video Rendering --- */}
//         <div className="relative h-[500px] w-full flex items-center justify-center perspective-1000">
          
//           <AnimatePresence mode='wait'>
//             <motion.div
//               key={activeCard}
//               initial={{ opacity: 0, rotateX: -10, y: 50, scale: 0.9 }}
//               animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
//               exit={{ opacity: 0, rotateX: 10, y: -50, scale: 0.9 }}
//               transition={{ duration: 0.6, ease: "circOut" }}
//               className="relative w-full max-w-md aspect-[4/5] bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50 group cursor-pointer"
//             >
              
//               {/* Fake Video/Image Container */}
//               <div className={`absolute inset-0 ${projects[activeCard].videoColor} transition-colors duration-1000`}>
//                 {/* Overlay Gradient */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                
//                 {/* Play Button Icon (Centered) */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
//                         <Play className="w-6 h-6 text-white fill-white" />
//                     </div>
//                 </div>
//               </div>

//               {/* Card Content (Bottom) */}
//               <div className="absolute bottom-0 left-0 right-0 p-8">
//                 <div className="flex justify-between items-end mb-4">
//                   <div>
//                     <motion.p 
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="text-amber-400 text-sm font-medium mb-1 tracking-wider uppercase"
//                     >
//                       {projects[activeCard].type}
//                     </motion.p>
//                     <motion.h3 
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="text-3xl font-bold text-white"
//                     >
//                       {projects[activeCard].client}
//                     </motion.h3>
//                   </div>
//                   <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white">
//                     <ArrowUpRight className="w-5 h-5" />
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
//                    <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-300 border border-white/5">
//                       {projects[activeCard].material}
//                    </div>
//                    <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-300 border border-white/5">
//                       2024 Collection
//                    </div>
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* Decorative Back Cards (Creating depth stack) */}
//           <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[85%] h-[80%] bg-slate-800/50 rounded-3xl border border-white/5 blur-[1px]" />
//           <div className="absolute -z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[75%] h-[80%] bg-slate-800/30 rounded-3xl border border-white/5 blur-[2px]" />

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Award, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';

// --- DATA ---
const projects = [
  {
    id: 1,
    client: "Luxe Hotel & Spa",
    type: "Architectural Signage",
    material: "Brushed Gold & LED",
    // Ensure your videos are compressed for web (H.264 / mp4) for 60fps performance
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", 
    fallbackColor: "bg-amber-900", // Shows while video loads
  },
  {
    id: 2,
    client: "TechSpace Hub",
    type: "Neon Branding",
    material: "Acrylic & Neon Flex",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    fallbackColor: "bg-blue-900",
  },
  {
    id: 3,
    client: "Urban Coffee Co.",
    type: "3D Lettering",
    material: "Matte Black Steel",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    fallbackColor: "bg-stone-800",
  }
];

// Optimized Variants for GPU-accelerated transitions
const variants = {
  enter: (direction: number) => ({
    x: 300,
    opacity: 0,
    scale: 0.85,
    rotateY: 10,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: -300,
    opacity: 0,
    scale: 0.85,
    rotateY: -10,
  })
};

const Hero = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  // Calculate current index
  const imageIndex = Math.abs(page % projects.length);
  const currentProject = projects[imageIndex];

  // --- AUTO SLIDE LOGIC (8 Seconds) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setPage([page + 1, 1]); 
    }, 8000); 

    return () => clearInterval(timer);
  }, [page]);

  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center p-4 lg:p-12">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-amber-600/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* --- LEFT COL: Text Content --- */}
        <div className="space-y-8 text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold tracking-widest text-slate-300 uppercase">
               Since 1997
            </span>
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Your Name.  <span>       Your Story. </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Our Craft.
            </span>
          </h1>

          <div className="relative pl-6 border-l-2 border-amber-500/50">
            <p className="text-lg text-slate-400 font-light italic leading-relaxed">
              "From modern acrylic plates to bespoke signage,
we build designs that make people remember you"
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="h-14 px-8 text-base bg-white text-black hover:bg-slate-200 rounded-full transition-transform hover:scale-105">
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* --- RIGHT COL: Video Card Deck --- */}
        <div className="relative h-[600px] w-full flex flex-col items-center justify-center perspective-1000 order-1 lg:order-2">
          
          <div className="relative w-full max-w-md aspect-[4/5] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.4 },
                  rotateY: { duration: 0.5 }
                }}
                className="absolute w-full h-full bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50"
              >
                
                {/* --- VIDEO LAYER (Always Playing) --- */}
                <div className={`absolute inset-0 ${currentProject.fallbackColor}`}>
                  <video
                    key={currentProject.videoUrl} // Key ensures video reloads on change
                    src={currentProject.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                  
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                </div>

                {/* --- TEXT INFO --- */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <motion.p 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.2 }}
                         className="text-amber-400 text-sm font-medium mb-1 tracking-wider uppercase"
                      >
                        {currentProject.type}
                      </motion.p>
                      <motion.h3 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3 }}
                         className="text-3xl font-bold text-white"
                      >
                        {currentProject.client}
                      </motion.h3>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-sm">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Progress Bar (Visual Timer) */}
                  <div className="w-full h-1 bg-white/20 rounded-full mt-6 overflow-hidden">
                    <motion.div 
                       key={page}
                       initial={{ width: "0%" }}
                       animate={{ width: "100%" }}
                       transition={{ duration: 8, ease: "linear" }}
                       className="h-full bg-amber-500"
                    />
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Back Stack Visuals */}
            <div className="absolute -z-10 top-4 scale-95 opacity-50 w-full h-full bg-slate-800 rounded-3xl border border-white/5" />
          </div>

          {/* Active Pill Indicator */}
          <div className="mt-8 flex gap-3">
            {projects.map((_, i) => (
              <div 
                key={i} 
                className={`transition-all duration-500 rounded-full ${i === imageIndex ? 'w-8 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'w-2 bg-white/20' } h-2`} 
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;