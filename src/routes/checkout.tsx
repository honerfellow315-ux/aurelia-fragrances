import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Upload, Wallet, Loader2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { products as localProducts } from "@/lib/products";
import { productsApi, ordersApi, API_BASE, tokens } from "@/lib/api";
import { PageHeader } from "./shop";

export const Route = createFileRoute("/checkout")({ component: Checkout });

function CodIcon() {
  return (
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-300 to-slate-600 grid place-items-center shadow-[0_8px_20px_-6px_rgba(170,195,235,0.45)]">
      <Wallet className="w-6 h-6 text-ink" />
    </div>
  );
}
function EasypaisaIcon() {
  return (
    <div className="w-12 h-12 rounded-lg bg-[#2c2848] grid place-items-center shadow-[0_8px_20px_-6px_rgba(170,195,235,0.45)] overflow-hidden p-1">
      <img src="/easypaisa.png" alt="Easypaisa" className="w-full h-full object-contain" />
    </div>
  );
}
function JazzCashIcon() {
  return (
    <div className="w-12 h-12 rounded-lg bg-white grid place-items-center shadow-[0_8px_20px_-6px_rgba(237,28,36,0.45)] overflow-hidden p-1">
      <img src="/jazzcash.png" alt="JazzCash" className="w-full h-full object-contain" />
    </div>
  );
}

const methods = [
  { id: "cod", Icon: CodIcon, t: "Cash on Delivery", d: "Pay when your order arrives at your door" },
  { id: "easypaisa", Icon: EasypaisaIcon, t: "Easypaisa", d: "Transfer to 0300-XXXXXXX, upload screenshot" },
  { id: "jazzcash", Icon: JazzCashIcon, t: "JazzCash", d: "Transfer to 0300-XXXXXXX, upload screenshot" },
] as const;

type DbProduct = {
  _id: string;
  name: string;
  price: number;
  images?: { url: string; public_id: string }[];
};

function Checkout() {
  const nav = useNavigate();
  const { items, clear } = useCart();
  const [pm, setPm] = useState<(typeof methods)[number]["id"]>("cod");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);

  // Form fields
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    address: "", city: "", province: "Sindh", notes: "",
  });

  // Load DB products to match cart items
  useEffect(() => {
    productsApi.list().then((res: any) => {
      const arr = Array.isArray(res) ? res : res?.products ?? [];
      setDbProducts(arr);
    }).catch(() => {});
  }, []);

  // Build detailed cart — check DB products first, fallback to local
  const detailed = items.map((i) => {
    const dbP = dbProducts.find((p) => p._id === String(i.id));
    const localP = localProducts.find((x) => x.id === i.id);
    const p = dbP || localP;
    if (!p) return null;
    return { ...i, p, isDb: !!dbP };
  }).filter(Boolean) as any[];

  const subtotal = detailed.reduce((s: number, i: any) => s + i.p.price * i.qty, 0);
  const discount = detailed.reduce(
    (s: number, i: any) => s + (i.p.oldPrice && i.p.oldPrice > i.p.price ? (i.p.oldPrice - i.p.price) * i.qty : 0),
    0
  );
  const delivery = subtotal > 0 ? 299 : 0;
  const total = subtotal + delivery;

  const place = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (detailed.length === 0) {
      setError("Cart khali hai!");
      return;
    }
    if (pm !== "cod" && !file) {
      setError("Payment screenshot zaroor upload karo!");
      return;
    }

    setSaving(true);
    try {
      // Build order items — DB products ke liye product ID, local ke liye sirf name/price
      const orderItems = detailed.map((i: any) => ({
        product: i.isDb ? i.p._id : undefined,
        productName: i.p.name,
        productImage: i.isDb
          ? (i.p.images?.[0]?.url || "")
          : (i.p.image || ""),
        size: i.size || "",
        quantity: i.qty,
        unitPrice: i.p.price,
        totalPrice: i.p.price * i.qty,
      }));

      const orderPayload = {
        items: orderItems,
        shippingAddress: {
          street: form.address,
          city: form.city,
          province: form.province,
          notes: form.notes || undefined,
        },
        payment: { method: pm === "cod" ? "COD" : pm === "easypaisa" ? "Easypaisa" : "JazzCash" },
        guestInfo: tokens.getUser() ? undefined : {
          name: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone,
        },
        subtotal,
        deliveryFee: delivery,
        totalAmount: total,
      };

      const res: any = await ordersApi.create(orderPayload);
      const orderId: string = res?.order?.orderId || res?.orderId || "AR-00000";

      // Upload screenshot agar Easypaisa/JazzCash
      if (pm !== "cod" && file) {
        try {
          const formData = new FormData();
          formData.append("screenshot", file);
          await fetch(`${API_BASE}/orders/${orderId}/payment-screenshot`, {
            method: "POST",
            body: formData,
          });
        } catch {
          // screenshot fail ho toh bhi order place ho gaya — ignore
        }
      }

      clear();
      nav({ to: "/success", search: { id: orderId } });
    } catch (e: any) {
      setError(e.message || "Order place nahi hua, dobara try karo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Checkout" sub="Complete your order" />
      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-12">
        <form onSubmit={place} className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-12">
            <FormSection title="Delivery Information">
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="First Name">
                  <input required className="luxe-input" placeholder="Ahmed"
                    value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </Field>
                <Field label="Last Name">
                  <input required className="luxe-input" placeholder="Rauf"
                    value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </Field>
              </div>
              <Field label="Phone Number">
                <input required type="tel" className="luxe-input" placeholder="0300-0000000"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
              <Field label="Address">
                <input required className="luxe-input" placeholder="Street, Area"
                  value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="City">
                  <input required className="luxe-input" placeholder="Karachi"
                    value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </Field>
                <Field label="Province">
                  <select className="luxe-input" value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}>
                    <option>Sindh</option>
                    <option>Punjab</option>
                    <option>KPK</option>
                    <option>Balochistan</option>
                  </select>
                </Field>
              </div>
              <Field label="Order Notes (Optional)">
                <textarea className="luxe-input resize-none h-20" placeholder="Any special instructions…"
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </Field>
            </FormSection>

            <FormSection title="Payment Method">
              <div className="grid sm:grid-cols-3 gap-3">
                {methods.map((m) => (
                  <motion.button
                    type="button" key={m.id} onClick={() => setPm(m.id)}
                    whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                    className={`text-left p-4 border transition-all ${
                      pm === m.id ? "border-gold bg-gold/10 shadow-[0_10px_30px_-12px_rgba(170,195,235,0.5)]" : "border-gold/20 hover:border-gold/50"
                    }`}>
                    <m.Icon />
                    <p className="mt-3 font-medium text-sm">{m.t}</p>
                    <p className="text-[11px] text-ash mt-1 leading-snug">{m.d}</p>
                  </motion.button>
                ))}
              </div>

              {pm !== "cod" && (
                <motion.label
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 block cursor-pointer border border-dashed border-gold/40 p-6 text-center text-ash hover:border-gold transition-colors"
                >
                  <Upload className="w-6 h-6 mx-auto text-gold" />
                  <p className="mt-2 text-sm">
                    {fileName ? `✅ ${fileName}` : "Upload Payment Screenshot"}
                  </p>
                  <p className="text-[11px] mt-1">Click to browse — JPG, PNG accepted</p>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setFile(f);
                      setFileName(f?.name ?? "");
                    }} />
                </motion.label>
              )}
            </FormSection>

            {error && (
              <p className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3">
                {error}
              </p>
            )}

            <button disabled={saving} className={`btn-luxe w-full sm:w-auto ${saving ? "opacity-60 pointer-events-none" : ""}`}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Placing Order…</> : "Place Order"}
            </button>
          </div>

          {/* Order Summary */}
          <aside className="border border-gold/20 bg-surface/40 p-6 h-fit lg:sticky lg:top-28">
            <p className="font-display text-2xl text-gold-gradient mb-5">Order Summary</p>
            <div className="space-y-2 mb-4 text-sm text-ash max-h-48 overflow-y-auto">
              {detailed.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between gap-2">
                  <span className="truncate">{it.p.name} × {it.qty}</span>
                  <span className="shrink-0">PKR {(it.p.price * it.qty).toLocaleString()}</span>
                </div>
              ))}
              {detailed.length === 0 && <p>Your cart is empty.</p>}
            </div>
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-ash">Subtotal</span>
              <span>PKR {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm py-1.5">
                <span className="text-ash">Discount</span>
                <span className="text-emerald-400">— PKR {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-ash">Delivery</span>
              <span>PKR {delivery}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gold/15 flex items-baseline justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase text-ash">Total</span>
              <span className="font-display text-2xl text-gold-gradient">PKR {total.toLocaleString()}</span>
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-2xl text-gold-gradient mb-6">{title}</p>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="luxe-label">{label}</span>{children}</label>;
}
