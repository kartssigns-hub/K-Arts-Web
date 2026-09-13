import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { MessageCircle, LogIn, Menu, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "./ui/sheet";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BUSINESS, buildWhatsAppLink, generalEnquiryMessage } from "@/config/business";
import WhatsAppIcon from "./catalog/WhatsAppIcon";
import { cn } from "@/lib/utils";

/**
 * Nav links.
 *
 * Homepage sections are addressed as "/#id" rather than bare "#id" so they
 * still work from /catalog and /contact — a bare hash on another route only
 * changes the fragment and scrolls nowhere.
 */
const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Catalog", href: "/catalog", emphasis: true },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const isActive = (href: string) =>
    href === "/catalog"
      ? location.pathname.startsWith("/catalog")
      : href === location.pathname;

  const Logo = () => (
    <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col">
      <div className="text-3xl font-bold text-foreground tracking-wide leading-none">
        <span style={{ textShadow: "0 0 10px rgba(0, 123, 255, 0.8)" }}>K'</span>
        <span style={{ textShadow: "0 0 10px rgba(255, 165, 0, 0.8)" }}>artz</span>
      </div>
      <hr className="bg-white h-[2px]" />
      <span className="text-[10px] font-medium text-slate-100 tracking-widest uppercase opacity-80">
        Kalashree Arts
      </span>
    </motion.div>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* --- Logo --- */}
          <Link to="/" aria-label="K'artz — home" className="shrink-0">
            <Logo />
          </Link>

          {/* --- Desktop navigation --- */}
          <div className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Link
                  to={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "font-medium transition-colors duration-300 hover:text-accent",
                    link.emphasis
                      ? "rounded-full border border-accent/40 px-4 py-1.5 text-accent hover:bg-accent/10"
                      : "text-foreground",
                    isActive(link.href) && !link.emphasis && "text-accent",
                  )}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* --- Actions --- */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open chat"
                className="text-foreground hover:text-accent hover:bg-accent/10"
                onClick={() => navigate("/chat")}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* --- Auth (unchanged behaviour) --- */}
            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-white hidden xl:block">{user.displayName}</span>
                  <button
                    onClick={() => logout()}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Logout
                  </button>
                  <Link
                    to="/dashboard"
                    aria-label="Your dashboard"
                    className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold overflow-hidden"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.displayName?.charAt(0) || "U"
                    )}
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>

            {/* --- Mobile menu --- */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="lg:hidden text-foreground hover:text-accent hover:bg-accent/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                aria-describedby={undefined}
                className="w-full max-w-sm border-l border-border bg-background p-0"
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>

                <div className="flex h-full flex-col">
                  <div className="border-b border-border p-6 pr-16">
                    <Logo />
                  </div>

                  <nav className="flex-1 overflow-y-auto p-6">
                    <ul className="space-y-1">
                      {navLinks.map((link) => (
                        <li key={link.name}>
                          <SheetClose asChild>
                            <Link
                              to={link.href}
                              aria-current={isActive(link.href) ? "page" : undefined}
                              className={cn(
                                "flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium transition-colors",
                                isActive(link.href) || link.emphasis
                                  ? "bg-accent/10 text-accent"
                                  : "text-foreground hover:bg-secondary",
                              )}
                            >
                              {link.name}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>

                    {!user && (
                      <SheetClose asChild>
                        <Link
                          to="/login"
                          className="mt-4 flex items-center gap-2 rounded-xl px-4 py-4 text-lg font-medium text-muted-foreground hover:bg-secondary"
                        >
                          <LogIn className="h-5 w-5" />
                          Login
                        </Link>
                      </SheetClose>
                    )}

                    {user && (
                      <div className="mt-4 space-y-1">
                        <SheetClose asChild>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 rounded-xl px-4 py-4 text-lg font-medium text-muted-foreground hover:bg-secondary"
                          >
                            Dashboard
                          </Link>
                        </SheetClose>
                        <button
                          onClick={() => {
                            logout();
                            setMenuOpen(false);
                          }}
                          className="w-full rounded-xl px-4 py-4 text-left text-lg font-medium text-muted-foreground hover:bg-secondary"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </nav>

                  <div className="space-y-3 border-t border-border p-6">
                    <Button
                      asChild
                      className="h-12 w-full rounded-full bg-[#25D366] text-[#0b141a] hover:bg-[#1ebe5b]"
                    >
                      <a
                        href={buildWhatsAppLink(generalEnquiryMessage())}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                    </Button>

                    <Button asChild variant="outline" className="h-12 w-full rounded-full">
                      <a href={BUSINESS.phoneHref}>
                        <Phone className="h-4 w-4" />
                        {BUSINESS.phone}
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
