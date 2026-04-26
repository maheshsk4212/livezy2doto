import { ArrowLeft, MapPin, ChevronDown, Bell, Search, ShoppingBag, Shield, ChevronRight } from "lucide-react";
import { useStore, inr } from "../store";

type Props = {
  variant?: "dashboard" | "shop" | "back";
  title?: string;
  onSearchClick?: () => void;
};

export function TopBar({ variant = "dashboard", title, onSearchClick }: Props) {
  const { go, back, address, cart } = useStore();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (variant === "back") {
    return (
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 h-14 px-4 flex items-center gap-3">
        <button onClick={back} className="-ml-1 p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 truncate" style={{ fontWeight: 600 }}>{title}</div>
        <button onClick={() => go({ name: "shop-cart" })} className="relative p-2 -mr-1">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[11px] flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-b from-indigo-600 to-indigo-500 text-white">
      <div className="pt-4 px-4 flex items-center gap-3">
        <MapPin className="w-4 h-4 shrink-0 opacity-90" />
        <div className="flex-1 min-w-0 leading-tight">
          <div className="text-[10px] opacity-75 uppercase tracking-wider">Deliver to</div>
          <button className="flex items-center gap-1 max-w-full mt-0.5">
            <span className="truncate text-sm" style={{ fontWeight: 600 }}>{address}</span>
            <ChevronDown className="w-4 h-4 shrink-0 opacity-80" />
          </button>
        </div>
        <button className="relative p-2 -mr-2 rounded-full hover:bg-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full" />
        </button>
      </div>

      <div className="px-4 pt-3 pb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q") as string;
            if (q?.trim()) {
              go({ name: "shop-search", query: q.trim() });
            }
          }}
          className="w-full h-11 bg-white text-slate-500 rounded-xl flex items-center gap-2 px-3 shadow-sm"
        >
          <Search className="w-4 h-4 shrink-0" />
          <input
            name="q"
            type="search"
            placeholder={variant === "shop" ? "Search products, brands…" : "Search across Livezy"}
            className="flex-1 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            autoComplete="off"
            onClick={onSearchClick}
          />
        </form>
      </div>

      {variant === "dashboard" && (
        <div className="px-4 pb-3 flex items-center justify-between gap-3 text-white/90">
          <div className="inline-flex items-center gap-1.5 text-[11px] bg-white/10 rounded-full px-2.5 py-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Livezy Shield</span>
          </div>
          <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-full pl-2.5 pr-1.5 py-1 transition-colors">
            <span className="text-[10px] opacity-80 uppercase tracking-wider">Wallet</span>
            <span className="text-xs" style={{ fontWeight: 700 }}>{inr(1250)}</span>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
