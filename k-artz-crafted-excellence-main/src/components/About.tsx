

import React, { useState, useEffect, useRef } from 'react';

// --- Types ---
type Theme = 'dark' | 'light';

interface AboutProps {
  className?: string;
}

const About: React.FC<AboutProps> = ({ className = '' }) => {
  // --- State ---
  const [theme, setTheme] = useState<Theme>('dark');
  const [isEnlightened, setIsEnlightened] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);

  // Refs for cleanup
  const sweepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Handlers ---
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleEnlightToggle = () => {
    const newState = !isEnlightened;
    setIsEnlightened(newState);

    if (newState) {
      // Trigger sweep animation
      setIsSweeping(true);
      if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current);
      // Reset sweep state after animation duration (1.2s matches CSS)
      sweepTimeoutRef.current = setTimeout(() => setIsSweeping(false), 1200);
    } else {
      setIsSweeping(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current);
    };
  }, []);

  // --- Theme Classes ---
  const bgMain = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f4f4f9]';
  const bgSecondary = theme === 'dark' ? 'bg-[#141414]' : 'bg-white';
  const textMain = theme === 'dark' ? 'text-white' : 'text-zinc-900';
  const textMuted = theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500';
  
  // Dynamic Metallic Gradients for Text
  const silverGradient = "bg-gradient-to-br from-zinc-400 via-white to-zinc-500";
  const goldGradient = "bg-gradient-to-br from-yellow-600 via-yellow-200 to-yellow-600";
  
  return (
    <div className={`relative w-full min-h-screen font-sans transition-colors duration-300 ease-in-out ${bgMain} ${className}`}>
      {/* Custom Styles for specific animations */}
      <style>{`
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 15px rgba(253, 224, 71, 0.3), inset 0 0 10px rgba(253, 224, 71, 0.1); border-color: rgba(253, 224, 71, 0.4); }
          50% { box-shadow: 0 0 30px rgba(253, 224, 71, 0.6), inset 0 0 20px rgba(253, 224, 71, 0.3); border-color: rgba(253, 224, 71, 0.8); }
        }
        @keyframes sweepAnim {
          0% { transform: translateX(-150%) skewX(-25deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(150%) skewX(-25deg); opacity: 0; }
        }
        .gold-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
        .sweep-effect {
          animation: sweepAnim 1.2s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }
        /* Custom font for logo */
        .font-display { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* --- Main Layout --- */}
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        
        {/* --- Theme Toggle (Absolute Top Right) --- */}
        

        {/* --- LEFT SIDE: Kartz Nameplate (60% Width) --- */}
        <section className="relative flex-none w-full lg:w-[50%] min-h-[500px] lg:min-h-screen  flex flex-col items-center justify-center p-8 overflow-hidden">
          {/* Background Texture/Glow for Studio Ambience */}
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#1a120e_0%,#000000_70%)] opacity-80 pointer-events-none" /> */}

          {/* WRAPPER FOR PLATE 
              Replaced the rotating neon div with a static golden border wrapper 
              that has the 'gold-breathe' animation.
          */}
          <div className="relative p-[10px] rounded-xl gold-breathe border-2 border-yellow-200/50">
            
            {/* The Plate Itself */}
            <div className="relative z-10 w-full max-w-[520px] h-[220px] rounded-lg border-2 border-white/5 shadow-2xl flex items-center justify-center overflow-hidden px-12"
                 style={{ 
                   /* Dark Wood Texture Simulation:
                      1. Radial gradient for lighting (vignette).
                      2. Repeating linear gradient for horizontal wood grain lines.
                      3. Base dark reddish-brown color (#3d120e).
                   */
                   background: `
                     radial-gradient(circle at center, rgba(70, 25, 20, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%),
                     repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0, 0, 0, 0.2) 2px, transparent 4px), 
                     linear-gradient(90deg, #3d120e, #2b0a08)
                   `,
                   boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8), 0 10px 25px rgba(0,0,0,0.5)'
                 }}>
              
              {/* The Text Effect - Changed casing and removed uppercase class */}
              <h1 
                className={`
                  relative m-0 font-display text-[clamp(60px,12vw,110px)] font-black tracking-[2px] leading-none
                  text-transparent bg-clip-text transition-all duration-700
                  drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]
                  ${isEnlightened ? goldGradient : silverGradient}
                `}
                style={{
                  textShadow: isEnlightened ? '0 0 30px rgba(255, 215, 0, 0.4)' : 'none'
                }}
              >
                K'artz
                
                {/* The Golden Sweep Overlay */}
                <span 
                  className={`absolute top-0 left-0 w-full h-full pointer-events-none bg-clip-text text-transparent bg-gradient-to-r from-transparent via-white to-transparent opacity-0 ${isSweeping ? 'sweep-effect' : ''}`}
                  aria-hidden="true"
                >
                  K'artz
                </span>
              </h1>
            </div>
          </div>

          {/* Enlight Button - Now positioned relative to the flex container with margin-top (gap) */}
          <button
            onClick={handleEnlightToggle}
            aria-pressed={isEnlightened}
            className={`
              mt-12
              px-8 py-3 rounded-full font-semibold text-sm tracking-widest uppercase
              backdrop-blur-md border transition-all duration-300 shadow-lg group
              flex items-center gap-2 z-20
              ${isEnlightened 
                ? 'bg-neutral-900/90 border-yellow-400 text-yellow-400 shadow-yellow-900/20 scale-105' 
                : 'bg-neutral-900/80 border-white/20 text-zinc-300 hover:border-white hover:text-white'
              }
            `}
          >
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${isEnlightened ? 'bg-yellow-400 shadow-[0_0_8px_currentColor]' : 'bg-zinc-500'}`} />
            Glow It !
          </button>

        </section>

        {/* --- RIGHT SIDE: About Content (40% Width) --- */}
        <section className={`flex-none w-full lg:w-[50%] flex flex-col justify-center px-8 py-12 lg:p-20  transition-colors duration-300`}>
          <div className="max-w-xl mx-auto w-full">
            
            <h2 className={`text-4xl lg:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-zinc-500' : 'from-zinc-900 to-zinc-500'}`}>
              About Kartz
            </h2>

            <p className={`text-lg leading-relaxed ${textMuted}`}>
              Kartz specializes in bespoke identity craftsmanship, merging traditional metalwork with modern illumination. Our signature silver cutout aesthetics are framed by dynamic neon borders and interactive lighting.
              <br /><br />
              We believe every sign tells a story. From the raw materials to the final polish, our process is designed to create a lasting impression that resonates with your brand's unique voice and vision.
              <br /><br />
              Experience the fusion of art and engineering.
            </p>

          </div>
        </section>
      </div>
    </div>
  );
};

export default About;