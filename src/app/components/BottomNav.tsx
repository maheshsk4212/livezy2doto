import { Home, Grid3x3, ShoppingBag, Heart, User } from "lucide-react";
import { useStore, Screen } from "../store";

const items = [
  { key: "dashboard", label: "Home", icon: Home, target: { name: "dashboard" } as Screen },
  { key: "shop-home", label: "Shop", icon: Grid3x3, target: { name: "shop-home" } as Screen },
  { key: "shop-cart", label: "Cart", icon: ShoppingBag, target: { name: "shop-cart" } as Screen },
  { key: "shop-orders", label: "Orders", icon: Heart, target: { name: "shop-orders" } as Screen },
  { key: "account", label: "Account", icon: User, target: { name: "account" } as Screen },
];

export function BottomNav() {
  const { screen, go, cart } = useStore();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[460px] z-40 bg-white border-t border-slate-100 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(15,23,42,0.04)]">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = screen.name === it.key;
          const Icon = it.icon;
          return (
            <button
              key={it.key}
              onClick={() => go(it.target)}
              className="py-2.5 flex flex-col items-center gap-0.5 relative"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${active ? "text-indigo-600" : "text-slate-500"}`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                {it.key === "shop-cart" && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] ${active ? "text-indigo-600" : "text-slate-500"}`}>
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
