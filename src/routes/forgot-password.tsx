import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
const logoAsset = { url: "/aurelia-logo.png" };
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return;
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp) return;
    setStep("reset");
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newPassword) return;
    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      setSuccess("Password changed successfully!");
      setTimeout(() => navigate({ to: "/auth" }), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
        <img src={logoAsset.url} alt="Aurelia" className="h-16 w-auto mx-auto mb-6 drop-shadow-[0_0_24px_rgba(170,195,235,0.35)]" />

        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-grid place-items-center w-14 h-14 rounded-full border border-gold/40 bg-gold/5 mb-4"
          >
            <KeyRound className="w-6 h-6 text-gold" />
          </motion.div>
          <p className="font-display text-2xl text-gold-gradient">
            {step === "email" ? "Forgot Password?" : step === "otp" ? "Enter OTP" : "New Password"}
          </p>
          <p className="text-xs text-ash mt-2 leading-relaxed">
            {step === "email" && "Enter your email and we'll send you a verification code."}
            {step === "otp" && `Enter the OTP sent to ${email}`}
            {step === "reset" && "Enter your new password below."}
          </p>
        </div>

        <AnimatePresence mode="wait">

          {step === "email" && (
            <motion.form key="email" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }} onSubmit={sendOtp} className="space-y-5" autoComplete="off">
              <label className="block">
                <span className="luxe-label">Email</span>
                <input type="email" className="luxe-input" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" />
              </label>
              {error && <p className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3 text-center">{error}</p>}
              <button disabled={loading} className={`btn-luxe w-full ${loading ? "opacity-60 pointer-events-none" : ""}`}>
                {loading ? "Sending…" : "Send OTP"}
              </button>
              <Link to="/auth" className="flex items-center justify-center gap-2 text-xs text-ash hover:text-gold transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </motion.form>
          )}

          {step === "otp" && (
            <motion.form key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }} onSubmit={verifyOtp} className="space-y-5" autoComplete="off">
              <label className="block">
                <span className="luxe-label">OTP Code</span>
                <input className="luxe-input text-center tracking-[0.5em] font-display text-xl" placeholder="000000"
                  maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required />
              </label>
              {error && <p className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3 text-center">{error}</p>}
              <button disabled={otp.length !== 6} className={`btn-luxe w-full ${otp.length !== 6 ? "opacity-60 pointer-events-none" : ""}`}>
                Verify OTP
              </button>
              <button type="button" onClick={() => setStep("email")}
                className="flex items-center justify-center gap-2 text-xs text-ash hover:text-gold transition-colors w-full">
                <ArrowLeft className="w-3.5 h-3.5" /> Change Email
              </button>
            </motion.form>
          )}

          {step === "reset" && (
            <motion.form key="reset" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }} onSubmit={resetPassword} className="space-y-5" autoComplete="off">
              <label className="block">
                <span className="luxe-label">New Password</span>
                <input type="password" className="luxe-input" placeholder="••••••••"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoComplete="new-password" />
              </label>
              {error && <p className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 py-2 px-3 text-center">{error}</p>}
              {success && <p className="text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 py-2 px-3 text-center">{success}</p>}
              <button disabled={loading} className={`btn-luxe w-full ${loading ? "opacity-60 pointer-events-none" : ""}`}>
                {loading ? "Saving…" : "Reset Password"}
              </button>
            </motion.form>
          )}

        </AnimatePresence>
      </motion.div>
    </section>
  );
}
