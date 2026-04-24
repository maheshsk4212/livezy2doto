import {
  ShoppingBag,
  Carrot,
  Banknote,
  Plane,
  Wrench,
  Sparkles,
  Car,
  UtensilsCrossed,
  Stethoscope,
  Gift,
  ChevronRight,
  Zap,
  Tag,
  MapPin,
  Clock3,
} from "lucide-react";
import { useStore, inr } from "../store";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { heroBanners, products } from "../data/products";
import { HScroll } from "./HScroll";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const lobs = [
  { id: "shop", name: "Shop", icon: ShoppingBag, tint: "bg-gradient-to-br from-indigo-500 to-violet-600" },
  { id: "mart", name: "Mart", icon: Carrot, tint: "bg-gradient-to-br from-emerald-500 to-teal-600" },
  { id: "loans", name: "Loans", icon: Banknote, tint: "bg-gradient-to-br from-amber-400 to-orange-500" },
  { id: "flights", name: "Flights", icon: Plane, tint: "bg-gradient-to-br from-sky-500 to-blue-600" },
  { id: "home", name: "Home", icon: Wrench, tint: "bg-gradient-to-br from-rose-500 to-pink-600" },
  { id: "beauty", name: "Salon", icon: Sparkles, tint: "bg-gradient-to-br from-fuchsia-500 to-purple-600" },
  { id: "rides", name: "Rides", icon: Car, tint: "bg-gradient-to-br from-slate-600 to-slate-800" },
  { id: "food", name: "Food", icon: UtensilsCrossed, tint: "bg-gradient-to-br from-orange-500 to-red-500" },
  { id: "health", name: "Health", icon: Stethoscope, tint: "bg-gradient-to-br from-teal-500 to-cyan-600" },
  { id: "rewards", name: "Rewards", icon: Gift, tint: "bg-gradient-to-br from-purple-500 to-pink-500" },
];

export function Dashboard() {
  const { go, recentlyViewed, markViewed } = useStore();
  const trending = products.slice(0, 6);
  const dealsNearYou = products
    .filter((p) => p.mrp > p.price && p.mrp - p.price >= 1000)
    .sort((a, b) => b.mrp - b.price - (a.mrp - a.price))
    .slice(0, 6);
  const recentViewedProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));
  const recentViewedRail = [
    ...recentViewedProducts,
    ...products.filter((p) => !recentlyViewed.includes(p.id)),
  ].slice(0, 6);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [heroIdx, setHeroIdx] = useState(0);

  const openLob = (id: string) => {
    if (id === "shop") go({ name: "shop-home" });
    else go({ name: "lob-stub", lob: id });
  };

  // Auto-advance hero carousel
  useEffect(() => {
    const id = setInterval(() => {
      const el = heroRef.current;
      if (!el) return;
      const next = (heroIdx + 1) % heroBanners.length;
      const child = el.children[next] as HTMLElement | undefined;
      if (child) {
        el.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
        setHeroIdx(next);
      }
    }, 3800);
    return () => clearInterval(id);
  }, [heroIdx]);

  return (
    <div className="pb-6">
      {/* Services grid — elevated primary section */}
      <section className="px-3 mt-3 relative z-10">
        <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-indigo-300 via-fuchsia-300 to-amber-300 shadow-[0_10px_28px_-10px_rgba(79,70,229,0.35)]">
          <div className="rounded-[15px] bg-gradient-to-b from-white to-indigo-50/60 pt-4 pb-5 grid grid-cols-5 gap-y-5 px-1">
          {lobs.map((l, i) => {
            const Icon = l.icon;
            return (
              <motion.button
                key={l.id}
                onClick={() => openLob(l.id)}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 320, damping: 20 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1.5 min-w-0"
              >
                <motion.div
                  whileHover={{ y: -2, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                  className={`w-12 h-12 rounded-2xl ${l.tint} text-white flex items-center justify-center shadow-md shadow-slate-900/10`}
                >
                  <Icon className="w-[22px] h-[22px]" strokeWidth={2.2} />
                </motion.div>
                <div className="text-[11px] text-slate-700 leading-tight text-center truncate max-w-full">
                  {l.name}
                </div>
              </motion.button>
            );
          })}
          </div>
        </div>
      </section>

      {/* Hero banners carousel */}
      <section className="mt-5">
        <HScroll scrollRef={heroRef} className="pb-2">
          {heroBanners.map((b, i) => (
            <motion.button
              key={b.id}
              onClick={() => go({ name: "shop-home" })}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: heroIdx === i ? 1 : 0.98, opacity: heroIdx === i ? 1 : 0.85 }}
              transition={{ duration: 0.4 }}
              className="snap-start shrink-0 w-[85%] rounded-xl overflow-hidden relative h-32 text-left"
            >
              <ImageWithFallback src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>
                <div className="text-[10px] uppercase tracking-wider text-amber-300" style={{ fontWeight: 700 }}>Featured</div>
                <div className="text-lg leading-tight mt-0.5" style={{ fontWeight: 800 }}>{b.title}</div>
                <div className="text-xs text-white/95 mt-0.5">{b.subtitle}</div>
                <div className="mt-2 inline-flex self-start bg-white text-slate-900 px-3 py-1.5 rounded-full text-xs shadow-md" style={{ fontWeight: 700, textShadow: "none" }}>
                  {b.cta} <ChevronRight className="w-3 h-3 ml-0.5 self-center" />
                </div>
              </div>
            </motion.button>
          ))}
        </HScroll>
        <div className="mt-2 flex justify-center gap-1.5">
          {heroBanners.map((_, i) => (
            <motion.span
              key={i}
              animate={{ width: heroIdx === i ? 16 : 4, backgroundColor: heroIdx === i ? "#4f46e5" : "#cbd5e1" }}
              transition={{ duration: 0.3 }}
              className="h-1 rounded-full block"
            />
          ))}
        </div>
      </section>

      {/* Loan strip */}
      <section className="px-4 mt-5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full relative overflow-hidden rounded-xl bg-amber-50 px-3 py-2.5 flex items-center gap-2.5 text-left"
        >
          <motion.div
            aria-hidden
            initial={{ x: "-120%" }}
            animate={{ x: "220%" }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none"
          />
          <motion.span
            animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
            className="shrink-0"
          >
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
          </motion.span>
          <div className="flex-1 min-w-0 text-xs text-slate-700 truncate">
            Pre-approved loan of <span style={{ fontWeight: 600 }}>{inr(500000)}</span> @ 10.5%
          </div>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </motion.div>
        </motion.button>
      </section>

      {/* Trending */}
      <section className="mt-5">
        <div className="px-4 flex items-center justify-between mb-2.5">
          <div className="text-sm" style={{ fontWeight: 600 }}>Trending on Shop</div>
          <button
            onClick={() => go({ name: "shop-home" })}
            className="text-xs text-indigo-600 flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <HScroll className="pb-2">
          {trending.map((p) => {
            const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            return (
              <motion.button
                key={p.id}
                onClick={() => {
                  markViewed(p.id);
                  go({ name: "shop-pdp", productId: p.id });
                }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -3 }}
                className="snap-start shrink-0 w-40 text-left bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                <div className="aspect-square w-full bg-slate-100 overflow-hidden relative">
                  <motion.div className="w-full h-full" whileHover={{ scale: 1.06 }} transition={{ duration: 0.3 }}>
                    <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded"
                  >
                    {off}% OFF
                  </motion.div>
                </div>
                <div className="p-2.5">
                  <div className="text-[11px] text-slate-500 truncate">{p.brand}</div>
                  <div className="text-sm line-clamp-1 mt-0.5">{p.name}</div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span style={{ fontWeight: 600 }}>{inr(p.price)}</span>
                    <span className="text-[11px] text-slate-400 line-through">{inr(p.mrp)}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </HScroll>
      </section>

      {/* Nearby deals */}
      <section className="mt-5">
        <div className="px-4 flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-sm" style={{ fontWeight: 600 }}>
            <MapPin className="w-4 h-4 text-emerald-600" />
            Deals Near you
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Clock3 className="w-3 h-3" />
            Fresh today
          </div>
        </div>
        <HScroll className="pb-2">
          {dealsNearYou.map((p) => {
            const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            return (
              <motion.button
                key={p.id}
                onClick={() => {
                  markViewed(p.id);
                  go({ name: "shop-pdp", productId: p.id });
                }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -3 }}
                className="snap-start shrink-0 w-44 text-left bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm"
              >
                <div className="aspect-square w-full bg-emerald-50 overflow-hidden relative">
                  <motion.div className="w-full h-full" whileHover={{ scale: 1.06 }} transition={{ duration: 0.3 }}>
                    <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Nearby
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full">
                    {off}% off
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-[11px] text-slate-500 truncate">{p.brand}</div>
                  <div className="text-sm line-clamp-1 mt-0.5">{p.name}</div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span style={{ fontWeight: 600 }}>{inr(p.price)}</span>
                    <span className="text-[11px] text-slate-400 line-through">{inr(p.mrp)}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-1 truncate">{p.delivery}</div>
                </div>
              </motion.button>
            );
          })}
        </HScroll>
      </section>

      {/* Recent viewed */}
      <section className="mt-5">
        <div className="px-4 flex items-center justify-between mb-2.5">
          <div className="text-sm" style={{ fontWeight: 600 }}>Recent viewed</div>
          <button
            onClick={() => go({ name: "shop-home" })}
            className="text-xs text-indigo-600 flex items-center gap-0.5"
          >
            Continue shopping <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <HScroll className="pb-2">
          {recentViewedRail.map((p) => {
            const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            return (
              <motion.button
                key={p.id}
                onClick={() => {
                  markViewed(p.id);
                  go({ name: "shop-pdp", productId: p.id });
                }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -3 }}
                className="snap-start shrink-0 w-40 text-left bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                <div className="aspect-square w-full bg-slate-100 overflow-hidden relative">
                  <motion.div className="w-full h-full" whileHover={{ scale: 1.06 }} transition={{ duration: 0.3 }}>
                    <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Viewed
                  </div>
                  <div className="absolute bottom-2 left-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {off}% OFF
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-[11px] text-slate-500 truncate">{p.brand}</div>
                  <div className="text-sm line-clamp-1 mt-0.5">{p.name}</div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span style={{ fontWeight: 600 }}>{inr(p.price)}</span>
                    <span className="text-[11px] text-slate-400 line-through">{inr(p.mrp)}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </HScroll>
      </section>

      {/* Livezy One upsell */}
      <section className="px-4 mt-5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2.5 py-2.5 text-left"
        >
          <motion.span
            animate={{ rotate: [0, 12, -8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.8 }}
            className="shrink-0"
          >
            <Tag className="w-4 h-4 text-indigo-600" />
          </motion.span>
          <div className="flex-1 min-w-0 text-xs text-slate-700 truncate">
            <span style={{ fontWeight: 600 }}>Livezy One</span> · Free delivery, priority & exclusive deals
          </div>
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-xs text-indigo-600 shrink-0"
            style={{ fontWeight: 600 }}
          >
            Try free
          </motion.span>
        </motion.button>
      </section>
    </div>
  );
}
