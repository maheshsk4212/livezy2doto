import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Gift,
  Wallet,
} from "lucide-react";

const sections = [
  {
    title: "Livezy benefits",
    items: [
      { icon: Gift, label: "Rewards & Coupons", sub: "2,340 points · 4 coupons" },
      { icon: Wallet, label: "Livezy Wallet", sub: "Balance ₹1,250" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: User, label: "Personal info" },
      { icon: MapPin, label: "Saved addresses", sub: "2 addresses" },
      { icon: CreditCard, label: "Payment methods" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications" },
      { icon: Shield, label: "Privacy & Security" },
      { icon: HelpCircle, label: "Help & Support" },
    ],
  },
];

export function Account() {
  return (
    <div className="pb-6">
      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center text-lg" style={{ fontWeight: 700 }}>
            AM
          </div>
          <div className="flex-1">
            <div style={{ fontWeight: 600 }}>Arjun Mehta</div>
            <div className="text-xs text-slate-500">+91 98765 43210 · arjun@livezy.app</div>
          </div>
          <button className="text-xs text-indigo-600">Edit</button>
        </div>
        <div className="mt-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm" style={{ fontWeight: 600 }}>Livezy ONE Member</div>
            <div className="text-[11px] opacity-90">Free delivery · Priority support · Renews 12 Dec</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {sections.map((s) => (
        <div key={s.title} className="px-4 mt-5">
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">{s.title}</div>
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            {s.items.map((it, i) => {
              const I = it.icon;
              return (
                <button key={it.label} className={`w-full flex items-center gap-3 px-3.5 py-3 text-left ${i > 0 ? "border-t border-slate-100" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <I className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{it.label}</div>
                    {it.sub && <div className="text-xs text-slate-500">{it.sub}</div>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="px-4 mt-5">
        <button className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 text-rose-600 text-sm">
          <LogOut className="w-4 h-4" /> Log out
        </button>
        <div className="text-center text-[11px] text-slate-400 mt-3">Livezy · v1.0.0</div>
      </div>
    </div>
  );
}
