import { Star, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "../data/products";
import { inr, useStore } from "../store";
import { productImageClass } from "./productImage";

export function ProductCard({ p }: { p: Product }) {
  const { go, wishlist, toggleWish, markViewed } = useStore();
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const wished = wishlist.includes(p.id);
  return (
    <button
      onClick={() => {
        markViewed(p.id);
        go({ name: "shop-pdp", productId: p.id });
      }}
      className="text-left bg-white rounded-2xl overflow-hidden border border-slate-100 active:scale-[0.99] transition"
    >
      <div className="aspect-square w-full bg-slate-100 relative overflow-hidden">
        <ImageWithFallback src={p.image} alt={p.name} className={productImageClass} />
        <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded">
          {off}% OFF
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            toggleWish(p.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow"
        >
          <Heart
            className={`w-4 h-4 ${wished ? "fill-rose-500 text-rose-500" : "text-slate-600"}`}
          />
        </span>
      </div>
      <div className="p-2.5">
        <div className="text-[11px] text-slate-500">{p.brand}</div>
        <div className="text-sm line-clamp-1">{p.name}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <span style={{ fontWeight: 600 }}>{inr(p.price)}</span>
          <span className="text-[11px] text-slate-400 line-through">{inr(p.mrp)}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded">
            {p.rating} <Star className="w-2.5 h-2.5 fill-white" />
          </span>
          <span className="text-[11px] text-slate-400">({p.reviews.toLocaleString()})</span>
        </div>
        {p.colors && p.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {p.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3.5 h-3.5 rounded-full ring-1 ring-slate-200"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {p.colors.length > 4 && (
              <span className="text-[10px] text-slate-500">+{p.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
