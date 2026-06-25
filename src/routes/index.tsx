import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Truck, ShieldCheck, RefreshCcw, Sparkles, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-perfume.jpg";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia Parfums — Wear the Soul of Arabia" },
      { name: "description", content: "Luxury handcrafted Pakistani attars and perfumes. Noir Eclipse & Velvet Bloom." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,oklch(0.82_0.04_255/0.15),transparent_55%)]" />
        </div>

        {/* Floating orbs */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,oklch(0.82_0.04_255/0.25),transparent_70%)] animate-smoke" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.05_255/0.25),transparent_70%)] animate-smoke" style={{ animationDelay: "3s" }} />

        <div className="relative mx-auto max-w-5xl px-6 sm:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="gold-rule"
          >Luxury Pakistani Fragrances</motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-6 font-display text-[14vw] sm:text-[88px] lg:text-[120px] leading-[0.95] font-light"
          >
            Wear the <em className="shimmer-text font-medium italic">Soul</em>
            <br />of Arabia
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 max-w-xl mx-auto text-sm sm:text-base text-ash leading-relaxed"
          >
            Hand-curated attars and perfumes inspired by the ancient routes.
            Crafted in Pakistan for those who refuse the ordinary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/shop" className="btn-luxe">Explore Collection <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/shop" className="btn-ghost">View Bestsellers</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.4 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden sm:flex flex-col items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-ash"
          >
            Scroll
            <span className="block w-px h-12 bg-gradient-to-b from-gold to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative py-5 border-y border-gold/15 bg-night overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12 px-6 text-[11px] tracking-[0.35em] uppercase text-gold-soft">
              <span>Authentic Wanted & Flora</span><span className="text-gold">✦</span>
              <span>COD Available Across Pakistan</span><span className="text-gold">✦</span>
              <span>Easypaisa &amp; JazzCash Accepted</span><span className="text-gold">✦</span>
              <span>Free Gift Packaging</span><span className="text-gold">✦</span>
              <span>2–4 Day Nationwide Delivery</span><span className="text-gold">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="relative mx-auto max-w-7xl px-6 sm:px-8 py-24 sm:py-32">
        <SectionHead eyebrow="Our Collection" title="Featured" emphasis="Fragrances" />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
        <div className="mt-14 text-center">
          <Link to="/shop" className="btn-ghost">View All Fragrances <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* COLLECTIONS SPLIT */}
      <section className="relative mx-auto max-w-7xl px-6 sm:px-8 py-24">
        <SectionHead eyebrow="Two Worlds" title="Signature" emphasis="Collections" />
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {[
            { title: "Noir Eclipse", sub: "Bold · Dark · Magnetic", link: "/shop", grad: "from-amber-900/30 to-yellow-900/10" },
            { title: "Velvet Bloom", sub: "Delicate · Romantic · Timeless", link: "/shop", grad: "from-rose-900/30 to-pink-900/10" },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group relative overflow-hidden border border-gold/20 bg-gradient-to-br from-surface to-ink p-10 sm:p-14 min-h-[320px] flex flex-col justify-between"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.grad} opacity-40 group-hover:opacity-70 transition-opacity duration-700`} />
              <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-gold/10 blur-3xl group-hover:bg-gold/25 transition-all duration-700" />
              <div className="relative">
                <p className="text-[10px] tracking-[0.4em] uppercase text-gold-soft">{c.sub}</p>
                <h3 className="mt-4 font-display text-4xl sm:text-5xl text-gold-gradient">{c.title}</h3>
              </div>
              <Link to={c.link} className="relative mt-8 inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold group-hover:gap-5 transition-all">
                Discover <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative bg-night py-20 border-y border-gold/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Truck, t: "Fast Delivery", d: "2–4 days across Pakistan with real-time tracking" },
            { Icon: Sparkles, t: "Easy Payments", d: "COD, Easypaisa & JazzCash accepted" },
            { Icon: ShieldCheck, t: "100% Authentic", d: "Sourced from trusted suppliers" },
            { Icon: RefreshCcw, t: "Easy Returns", d: "7-day return on unopened items" },
          ].map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="mx-auto grid place-items-center w-16 h-16 rounded-full border border-gold/30 text-gold group-hover:border-gold group-hover:bg-gold/10 transition-all duration-500 group-hover:-translate-y-1">
                <f.Icon className="w-6 h-6" />
              </div>
              <p className="mt-5 font-display text-xl text-foreground">{f.t}</p>
              <p className="mt-2 text-sm text-ash">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </>
  );
}

function SectionHead({ eyebrow, title, emphasis }: { eyebrow: string; title: string; emphasis: string }) {
  return (
    <div className="text-center">
      <span className="gold-rule">{eyebrow}</span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl"
      >
        {title} <em className="text-gold-gradient italic font-medium">{emphasis}</em>
      </motion.h2>
    </div>
  );
}
