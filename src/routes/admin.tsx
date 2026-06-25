import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ArrowLeft,
  Plus,
  Upload as UploadIcon,
  Loader2,
  Trash2,
  LogOut,
  Pencil,
} from "lucide-react";
import { products as localProducts } from "@/lib/products";
import {
  productsApi,
  uploadImage,
  tokens,
  api,
  type ApiProduct,
} from "@/lib/api";

export const Route = createFileRoute("/admin")({ component: Admin });

const tabs = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "orders", label: "Orders", Icon: ShoppingCart },
  { id: "products", label: "Products", Icon: Package },
  { id: "users", label: "Users", Icon: Users },
] as const;

function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("dashboard");

  // ⚠️ DEMO MODE: admin panel open to everyone. Re-enable the redirect to
  // restore protection.
  useEffect(() => {
    // if (typeof window !== "undefined" && !tokens.getAdmin()) {
    //   navigate({ to: "/admin-login" });
    // }
  }, [navigate]);

  const logout = () => {
    tokens.clearAdmin();
    navigate({ to: "/admin-login" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="border border-gold/20 bg-surface/40 p-5 h-fit lg:sticky lg:top-28">
        <p className="font-display text-xl text-gold-gradient mb-5">Admin Panel</p>
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${
                tab === t.id ? "bg-gold/10 text-gold border-l-2 border-gold" : "text-ash hover:text-gold hover:bg-surface-2"
              }`}
            >
              <t.Icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ash hover:text-gold mt-6 border-t border-gold/15 pt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ash hover:text-gold">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </nav>
      </aside>

      <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {tab === "dashboard" && <Dashboard />}
        {tab === "orders" && <OrdersTab />}
        {tab === "products" && <Products />}
        {tab === "users" && <UsersTab />}
      </motion.div>
    </section>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <p className="font-display text-3xl text-gold-gradient mb-6">{children}</p>;
}

// ============= Dashboard =============
function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [dbProductCount, setDbProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api("/admin/dashboard", { token: tokens.getAdmin() }),
      productsApi.list(),
    ])
      .then(([dashRes, productsRes]: any) => {
        // Backend bhejta hai { stats: {...}, recentOrders: [...] }
        setStats(dashRes.stats ?? dashRes);
        setRecentOrders(dashRes.recentOrders ?? []);
        const arr = Array.isArray(productsRes) ? productsRes : productsRes?.products ?? [];
        setDbProductCount(arr.length + localProducts.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { l: "Total Orders", v: stats?.totalOrders ?? "0", c: "All time" },
    { l: "Revenue", v: `PKR ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`, c: "All time" },
    { l: "Pending Orders", v: stats?.pendingOrders ?? "0", c: "Needs attention" },
    { l: "Products", v: String(dbProductCount || localProducts.length), c: "Live in store" },
  ];

  return (
    <>
      <H>Dashboard</H>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="luxe-card p-5"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-ash">{s.l}</p>
            <p className="font-display text-3xl text-gold-gradient mt-2">
              {loading ? <Loader2 className="inline w-4 h-4 animate-spin" /> : s.v}
            </p>
            <p className="text-xs text-ash mt-1">{s.c}</p>
          </motion.div>
        ))}
      </div>

      <p className="font-display text-2xl mt-10 mb-4">Recent Orders</p>
      <Table cols={["Order ID", "Customer", "Total", "Payment", "Status"]}>
        {loading && (
          <tr><td colSpan={5} className="px-4 py-10 text-center text-ash">
            <Loader2 className="inline w-4 h-4 animate-spin mr-2" /> Loading…
          </td></tr>
        )}
        {!loading && recentOrders.length === 0 && (
          <tr><td colSpan={5} className="px-4 py-10 text-center text-ash">No orders yet.</td></tr>
        )}
        {!loading && recentOrders.map((o) => (
          <tr key={o._id} className="border-t border-gold/10">
            <td className="px-4 py-3 text-xs font-mono text-ash">{o.orderId}</td>
            <td className="px-4 py-3">{o.user?.name ?? o.guestInfo?.name ?? "—"}</td>
            <td className="px-4 py-3">PKR {Number(o.totalAmount ?? 0).toLocaleString()}</td>
            <td className="px-4 py-3 text-ash">{o.payment?.method ?? "—"}</td>
            <td className="px-4 py-3">
              <span className="text-[10px] tracking-widest uppercase border border-gold/30 px-2 py-1 text-gold">
                {o.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}

// ============= Orders =============
function OrdersTab() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api("/admin/orders", { token: tokens.getAdmin() })
      .then((res: any) => setList(Array.isArray(res) ? res : res?.orders ?? []))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api(`/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: { status },
        token: tokens.getAdmin(),
      });
      setList((l) => l.map((o) => (o.orderId === orderId ? { ...o, status } : o)));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <>
      <H>Manage Orders</H>
      {error && <p className="text-xs text-red-400 mb-4">{error}</p>}
      <Table cols={["Order ID", "Customer", "Phone", "Total", "Payment", "Receipt", "Status", "Action"]}>
        {loading && (
          <tr><td colSpan={8} className="px-4 py-10 text-center text-ash">
            <Loader2 className="inline w-4 h-4 animate-spin mr-2" /> Loading…
          </td></tr>
        )}
        {!loading && list.length === 0 && (
          <tr><td colSpan={8} className="px-4 py-10 text-center text-ash">No orders yet.</td></tr>
        )}
        {!loading && list.map((o) => {
          const customerName = o.user?.name ?? o.guestInfo?.name ?? "—";
          const phone = o.user?.phone ?? o.guestInfo?.phone ?? "—";
          const paymentMethod = o.payment?.method ?? "—";
          const receiptUrl = o.payment?.screenshotUrl;
          return (
            <tr key={o._id} className="border-t border-gold/10">
              <td className="px-4 py-3 text-xs text-ash font-mono">{o.orderId ?? o._id?.slice(-6).toUpperCase()}</td>
              <td className="px-4 py-3">{customerName}</td>
              <td className="px-4 py-3 text-ash">{phone}</td>
              <td className="px-4 py-3">PKR {Number(o.totalAmount ?? 0).toLocaleString()}</td>
              <td className="px-4 py-3 text-ash">{paymentMethod}</td>
              <td className="px-4 py-3">
                {receiptUrl ? (
                  <a href={receiptUrl} target="_blank" rel="noreferrer" download
                    className="text-[10px] tracking-[0.25em] uppercase text-gold hover:underline">
                    Download
                  </a>
                ) : <span className="text-ash text-xs">—</span>}
              </td>
              <td className="px-4 py-3">
                <span className="text-[10px] tracking-widest uppercase border border-gold/30 px-2 py-1 text-gold">
                  {o.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <select
                  className="luxe-input text-xs py-1"
                  value={o.status}
                  onChange={(e) => updateStatus(o.orderId, e.target.value)}
                >
                  {["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}

// ============= Products =============
function Products() {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [list, setList] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await productsApi.list();
      const arr: ApiProduct[] = Array.isArray(res) ? res : res?.products ?? [];
      setList(arr);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const onDelete = async (id?: string | number) => {
    if (!id) return;
    if (!confirm("Delete this product?")) return;
    try {
      await productsApi.remove(String(id));
      setList((l) => l.filter((p) => (p._id ?? p.id) !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <p className="font-display text-3xl text-gold-gradient">Products</p>
        <button onClick={() => { setShowAdd((s) => !s); setEditing(null); }} className="btn-ghost">
          <Plus className="w-4 h-4" /> {showAdd ? "Close" : "Add Product"}
        </button>
      </div>

      {showAdd && !editing && <AddProductForm onSaved={() => { setShowAdd(false); fetchList(); }} />}
      {editing && (
        <EditProductForm
          product={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchList(); }}
        />
      )}

      {error && (
        <p className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3 mb-4">{error}</p>
      )}

      <Table cols={["Image", "Name", "Price", "Category", "Actions"]}>
        {loading && (
          <tr><td colSpan={5} className="px-4 py-10 text-center text-ash">
            <Loader2 className="inline w-4 h-4 animate-spin mr-2" /> Loading…
          </td></tr>
        )}
        {!loading && list.length === 0 && (
          <tr><td colSpan={5} className="px-4 py-10 text-center text-ash">No products yet.</td></tr>
        )}
        {!loading && list.map((p) => {
          const id = (p._id ?? p.id) as string | number | undefined;
          const img = p.image || (p.images as any)?.[0]?.url || (p.images as any)?.[0];
          return (
            <tr key={String(id)} className="border-t border-gold/10">
              <td className="px-4 py-3">
                {img ? (
                  <img src={img} alt={p.name} className="w-12 h-12 object-cover border border-gold/15" />
                ) : (
                  <div className="w-12 h-12 border border-gold/15 bg-surface-2/50" />
                )}
              </td>
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3 text-ash">PKR {Number(p.price).toLocaleString()}</td>
              <td className="px-4 py-3 text-ash">{p.category || "—"}</td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => { setEditing(p); setShowAdd(false); }} className="btn-ghost py-1.5 px-3 text-[10px]">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDelete(id)} className="btn-ghost py-1.5 px-3 text-[10px]">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}

function EditProductForm({ product, onSaved, onCancel }: { product: ApiProduct; onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: product.name || "",
    sub: product.sub || "",
    description: product.description || "",
    price: String(product.price ?? ""),
    oldPrice: product.oldPrice ? String(product.oldPrice) : "",
    category: product.category || "",
    stock: product.stock != null ? String(product.stock) : "",
    badge: product.badge || "",
  });
  const [file, setFile] = useState<File | null>(null);
  const existingImg = product.image || (product.images as any)?.[0]?.url || "";
  const [previewUrl, setPreviewUrl] = useState<string>(existingImg);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onFile = (f: File | null) => {
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : existingImg);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price) { setError("Name and price are required"); return; }
    setSaving(true);
    try {
      let imageUrl: string | undefined;
      if (file) {
        const up = await uploadImage(file);
        imageUrl = up.url;
      }
      const id = String(product._id ?? product.id);
      await productsApi.update(id, {
        name: form.name,
        sub: form.sub || undefined,
        description: form.description || undefined,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        category: form.category || undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        badge: form.badge || undefined,
        ...(imageUrl ? { image: imageUrl } : {}),
      });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="border border-gold/40 bg-gold/5 p-5 mb-6 grid gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2 flex items-center justify-between">
        <p className="font-display text-xl text-gold-gradient">Edit: {product.name}</p>
        <button type="button" onClick={onCancel} className="text-xs text-ash hover:text-gold">Cancel</button>
      </div>

      <div className="sm:col-span-2">
        <span className="luxe-label">Product Image</span>
        <label className="mt-1 flex items-center gap-4 border-2 border-dashed border-gold/25 hover:border-gold/60 cursor-pointer p-4 transition-colors">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover border border-gold/20" />
          ) : (
            <div className="w-20 h-20 grid place-items-center border border-gold/20 bg-surface-2/40 text-gold">
              <UploadIcon className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-ash">{file ? file.name : "Click to replace image (optional)"}</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        </label>
      </div>

      <Field label="Product Name *">
        <input className="luxe-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Subtitle">
        <input className="luxe-input" value={form.sub} onChange={(e) => setForm({ ...form, sub: e.target.value })} />
      </Field>
      <Field label="Price (PKR) *">
        <input className="luxe-input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      </Field>
      <Field label="Old Price">
        <input className="luxe-input" type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
      </Field>
      <Field label="Category">
        <select className="luxe-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Select Category</option>
          <option value="Attar">Attar</option>
          <option value="EDP">EDP</option>
          <option value="EDT">EDT</option>
          <option value="Musk">Musk</option>
          <option value="Oud">Oud</option>
          <option value="Gift Set">Gift Set</option>
        </select>
      </Field>
      <Field label="Stock">
        <input className="luxe-input" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
      </Field>
      <Field label="Badge">
        <select className="luxe-input" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
          <option value="">No Badge</option>
          <option value="Bestseller">Bestseller</option>
          <option value="New Arrival">New Arrival</option>
          <option value="Sale">Sale</option>
          <option value="Limited">Limited</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea className="luxe-input h-24 resize-none" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
      </div>
      {error && <p className="sm:col-span-2 text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3">{error}</p>}
      <button disabled={saving} className={`btn-luxe sm:col-span-2 sm:w-fit ${saving ? "opacity-60 pointer-events-none" : ""}`}>
        {saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>) : "Save Changes"}
      </button>
    </motion.form>
  );
}

function AddProductForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({
    name: "", sub: "", description: "", price: "",
    oldPrice: "", category: "", stock: "", badge: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onFile = (f: File | null) => {
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price) { setError("Name and price are required"); return; }
    if (!form.category) { setError("Please select a category"); return; }
    setSaving(true);
    try {
      let imageUrl: string | undefined;
      if (file) {
        const up = await uploadImage(file);
        imageUrl = up.url;
      }
      await productsApi.create({
        name: form.name,
        sub: form.sub || undefined,
        description: form.description || undefined,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        category: form.category || undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        badge: form.badge || undefined,
        image: imageUrl,
      });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="border border-gold/20 bg-surface/40 p-5 mb-6 grid gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <span className="luxe-label">Product Image</span>
        <label className="mt-1 flex items-center gap-4 border-2 border-dashed border-gold/25 hover:border-gold/60 cursor-pointer p-4 transition-colors">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover border border-gold/20" />
          ) : (
            <div className="w-20 h-20 grid place-items-center border border-gold/20 bg-surface-2/40 text-gold">
              <UploadIcon className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-ash">{file ? file.name : "Click to upload product image"}</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-ash/60 mt-1">JPG, PNG, WEBP — up to 5MB</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        </label>
      </div>

      <Field label="Product Name *">
        <input className="luxe-input" placeholder="Oud Al Noor" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>

      <Field label="Subtitle">
        <input className="luxe-input" placeholder="Saffron · Oud · Amber — 100ml"
          value={form.sub} onChange={(e) => setForm({ ...form, sub: e.target.value })} />
      </Field>

      <Field label="Price (PKR) *">
        <input className="luxe-input" type="number" placeholder="3500" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />
      </Field>

      <Field label="Old Price (for discount)">
        <input className="luxe-input" type="number" placeholder="5000" value={form.oldPrice}
          onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
      </Field>

      <Field label="Category *">
        <select className="luxe-input" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Select Category</option>
          <option value="Attar">Attar</option>
          <option value="EDP">EDP</option>
          <option value="EDT">EDT</option>
          <option value="Musk">Musk</option>
          <option value="Oud">Oud</option>
          <option value="Gift Set">Gift Set</option>
        </select>
      </Field>

      <Field label="Stock Quantity">
        <input className="luxe-input" type="number" placeholder="50" value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })} />
      </Field>

      <Field label="Badge (optional)">
        <select className="luxe-input" value={form.badge}
          onChange={(e) => setForm({ ...form, badge: e.target.value })}>
          <option value="">No Badge</option>
          <option value="Bestseller">Bestseller</option>
          <option value="New Arrival">New Arrival</option>
          <option value="Sale">Sale</option>
          <option value="Limited">Limited</option>
          <option value="Limited Offer">Limited Offer</option>
        </select>
      </Field>

      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea className="luxe-input h-24 resize-none" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
      </div>

      {error && <p className="sm:col-span-2 text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3">{error}</p>}

      <button disabled={saving} className={`btn-luxe sm:col-span-2 sm:w-fit ${saving ? "opacity-60 pointer-events-none" : ""}`}>
        {saving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>) : "Save Product"}
      </button>
    </motion.form>
  );
}

// ============= Users =============
function UsersTab() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api("/admin/users", { token: tokens.getAdmin() })
      .then((res: any) => setList(Array.isArray(res) ? res : res?.users ?? []))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <H>Users</H>
      {error && <p className="text-xs text-red-400 mb-4">{error}</p>}
      <Table cols={["Name", "Email", "Phone", "Joined"]}>
        {loading && (
          <tr><td colSpan={4} className="px-4 py-10 text-center text-ash">
            <Loader2 className="inline w-4 h-4 animate-spin mr-2" /> Loading…
          </td></tr>
        )}
        {!loading && list.length === 0 && (
          <tr><td colSpan={4} className="px-4 py-10 text-center text-ash">No users yet.</td></tr>
        )}
        {!loading && list.map((u, i) => (
          <tr key={i} className="border-t border-gold/10">
            <td className="px-4 py-3">{u.name}</td>
            <td className="px-4 py-3 text-ash">{u.email}</td>
            <td className="px-4 py-3 text-ash">{u.phone}</td>
            <td className="px-4 py-3 text-ash">{new Date(u.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}

// ============= Helpers =============
function Table({ cols, children, empty }: { cols: string[]; children?: React.ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto border border-gold/15">
      <table className="w-full text-sm min-w-[600px]">
        <thead className="bg-surface-2/50">
          <tr>{cols.map((c) => <th key={c} className="text-left px-4 py-3 text-[10px] tracking-[0.25em] uppercase text-gold-soft font-medium">{c}</th>)}</tr>
        </thead>
        <tbody>
          {children ?? <tr><td colSpan={cols.length} className="text-center px-4 py-10 text-ash">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="luxe-label">{label}</span>{children}</label>;
}
