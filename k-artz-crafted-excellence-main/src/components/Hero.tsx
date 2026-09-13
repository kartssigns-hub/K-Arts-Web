
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Award, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

// --- DATA ---
/**
 * Hero videos live in public/hero/ and are pre-encoded for instant start:
 * cropped to the card's 4:5 frame (576x720), H.264, no audio track, and
 * "faststart" (index at the front, so playback begins after the first bytes).
 * Each has a first-frame poster so the card is never blank while it loads.
 *
 * public/hero/ is served with a one-year immutable cache (vercel.json), so when
 * replacing a video give it a NEW filename rather than overwriting the old one.
 */
const projects = [
  {
    id: 1,
    client: "",
    type: "Acrylic Plate Designs",
    material: "Premium Acrylic & LED Backlit",
    videoUrl: "/hero/k1.mp4",
    poster: "/hero/k1.jpg",
    fallbackColor: "bg-slate-900",
  },
  {
    id: 2,
    client: "TechSpace Hub",
    type: "Acrylic Plate Designs",
    material: "Acrylic with Neon Effects",
    videoUrl: "/hero/k2.mp4",
    poster: "/hero/k2.jpg",
    fallbackColor: "bg-blue-900",
  },
  {
    id: 3,
    client: "",
    type: "Acrylic Name Plates",
    material: "Acrylic with Brass Standoffs",
    videoUrl: "/hero/nameplate.mp4",
    poster: "/hero/nameplate.jpg",
    fallbackColor: "bg-neutral-900",
  },
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
  const navigate = useNavigate();

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

  // Warm the browser cache with the NEXT slide's poster and video while the
  // current one plays, so each transition starts instantly instead of loading.
  useEffect(() => {
    const next = projects[(imageIndex + 1) % projects.length];
    const links = [
      { href: next.poster, as: "image" },
      { href: next.videoUrl, as: "video" },
    ].map(({ href, as }) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
      return link;
    });

    return () => links.forEach((link) => link.remove());
  }, [imageIndex]);

  return (
    <section id="home" className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center p-4 lg:p-12">
      
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
            Illuminate Your Brand  <span>      Name </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              With Our Signs
            </span>
          </h1>

          <div className="relative pl-6 border-l-2 border-amber-500/50">
            <p className="text-lg text-slate-400 font-light italic leading-relaxed">
              "From modern acrylic name plates to bespoke signage,
we build designs that make people remember you"
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              onClick={() => navigate('/catalog')}
              className="h-14 px-8 text-base bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-full transition-transform hover:scale-105"
            >
              Explore Catalog
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigate('/chat')}
              variant="outline"
              className="h-14 px-8 text-base bg-transparent border-white/20 text-white hover:bg-white hover:text-black rounded-full transition-transform hover:scale-105"
            >
              Let's Get Started
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
                    poster={currentProject.poster}
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