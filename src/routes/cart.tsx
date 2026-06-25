import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { products as localProducts } from "@/lib/products";
import { productsApi } from "@/lib/api";
import { PageHeader } from "./shop";

export const Route = createFileRoute("/cart")({ component: Cart });

type AnyP = {
  id: string | number;
  name: string;
  sub?: string;
  price: number;
  oldPrice?: number;
  img?: string;
  image?: string;
  images?: any[];
};

function Cart() {
  const { items, setQty, remove } = useCart();
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    productsApi.list().then((res: any) => {
      const arr = Array.isArray(res) ? res : res?.products ?? [];
      setDbProducts(arr);
    }).catch(() => {});
  }, []);

  const findP = (id: string | number): AnyP | undefined => {
    const sId = String(id);
    const db = dbProducts.find((d) => String(d._id) === sId || String(d.id) === sId);
    if (db) return db as AnyP;
    return localProducts.find((x) => String(x.id) === sId) as any;
  };

  const getImg = (p: AnyP) =>
    p.img || p.image ||
    (Array.isArray(p.images) && p.images.length
      ? typeof p.images[0] === "string" ? p.images[0] : p.images[0]?.url
      : "");

  const detailed = items
    .map((i) => ({ ...i, p: findP(i.id) }))
    .filter((x) => !!x.p) as Array<{ id: any; qty: number; size: string; p: AnyP }>;

  const subtotal = detailed.reduce((s, i) => s + i.p.price * i.qty, 0);
  const discount = detailed.reduce(
    (s, i) => s + (i.p.oldPrice ? (i.p.oldPrice - i.p.price) * i.qty : 0),
    0
  );
  const delivery = subtotal > 0 ? 299 : 0;
  const total = subtotal + delivery;

  return (
    <>
      <PageHeader title="Your Cart" sub="Review your selection" />
      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
        {detailed.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-3xl text-ash">Your cart is empty.</p>
            <Link to="/shop" className="btn-luxe mt-8">Go to Shop</Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <AnimatePresence>
                {detailed.map((it) => (
                  <motion.div key={String(it.id) + it.size}
                    layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }}
                    className="grid grid-cols-[80px_1fr_auto] gap-4 sm:gap-6 items-center border border-gold/15 bg-surface/40 p-4"
                  >
                    <img src={getImg(it.p)} alt={it.p.name} className="w-20 h-20 object-contain" />
                    <div className="min-w-0">
                      <p className="font-display text-xl text-foreground truncate">{it.p.name}</p>
                      <p className="text-xs text-ash">{it.size} {it.p.sub ? `· ${it.p.sub}` : ""}</p>
                      <p className="font-display text-lg text-gold-gradient mt-1">PKR {(it.p.price * it.qty).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-gold/30">
                        <button onClick={() => setQty(it.id, it.size, it.qty - 1)} className="p-2 text-ash hover:text-gold"><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-sm">{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.size, it.qty + 1)} className="p-2 text-ash hover:text-gold"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => remove(it.id, it.size)} className="text-ash hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <aside className="border border-gold/20 bg-surface/40 p-6 h-fit">
              <p className="font-display text-2xl text-gold-gradient mb-5">Order Summary</p>
              <Row k="Subtotal" v={`PKR ${subtotal.toLocaleString()}`} />
              {discount > 0 && <Row k="Discount" v={`— PKR ${discount.toLocaleString()}`} green />}
              <Row k="Delivery" v={`PKR ${delivery}`} />
              <div className="mt-4 pt-4 border-t border-gold/15 flex items-baseline justify-between">
                <span className="text-[10px] tracking-[0.3em] uppercase text-ash">Total</span>
                <span className="font-display text-2xl text-gold-gradient">PKR {total.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="btn-luxe w-full mt-6">Checkout</Link>
              <p className="text-[10px] tracking-[0.3em] uppercase text-ash text-center mt-3">COD · Easypaisa · JazzCash</p>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}

function Row({ k, v, green }: { k: string; v: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <span className="text-ash">{k}</span>
      <span className={green ? "text-emerald-400" : "text-foreground"}>{v}</span>
    </div>
  );
}
