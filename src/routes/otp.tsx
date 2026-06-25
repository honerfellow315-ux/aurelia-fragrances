import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
const logoAsset = { url: "/aurelia-logo.png" };
import { authApi, tokens } from "@/lib/api";

export const Route = createFileRoute("/otp")({ component: OTP });

function OTP() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const arr = text.split("").concat(Array(6).fill("")).slice(0, 6);
    setDigits(arr);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const code = digits.join("");
  const ready = code.length === 6;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || !email) {
      setError("Please enter your email and OTP code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authApi.verifyOtp({ email, otp: code });
      if (res?.token) tokens.setUser(res.token);
      setVerified(true);
      setTimeout(() => navigate({ to: "/" }), 1600);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[85vh] grid place-items-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.04_255/0.14),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-md border border-gold/25 bg-surface/60 backdrop-blur-xl p-8 sm:p-10"
      >
        <img src={logoAsset.url} alt="Aurelia" className="h-16 w-auto mx-auto mb-6 drop-shadow-[0_0_24px_rgba(170,195,235,0.45)]" />

        <AnimatePresence mode="wait">
          {!verified ? (
            <motion.form
              key="otp"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              onSubmit={submit}
              className="space-y-6"
              autoComplete="off"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-grid place-items-center w-14 h-14 rounded-full border border-gold/40 bg-gold/5 mb-4"
                >
                  <ShieldCheck className="w-6 h-6 text-gold" />
                </motion.div>
                <p className="font-display text-2xl text-gold-gradient">Verify Your Email</p>
                <p className="text-xs text-ash mt-2 leading-relaxed">
                  We sent a 6-digit verification code to your email.<br />
                  Enter it below to continue.
                </p>
              </div>

              {/* Email field */}
              <label className="block">
                <span className="luxe-label">Your Email</span>
                <input
                  type="email"
                  className="luxe-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <div className="flex justify-between gap-2 sm:gap-3" onPaste={onPaste}>
                {digits.map((d, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-11 sm:w-12 h-14 text-center font-display text-2xl bg-surface/60 border border-gold/25 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 text-gold transition-all"
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3 text-center">
                  {error}
                </p>
              )}

              <button
                disabled={!ready || loading}
                className={`btn-luxe w-full transition-all ${ready && !loading ? "" : "opacity-40 pointer-events-none"}`}
              >
                {loading ? "Verifying…" : "Verify & Continue"}
              </button>

              <div className="flex items-center justify-between text-xs text-ash">
                <Link to="/auth" className="hover:text-gold">← Back</Link>
                {secondsLeft > 0 ? (
                  <span>Resend in <span className="text-gold">{secondsLeft}s</span></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSecondsLeft(45)}
                    className="flex items-center gap-1 text-gold hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend Code
                  </button>
                )}
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-center space-y-4 py-4"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 12 }}
                className="inline-grid place-items-center w-16 h-16 rounded-full bg-gradient-gold mb-2"
              >
                <CheckCircle2 className="w-8 h-8 text-ink" />
              </motion.div>
              <p className="font-display text-2xl text-gold-gradient">Verified!</p>
              <p className="text-sm text-ash">Redirecting you to the store…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
