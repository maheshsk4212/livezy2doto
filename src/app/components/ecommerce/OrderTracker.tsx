import { CheckCircle2, Clock3, MapPin, Package, Truck, ArrowRight, Sparkles } from "lucide-react";
import { products } from "../../data/products";
import { inr, useStore } from "../../store";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { productImageClass } from "../productImage";

const steps = [
  { key: "placed", label: "Placed", hint: "Order confirmed" },
  { key: "packed", label: "Packed", hint: "Warehouse is preparing your items" },
  { key: "shipped", label: "Shipped", hint: "Parcel has left the warehouse" },
  { key: "out", label: "Out for delivery", hint: "Courier is on the way" },
  { key: "delivered", label: "Delivered", hint: "Package has reached you" },
] as const;

export function OrderTracker({ orderId }: { orderId: string }) {
  const { getOrder, go } = useStore();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="px-4 pt-6 pb-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
          Order not found.
        </div>
      </div>
    );
  }

  const activeIndex = steps.findIndex((s) => s.key === order.status);
  const currentIndex = activeIndex === -1 ? 0 : activeIndex;
  const progress = `${((currentIndex + 1) / steps.length) * 100}%`;

  return (
    <div className="pb-6">
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 text-white p-4 shadow-lg">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-6 bottom-0 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-widest opacity-80">Live tracking</div>
            <div className="mt-1 text-2xl leading-tight" style={{ fontWeight: 800 }}>
              Track order {order.id}
            </div>
            <div className="mt-1 text-xs text-white/85 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {order.status === "delivered" ? "Delivered safely" : "Real-time tracker for this order"}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">Current status</div>
              <div className="text-lg" style={{ fontWeight: 700 }}>
                {steps[currentIndex].label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{steps[currentIndex].hint}</div>
            </div>
            <div className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[11px] inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {order.eta}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
              {steps.map((step, idx) => (
                <span
                  key={step.key}
                  className={idx <= currentIndex ? "text-emerald-700" : ""}
                  style={{ fontWeight: idx <= currentIndex ? 600 : undefined }}
                >
                  {step.label}
                </span>
              ))}
            </div>
            <div className="relative h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: progress }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="text-sm mb-2" style={{ fontWeight: 600 }}>Tracking timeline</div>
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const done = idx <= currentIndex;
            const active = idx === currentIndex;
            return (
              <div
                key={step.key}
                className={`rounded-2xl border p-3 flex items-start gap-3 ${
                  active ? "border-indigo-200 bg-indigo-50/40" : "border-slate-100 bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm" style={{ fontWeight: 600 }}>
                      {step.label}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {done ? (active ? "In progress" : "Done") : "Upcoming"}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{step.hint}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="flex items-center gap-2 text-sm mb-3" style={{ fontWeight: 600 }}>
            <Truck className="w-4 h-4 text-indigo-600" /> Shipment details
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <InfoRow icon={Package} label="Order ID" value={order.id} />
            <InfoRow icon={Clock3} label="Estimated delivery" value={order.eta} />
            <InfoRow icon={MapPin} label="Delivery mode" value={order.deliveryMode === "express" ? "Express" : "Standard"} />
            <InfoRow icon={CheckCircle2} label="Payment" value={`${order.payment} · ${inr(order.total)}`} />
          </div>
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm" style={{ fontWeight: 600 }}>Items in this order</div>
          <button onClick={() => go({ name: "shop-orders" })} className="text-xs text-indigo-600">
            Back to orders
          </button>
        </div>
        <div className="space-y-2">
          {order.items.map((item) => {
            const full = products.find((p) => p.id === item.product.id) ?? item.product;
            return (
                <button
                key={full.id + (item.size ?? "") + (item.color ?? "")}
                onClick={() => go({ name: "shop-pdp", productId: full.id })}
                className="w-full flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <ImageWithFallback src={full.image} alt={full.name} className={productImageClass} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-500">{full.brand}</div>
                  <div className="text-sm line-clamp-1">{full.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Qty {item.qty}
                    {item.size ? ` · Size ${item.size}` : ""}
                    {item.color ? ` · ${item.color}` : ""}
                  </div>
                </div>
                <div className="text-sm" style={{ fontWeight: 700 }}>
                  {inr(full.price * item.qty)}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
        <span>{label}</span>
        <span className="text-slate-900 text-right" style={{ fontWeight: 600 }}>
          {value}
        </span>
      </div>
    </div>
  );
}
