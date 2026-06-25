import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { User, Package, LogOut, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { authApi, ordersApi, tokens } from "@/lib/api";
import { PageHeader } from "./shop";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"profile" | "orders" | "danger">("profile");
  const [me, setMe] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!tokens.getUser()) {
      nav({ to: "/auth" });
      return;
    }
    setLoading(true);
    Promise.all([
      authApi.me().catch(() => null),
      ordersApi.mine().catch(() => ({ orders: [] })),
    ]).then(([meRes, ordRes]: any) => {
      setMe(meRes?.user ?? meRes);
      setOrders(ordRes?.orders ?? []);
    }).catch((e: any) => setErr(e?.message || "")).finally(() => setLoading(false));
  }, [nav]);

  const logout = () => {
    tokens.clearUser();
    nav({ to: "/auth" });
  };

  return (
    <>
      <PageHeader title="My Account" sub={me?.email || "Welcome back"} />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          <TabBtn active={tab === "profile"} onClick={() => setTab("profile")} icon={User} label="Profile" />
          <TabBtn active={tab === "orders"} onClick={() => setTab("orders")} icon={Package} label="My Orders" />
          <TabBtn active={tab === "danger"} onClick={() => setTab("danger")} icon={Trash2} label="Delete Account" />
          <Link to="/shop" className="ml-auto inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-gold hover:opacity-80">
            <ShoppingBag className="w-4 h-4" /> Go to Shop
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-6 h-6 text-gold animate-spin mx-auto" /></div>
        ) : (
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {tab === "profile" && <Profile me={me} onLogout={logout} />}
            {tab === "orders" && <Orders orders={orders} />}
            {tab === "danger" && <DeleteAccount email={me?.email || ""} onDone={logout} />}
          </motion.div>
        )}
        {err && <p className="text-xs text-red-400 mt-4">{err}</p>}
      </section>
    </>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: any) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 border text-[11px] tracking-[0.25em] uppercase transition-all ${
        active ? "border-gold text-gold bg-gold/10" : "border-gold/20 text-ash hover:text-gold hover:border-gold/40"
      }`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

function Profile({ me, onLogout }: { me: any; onLogout: () => void }) {
  return (
    <div className="border border-gold/20 bg-surface/40 p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
      <Info label="Name" value={me?.name || "—"} />
      <Info label="Email" value={me?.email || "—"} />
      <Info label="Phone" value={me?.phone || "—"} />
      <Info label="Joined" value={me?.createdAt ? new Date(me.createdAt).toLocaleDateString() : "—"} />
      <div className="sm:col-span-2 pt-4 border-t border-gold/15">
        <button onClick={onLogout} className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ash hover:text-gold">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-ash">{label}</p>
      <p className="font-display text-xl text-foreground mt-1 break-all">{value}</p>
    </div>
  );
}

function Orders({ orders }: { orders: any[] }) {
  if (!orders?.length) {
    return (
      <div className="text-center py-16 border border-gold/15 bg-surface/40">
        <p className="font-display text-2xl text-ash">No orders yet.</p>
        <Link to="/shop" className="btn-luxe mt-6 inline-flex">Start Shopping</Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o._id || o.orderId} className="border border-gold/20 bg-surface/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-ash">Order</p>
              <p className="font-display text-xl text-gold-gradient">{o.orderId}</p>
            </div>
            <span className={`text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 ${
              o.status === "Cancelled" ? "bg-red-500/20 text-red-300" :
              o.status === "Delivered" ? "bg-emerald-500/20 text-emerald-300" :
              "bg-gradient-gold text-ink"
            }`}>{o.status}</span>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-ash">Total</p>
              <p className="font-display text-lg">PKR {Number(o.totalAmount || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gold/10 text-xs text-ash">
            {(o.items || []).map((it: any, i: number) => (
              <div key={i} className="flex justify-between py-0.5">
                <span className="truncate">{it.productName} × {it.quantity}</span>
                <span>PKR {Number(it.totalPrice || 0).toLocaleString()}</span>
              </div>
            ))}
            <p className="mt-2 text-[10px]">Placed: {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DeleteAccount({ email, onDone }: { email: string; onDone: () => void }) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setOk("");
    if (confirmEmail.trim().toLowerCase() !== (email || "").toLowerCase()) {
      setErr("Email match nahi kar raha.");
      return;
    }
    setLoading(true);
    try {
      await authApi.deleteAccount({ email: confirmEmail, password });
      setOk("Account permanently deleted.");
      setTimeout(onDone, 1500);
    } catch (e: any) {
      setErr(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="border border-red-500/30 bg-red-500/5 p-6 sm:p-8 max-w-xl">
      <p className="font-display text-2xl text-red-300">Delete Account</p>
      <p className="text-sm text-ash mt-2">
        Yeh permanent hai. Apna email aur password dobara dalo confirm karne ke liye.
      </p>
      <label className="block mt-5">
        <span className="luxe-label">Confirm Email</span>
        <input required type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)}
          placeholder={email} className="luxe-input" />
      </label>
      <label className="block mt-4">
        <span className="luxe-label">Password</span>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="luxe-input" />
      </label>
      {err && <p className="text-xs text-red-400 mt-3">{err}</p>}
      {ok && <p className="text-xs text-emerald-400 mt-3">{ok}</p>}
      <button disabled={loading}
        className={`mt-6 inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30 text-[11px] tracking-[0.3em] uppercase ${loading ? "opacity-60 pointer-events-none" : ""}`}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        Permanently Delete
      </button>
    </form>
  );
}
