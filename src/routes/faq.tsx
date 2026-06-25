import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/products";
import { PageHeader } from "./shop";

export const Route = createFileRoute("/faq")({ component: FAQ });

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <PageHeader title="Frequently Asked" sub="Everything you need to know" />
      <section className="mx-auto max-w-3xl px-6 sm:px-8 py-16 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border border-gold/20 bg-surface/40 overflow-hidden"
            >
              <button onClick={() => setOpen(isOpen ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 group">
                <span className="font-display text-lg sm:text-xl text-foreground group-hover:text-gold-gradient transition-colors">{f.q}</span>
                <span className={`grid place-items-center w-8 h-8 rounded-full border border-gold/30 text-gold transition-transform duration-500 ${isOpen ? "rotate-45 bg-gold/10" : ""}`}>
                  <Plus className="w-4 h-4" />
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35 }}>
                    <p className="px-5 pb-5 text-sm text-ash leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </section>
    </>
  );
}