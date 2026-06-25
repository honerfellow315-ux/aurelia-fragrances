import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { PageHeader } from "./shop";

export const Route = createFileRoute("/tracking")({ component: Tracking });

type OrderData = {
  orderId: string;
  status: string;
  createdAt: string;
  statusHistory: { status: string; note: string; updatedAt: string }[];
  shippingAddress: { street: string; city: string; province: string; notes?: string };
  payment: { method: string; status: string };
  rider?: { name: string; phone: string };
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  items: { productName: string; quantity: number; unitPrice: number }[];
};

const STATUS_STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

function Tracking() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) return;
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders/track/${id.trim()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Order not found");
      setOrder(data.order);
    } catch (e: any) {
      setError(e.message || "Order nahi mila. ID check karo.");
    } finally {
      setLoading(false);
    }
  };

  // Current step index
  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <>
      <PageHeader title="Track Your Order" sub="Real-time order status" />
      <section className="mx-auto max-w-3xl px-6 sm:px-8 py-12">
        <form onSubmit={track} className="flex flex-col sm:flex-row gap-3">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter Order ID (e.g. AR-00001)"
            className="luxe-input flex-1"
          />
          <button className="btn-luxe" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "Track"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3">
            {error}
          </p>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mt-12"
          >
            {/* Order Info Card */}
            <div className="border border-gold/20 bg-surface/40 p-6 mb-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-ash">Order ID</p>
                <p className="font-display text-2xl text-gold-gradient">{order.orderId}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-ash">Payment</p>
                <p className="text-sm font-medium">{order.payment.method} · {order.payment.status}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-ash">Total</p>
                <p className="text-sm font-medium">PKR {order.totalAmount?.toLocaleString()}</p>
              </div>
              <span className="text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 bg-gradient-gold text-ink">
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="border border-gold/15 bg-surface/30 p-5 mb-10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-ash mb-3">Items Ordered</p>
              <div className="space-y-2">
                {order.items?.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-ash">{it.productName} × {it.quantity}</span>
                    <span>PKR {(it.unitPrice * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gold/10 flex justify-between text-sm">
                <span className="text-ash">Delivery Fee</span>
                <span>PKR {order.deliveryFee}</span>
              </div>
            </div>

            {/* Rider info agar hai */}
            {order.rider?.name && (
              <div className="border border-gold/15 bg-surface/30 p-5 mb-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-ash mb-2">Rider Info</p>
                <p className="text-sm">{order.rider.name} · {order.rider.phone}</p>
              </div>
            )}

            {/* Status Timeline */}
            <ol className="relative border-l border-gold/30 pl-8 space-y-8">
              {STATUS_STEPS.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                const pending = i > currentStep;
                // statusHistory se matching entry dhundho
                const histEntry = order.statusHistory?.find(
                  (h) => h.status.toLowerCase() === step.toLowerCase()
                );
                return (
                  <motion.li
                    key={step}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="relative"
                  >
                    <span className={`absolute -left-[37px] grid place-items-center w-4 h-4 rounded-full border ${
                      done ? "bg-gradient-gold border-gold"
                      : active ? "bg-gold border-gold animate-glow"
                      : "bg-ink border-gold/30"
                    }`} />
                    <p className={`font-display text-xl ${pending ? "text-ash italic" : "text-foreground"}`}>
                      {step}
                    </p>
                    <p className="text-xs text-ash mt-1">
                      {histEntry
                        ? `${new Date(histEntry.updatedAt).toLocaleString("en-PK")}${histEntry.note ? " · " + histEntry.note : ""}`
                        : pending ? "Pending" : ""}
                    </p>
                  </motion.li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </section>
    </>
  );
}
