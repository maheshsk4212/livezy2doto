import {
  Carrot, Banknote, Plane, Wrench, Sparkles, Car, UtensilsCrossed, Stethoscope, Gift, ArrowRight,
} from "lucide-react";
import { useStore } from "../store";

const meta: Record<string, { name: string; icon: any; bg: string; blurb: string }> = {
  mart: { name: "Livezy Mart", icon: Carrot, bg: "from-emerald-500 to-teal-500", blurb: "Groceries & essentials delivered in 10 minutes." },
  loans: { name: "Quick Loans", icon: Banknote, bg: "from-amber-500 to-orange-500", blurb: "Instant pre-approved loans up to ₹5,00,000." },
  flights: { name: "Flights", icon: Plane, bg: "from-sky-500 to-blue-600", blurb: "Book flights at the lowest fares, guaranteed." },
  home: { name: "Home Services", icon: Wrench, bg: "from-rose-500 to-pink-500", blurb: "Cleaning, plumbing, electricians — verified pros." },
  beauty: { name: "Salon at Home", icon: Sparkles, bg: "from-fuchsia-500 to-purple-500", blurb: "Premium salon services at your doorstep." },
  rides: { name: "Livezy Rides", icon: Car, bg: "from-slate-700 to-slate-900", blurb: "Reliable bikes, autos and cabs on demand." },
  food: { name: "Food Delivery", icon: UtensilsCrossed, bg: "from-orange-500 to-rose-500", blurb: "Your favourite restaurants, faster." },
  health: { name: "Health", icon: Stethoscope, bg: "from-teal-500 to-emerald-600", blurb: "Doctor in 15 minutes. Medicines in 30." },
  rewards: { name: "Rewards", icon: Gift, bg: "from-purple-500 to-indigo-500", blurb: "Earn, redeem and level-up with every Livezy order." },
};

export function LobStub({ lob }: { lob: string }) {
  const m = meta[lob] ?? { name: "Coming soon", icon: Gift, bg: "from-indigo-500 to-violet-600", blurb: "" };
  const { go } = useStore();
  const Icon = m.icon;
  return (
    <div className="px-5 pt-10 pb-16 text-center">
      <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${m.bg} text-white flex items-center justify-center shadow-lg`}>
        <Icon className="w-10 h-10" />
      </div>
      <h1 className="mt-5 text-xl" style={{ fontWeight: 700 }}>{m.name}</h1>
      <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto">{m.blurb}</p>
      <div className="mt-6 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full">
        In development · Launching soon
      </div>
      <div className="mt-8 max-w-sm mx-auto bg-white border border-slate-100 rounded-2xl p-4 text-left">
        <div className="text-sm" style={{ fontWeight: 600 }}>What's coming</div>
        <ul className="mt-2 text-xs text-slate-600 space-y-1.5">
          <li>• Same unified Livezy login & wallet</li>
          <li>• One-tap checkout across LOBs</li>
          <li>• Rewards stacking with Livezy ONE</li>
          <li>• Proven ecommerce UX patterns re-applied</li>
        </ul>
      </div>
      <button
        onClick={() => go({ name: "shop-home" })}
        className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm"
      >
        Explore Livezy Shop <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
