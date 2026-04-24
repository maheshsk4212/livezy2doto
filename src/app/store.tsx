import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { Product } from "./data/products";

export type Screen =
  | { name: "dashboard" }
  | { name: "shop-home" }
  | { name: "shop-category"; categoryId: string }
  | { name: "shop-category-list"; categoryId: string }
  | { name: "shop-search"; query: string }
  | { name: "shop-pdp"; productId: string }
  | { name: "shop-cart" }
  | { name: "shop-checkout" }
  | { name: "shop-success"; orderId: string }
  | { name: "shop-orders" }
  | { name: "account" }
  | { name: "lob-stub"; lob: string };

export type CartItem = {
  product: Product;
  qty: number;
  size?: string;
  color?: string;
  subscribe?: boolean;
};

type Store = {
  screen: Screen;
  history: Screen[];
  go: (s: Screen) => void;
  back: () => void;
  cart: CartItem[];
  addToCart: (p: Product, size?: string, color?: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  toggleSubscribe: (id: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  recentlyViewed: string[];
  markViewed: (id: string) => void;
  address: string;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>({ name: "dashboard" });
  const [history, setHistory] = useState<Screen[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const go = (s: Screen) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };
  const back = () => {
    setHistory((h) => {
      if (h.length === 0) {
        setScreen({ name: "dashboard" });
        return h;
      }
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
  };

  const addToCart = (p: Product, size?: string, color?: string) =>
    setCart((c) => {
      const found = c.find(
        (i) => i.product.id === p.id && i.size === size && i.color === color,
      );
      if (found)
        return c.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { product: p, qty: 1, size, color }];
    });
  const toggleSubscribe = (id: string) =>
    setCart((c) => c.map((i) => (i.product.id === id ? { ...i, subscribe: !i.subscribe } : i)));
  const removeFromCart = (id: string) =>
    setCart((c) => c.filter((i) => i.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => i.product.id !== id)
        : c.map((i) => (i.product.id === id ? { ...i, qty } : i)),
    );
  const clearCart = () => setCart([]);
  const toggleWish = (id: string) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const markViewed = (id: string) =>
    setRecentlyViewed((items) => [id, ...items.filter((x) => x !== id)].slice(0, 8));

  const value = useMemo<Store>(
    () => ({
      screen,
      history,
      go,
      back,
      cart,
      addToCart,
      removeFromCart,
      setQty,
      toggleSubscribe,
      clearCart,
      wishlist,
      toggleWish,
      recentlyViewed,
      markViewed,
      address: "Home · Koramangala, Bengaluru 560034",
    }),
    [screen, history, cart, wishlist, recentlyViewed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
