import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
const logoAsset = { url: "/aurelia-logo.png" };

/* --- Realistic brand icons (inline SVG, currentColor) --- */
const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="igGrad" cx="30%" cy="110%" r="130%">
        <stop offset="0%" stopColor="#FFDD55" />
        <stop offset="25%" stopColor="#FF6B3D" />
        <stop offset="55%" stopColor="#E1306C" />
        <stop offset="80%" stopColor="#A02CB1" />
        <stop offset="100%" stopColor="#3B5FBE" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#igGrad)" />
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="none" stroke="rgba(255,255,255,0.15)" />
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.7" />
    <circle cx="17.6" cy="6.6" r="1.15" fill="#fff" />
  </svg>
);

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#25D366" />
    <path fill="#fff" d="M16.7 13.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.36.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.74-1.8-.2-.46-.4-.4-.54-.4l-.46-.02c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.24 1.02.4 1.38.5.58.18 1.1.16 1.52.1.46-.06 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    <path fill="#fff" d="M19.6 4.4A10.5 10.5 0 0 0 4.6 19.2L3.2 24l4.9-1.3a10.5 10.5 0 0 0 5 1.3h.04a10.5 10.5 0 0 0 7.4-17.96zM12.16 22.18a8.7 8.7 0 0 1-4.44-1.22l-.32-.18-2.9.76.78-2.84-.2-.32a8.7 8.7 0 1 1 7.08 3.8z" opacity=".95" />
  </svg>
);

const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mailGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E8B339" />
        <stop offset="100%" stopColor="#9C7415" />
      </linearGradient>
    </defs>
    <rect x="2" y="4.5" width="20" height="15" rx="2.5" fill="url(#mailGrad)" />
    <path d="M3 6.5l9 6.2 9-6.2" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M3 18.5l6.5-5M21 18.5l-6.5-5" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
  </svg>
);

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-gold/15 bg-gradient-to-b from-ink to-night overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.04_255/0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 pt-20 pb-10 grid gap-12 lg:grid-cols-3">
        <div>
          <img src={logoAsset.url} alt="Aurelia Parfums" className="h-16 w-auto mb-5" />
          <p className="text-sm text-ash leading-relaxed max-w-xs">
            Handcrafted luxury fragrances from the heart of Pakistan. Inspired by the ancient routes of oud, musk, and rose.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com/aurelia.demo"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid place-items-center w-11 h-11 rounded-full bg-surface/40 border border-gold/20 hover:border-gold/60 hover:-translate-y-1 transition-all duration-500"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href="https://wa.me/92300XXXXXXX"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="grid place-items-center w-11 h-11 rounded-full bg-surface/40 border border-gold/20 hover:border-gold/60 hover:-translate-y-1 transition-all duration-500"
            >
              <WhatsAppIcon className="w-6 h-6" />
            </a>
            <a
              href="mailto:demo@aurelia.example"
              aria-label="Email"
              className="grid place-items-center w-11 h-11 rounded-full bg-surface/40 border border-gold/20 hover:border-gold/60 hover:-translate-y-1 transition-all duration-500"
            >
              <MailIcon className="w-6 h-6" />
            </a>
          </div>
          <div className="mt-6 flex gap-2 flex-wrap">
            {["COD", "Easypaisa", "JazzCash"].map((p) => (
              <span key={p} className="text-[10px] tracking-[0.2em] uppercase text-ash border border-gold/20 px-3 py-1.5">{p}</span>
            ))}
          </div>
        </div>

        <FCol
          title="Explore"
          links={[
            { to: "/", label: "Home" },
            { to: "/shop", label: "Collection" },
            { to: "/tracking", label: "Track Order" },
            { to: "/faq", label: "FAQ" },
          ]}
        />

        <div>
          <p className="font-display text-xl text-gold-gradient mb-5">Get In Touch</p>
          <ul className="space-y-3 text-sm text-ash">
            <li className="flex items-start gap-3">
              <MailIcon className="w-4 h-4 mt-0.5 shrink-0" />
              <a href="mailto:demo@aurelia.example" className="hover:text-gold transition-colors break-all">demo@aurelia.example</a>
            </li>
            <li className="flex items-start gap-3">
              <WhatsAppIcon className="w-4 h-4 mt-0.5 shrink-0" />
              <a href="https://wa.me/92300XXXXXXX" className="hover:text-gold transition-colors">0300-XXXXXXX</a>
            </li>
            <li className="flex items-start gap-3">
              <InstagramIcon className="w-4 h-4 mt-0.5 shrink-0" />
              <a href="https://instagram.com/aurelia.demo" className="hover:text-gold transition-colors">@aurelia.demo</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
              <span>Pakistan — Nationwide Delivery</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-6 border-t border-gold/10 flex flex-wrap items-center justify-between gap-3 text-xs text-ash">
        <span>© {new Date().getFullYear()} Aurelia Parfums. Crafted with care.</span>
        <span className="tracking-[0.25em] uppercase text-[10px]">Made in Pakistan</span>
      </div>
    </footer>
  );
}

function FCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="font-display text-xl text-gold-gradient mb-5">{title}</p>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-ash hover:text-gold transition-colors inline-block hover:translate-x-1 duration-300">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
