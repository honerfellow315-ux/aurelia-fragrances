import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import { products as localProducts } from "@/lib/products";
import { productsApi } from "@/lib/api";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  component: Detail,
});

function Detail() {
  const { id } = useParams({ from: "/product/$id" });
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("100ml");
  const add = useCart((s) => s.add);

  useEffect(() => {
    // Pehle local products mein dhundho
    const local = localProducts.find((x) => String(x.id) === String(id));
    if (local) {
      setP(local);
      setLoading(false);
      return;
    }

    // DB se fetch karo
    productsApi.get(id)
      .then((res: any) => {
        const product = res?.product ?? res;
        setP(product);
      })
      .catch(() => {
        // fallback to first local product
        setP(localProducts[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-[60vh] grid place-items-center">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );

  if (!p) return (
    <div className="min-h-[60vh] grid place-items-center text-ash">
      Product not found.
    </div>
  );

  // Image resolve karo
  const imgSrc = p.img ?? p.image ?? (Array.isArray(p.images) && p.images[0]?.url) ?? "";
  const sub = p.sub ?? p.description ?? "";
  const desc = p.desc ?? p.description ?? "";
  const top = p.top ?? p.fragrantNotes?.top ?? "";
  const heart = p.heart ?? p.fragrantNotes?.heart ?? "";
  const base = p.base ?? p.fragrantNotes?.base ?? "";

  return (
    <section className="mx-auto max-w-7xl px-6 sm:px-8 py-12">
      <nav className="text-[11px] tracking-[0.25em] uppercase text-ash flex items-center gap-2">
        <Link to="/shop" className="hover:text-gold">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gold-soft">{p.name}</span>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}
          className="relative aspect-square bg-gradient-to-br from-surface to-ink border border-gold/15 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.04_255/0.18),transparent_70%)]" />
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-gold/15 blur-3xl animate-glow" />
          {imgSrc ? (
            <motion.img
              src={imgSrc} alt={p.name}
              className="relative z-10 w-full h-full object-cover"
              animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <div className="relative z-10 w-full h-full flex items-center justify-center text-ash">
              No Image
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold-soft">{p.category}</p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl text-foreground">{p.name}</h1>
          <p className="mt-2 text-ash">{sub}</p>
          <div className="mt-8 flex items-baseline gap-4 flex-wrap">
            <p className="font-display text-4xl text-gold-gradient">PKR {Number(p.price).toLocaleString()}</p>
            {p.oldPrice && (
              <>
                <span className="text-ash line-through text-lg">PKR {Number(p.oldPrice).toLocaleString()}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wider">
                  {Math.round((1 - p.price / p.oldPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <p className="mt-6 text-sm text-ash leading-relaxed max-w-lg">{desc}</p>

          <div className="mt-10">
            <p className="luxe-label">Size</p>
            <div className="flex gap-3">
              {["100ml"].map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase border transition-all ${
                    size === s ? "border-gold text-ink bg-gradient-gold" : "border-gold/30 text-ash hover:text-gold hover:border-gold"
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          {(top || heart || base) && (
            <div className="mt-10 grid grid-cols-3 gap-4 border-y border-gold/15 py-6">
              {[["Top", top], ["Heart", heart], ["Base", base]].map(([k, v]) => (
                <div key={k} className="text-center">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-ash">{k}</p>
                  <p className="mt-2 font-display text-lg text-gold-gradient">{v}</p>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => add(p._id ?? p.id, size)} className="btn-luxe mt-10 w-full sm:w-auto">
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </motion.div>
      </div>
    </section>
  );
}
