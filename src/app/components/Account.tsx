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
  Palette,
  Check,
  Smartphone,
  Share,
} from "lucide-react";
import { useState, useEffect } from "react";
import { BottomSheet } from "./BottomSheet";
import { useStore } from "../store";
import { toast } from "sonner";

export function Account() {
  const { themeMode, setThemeMode, setAuthComplete, go } = useStore();
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        toast.success("App installed successfully!");
      }
    } else if (isIOS) {
      toast("To install Livezy on your iPhone", {
        description: "Tap the share button (square with arrow) and select 'Add to Home Screen'.",
        duration: 5000,
        icon: <Share className="w-4 h-4" />,
      });
    } else {
      toast.info("Installation", {
        description: "To install this app, use the 'Add to Home Screen' option in your browser menu.",
      });
    }
  };

  const currentThemeLabel = themeMode === "green" ? "Green" : "Default";

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
      title: "Profile settings",
      items: [
        { icon: Palette, label: "Theme", sub: currentThemeLabel, action: () => setThemeSheetOpen(true) },
        { icon: Bell, label: "Notifications" },
        { icon: Shield, label: "Privacy & Security" },
        { icon: HelpCircle, label: "Help & Support" },
      ],
    },
    {
      title: "App",
      items: [
        { 
          icon: Smartphone, 
          label: "Add to Home Screen", 
          sub: "Get quick access to Livezy", 
          action: handleInstallClick 
        },
      ],
    },
  ];

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
              const clickable = Boolean((it as { action?: () => void }).action);
              return (
                <button
                  key={it.label}
                  onClick={(it as { action?: () => void }).action}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 text-left ${
                    i > 0 ? "border-t border-slate-100" : ""
                  } ${clickable ? "active:bg-slate-50" : ""}`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <I className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{it.label}</div>
                    {it.sub && <div className="text-xs text-slate-500">{it.sub}</div>}
                  </div>
                  <ChevronRight className={`w-4 h-4 ${clickable ? "text-slate-500" : "text-slate-400"}`} />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="px-4 mt-5">
        <button
          onClick={() => {
            setAuthComplete(false);
            go({ name: "auth" });
          }}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 text-rose-600 text-sm active:scale-[0.99]"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
        <div className="text-center text-[11px] text-slate-400 mt-3">Livezy · v1.0.0</div>
      </div>

      <BottomSheet open={themeSheetOpen} onClose={() => setThemeSheetOpen(false)} title="App Theme">
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Choose the app look that feels right. The default theme stays unchanged, and the green theme uses #0CA411 as the primary accent.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <ThemeCard
              title="Default"
              sub="Current look"
              selected={themeMode === "default"}
              onClick={() => {
                setThemeMode("default");
                setThemeSheetOpen(false);
              }}
              accent="from-indigo-600 to-fuchsia-600"
            />
            <ThemeCard
              title="Green"
              sub="#0CA411"
              selected={themeMode === "green"}
              onClick={() => {
                setThemeMode("green");
                setThemeSheetOpen(false);
              }}
              accent="from-emerald-500 to-green-600"
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function ThemeCard({
  title,
  sub,
  selected,
  onClick,
  accent,
}: {
  title: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition-transform active:scale-[0.99] ${
        selected ? "border-indigo-600 bg-indigo-50/40" : "border-slate-200 bg-white"
      }`}
    >
      <div className={`h-10 rounded-xl bg-gradient-to-r ${accent}`} />
      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-sm" style={{ fontWeight: 600 }}>{title}</div>
          <div className="text-[11px] text-slate-500">{sub}</div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white"
          }`}
        >
          {selected && <Check className="w-3 h-3" />}
        </div>
      </div>
    </button>
  );
}
