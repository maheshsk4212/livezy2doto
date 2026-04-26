import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Tag,
  ShoppingBag,
  Star,
  Truck,
  Repeat,
  Gift,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { inr, useStore } from "../../store";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { BottomSheet } from "../BottomSheet";
import { productImageClass } from "../productImage";

const REWARD_POINTS = 2340; // 1 pt = ₹1
const SUB_DISCOUNT = 0.1; // 10% off when subscribed

export function Cart() {
  const { cart, setQty, removeFromCart, toggleSubscribe, go } = useStore();
  const [coupon, setCoupon] = useState<string | null>(null);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [priceSheet, setPriceSheet] = useState(false);

  const itemEffective = (i: (typeof cart)[number]) =>
    i.subscribe ? Math.round(i.product.price * (1 - SUB_DISCOUNT)) : i.product.price;

  const lines = cart.map((i) => ({
    ...i,
    effective: itemEffective(i),
    lineTotal: itemEffective(i) * i.qty,
    lineMrp: i.product.mrp * i.qty,
  }));

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.lineMrp, 0);
  const productDiscount = mrpTotal - lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const subscriptionSaving = lines.reduce(
    (s, l) => s + (l.subscribe ? (l.product.price - l.effective) * l.qty : 0),
    0,
  );
  const delivery = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const couponDiscount = coupon === "LIVEZY100" ? 100 : 0;
  const maxRedeemable = Math.min(REWARD_POINTS, Math.floor(subtotal * 0.2)); // cap 20% of order
  const pointsApplied = Math.min(pointsUsed, maxRedeemable);
  const total = Math.max(0, subtotal + delivery - couponDiscount - pointsApplied);
  const totalSavings = mrpTotal - total;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="mt-4" style={{ fontWeight: 600 }}>Your cart is empty</div>
        <div className="text-sm text-slate-500 mt-1">Add items to continue shopping</div>
        <button
          onClick={() => go({ name: "shop-home" })}
          className="mt-5 bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm"
        >
          Start shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pb-4 bg-slate-50">
      {/* Savings banner */}
      <div className="px-4 pt-3">
        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Yay! You're saving <b className="mx-1">{inr(totalSavings)}</b> on this order
        </div>
      </div>

      {/* Items */}
      <div className="px-4 pt-3 space-y-3">
        {lines.map((i) => {
          const colorObj = i.product.colors?.find((c) => c.name === i.color);
          const discountPct = Math.round(((i.product.mrp - i.effective) / i.product.mrp) * 100);
          return (
            <div
              key={i.product.id + (i.size ?? "") + (i.color ?? "")}
              className="bg-white rounded-2xl border border-slate-100 p-3"
            >
              <div className="flex gap-3">
                <button
                  onClick={() => go({ name: "shop-pdp", productId: i.product.id })}
                  className="w-24 h-28 rounded-lg bg-slate-100 overflow-hidden shrink-0"
                >
                  <ImageWithFallback src={i.product.image} alt="" className={productImageClass} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-500">{i.product.brand}</div>
                      <div className="text-sm line-clamp-2">{i.product.name}</div>
                    </div>
                    <button
                      onClick={() => removeFromCart(i.product.id)}
                      className="text-slate-400 p-1 -mr-1 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {i.product.rating} <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({i.product.reviews.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {colorObj && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-full">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white ring-1 ring-slate-200"
                          style={{ background: colorObj.hex }}
                        />
                        {colorObj.name}
                      </span>
                    )}
                    {i.size && (
                      <span className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-full">
                        Size: {i.size}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span style={{ fontWeight: 700 }}>{inr(i.effective)}</span>
                    <span className="text-[11px] text-slate-400 line-through">{inr(i.product.mrp)}</span>
                    <span className="text-[11px] text-emerald-700" style={{ fontWeight: 600 }}>
                      {discountPct}% off
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 inline-flex items-center gap-1">
                    <Truck className="w-3 h-3 text-emerald-600" />
                    Delivery by <b className="text-slate-900 ml-0.5">Sat, 26 Apr</b> · FREE
                  </div>
                </div>
              </div>

              {/* Qty + Subscribe */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center border border-slate-200 rounded-full">
                  <button
                    onClick={() => setQty(i.product.id, i.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm min-w-[20px] text-center" style={{ fontWeight: 600 }}>
                    {i.qty}
                  </span>
                  <button
                    onClick={() => setQty(i.product.id, i.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => toggleSubscribe(i.product.id)}
                  className={`flex-1 text-left rounded-lg px-2.5 py-1.5 border flex items-center gap-2 ${
                    i.subscribe
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      i.subscribe ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                    }`}
                  >
                    {i.subscribe && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0 leading-tight">
                    <div className="text-[11px] inline-flex items-center gap-1" style={{ fontWeight: 600 }}>
                      <Repeat className="w-3 h-3" /> Subscribe & save 10%
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      Effective {inr(Math.round(i.product.price * (1 - SUB_DISCOUNT)))} · Monthly
                    </div>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rewards claim */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-white border border-slate-100 p-3.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm" style={{ fontWeight: 600 }}>
                Claim Livezy Reward Points
              </div>
              <div className="text-[11px] text-slate-500">
                Balance <b className="text-slate-900">{REWARD_POINTS.toLocaleString()} pts</b> · 1 pt = ₹1 · Max {inr(maxRedeemable)} on this order
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={maxRedeemable}
                step={10}
                value={pointsApplied}
                onChange={(e) => setPointsUsed(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <div className="text-xs text-right min-w-[80px]">
                <div style={{ fontWeight: 700 }}>− {inr(pointsApplied)}</div>
                <div className="text-[10px] text-slate-500">{pointsApplied} pts</div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {[0, Math.floor(maxRedeemable / 2), maxRedeemable].map((v, i) => (
                <button
                  key={i}
                  onClick={() => setPointsUsed(v)}
                  className={`text-[11px] px-2 py-1 rounded-full border ${
                    pointsApplied === v
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  {v === 0 ? "None" : v === maxRedeemable ? `Max (${v})` : `${v} pts`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coupon */}
      <div className="px-4 mt-3">
        <button
          onClick={() => setCoupon(coupon === "LIVEZY100" ? null : "LIVEZY100")}
          className={`w-full flex items-center gap-2 rounded-2xl border p-3 text-sm ${
            coupon ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"
          }`}
        >
          <Tag className={`w-4 h-4 ${coupon ? "text-emerald-700" : "text-indigo-600"}`} />
          <div className="flex-1 text-left">
            <div style={{ fontWeight: 600 }}>
              {coupon ? `Coupon LIVEZY100 applied` : "Apply a coupon"}
            </div>
            <div className="text-[11px] text-slate-500">
              {coupon ? "₹100 off · tap to remove" : "LIVEZY100 for flat ₹100 off · and more"}
            </div>
          </div>
          <span className={`text-xs ${coupon ? "text-emerald-700" : "text-indigo-600"}`}>
            {coupon ? "Remove" : "Apply"}
          </span>
        </button>
      </div>

      {/* Summary strip */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl bg-white border border-slate-100 p-3.5 text-sm">
          <Row label={`Items total (${cart.length})`} value={inr(mrpTotal)} />
          <Row label="Product discount" value={`– ${inr(productDiscount)}`} good />
          {subscriptionSaving > 0 && (
            <Row label="Subscription saving" value={`– ${inr(subscriptionSaving)}`} good />
          )}
          {couponDiscount > 0 && <Row label="Coupon" value={`– ${inr(couponDiscount)}`} good />}
          {pointsApplied > 0 && (
            <Row label={`Reward points (${pointsApplied})`} value={`– ${inr(pointsApplied)}`} good />
          )}
          <Row label="Delivery" value={delivery === 0 ? "FREE" : inr(delivery)} good={delivery === 0} />
          <div className="h-px bg-slate-100 my-2" />
          <Row label="Total payable" value={inr(total)} bold />
        </div>
      </div>

      {/* Sticky bottom CTA — best-practice two-column layout */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[460px] z-40 bg-white border-t border-slate-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3">
          <button onClick={() => setPriceSheet(true)} className="flex-1 leading-tight text-left">
            <div className="text-[10px] text-slate-500">Total</div>
            <div className="text-base" style={{ fontWeight: 700 }}>{inr(total)}</div>
            <div className="text-[11px] text-indigo-600 underline underline-offset-2">View price details</div>
          </button>
          <button
            onClick={() => go({ name: "shop-checkout" })}
            className="h-11 px-5 rounded-lg bg-indigo-600 text-white text-sm inline-flex items-center justify-center gap-1.5 active:bg-indigo-700 shrink-0"
            style={{ fontWeight: 600 }}
          >
            Continue <span className="opacity-90">→</span>
          </button>
        </div>
      </div>

      {/* Spacer for sticky CTA */}
      <div className="h-20" />

      {/* Price details sheet */}
      <BottomSheet open={priceSheet} onClose={() => setPriceSheet(false)} title="Price Details">
        <div className="text-sm space-y-1">
          <Row label={`Items total (${cart.length})`} value={inr(mrpTotal)} />
          <Row label="Product discount" value={`– ${inr(productDiscount)}`} good />
          {subscriptionSaving > 0 && (
            <Row label="Subscription saving (10%)" value={`– ${inr(subscriptionSaving)}`} good />
          )}
          {couponDiscount > 0 && <Row label="Coupon LIVEZY100" value={`– ${inr(couponDiscount)}`} good />}
          {pointsApplied > 0 && (
            <Row label={`Reward points (${pointsApplied})`} value={`– ${inr(pointsApplied)}`} good />
          )}
          <Row label="Delivery fee" value={delivery === 0 ? "FREE" : inr(delivery)} good={delivery === 0} />
          <div className="h-px bg-slate-100 my-2" />
          <Row label="Total payable" value={inr(total)} bold />
          <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-2">
            You save <b>{inr(totalSavings)}</b> on this order.
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function Row({
  label, value, good, bold,
}: { label: string; value: string; good?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-slate-600">{label}</span>
      <span className={good ? "text-emerald-700" : ""} style={{ fontWeight: bold ? 700 : undefined }}>
        {value}
      </span>
    </div>
  );
}
