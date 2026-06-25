import { motion } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/store";

export type CardProduct = {
  id: string | number;
  name: string;
  sub?: string;
  price: number;
  oldPrice?: number;
  img?: string;
  image?: string;
  images?: any[];
  category?: string;
  collection?: string;
  badge?: string;
  desc?: string;
  top?: string;
  heart?: string;
  base?: string;
};

export function ProductCard({ p, index = 0 }: { p: CardProduct; index?: number }) {
  const add = useCart((s) => s.add);
  const nav = useNavigate();

  const imgSrc =
    p.img ||
    p.image ||
    (Array.isArray(p.images) && p.images.length > 0
      ? typeof p.images[0] === "string"
        ? p.images[0]
        : p.images[0]?.url
      : "") ||
    "";

  const handleAdd = () => {
    add(p.id as any);
    nav({ to: "/cart" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      className="luxe-card group flex flex-col"
    >
      <Link to="/product/$id" params={{ id: String(p.id) }} className="relative block aspect-[4/5] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.32_0.06_70/0.6),transparent_70%)]" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.04_255/0.18),transparent_70%)]" />
        {imgSrc ? (
          <motion.img
            src={imgSrc} alt={p.name} loading="lazy"
            className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            whileHover={{ y: -8 }}
          />
        ) : (
          <div className="relative z-10 w-full h-full flex items-center justify-center text-ash text-xs">
            No Image
          </div>
        )}
        {p.badge && (
          <span className="absolute top-4 left-4 z-20 text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 bg-gradient-gold text-ink font-medium">
            {p.badge}
          </span>
        )}
      </Link>

      <div className="p-5 border-t border-gold/10">
        <p className="text-[10px] tracking-[0.25em] uppercase text-gold-soft mb-1">{p.category}</p>
        <Link to="/product/$id" params={{ id: String(p.id) }} className="font-display text-2xl text-foreground hover:text-gold transition-colors">
          {p.name}
        </Link>
        <p className="text-xs text-ash mt-1 mb-4">{p.sub}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display text-xl text-gold-gradient leading-none">PKR {p.price.toLocaleString()}</span>
            {p.oldPrice && (
              <span className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="text-ash line-through">PKR {p.oldPrice.toLocaleString()}</span>
                <span className="text-emerald-400 font-medium">
                  {Math.round((1 - p.price / p.oldPrice) * 100)}% OFF
                </span>
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className="grid place-items-center w-10 h-10 border border-gold/40 text-gold hover:bg-gradient-gold hover:text-ink hover:border-transparent transition-all duration-500 hover:rotate-90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
