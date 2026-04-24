import { CheckCircle2, Package, ArrowRight, Copy, Check, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "../../store";

export function OrderSuccess({ orderId }: { orderId: string }) {
  const { go, getOrder } = useStore();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const order = getOrder(orderId);

  const currentStep = (() => {
    switch (order?.status) {
      case "packed": return 1;
      case "shipped": return 2;
      case "out": return 3;
      case "delivered": return 4;
      default: return 0;
    }
  })();
  const currentLabel = order?.status
    ? {
        placed: "Placed",
        packed: "Packed",
        shipped: "Shipped",
        out: "Out for delivery",
        delivered: "Delivered",
      }[order.status]
    : "Placed";

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center text-center px-6 pt-14 pb-10">
      {/* Success mark */}
      <div
        className={`relative w-24 h-24 transition-all duration-500 ease-out ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <span className="absolute inset-0 rounded-full bg-emerald-100" />
        <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" style={{ animationDuration: "2.2s" }} />
        <span className="absolute inset-2 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2
            className={`w-11 h-11 text-emerald-600 transition-all duration-500 ${
              mounted ? "scale-100 rotate-0" : "scale-50 rotate-[-20deg]"
            }`}
            strokeWidth={2.2}
          />
        </span>
      </div>

      <h1
        className={`mt-6 text-xl transition-all duration-500 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        style={{ fontWeight: 700 }}
      >
        Order placed!
      </h1>
      <p
        className={`text-sm text-slate-500 mt-1.5 max-w-xs transition-all duration-500 delay-150 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        Thanks for shopping with Livezy. A confirmation has been sent to your registered number.
      </p>

      {/* Order card */}
      <div
        className={`mt-7 w-full bg-white border border-slate-100 rounded-2xl p-4 text-left shadow-sm transition-all duration-500 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-slate-500">Order ID</div>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 group"
              style={{ fontWeight: 600 }}
            >
              <span>{orderId}</span>
              <span
                className={`text-slate-400 group-hover:text-indigo-600 transition-colors ${
                  copied ? "text-emerald-600" : ""
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </span>
            </button>
          </div>
          <button
            onClick={() => go({ name: "shop-tracker", orderId })}
            className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
          >
            <Truck className="w-3 h-3" /> Track
          </button>
        </div>

        <div className="h-px bg-slate-100 my-3" />

        <div className="text-xs space-y-2">
          <Detail label="Estimated delivery" value="Sat, 26 Apr" highlight />
          <Detail label="Payment" value="UPI · ₹648 paid" />
          <Detail label="Ships from" value="Bengaluru FC" />
        </div>

        {/* Progress tracker */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
            {["Placed", "Packed", "Shipped", "Out", "Delivered"].map((label, i) => (
              <span
                key={label}
                className={i <= currentStep ? "text-emerald-700" : ""}
                style={{ fontWeight: i <= currentStep ? 600 : undefined }}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="relative h-1 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all ease-out"
              style={{
                width: mounted ? `${Math.max(1, currentStep + 1) * 20}%` : "0%",
                transitionDuration: "900ms",
                transitionDelay: "400ms",
              }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Current status: <span className="text-slate-900" style={{ fontWeight: 600 }}>{currentLabel}</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div
        className={`mt-6 w-full grid grid-cols-2 gap-3 transition-all duration-500 delay-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <button
          onClick={() => go({ name: "shop-orders" })}
          className="h-11 rounded-lg border border-indigo-600 text-indigo-600 text-sm active:bg-indigo-50 transition-colors"
          style={{ fontWeight: 600 }}
        >
          View orders
        </button>
        <button
          onClick={() => go({ name: "shop-tracker", orderId })}
          className="h-11 rounded-lg bg-indigo-600 text-white text-sm inline-flex items-center justify-center gap-1.5 active:bg-indigo-700 transition-colors"
          style={{ fontWeight: 600 }}
        >
          Track order <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p
        className={`mt-6 text-[11px] text-slate-400 transition-opacity duration-500 delay-500 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        Need help? <button className="text-indigo-600 hover:underline">Contact support</button>
      </p>
    </div>
  );
}

function Detail({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <span className={highlight ? "text-emerald-700" : "text-slate-900"} style={{ fontWeight: highlight ? 600 : undefined }}>
        {value}
      </span>
    </div>
  );
}
