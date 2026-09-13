import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BUSINESS,
  buildWhatsAppLink,
  generalEnquiryMessage,
  yearsInBusiness,
} from '@/config/business';
import { sortedCategories } from '@/data/catalog';
import WhatsAppIcon from './catalog/WhatsAppIcon';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Services', to: '/#services' },
  { label: 'Catalog', to: '/catalog' },
  { label: 'Portfolio', to: '/#works' },
  { label: 'Contact', to: '/contact' },
];

const Footer = () => {
  // Only render social icons the business has actually given us a link for.
  const socialLinks = [
    { icon: Instagram, href: BUSINESS.social.instagram, label: 'Instagram' },
    { icon: Facebook, href: BUSINESS.social.facebook, label: 'Facebook' },
    { icon: Linkedin, href: BUSINESS.social.linkedin, label: 'LinkedIn' },
  ].filter((social) => social.href);

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold text-foreground tracking-wide inline-block"
            >
              <span style={{ textShadow: '0 0 10px rgba(0, 123, 255, 0.8)' }}>K'</span>
              <span style={{ textShadow: '0 0 10px rgba(255, 165, 0, 0.8)' }}>artz</span>
            </motion.div>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Crafting excellence in signage since {BUSINESS.established} — {yearsInBusiness()}{' '}
              years of name plates, LED boards and custom signage.
            </p>

            <a
              href={buildWhatsAppLink(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-[#0b141a] transition-colors hover:bg-[#1ebe5b]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Catalog */}
          <nav aria-label="Catalog categories">
            <h4 className="font-semibold mb-4">Our Catalog</h4>
            <ul className="space-y-2">
              {sortedCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/catalog/${category.slug}`}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a
                  href={BUSINESS.phoneHref}
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.emailHref}
                  className="flex items-center gap-2 break-all hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                {BUSINESS.city}
              </li>
            </ul>

            {BUSINESS.hours && (
              <p className="mt-4 text-sm text-muted-foreground">{BUSINESS.hours}</p>
            )}
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>

          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
