import { useState } from "react";
import {
  MapPin,
  CreditCard,
  Wallet,
  Landmark,
  Truck,
  Check,
  Gift,
  Tag,
  Info,
  Star,
  Repeat,
  Shield,
  Sparkles,
  ChevronDown,
  Banknote,
  Plus,
  Calendar,
  Zap,
} from "lucide-react";
import { inr, useStore } from "../../store";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { BottomSheet } from "../BottomSheet";

const REWARD_POINTS = 2340;
const SUB_DISCOUNT = 0.1;

export function Checkout() {
  const { cart, go, clearCart, placeOrder: createOrder } = useStore();
  const [step, setStep] = useState<"address" | "payment">("address");
  const [pay, setPay] = useState("saved-card");
  const [deliveryMode, setDeliveryMode] = useState<"standard" | "express">("standard");
  const [coupon, setCoupon] = useState<string | null>("LIVEZY100");
  const [pointsUsed, setPointsUsed] = useState(0);
  const [priceSheet, setPriceSheet] = useState(false);

  const itemEffective = (i: (typeof cart)[number]) =>
    i.subscribe ? Math.round(i.product.price * (1 - SUB_DISCOUNT)) : i.product.price;

  const subtotal = cart.reduce((s, i) => s + itemEffective(i) * i.qty, 0);
  const mrpTotal = cart.reduce((s, i) => s + i.product.mrp * i.qty, 0);
  const productDiscount = mrpTotal - cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const subscriptionSaving = cart.reduce(
    (s, i) => s + (i.subscribe ? (i.product.price - itemEffective(i)) * i.qty : 0),
    0,
  );
  const deliveryFee = deliveryMode === "express" ? 79 : subtotal > 999 ? 0 : 49;
  const couponDiscount = coupon === "LIVEZY100" ? 100 : 0;
  const maxRedeemable = Math.min(REWARD_POINTS, Math.floor(subtotal * 0.2));
  const pointsApplied = Math.min(pointsUsed, maxRedeemable);
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount - pointsApplied);
  const totalSavings = mrpTotal - total;

  const submitOrder = () => {
    const eta = deliveryMode === "express" ? "Arriving tomorrow by 9 PM" : "Arriving Sat, 26 Apr";
    const id = createOrder({
      items: cart,
      total,
      payment: pay,
      deliveryMode,
      eta,
    });
    clearCart();
    go({ name: "shop-success", orderId: id });
  };

  return (
    <div className="pb-4 bg-slate-50 min-h-full">
      {/* Stepper */}
      <div className="px-4 pt-4 flex items-center gap-2 text-xs bg-white py-3 -mt-px border-b border-slate-100">
        <Stepper label="Cart" done />
        <div className="h-px flex-1 bg-indigo-200" />
        <Stepper label="Address" done={step === "payment"} active={step === "address"} />
        <div className="h-px flex-1 bg-slate-200" />
        <Stepper label="Payment" active={step === "payment"} />
      </div>

      {/* Order items summary — hidden on payment step for focus */}
      {step === "address" && <section className="px-4 mt-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ fontWeight: 600 }}>
              Order summary · {cart.length} {cart.length === 1 ? "item" : "items"}
            </div>
            <button onClick={() => go({ name: "shop-cart" })} className="text-xs text-indigo-600">
              Edit
            </button>
          </div>
          <div className="mt-2 space-y-2.5">
            {cart.map((i) => {
              const colorObj = i.product.colors?.find((c) => c.name === i.color);
              const eff = itemEffective(i);
              const discountPct = Math.round(((i.product.mrp - eff) / i.product.mrp) * 100);
              return (
                <div key={i.product.id + (i.size ?? "") + (i.color ?? "")} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                    <ImageWithFallback src={i.product.image} alt="" className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] rounded-full bg-slate-900 text-white flex items-center justify-center">
                      {i.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[11px] text-slate-500">{i.product.brand}</div>
                        <div className="text-sm line-clamp-1">{i.product.name}</div>
                      </div>
                      <div className="text-right leading-tight shrink-0">
                        <div className="text-sm" style={{ fontWeight: 700 }}>{inr(eff * i.qty)}</div>
                        <div className="text-[10px] text-slate-400 line-through">{inr(i.product.mrp * i.qty)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] px-1 py-0.5 rounded">
                        {i.product.rating} <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      {colorObj && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-full">
                          <span
                            className="w-2 h-2 rounded-full ring-1 ring-slate-200"
                            style={{ background: colorObj.hex }}
                          />
                          {colorObj.name}
                        </span>
                      )}
                      {i.size && (
                        <span className="text-[10px] text-slate-600 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-full">
                          {i.size}
                        </span>
                      )}
                      <span className="text-[10px] text-emerald-700" style={{ fontWeight: 600 }}>
                        {discountPct}% off
                      </span>
                      {i.subscribe && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full">
                          <Repeat className="w-2.5 h-2.5" /> Subscribed
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 inline-flex items-center gap-1">
                      <Truck className="w-3 h-3 text-emerald-600" />
                      {deliveryMode === "express" ? "Arrives tomorrow by 9 PM" : "Delivery by Sat, 26 Apr"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>}

      {step === "address" && (
        <>
          <section className="px-4 mt-3">
            <div className="text-sm mb-2" style={{ fontWeight: 600 }}>Delivery Address</div>
            <div className="rounded-2xl border-2 border-indigo-600 bg-indigo-50/40 p-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 mt-0.5" />
                <div className="flex-1 text-sm">
                  <div style={{ fontWeight: 600 }}>Home</div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    Arjun Mehta · 80 Feet Road, 1st Block, Koramangala, Bengaluru 560034
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">+91 98765 43210</div>
                </div>
                <span className="text-[11px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Default</span>
              </div>
            </div>
            <button className="mt-2 text-xs text-indigo-600">+ Add new address</button>
          </section>

          <section className="px-4 mt-4">
            <div className="text-sm mb-2" style={{ fontWeight: 600 }}>Delivery Options</div>
            <div className="space-y-2">
              <DeliveryOpt
                active={deliveryMode === "standard"}
                onClick={() => setDeliveryMode("standard")}
                icon={Truck}
                iconClass="text-emerald-600"
                title={`Standard · ${subtotal > 999 ? "Free" : inr(49)}`}
                sub="Arrives Sat, 26 Apr"
              />
              <DeliveryOpt
                active={deliveryMode === "express"}
                onClick={() => setDeliveryMode("express")}
                icon={Truck}
                iconClass="text-amber-600"
                title={`Express · ${inr(79)}`}
                sub="Arrives tomorrow by 9 PM"
              />
            </div>
          </section>
        </>
      )}

      {step === "payment" && (
        <PaymentAccordion pay={pay} setPay={setPay} total={total} onPlaceOrder={submitOrder} />
      )}

      {/* Rewards claim */}
      <section className="px-4 mt-3">
        <div className="rounded-2xl bg-white border border-slate-100 p-3.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm" style={{ fontWeight: 600 }}>Claim Livezy Reward Points</div>
              <div className="text-[11px] text-slate-500">
                Balance <b className="text-slate-900">{REWARD_POINTS.toLocaleString()} pts</b> · 1 pt = ₹1 · Max {inr(maxRedeemable)} on this order
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-emerald-700" style={{ fontWeight: 700 }}>− {inr(pointsApplied)}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={maxRedeemable}
              step={10}
              value={pointsApplied}
              onChange={(e) => setPointsUsed(Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <div className="text-[11px] text-slate-500 w-16 text-right">{pointsApplied} pts</div>
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
      </section>

      {/* Coupon */}
      <section className="px-4 mt-3">
        <button
          onClick={() => setCoupon(coupon ? null : "LIVEZY100")}
          className={`w-full flex items-center gap-2 rounded-2xl border p-3 text-sm ${
            coupon ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"
          }`}
        >
          <Tag className={`w-4 h-4 ${coupon ? "text-emerald-700" : "text-indigo-600"}`} />
          <div className="flex-1 text-left">
            <div style={{ fontWeight: 600 }}>
              {coupon ? "Coupon LIVEZY100 applied" : "Apply a coupon"}
            </div>
            <div className="text-[11px] text-slate-500">
              {coupon ? "₹100 off · tap to remove" : "LIVEZY100 for flat ₹100 off"}
            </div>
          </div>
          <span className={`text-xs ${coupon ? "text-emerald-700" : "text-indigo-600"}`}>
            {coupon ? "Remove" : "Apply"}
          </span>
        </button>
      </section>

      {/* Price summary */}
      <section className="px-4 mt-3">
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
          <Row label="Delivery" value={deliveryFee === 0 ? "FREE" : inr(deliveryFee)} good={deliveryFee === 0} />
          <div className="h-px bg-slate-100 my-2" />
          <Row label="Total payable" value={inr(total)} bold />
          {totalSavings > 0 && (
            <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-2 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> You save {inr(totalSavings)} on this order
            </div>
          )}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[460px] z-40 bg-white border-t border-slate-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3">
          <button onClick={() => setPriceSheet(true)} className="flex-1 leading-tight text-left">
            <div className="text-[10px] text-slate-500">Payable</div>
            <div className="text-base" style={{ fontWeight: 700 }}>{inr(total)}</div>
            <div className="text-[11px] text-indigo-600 underline underline-offset-2">View price details</div>
          </button>
          <button
            onClick={() => (step === "address" ? setStep("payment") : placeOrder())}
            className="h-11 px-5 rounded-lg bg-indigo-600 text-white text-sm inline-flex items-center justify-center gap-1.5 active:bg-indigo-700 shrink-0"
            style={{ fontWeight: 600 }}
          >
            {step === "address" ? (
              <>Continue to Payment <span className="opacity-90">→</span></>
            ) : pay === "cod" ? (
              <>Place Order <span className="opacity-90">→</span></>
            ) : (
              <>Pay {inr(total)} <span className="opacity-90">→</span></>
            )}
          </button>
        </div>
      </div>

      <div className="h-24" />

      <BottomSheet open={priceSheet} onClose={() => setPriceSheet(false)} title="Price Details">
        <div className="text-sm space-y-1">
          <Row label={`Items total (${cart.length})`} value={inr(mrpTotal)} />
          <Row label="Product discount" value={`– ${inr(productDiscount)}`} good />
          {subscriptionSaving > 0 && <Row label="Subscription saving (10%)" value={`– ${inr(subscriptionSaving)}`} good />}
          {couponDiscount > 0 && <Row label="Coupon LIVEZY100" value={`– ${inr(couponDiscount)}`} good />}
          {pointsApplied > 0 && <Row label={`Reward points (${pointsApplied})`} value={`– ${inr(pointsApplied)}`} good />}
          <Row label={`Delivery (${deliveryMode})`} value={deliveryFee === 0 ? "FREE" : inr(deliveryFee)} good={deliveryFee === 0} />
          <div className="h-px bg-slate-100 my-2" />
          <Row label="Total payable" value={inr(total)} bold />
          {totalSavings > 0 && (
            <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-2">
              You save <b>{inr(totalSavings)}</b> on this order.
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}

function Stepper({ label, active, done }: { label: string; active?: boolean; done?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
          done ? "bg-emerald-500 text-white" : active ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? <Check className="w-3 h-3" /> : "•"}
      </div>
      <span className={active || done ? "text-slate-900" : "text-slate-400"}>{label}</span>
    </div>
  );
}

function DeliveryOpt({
  active, onClick, icon: Icon, iconClass, title, sub,
}: {
  active: boolean; onClick: () => void; icon: any; iconClass: string; title: string; sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-3 flex items-center gap-3 text-left ${
        active ? "border-indigo-600 bg-indigo-50/40" : "border-slate-200 bg-white"
      }`}
    >
      <Icon className={`w-5 h-5 ${iconClass}`} />
      <div className="flex-1 text-sm">
        <div>{title}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 ${active ? "border-indigo-600" : "border-slate-300"} flex items-center justify-center`}>
        {active && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
      </div>
    </button>
  );
}

function PayOpt({
  id, label, sub, icon: Icon, active, set,
}: { id: string; label: string; sub: string; icon: any; active: string; set: (s: string) => void }) {
  const on = active === id;
  return (
    <button
      onClick={() => set(id)}
      className={`w-full rounded-xl border p-3 flex items-center gap-3 text-left ${
        on ? "border-indigo-600 bg-indigo-50/40" : "border-slate-200 bg-white"
      }`}
    >
      <Icon className="w-5 h-5 text-indigo-600" />
      <div className="flex-1">
        <div className="text-sm">{label}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 ${on ? "border-indigo-600" : "border-slate-300"} flex items-center justify-center`}>
        {on && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
      </div>
    </button>
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

// ============ Payment Accordion ============

const savedUpi = [
  { id: "upi-gpay", handle: "arjun@okhdfcbank", app: "GPay" },
  { id: "upi-phonepe", handle: "9876543210@ybl", app: "PhonePe" },
];
const savedCards = [
  {
    id: "c1",
    brand: "Visa",
    last4: "4821",
    bank: "HDFC Bank",
    type: "Credit",
    offer: "10% off up to ₹1,500 · auto-applied",
  },
  { id: "c2", brand: "Mastercard", last4: "9023", bank: "ICICI Bank", type: "Debit" },
];

function PaymentAccordion({
  pay, setPay, total, onPlaceOrder,
}: { pay: string; setPay: (s: string) => void; total: number; onPlaceOrder: () => void }) {
  const [open, setOpen] = useState<string>("saved-card");
  const [upiChoice, setUpiChoice] = useState<string>(savedUpi[0].id);
  const [newUpi, setNewUpi] = useState("");
  const [cardChoice, setCardChoice] = useState<string>(savedCards[0].id);
  const [emiBank, setEmiBank] = useState<string>("livezy");
  const [emiTenure, setEmiTenure] = useState(6);

  const toggle = (id: string) => {
    setOpen(open === id ? "" : id);
    setPay(id);
  };

  const emis = [3, 6, 9, 12];
  const emiMonthly = (months: number, rate: number) => {
    const r = rate / 100 / 12;
    const emi = (total * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(emi);
  };

  return (
    <section className="px-4 mt-3 pb-2">
      <div className="text-sm mb-2 flex items-center justify-between" style={{ fontWeight: 600 }}>
        <span>Choose Payment Method</span>
        <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-600" /> 256-bit secure
        </span>
      </div>

      <div className="space-y-2">
        {/* UPI */}
        <AccordionItem
          icon={Wallet}
          title="UPI"
          sub="Pay via GPay, PhonePe, Paytm"
          badge="Instant"
          open={open === "upi"}
          onToggle={() => toggle("upi")}
          selected={pay === "upi"}
        >
          <div className="text-[11px] text-slate-500 mb-2">Saved UPI IDs</div>
          <div className="space-y-2">
            {savedUpi.map((u) => (
              <label
                key={u.id}
                className={`flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer ${
                  upiChoice === u.id ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="upi"
                  checked={upiChoice === u.id}
                  onChange={() => setUpiChoice(u.id)}
                  className="accent-indigo-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{u.handle}</div>
                  <div className="text-[11px] text-slate-500">{u.app}</div>
                </div>
                <span className="text-[10px] text-slate-400">Verified</span>
              </label>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 mb-1.5">Add new UPI ID</div>
            <div className="flex gap-2">
              <input
                value={newUpi}
                onChange={(e) => setNewUpi(e.target.value)}
                placeholder="yourname@bank"
                className="flex-1 h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white"
              />
              <button className="h-10 px-3 rounded-lg bg-slate-900 text-white text-xs" style={{ fontWeight: 600 }}>
                Verify
              </button>
            </div>
          </div>
        </AccordionItem>

        {/* Saved Cards */}
        <AccordionItem
          icon={CreditCard}
          title="Saved Cards"
          sub={`${savedCards.length} cards · tap to pay`}
          badge="Preferred"
          open={open === "saved-card"}
          onToggle={() => toggle("saved-card")}
          selected={pay === "saved-card"}
        >
          <div className="space-y-2">
            {savedCards.map((c) => (
              <label
                key={c.id}
                className={`block rounded-lg border overflow-hidden cursor-pointer ${
                  cardChoice === c.id ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  <input
                    type="radio"
                    name="saved-card"
                    checked={cardChoice === c.id}
                    onChange={() => setCardChoice(c.id)}
                    className="accent-indigo-600"
                  />
                  <div className="w-10 h-7 rounded bg-gradient-to-br from-slate-800 to-slate-600 text-white text-[9px] flex items-center justify-center">
                    {c.brand.slice(0, 4).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      {c.bank} <span className="text-slate-500">•••• {c.last4}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{c.type} · {c.brand}</div>
                  </div>
                  <input
                    placeholder="CVV"
                    maxLength={3}
                    className="w-14 h-8 rounded-md border border-slate-200 px-2 text-sm text-center"
                  />
                </div>
                {c.offer && (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-emerald-50/40 border-t border-emerald-100 px-3 py-1.5 text-[11px] text-emerald-800">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span className="truncate">{c.offer}</span>
                    <span className="ml-auto text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                      Offer
                    </span>
                  </div>
                )}
              </label>
            ))}
          </div>
        </AccordionItem>

        {/* Add new Card */}
        <AccordionItem
          icon={Plus}
          title="Credit / Debit Card"
          sub="Add a new card · Visa, Mastercard, Rupay"
          open={open === "card"}
          onToggle={() => toggle("card")}
          selected={pay === "card"}
        >
          <div className="space-y-2">
            <input
              placeholder="Card number"
              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white"
            />
            <div className="flex gap-2">
              <input
                placeholder="MM / YY"
                className="flex-1 h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white"
              />
              <input
                placeholder="CVV"
                maxLength={3}
                className="w-20 h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white"
              />
            </div>
            <input
              placeholder="Name on card"
              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white"
            />
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" defaultChecked className="accent-indigo-600" />
              Save this card securely for future payments
            </label>
          </div>
        </AccordionItem>

        {/* Net Banking */}
        <AccordionItem
          icon={Landmark}
          title="Net Banking"
          sub="All major banks supported"
          open={open === "nb"}
          onToggle={() => toggle("nb")}
          selected={pay === "nb"}
        >
          <div className="grid grid-cols-3 gap-2 text-xs">
            {["HDFC", "ICICI", "SBI", "Axis", "Kotak", "Yes"].map((b) => (
              <button key={b} className="h-10 rounded-lg border border-slate-200 bg-white hover:border-indigo-400">
                {b}
              </button>
            ))}
          </div>
          <select className="mt-2 w-full h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm">
            <option>Other banks — select</option>
            <option>IDFC First Bank</option>
            <option>PNB</option>
            <option>Canara Bank</option>
          </select>
        </AccordionItem>

        {/* EMI */}
        <AccordionItem
          icon={Calendar}
          title="EMI"
          sub={`No-cost from ${inr(emiMonthly(emiTenure, emiBank === "livezy" ? 0.01 : 14))}/mo`}
          badge="No cost"
          open={open === "emi"}
          onToggle={() => toggle("emi")}
          selected={pay === "emi"}
        >
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setEmiBank("livezy")}
              className={`rounded-lg border p-2.5 text-left ${
                emiBank === "livezy" ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200"
              }`}
            >
              <div className="text-xs inline-flex items-center gap-1" style={{ fontWeight: 600 }}>
                <Zap className="w-3 h-3 text-amber-500" /> Livezy EMI
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Instant · No-cost · 0 paperwork</div>
            </button>
            <button
              onClick={() => setEmiBank("cc")}
              className={`rounded-lg border p-2.5 text-left ${
                emiBank === "cc" ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200"
              }`}
            >
              <div className="text-xs inline-flex items-center gap-1" style={{ fontWeight: 600 }}>
                <CreditCard className="w-3 h-3" /> Credit Card EMI
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">HDFC, ICICI, Axis, SBI</div>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 mb-1.5">Choose tenure</div>
          <div className="grid grid-cols-4 gap-2">
            {emis.map((m) => {
              const emi = emiMonthly(m, emiBank === "livezy" ? 0.01 : 14);
              return (
                <button
                  key={m}
                  onClick={() => setEmiTenure(m)}
                  className={`rounded-lg border p-2 text-center ${
                    emiTenure === m ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200"
                  }`}
                >
                  <div className="text-xs" style={{ fontWeight: 600 }}>{m} mo</div>
                  <div className="text-[10px] text-slate-500">{inr(emi)}/mo</div>
                </button>
              );
            })}
          </div>

          {emiBank === "cc" && (
            <div className="mt-3">
              <div className="text-[11px] text-slate-500 mb-1.5">Select card</div>
              <div className="space-y-2">
                {savedCards.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-2.5 cursor-pointer"
                  >
                    <input type="radio" name="emi-card" defaultChecked={c.id === "c1"} className="accent-indigo-600" />
                    <div className="flex-1 text-sm">
                      {c.bank} <span className="text-slate-500">•••• {c.last4}</span>
                    </div>
                    <span className="text-[11px] text-emerald-700">Eligible</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 text-[11px] text-slate-500">
            Interest: <b className="text-slate-700">{emiBank === "livezy" ? "0%" : "14% p.a."}</b> · Total payable:{" "}
            <b className="text-slate-700">
              {inr(emiMonthly(emiTenure, emiBank === "livezy" ? 0.01 : 14) * emiTenure)}
            </b>
          </div>
        </AccordionItem>

        {/* Wallet */}
        <AccordionItem
          icon={Banknote}
          title="Livezy Wallet"
          sub={`Balance ${inr(1250)} · earn points on every pay`}
          open={open === "wallet"}
          onToggle={() => toggle("wallet")}
          selected={pay === "wallet"}
        >
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800">
            Wallet balance <b>₹1,250</b> · Remaining {inr(Math.max(0, total - 1250))} from another method.
          </div>
        </AccordionItem>

        {/* COD */}
        <AccordionItem
          icon={Truck}
          title="Cash on Delivery"
          sub="Pay when you receive the order"
          open={open === "cod"}
          onToggle={() => toggle("cod")}
          selected={pay === "cod"}
        >
          <div className="text-xs text-slate-600 mb-3">
            Orders above ₹10,000 not eligible. Exact change appreciated. No returns on gift cards.
          </div>
          <button
            onClick={onPlaceOrder}
            className="w-full h-11 rounded-lg bg-indigo-600 text-white text-sm inline-flex items-center justify-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            Place Order · {inr(total)} <span className="opacity-90">→</span>
          </button>
        </AccordionItem>
      </div>
    </section>
  );
}

function AccordionItem({
  icon: Icon, title, sub, badge, open, onToggle, selected, children,
}: {
  icon: any; title: string; sub: string; badge?: string;
  open: boolean; onToggle: () => void; selected: boolean; children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden transition-colors ${
        open ? "border-indigo-500" : selected ? "border-indigo-200" : "border-slate-200"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-3 text-left"
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            open ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm inline-flex items-center gap-1.5" style={{ fontWeight: 600 }}>
            {title}
            {badge && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 truncate">{sub}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-3 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
