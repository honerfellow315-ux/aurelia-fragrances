import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/success")({
  validateSearch: z.object({ id: z.string().optional() }),
  component: Success,
});

function Success() {
  const { id } = Route.useSearch();
  return (
    <section className="min-h-[70vh] grid place-items-center px-6 py-20">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="mx-auto grid place-items-center w-24 h-24 rounded-full bg-gradient-gold text-ink"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-8 font-display text-5xl text-gold-gradient"
        >Order Placed!</motion.h1>
        <p className="mt-4 text-ash">Thank you for your order. Our team will confirm it shortly on WhatsApp.</p>
        <div className="mt-6 inline-block border border-gold/30 px-6 py-3 font-display text-2xl text-foreground">Order #{id ?? "AR-00001"}</div>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link to="/tracking" className="btn-luxe">Track My Order</Link>
          <Link to="/shop" className="btn-ghost">Continue Shopping</Link>
        </div>
      </div>
    </section>
  );
}