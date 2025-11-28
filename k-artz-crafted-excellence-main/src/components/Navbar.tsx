

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { MessageCircle, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";
import { Link, Router,useNavigate } from "react-router-dom";


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate=useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Our Works", href: "#works" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* --- MODIFIED LOGO SECTION --- */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col cursor-pointer" // Used flex-col to stack items
          >
            {/* Main Title */}
            <div className="text-3xl font-bold text-foreground tracking-wide leading-none">
              <span style={{ textShadow: "0 0 10px rgba(0, 123, 255, 0.8)" }}>
                K'
              </span>
              
              <span style={{ textShadow: "0 0 10px rgba(255, 165, 0, 0.8)" }}>
                artz
              </span>
            </div>
            {/* Sub Title */}
            <hr className="bg-white h-[2px]"/>
            <span className="text-[10px]  font-medium text-slate-100 tracking-widest  uppercase  opacity-80">
              Kalashree Arts
            </span>
          </motion.div>
          {/* ----------------------------- */}

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, color: "hsl(var(--accent))" }}
                className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-accent hover:bg-accent/10"
                onClick={()=>navigate('/chat')}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-white hidden sm:block">
                    {user.displayName}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Logout
                  </button>
                  <Link
                    to="/dashboard"
                    className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold overflow-hidden"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      user.displayName?.charAt(0) || "U"
                    )}
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                   Login
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;