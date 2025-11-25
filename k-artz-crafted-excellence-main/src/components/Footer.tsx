import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            {/* <h3 className="text-2xl font-bold text-gradient mb-4">K'artz</h3> */}
             <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-3xl font-bold text-foreground tracking-wide"
          >
            <span style={{ textShadow: '0 0 10px rgba(0, 123, 255, 0.8)' }}>K'</span>
            <span style={{ textShadow: '0 0 10px rgba(255, 165, 0, 0.8)' }}>artz</span>
          </motion.div>
            <p className="text-muted-foreground">
              Crafting excellence in signage since 1997
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-accent transition-colors">Home</a></li>
              <li><a href="#works" className="text-muted-foreground hover:text-accent transition-colors">Our Works</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-accent transition-colors">Services</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Name Plates</li>
              <li className="text-muted-foreground">LED Boards</li>
              <li className="text-muted-foreground">Commercial Signage</li>
              <li className="text-muted-foreground">Design Consultation</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>+91 9822110512</li>
              <li>k.artz.signs@gmail.com</li>
              <li>Pune, Maharashtra</li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 K'artz. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
