import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const faqReplies: Record<string, string> = {
  delivery: "We deliver across Pakistan in 2–4 business days. Karachi: 1–2 days.",
  payment: "We accept Cash on Delivery, Easypaisa, and JazzCash.",
  wanted: "Noir Eclipse is our signature men's collection — bold oud, leather, and amber.",
  flora: "Velvet Bloom is our feminine line — rose, jasmine, vanilla, peony.",
  refund: "7-day return policy on unopened items. WhatsApp us to initiate.",
  contact: "WhatsApp: 0300-XXXXXXX · IG: @Aureliafragrance.pk",
};

const chips = [
  { k: "delivery", l: "Delivery time" },
  { k: "payment", l: "Payments" },
  { k: "wanted", l: "Noir line" },
  { k: "flora", l: "Bloom line" },
  { k: "refund", l: "Refunds" },
  { k: "contact", l: "Contact" },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  type Msg = { from: "bot" | "user"; text: string };
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Assalam-o-Alaikum! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string, reply?: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: reply || "Thank you! Our team will reach you on WhatsApp shortly." }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="mb-3 w-[min(360px,calc(100vw-3rem))] bg-surface border border-gold/30 shadow-2xl overflow-hidden flex flex-col"
            style={{ height: 460 }}
          >
            <div className="px-5 py-4 bg-gradient-gold text-ink flex items-center justify-between">
              <div>
                <p className="font-display text-lg leading-tight">Aurelia Support</p>
                <p className="text-[11px] opacity-80">Usually replies instantly</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-ink/80 hover:text-ink"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[80%] px-3 py-2 text-sm ${
                    m.from === "bot"
                      ? "bg-surface-2 text-foreground rounded-tr-lg rounded-br-lg rounded-bl-lg"
                      : "ml-auto bg-gradient-gold text-ink rounded-tl-lg rounded-bl-lg rounded-br-lg"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
            </div>
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {chips.map((c) => (
                <button key={c.k} onClick={() => send(c.l, faqReplies[c.k])}
                  className="text-[11px] px-2.5 py-1 border border-gold/30 text-gold-soft hover:bg-gold hover:text-ink transition-all">
                  {c.l}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-gold/15 p-2 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message…"
                className="flex-1 bg-transparent text-sm px-3 py-2 outline-none placeholder:text-ash" />
              <button className="px-3 text-gold hover:text-gold-soft"><Send className="w-4 h-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        className="relative grid place-items-center w-14 h-14 rounded-full bg-gradient-gold text-ink shadow-[0_15px_40px_-10px_rgba(170,195,235,0.55)]"
        aria-label="Chat"
      >
        <span className="absolute inset-0 rounded-full bg-gold animate-glow opacity-50" />
        <MessageCircle className="relative w-6 h-6" />
      </motion.button>
    </div>
  );
}