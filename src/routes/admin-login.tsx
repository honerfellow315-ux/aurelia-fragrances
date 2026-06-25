import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ShieldAlert, Lock, Phone, Eye, EyeOff } from "lucide-react";
const logoAsset = { url: "/aurelia-logo.png" };
import { adminApi, tokens } from "@/lib/api";

export const Route = createFileRoute("/admin-login")({ component: AdminLogin });

function AdminLogin() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ phone: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.phone || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await adminApi.login({
        phone: form.phone,
        password: form.password,
      });
      if (!res?.token) throw new Error("No token returned");
      if (res.user?.role !== "admin") {
        throw new Error("Not authorized. Admins only.");
      }
      tokens.setAdmin(res.token);
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[85vh] grid place-items-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.04_255/0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,oklch(0.82_0.04_255/0.04)_50%,transparent)] bg-[length:300%_100%] animate-[shimmer_8s_linear_infinite]" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-md border border-gold/30 bg-surface/70 backdrop-blur-xl p-8 sm:p-10 shadow-[0_0_60px_-15px_rgba(170,195,235,0.35)]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        <img src={logoAsset.url} alt="Aurelia" className="h-16 w-auto mx-auto mb-6 drop-shadow-[0_0_24px_rgba(170,195,235,0.45)]" />

        <div className="text-center mb-7 flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold border border-gold/30 px-3 py-1.5 rounded-full bg-gold/5">
            <ShieldAlert className="w-3.5 h-3.5" /> Restricted Access
          </span>
          <p className="font-display text-2xl text-gold-gradient mt-2">Admin Portal</p>
        </div>

        <form onSubmit={onSubmit} autoComplete="off" className="space-y-5">
          <label className="block">
            <span className="luxe-label">Phone Number</span>
            <div className="relative">
              <Phone className="w-4 h-4 text-gold/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                className="luxe-input pl-10"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                autoComplete="off"
              />
            </div>
          </label>

          <label className="block">
            <span className="luxe-label">Password</span>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPass ? "text" : "password"}
                className="luxe-input pl-10 pr-10"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-gold"
                aria-label="Toggle password"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 text-center border border-red-500/30 bg-red-500/10 py-2"
            >
              {error}
            </motion.p>
          )}

          <button
            disabled={loading}
            className={`btn-luxe w-full ${loading ? "opacity-60 pointer-events-none" : ""}`}
          >
            {loading ? "Authenticating…" : "Sign In to Admin"}
          </button>

          <p className="text-[10px] tracking-[0.25em] uppercase text-center text-ash/70">
            Authorized personnel only
          </p>
        </form>
      </motion.div>
    </section>
  );
}
