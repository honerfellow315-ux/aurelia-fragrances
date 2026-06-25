import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { productsApi, type ApiProduct } from "@/lib/api";
import { products as localProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "Shop — Aurelia Parfums" }, { name: "description", content: "Browse our luxury fragrance collections." }] }),
  component: Shop,
});

const cats = [
  { id: "all", label: "All Fragrances" },
  { id: "wanted", label: "Noir Eclipse" },
  { id: "flora", label: "Velvet Bloom" },
] as const;

function Shop() {
  const [active, setActive] = useState<(typeof cats)[number]["id"]>("all");
  const [dbProducts, setDbProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.list()
      .then((res: any) => {
        const arr: ApiProduct[] = Array.isArray(res) ? res : res?.products ?? [];
        setDbProducts(arr);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Local + DB dono merge karo
  const allProducts = [
    ...localProducts.map((p) => ({ ...p, _isLocal: true })),
    ...dbProducts.map((p) => ({ ...p, _isLocal: false })),
  ];

  const list = active === "all"
    ? allProducts
    : allProducts.filter((p: any) =>
        p.collection === active ||
        p.category?.toLowerCase().includes(active === "wanted" ? "wanted" : "flora") ||
        p.name?.toLowerCase().includes(active === "wanted" ? "wanted" : "flora")
      );

  return (
    <>
      <PageHeader title="Our Collection" sub="Handcrafted luxury fragrances" />
      <section className="mx-auto max-w-7xl px-6 sm:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {cats.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`relative text-[11px] tracking-[0.28em] uppercase px-5 py-2.5 border transition-all duration-500 ${
                active === c.id
                  ? "border-gold text-ink bg-gradient-gold"
                  : "border-gold/30 text-ash hover:text-gold hover:border-gold"
              }`}>
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-ash py-20">Loading…</div>
        ) : (
          <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p: any, i: number) => (
              <ProductCard key={p._id ?? p.id} p={{
                id: p._id ?? p.id,
                name: p.name,
                sub: p.sub ?? p.description ?? "",
                price: p.price,
                oldPrice: p.oldPrice,
                img: p.img ?? p.image ?? (Array.isArray(p.images) && p.images[0]?.url) ?? "",
                category: p.category ?? "",
                collection: p.collection ?? "wanted",
                badge: p.badge ?? "",
                desc: p.description ?? p.desc ?? "",
                top: p.fragrantNotes?.top ?? p.top ?? "",
                heart: p.fragrantNotes?.heart ?? p.heart ?? "",
                base: p.fragrantNotes?.base ?? p.base ?? "",
              }} index={i} />
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}

export function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <section className="relative py-20 sm:py-28 text-center overflow-hidden border-b border-gold/15">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.04_255/0.12),transparent_60%)]" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gold-rule relative">{sub}</motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="relative mt-5 font-display text-5xl sm:text-6xl lg:text-7xl"
      >
        {title}
      </motion.h1>
    </section>
  );
}
