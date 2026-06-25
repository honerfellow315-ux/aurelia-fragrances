import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { id: string | number; qty: number; size: string };

type State = {
  items: CartItem[];
  add: (id: string | number, size?: string) => void;
  remove: (id: string | number, size: string) => void;
  setQty: (id: string | number, size: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<State>()(
  persist(
    (set) => ({
      items: [],
      add: (id, size = "100ml") =>
        set((s) => {
          const ex = s.items.find((i) => String(i.id) === String(id) && i.size === size);
          if (ex) return { items: s.items.map((i) => (String(i.id) === String(id) && i.size === size ? { ...i, qty: i.qty + 1 } : i)) };
          return { items: [...s.items, { id, size, qty: 1 }] };
        }),
      remove: (id, size) => set((s) => ({ items: s.items.filter((i) => !(String(i.id) === String(id) && i.size === size)) })),
      setQty: (id, size, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => !(String(i.id) === String(id) && i.size === size))
            : s.items.map((i) => (String(i.id) === String(id) && i.size === size ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "aurelia-cart" }
  )
);
