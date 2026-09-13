import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { buildWhatsAppLink, generalEnquiryMessage } from '@/config/business';
import WhatsAppIcon from './catalog/WhatsAppIcon';

/**
 * Floating WhatsApp button.
 *
 * Appears once the visitor has scrolled past the hero, and hides itself while
 * the "Not sure what you need?" band is on screen so the two CTAs never sit on
 * top of each other.
 */
const WhatsAppFloat = () => {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [ctaOnScreen, setCtaOnScreen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > 500);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const cta = document.getElementById('get-quote');
    if (!cta) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCtaOnScreen(entry.isIntersecting),
      { threshold: 0.15 },
    );

    observer.observe(cta);
    return () => observer.disconnect();
  }, []);

  const visible = scrolledPastHero && !ctaOnScreen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.2 }}
          href={buildWhatsAppLink(generalEnquiryMessage())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Send your requirement on WhatsApp"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#0b141a] shadow-lg shadow-black/40 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-8 md:right-8"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppFloat;
