import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product } from "./data/products";

export type Screen =
  | { name: "auth" }
  | { name: "dashboard" }
  | { name: "shop-home" }
  | { name: "shop-category"; categoryId: string }
  | { name: "shop-category-list"; categoryId: string }
  | { name: "shop-search"; query: string }
  | { name: "shop-pdp"; productId: string }
  | { name: "shop-cart" }
  | { name: "shop-checkout" }
  | { name: "shop-success"; orderId: string }
  | { name: "shop-tracker"; orderId: string }
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

export type OrderStatus = "placed" | "packed" | "shipped" | "out" | "delivered";

export type OrderItem = {
  product: Product;
  qty: number;
  size?: string;
  color?: string;
  subscribe?: boolean;
};

export type OrderRecord = {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  eta: string;
  total: number;
  payment: string;
  deliveryMode: "standard" | "express";
  createdAt: string;
};

export type ThemeMode = "default" | "green";

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
  orders: OrderRecord[];
  placeOrder: (payload: {
    items: OrderItem[];
    total: number;
    payment: string;
    deliveryMode: "standard" | "express";
    eta: string;
  }) => string;
  getOrder: (id: string) => OrderRecord | undefined;
  wishlist: string[];
  toggleWish: (id: string) => void;
  recentlyViewed: string[];
  markViewed: (id: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  authComplete: boolean;
  setAuthComplete: (value: boolean) => void;
  address: string;
};

const Ctx = createContext<Store | null>(null);

const seedOrders: OrderRecord[] = [
  {
    id: "LZ482019",
    items: [{ product: { id: "p4" } as Product, qty: 1 }],
    status: "out",
    eta: "Arriving today by 7 PM",
    total: 7499,
    payment: "UPI",
    deliveryMode: "express",
    createdAt: "2026-04-24T10:00:00.000Z",
  },
  {
    id: "LZ481220",
    items: [{ product: { id: "p1" } as Product, qty: 1 }],
    status: "shipped",
    eta: "Arriving Sat, 26 Apr",
    total: 4299,
    payment: "UPI",
    deliveryMode: "standard",
    createdAt: "2026-04-23T09:15:00.000Z",
  },
  {
    id: "LZ479833",
    items: [{ product: { id: "p9" } as Product, qty: 1 }],
    status: "delivered",
    eta: "Delivered 20 Apr",
    total: 599,
    payment: "Card",
    deliveryMode: "standard",
    createdAt: "2026-04-20T08:30:00.000Z",
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>(() => {
    if (typeof window === "undefined") return { name: "dashboard" };
    return window.localStorage.getItem("livezy-authenticated") === "true"
      ? { name: "dashboard" }
      : { name: "auth" };
  });
  const [history, setHistory] = useState<Screen[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>(seedOrders);
  const [authComplete, setAuthComplete] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("livezy-authenticated") === "true";
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "default";
    const saved = window.localStorage.getItem("livezy-theme");
    return saved === "green" ? "green" : "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = themeMode;
    window.localStorage.setItem("livezy-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    window.localStorage.setItem("livezy-authenticated", authComplete ? "true" : "false");
  }, [authComplete]);

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
  const placeOrder = (payload: {
    items: OrderItem[];
    total: number;
    payment: string;
    deliveryMode: "standard" | "express";
    eta: string;
  }) => {
    const id = "LZ" + Math.floor(100000 + Math.random() * 900000);
    const next: OrderRecord = {
      id,
      items: payload.items,
      status: "placed",
      eta: payload.eta,
      total: payload.total,
      payment: payload.payment,
      deliveryMode: payload.deliveryMode,
      createdAt: new Date().toISOString(),
    };
    setOrders((list) => [next, ...list]);
    return id;
  };
  const getOrder = (id: string) => orders.find((o) => o.id === id);

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
      orders,
      placeOrder,
      getOrder,
      wishlist,
      toggleWish,
      recentlyViewed,
      markViewed,
      themeMode,
      setThemeMode,
      authComplete,
      setAuthComplete,
      address: "Home · Koramangala, Bengaluru 560034",
    }),
    [screen, history, cart, wishlist, orders, recentlyViewed, themeMode, authComplete],
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
