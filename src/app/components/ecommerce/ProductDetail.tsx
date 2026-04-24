import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Check,
  MapPin,
  ChevronRight,
  Sparkles,
  TrendingDown,
  LineChart,
  MessageSquareText,
  Ruler,
  BadgePercent,
  Package,
  Clock,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { products, Product } from "../../data/products";
import { offers, applyOffer } from "../../data/offers";
import { inr, useStore } from "../../store";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { BottomSheet } from "../BottomSheet";
import { ProductCard } from "../ProductCard";
import { HScroll } from "../HScroll";

export function ProductDetail({ productId }: { productId: string }) {
  const p = products.find((x) => x.id === productId);
  const { addToCart, go, wishlist, toggleWish, address } = useStore();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [missingSheet, setMissingSheet] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);

  if (!p) return <div className="p-6 text-sm text-slate-500">Product not found.</div>;

  const color = p.colors?.[colorIdx];
  const imgs = color?.images ?? p.images ?? [p.image];
  const wished = wishlist.includes(p.id);
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const hasSize = (p.sizes?.length ?? 0) > 0;
  const hasColor = (p.colors?.length ?? 0) > 0;

  const activeOffer = offers.find((o) => o.id === selectedOffer);
  const finalPrice = activeOffer ? applyOffer(p.price, activeOffer).final : p.price;
  const extraSaving = p.price - finalPrice;

  const tryBuy = (goCheckout: boolean) => {
    if ((hasSize && !size) || (hasColor && color === undefined)) {
      setMissingSheet(true);
      return;
    }
    addToCart(p, size, color?.name);
    go({ name: goCheckout ? "shop-checkout" : "shop-cart" });
  };

  const similar = useMemo(
    () => products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 6),
    [p.id],
  );
  const ctaBar = typeof document !== "undefined" ? createPortal(
    <div className="fixed bottom-0 left-1/2 w-full max-w-[460px] -translate-x-1/2 bg-white border-t border-slate-100 p-3 grid grid-cols-2 gap-2 z-50 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      <button
        onClick={() => tryBuy(false)}
        className="h-12 rounded-xl border border-indigo-600 text-indigo-600"
        style={{ fontWeight: 600 }}
      >
        Add to Cart
      </button>
      <button
        onClick={() => tryBuy(true)}
        className="h-12 rounded-xl bg-indigo-600 text-white flex flex-col items-center justify-center leading-tight"
        style={{ fontWeight: 600 }}
      >
        <span className="text-xs opacity-90">Buy at</span>
        <span>{inr(finalPrice)}</span>
      </button>
    </div>,
    document.body,
  ) : null;

  return (
    <div className="bg-white pb-24">
      {/* Gallery */}
      <div className="relative">
        <div className="aspect-square bg-slate-100">
          <ImageWithFallback src={imgs[activeImg]} alt={p.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWish(p.id)}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
          >
            <Heart className={`w-4 h-4 ${wished ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full">
          {activeImg + 1} / {imgs.length}
        </div>
      </div>

      {imgs.length > 1 && (
        <HScroll className="py-3" snap={false}>
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 ${
                i === activeImg ? "border-indigo-600" : "border-transparent"
              }`}
            >
              <ImageWithFallback src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </HScroll>
      )}

      {/* Title + price */}
      <div className="px-4 pt-1">
        <div className="text-xs text-indigo-600">{p.brand}</div>
        <h1 className="text-lg leading-tight mt-0.5">{p.name}</h1>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded">
            {p.rating} <Star className="w-3 h-3 fill-white" />
          </span>
          <span className="text-xs text-slate-500">{p.reviews.toLocaleString()} ratings</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-emerald-700 inline-flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Lowest in 60 days
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl" style={{ fontWeight: 700 }}>{inr(finalPrice)}</span>
          <span className="text-sm text-slate-400 line-through">{inr(p.mrp)}</span>
          <span className="text-sm text-emerald-600" style={{ fontWeight: 600 }}>{off}% off</span>
          {extraSaving > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
              − {inr(extraSaving)} with offer
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">Inclusive of all taxes</div>
      </div>

      {/* Color */}
      {hasColor && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ fontWeight: 600 }}>
              Colour: <span className="text-slate-600">{color?.name}</span>
            </div>
            <div className="text-xs text-slate-500">{p.colors!.length} options</div>
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {p.colors!.map((c, i) => (
              <button
                key={c.name}
                onClick={() => {
                  setColorIdx(i);
                  setActiveImg(0);
                }}
                className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 ${
                  i === colorIdx ? "border-indigo-600" : "border-slate-200"
                }`}
                title={c.name}
              >
                <ImageWithFallback src={c.thumb} alt={c.name} className="w-full h-full object-cover" />
                <span
                  className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: c.hex }}
                />
                {i === colorIdx && (
                  <span className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-indigo-600" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {hasSize && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ fontWeight: 600 }}>
              Size {size && <span className="text-slate-500">· {size}</span>}
            </div>
            <button onClick={() => setSizeGuideOpen(true)} className="text-xs text-indigo-600 inline-flex items-center gap-1">
              <Ruler className="w-3 h-3" /> Size guide
            </button>
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {p.sizes!.map((s) => {
              const unavailable = s === "XS";
              return (
                <button
                  key={s}
                  onClick={() => !unavailable && setSize(s)}
                  disabled={unavailable}
                  className={`min-w-[52px] h-10 rounded-full px-3 text-sm border relative ${
                    size === s
                      ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                      : unavailable
                      ? "border-slate-100 text-slate-300 line-through"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> AI suggests: <b className="text-slate-700 ml-0.5">M</b> based on your past orders
          </div>
        </div>
      )}

      {/* Delivery */}
      <div className="mx-4 mt-5 border border-slate-100 rounded-xl p-3 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span className="flex-1 truncate">{address}</span>
          <button className="text-indigo-600 text-xs">Change</button>
        </div>
        <div className="h-px bg-slate-100 my-2" />
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Free delivery by <b className="text-slate-900">Sat, 26 Apr</b></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Order within <b className="text-slate-900">2h 14m</b> for express delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>7-day easy returns · Try & buy available</span>
          </div>
        </div>
      </div>

      {/* Offers with live preview */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm inline-flex items-center gap-1.5" style={{ fontWeight: 600 }}>
            <BadgePercent className="w-4 h-4 text-emerald-600" /> Available Offers
          </div>
          <div className="text-[11px] text-slate-500">Tap to apply</div>
        </div>
        <div className="space-y-2">
          {offers.map((o) => {
            const { discount } = applyOffer(p.price, o);
            const active = selectedOffer === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSelectedOffer(active ? null : o.id)}
                className={`w-full rounded-xl border p-3 text-left flex items-start gap-3 ${
                  active ? "border-emerald-500 bg-emerald-50/40" : "border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm" style={{ fontWeight: 600 }}>{o.title}</div>
                  <div className="text-xs text-slate-500">{o.sub}</div>
                  <div className="mt-1 text-[11px] inline-flex items-center gap-1.5">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{o.code}</span>
                    {discount > 0 && (
                      <span className="text-emerald-700" style={{ fontWeight: 600 }}>
                        − {inr(discount)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {activeOffer && (
          <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            You pay <b className="mx-1">{inr(finalPrice)}</b> after applying <b>{activeOffer.code}</b>
          </div>
        )}
      </div>

      {/* AI tools */}
      <div className="px-4 mt-6">
        <div className="text-sm inline-flex items-center gap-1.5 mb-2" style={{ fontWeight: 600 }}>
          <Sparkles className="w-4 h-4 text-fuchsia-600" /> Livezy AI
          <span className="text-[10px] bg-fuchsia-100 text-fuchsia-700 px-1.5 py-0.5 rounded-full">BETA</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <AICard
            icon={MessageSquareText}
            title="Review summary"
            sub="AI-read 2,480 reviews"
            tint="bg-fuchsia-50 text-fuchsia-700"
          />
          <AICard
            icon={LineChart}
            title="Price trend"
            sub="Lowest in 60 days"
            tint="bg-emerald-50 text-emerald-700"
          />
          <AICard
            icon={Ruler}
            title="Find my size"
            sub="AI size advisor"
            tint="bg-indigo-50 text-indigo-700"
          />
          <AICard
            icon={Sparkles}
            title="Style it"
            sub="Outfit suggestions"
            tint="bg-amber-50 text-amber-700"
          />
        </div>

        {/* AI Review Summary */}
        <div className="mt-3 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/50 to-white p-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-fuchsia-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-sm" style={{ fontWeight: 600 }}>AI Review Summary</div>
          </div>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed">
            Shoppers love the <b>soft fabric</b> and <b>true-to-size fit</b>. Most say the
            tee holds its shape after multiple washes. Common concerns: minor colour fade
            on dark shades after 10+ washes. <b>Recommended for:</b> daily wear, layering.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(p.reviewTags ?? []).map((t) => (
              <span
                key={t.label}
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  t.good ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {t.label} · {t.pct}%
              </span>
            ))}
          </div>
        </div>

        {/* Price chart */}
        {p.priceHistory && (
          <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-3.5">
            <div className="flex items-center justify-between">
              <div className="text-sm inline-flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                <LineChart className="w-4 h-4 text-emerald-600" /> Price history
              </div>
              <button className="text-[11px] text-indigo-600">Open full chart</button>
            </div>
            <PriceChart history={p.priceHistory} current={finalPrice} />
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>60 days</span>
              <span className="text-emerald-700" style={{ fontWeight: 600 }}>
                {Math.round(((p.priceHistory[0].price - finalPrice) / p.priceHistory[0].price) * 100)}% drop
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Highlights */}
      {p.highlights && (
        <div className="px-4 mt-6">
          <div className="text-sm mb-2" style={{ fontWeight: 600 }}>Product Highlights</div>
          <div className="grid grid-cols-2 gap-2">
            {p.highlights.map((h) => (
              <div key={h} className="rounded-xl border border-slate-100 p-2.5 text-xs text-slate-700 flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description + specs */}
      <div className="px-4 mt-6">
        <button
          onClick={() => setDescOpen((o) => !o)}
          className="w-full flex items-center justify-between"
        >
          <div className="text-sm" style={{ fontWeight: 600 }}>Product Details</div>
          <ChevronDown className={`w-4 h-4 transition-transform ${descOpen ? "rotate-180" : ""}`} />
        </button>
        <div className={`text-sm text-slate-600 mt-1.5 leading-relaxed ${descOpen ? "" : "line-clamp-3"}`}>
          {p.description}
        </div>
        {p.specs && (
          <div className={`mt-3 rounded-xl border border-slate-100 divide-y divide-slate-100 ${descOpen ? "" : "hidden"}`}>
            {p.specs.map((s) => (
              <div key={s.label} className="flex px-3 py-2 text-xs">
                <span className="text-slate-500 w-32 shrink-0">{s.label}</span>
                <span className="text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ratings & Reviews */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ fontWeight: 600 }}>Ratings & Reviews</div>
          <button className="text-xs text-indigo-600 flex items-center">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-100 p-3.5">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl" style={{ fontWeight: 700 }}>{p.rating}</div>
              <div className="flex items-center gap-0.5 text-amber-500 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(p.rating) ? "fill-amber-500" : "opacity-30"}`} />
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{p.reviews.toLocaleString()} ratings</div>
            </div>
            <div className="flex-1 space-y-1">
              {(p.ratingBreakdown ?? []).map((r) => (
                <div key={r.stars} className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span className="w-4">{r.stars}</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div className="mt-4 space-y-3">
            {[
              {
                name: "Priya S.",
                rating: 5,
                date: "2 days ago",
                title: "Loved it!",
                body: "Quality is excellent and delivery was lightning fast. Fits true to size.",
                color: "Jet Black",
                sizeTag: "M",
                likes: 24,
              },
              {
                name: "Rohan M.",
                rating: 4,
                date: "1 week ago",
                title: "Great value",
                body: "Soft cotton, nice fit. Star off for slight shrinkage after first wash.",
                color: "Off White",
                sizeTag: "L",
                likes: 12,
              },
              {
                name: "Neha K.",
                rating: 5,
                date: "3 weeks ago",
                title: "Buying more colours",
                body: "Comfortable and breathable — perfect for daily wear.",
                color: "Sage Green",
                sizeTag: "S",
                likes: 9,
              },
            ].map((r) => (
              <div key={r.name} className="border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-3 h-3 ${i <= r.rating ? "fill-amber-500" : "opacity-30"}`} />
                  ))}
                  <span className="text-xs text-slate-700 ml-1" style={{ fontWeight: 600 }}>{r.title}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{r.body}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5 flex-wrap">
                  <span>{r.name} · Verified</span>
                  <span>·</span>
                  <span>{r.date}</span>
                  <span>·</span>
                  <span>{r.color}, {r.sizeTag}</span>
                  <span className="ml-auto">👍 {r.likes}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-3 w-full text-xs text-indigo-600 h-9 rounded-lg border border-indigo-100">
            Read all {p.reviews.toLocaleString()} reviews
          </button>
        </div>
      </div>

      {/* Similar products */}
      <div className="mt-6">
        <div className="px-4 flex items-center justify-between mb-3">
          <div style={{ fontWeight: 600 }}>Similar Products</div>
          <div className="text-xs text-slate-500">Hand-picked for you</div>
        </div>
        <HScroll className="pb-2">
          {similar.map((s) => (
            <div key={s.id} className="snap-start shrink-0 w-40">
              <ProductCard p={s} />
            </div>
          ))}
        </HScroll>
      </div>

      {/* Trust row */}
      <div className="px-4 mt-6 grid grid-cols-3 gap-2 text-center">
        {[
          { icon: Truck, label: "Free delivery" },
          { icon: RotateCcw, label: "7-day return" },
          { icon: Shield, label: "Livezy Shield" },
        ].map((b) => {
          const I = b.icon;
          return (
            <div key={b.label} className="rounded-xl border border-slate-100 p-2">
              <I className="w-4 h-4 mx-auto text-indigo-600" />
              <div className="text-[11px] mt-1 text-slate-600">{b.label}</div>
            </div>
          );
        })}
      </div>

      {/* Sticky CTA */}
      {ctaBar}

      {/* Missing selection sheet */}
      <BottomSheet
        open={missingSheet}
        onClose={() => setMissingSheet(false)}
        title="Please select to continue"
      >
        <div className="text-xs text-slate-500 mb-3 inline-flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          Choose the options below before proceeding.
        </div>

        {hasColor && (
          <div className="mb-4">
            <div className="text-sm mb-2" style={{ fontWeight: 600 }}>
              Colour <span className="text-slate-500">· {color?.name}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {p.colors!.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setColorIdx(i)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 relative ${
                    i === colorIdx ? "border-indigo-600" : "border-slate-200"
                  }`}
                >
                  <ImageWithFallback src={c.thumb} alt={c.name} className="w-full h-full object-cover" />
                  <span
                    className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white"
                    style={{ background: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {hasSize && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm" style={{ fontWeight: 600 }}>
                Size {!size && <span className="text-rose-500 text-xs">· Required</span>}
              </div>
              <button className="text-xs text-indigo-600">Size guide</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {p.sizes!.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[52px] h-10 rounded-full px-3 text-sm border ${
                    size === s
                      ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          disabled={(hasSize && !size) || (hasColor && color === undefined)}
          onClick={() => {
            setMissingSheet(false);
            addToCart(p, size, color?.name);
            go({ name: "shop-checkout" });
          }}
          className="w-full h-12 rounded-xl bg-indigo-600 text-white disabled:opacity-40 flex flex-col items-center justify-center leading-tight"
          style={{ fontWeight: 600 }}
        >
          <span className="text-[11px] opacity-90">Buy at</span>
          <span>{inr(finalPrice)}</span>
        </button>
      </BottomSheet>

      {/* Size guide sheet */}
      <BottomSheet open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} title="Size guide (in)">
        <div className="text-xs">
          <div className="grid grid-cols-4 gap-2 text-slate-500 mb-1">
            <span>Size</span><span>Chest</span><span>Length</span><span>Shoulder</span>
          </div>
          {[
            ["S", "38", "27", "17"],
            ["M", "40", "28", "18"],
            ["L", "42", "29", "19"],
            ["XL", "44", "30", "20"],
            ["XXL", "46", "31", "21"],
          ].map((r) => (
            <div key={r[0]} className="grid grid-cols-4 gap-2 py-1.5 border-t border-slate-100">
              {r.map((v, i) => (
                <span key={i} className={i === 0 ? "text-slate-900" : "text-slate-600"}>{v}</span>
              ))}
            </div>
          ))}
          <div className="mt-3 rounded-lg bg-indigo-50 p-2 text-indigo-700 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI recommends size <b className="ml-0.5">M</b> for you.
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function AICard({
  icon: Icon, title, sub, tint,
}: { icon: any; title: string; sub: string; tint: string }) {
  return (
    <button className="rounded-xl border border-slate-100 p-2.5 flex items-center gap-2 bg-white text-left">
      <div className={`w-8 h-8 rounded-lg ${tint} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs truncate" style={{ fontWeight: 600 }}>{title}</div>
        <div className="text-[10px] text-slate-500 truncate">{sub}</div>
      </div>
    </button>
  );
}

function PriceChart({ history, current }: { history: { label: string; price: number }[]; current: number }) {
  const all = [...history.map((h) => h.price), current];
  const max = Math.max(...all);
  const min = Math.min(...all);
  const range = max - min || 1;
  const W = 280, H = 70;
  const points = history.map((h, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H - ((h.price - min) / range) * H;
    return [x, y];
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${W},${H} L0,${H} Z`;
  const lastX = points[points.length - 1][0];
  const lastY = points[points.length - 1][1];
  return (
    <div className="mt-2">
      <svg viewBox={`0 0 ${W} ${H + 10}`} className="w-full h-20">
        <defs>
          <linearGradient id="pg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#pg)" />
        <path d={d} stroke="#10b981" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lastX} cy={lastY} r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
      </svg>
      <div className="flex justify-between text-[10px] text-slate-400 px-0.5">
        {history.map((h) => (
          <span key={h.label}>{h.label}</span>
        ))}
      </div>
    </div>
  );
}
