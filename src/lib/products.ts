export type Product = {
  id: number;
  name: string;
  sub: string;
  price: number;
  oldPrice?: number;
  img: string;
  category: string;
  collection: "wanted" | "flora";
  badge?: string;
  desc: string;
  top: string;
  heart: string;
  base: string;
};

export const products: Product[] = [
  {
    id: 0,
    name: "Noir Eclipse",
    sub: "Saffron · Oud · Amber — 100ml Monumental Edition",
    price: 5500,
    oldPrice: 6500,
    img: "/noir-eclipse.png",
    category: "Noir Eclipse",
    collection: "wanted",
    badge: "Bestseller",
    desc: "The signature scent of Noir Eclipse. A monumental 100ml edition — bold saffron and rich oud wrapped in warm amber. Crafted for the one who leaves a mark.",
    top: "Saffron",
    heart: "Oud",
    base: "Amber",
  },
  {
    id: 1,
    name: "Velvet Bloom",
    sub: "Damask Rose · Jasmine · Vanilla — 100ml Parfum Intense",
    price: 4500,
    oldPrice: 5500,
    img: "/velvet-bloom.png",
    category: "Velvet Bloom",
    collection: "flora",
    badge: "Limited Offer",
    desc: "Your signature scent. A long-lasting 100ml parfum intense — Damask rose and night-blooming jasmine softened with warm vanilla. Feminine, romantic, unforgettable.",
    top: "Rose",
    heart: "Jasmine",
    base: "Vanilla",
  },
];

export const faqs = [
  { q: "How long does delivery take?", a: "We deliver across Pakistan within 2–4 business days. Karachi orders usually arrive in 1–2 days." },
  { q: "What payment methods do you accept?", a: "Cash on Delivery (COD), Easypaisa, and JazzCash. For digital payments, upload your transaction screenshot at checkout." },
  { q: "What is your refund policy?", a: "We offer a 7-day return policy on unopened, unused items in original packaging. Contact us on WhatsApp to initiate a return." },
  { q: "Are your fragrances authentic?", a: "Yes, 100%. All Aurelia products are sourced directly from trusted suppliers. We never sell replicas or diluted products." },
  { q: "Do you offer gift packaging?", a: "Yes! Add a note during checkout and we'll include complimentary gift packaging at no extra charge." },
  { q: "Can I cancel my order?", a: "Yes, you can cancel any order before it ships. Contact us on WhatsApp at 0300-XXXXXXX." },
];
