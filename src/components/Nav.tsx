import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, User } from "lucide-react";
const logoAsset = { url: "/aurelia-logo.png" };
import { useCart } from "@/lib/store";
import { tokens } from "@/lib/api";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Collection" },
  { to: "/tracking", label: "Track" },
  { to: "/faq", label: "FAQ" },
  { to: "/admin", label: "Admin" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const items = useCart((s) => s.items);
  const count = items.reduce((a, b) => a + b.qty, 0);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30);
    f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    setOpen(false);
    if (typeof window !== "undefined") setLoggedIn(!!tokens.getUser());
  }, [path]);

  const accountHref = loggedIn ? "/account" : "/auth";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink/90 backdrop-blur-xl border-b border-gold/15" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoAsset.url} alt="Aurelia Parfums" className="h-12 w-auto sm:h-14 object-contain drop-shadow-[0_0_24px_rgba(170,195,235,0.35)]" />
        </Link>

        <ul className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="group relative text-[11px] font-medium tracking-[0.28em] uppercase text-ash hover:text-gold transition-colors"
              >
                {l.label}
                <span className="absolute -bottom-2 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to={accountHref} className="inline-flex p-2 text-ash hover:text-gold transition-colors" aria-label="Account">
            <User className="w-5 h-5" />
          </Link>
          <Link to="/cart" className="relative p-2 text-ash hover:text-gold transition-colors" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-gold text-ink text-[10px] font-semibold grid place-items-center"
                >{count}</motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="lg:hidden p-2 text-gold" aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:hidden overflow-hidden bg-ink/95 backdrop-blur-xl border-t border-gold/15"
          >
            <ul className="flex flex-col py-4">
              {[...links, { to: accountHref, label: loggedIn ? "My Account" : "Sign In" }].map((l, i) => (
                <motion.li
                  key={l.to + l.label}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link to={l.to} className="block px-8 py-3 text-[13px] tracking-[0.28em] uppercase text-ash hover:text-gold hover:bg-surface/50 transition-colors">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
