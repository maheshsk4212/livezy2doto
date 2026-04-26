import { Package, Truck, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { products } from "../../data/products";
import { inr, useStore } from "../../store";
import { productImageClass } from "../productImage";

export function Orders() {
  const { go, orders } = useStore();
  const statusCfg: Record<string, { label: string; icon: any; color: string }> = {
    placed: { label: "Placed", icon: Package, color: "text-slate-600 bg-slate-50" },
    packed: { label: "Packed", icon: Package, color: "text-indigo-600 bg-indigo-50" },
    shipped: { label: "Shipped", icon: Package, color: "text-indigo-600 bg-indigo-50" },
    out: { label: "Out for delivery", icon: Truck, color: "text-amber-600 bg-amber-50" },
    delivered: { label: "Delivered", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  };
  return (
    <div className="pb-6 px-4 pt-3 space-y-3">
      {orders.map((o) => {
        const first = o.items[0];
        const p = products.find((x) => x.id === first.product.id) ?? first.product;
        const cfg = statusCfg[o.status];
        const Icon = cfg.icon;
        return (
          <button
            key={o.id}
            onClick={() => go({ name: "shop-tracker", orderId: o.id })}
            className="w-full flex gap-3 bg-white border border-slate-100 rounded-xl p-3 text-left active:scale-[0.99] transition-transform"
          >
            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              <ImageWithFallback src={p.image} alt="" className={productImageClass} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500">Order #{o.id}</div>
              <div className="text-sm line-clamp-1">{p.name}</div>
              <div className="text-sm mt-0.5" style={{ fontWeight: 600 }}>{inr(o.total)}</div>
              <div className={`inline-flex items-center gap-1 text-[11px] mt-1.5 px-2 py-0.5 rounded-full ${cfg.color}`}>
                <Icon className="w-3 h-3" /> {cfg.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{o.eta}</div>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-indigo-600">
                Track this order
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
