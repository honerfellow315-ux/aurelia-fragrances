import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
const logoAsset = { url: "/aurelia-logo.png" };
import { authApi, tokens } from "@/lib/api";

export const Route = createFileRoute("/auth")({ component: Auth });

function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.email || !form.password || (tab === "register" && !form.name)) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      if (tab === "register") {
        await authApi.register({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        });
        setSuccess("Account created. Check your email for an OTP code.");
        setTimeout(() => navigate({ to: "/otp" }), 800);
      } else {
        const res = await authApi.login({ email: form.email, password: form.password });
        if (!res?.token) throw new Error("No token returned");
        tokens.setUser(res.token);
        setSuccess("Signed in successfully.");
        setTimeout(() => navigate({ to: "/" }), 600);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] grid place-items-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.04_255/0.12),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="relative w-full max-w-md border border-gold/25 bg-surface/60 backdrop-blur-xl p-8 sm:p-10"
      >
        <img src={logoAsset.url} alt="" className="h-16 w-auto mx-auto mb-6" />
        <div className="grid grid-cols-2 mb-8 border-b border-gold/20">
          {(["login", "register"] as const).map((k) => (
            <button key={k} onClick={() => { setTab(k); setError(""); setSuccess(""); }}
              className={`relative py-3 text-[11px] tracking-[0.3em] uppercase transition-colors ${tab === k ? "text-gold" : "text-ash"}`}>
              {k === "login" ? "Sign In" : "Create Account"}
              {tab === k && <motion.span layoutId="tab" className="absolute left-0 right-0 -bottom-px h-px bg-gradient-gold" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.form
            key={tab}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
            onSubmit={onSubmit}
            autoComplete="off"
          >
            {tab === "register" && (
              <Field label="Full Name">
                <input className="luxe-input" placeholder="Ahmed Rauf"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="off" />
              </Field>
            )}
            <Field label="Email">
              <input type="email" className="luxe-input" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="off" />
            </Field>
            {tab === "register" && (
              <Field label="Phone (Optional)">
                <input className="luxe-input" placeholder="0300-0000000"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  autoComplete="off" />
              </Field>
            )}
            <Field label="Password">
              <input type="password" className="luxe-input" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password" />
            </Field>

            {error && <p className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3 text-center">{error}</p>}
            {success && <p className="text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 py-2 px-3 text-center">{success}</p>}

            <button disabled={loading} className={`btn-luxe w-full ${loading ? "opacity-60 pointer-events-none" : ""}`}>
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Please wait…</>) : tab === "login" ? "Sign In" : "Create Account"}
            </button>

            {tab === "login" && (
              <div className="text-center text-xs text-ash">
                <Link to="/forgot-password" className="hover:text-gold transition-colors">Forgot password?</Link>
              </div>
            )}

            {tab === "register" && (
              <p className="text-xs text-ash text-center">
                After signing up you'll receive an OTP code to verify your email.
              </p>
            )}
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="luxe-label">{label}</span>{children}</label>;
}
