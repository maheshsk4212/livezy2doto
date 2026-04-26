import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BadgePercent, Chrome, ShieldCheck, Sparkles, Gift, Zap, Apple } from "lucide-react";
import { useStore } from "../store";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type Step = "phone" | "verify";

export function Auth() {
  const { go, setAuthComplete } = useStore();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("+91 ");
  const [otp, setOtp] = useState("");
  const [railPage, setRailPage] = useState(0);

  const isOtpReady = otp.replace(/\D/g, "").length === 6;

  const featureCards = useMemo(
    () => [
      {
        title: "Shop",
        sub: "Fashion, gadgets & more",
        icon: Gift,
        tint: "from-emerald-500 to-teal-600",
      },
      {
        title: "Mart",
        sub: "Groceries & essentials",
        icon: ShieldCheck,
        tint: "from-indigo-500 to-violet-600",
      },
      {
        title: "Loans",
        sub: "Quick credit options",
        icon: BadgePercent,
        tint: "from-fuchsia-500 to-rose-500",
      },
      {
        title: "Flights",
        sub: "Book travel in seconds",
        icon: Zap,
        tint: "from-amber-500 to-orange-500",
      },
      {
        title: "Home",
        sub: "Repairs and services",
        icon: ShieldCheck,
        tint: "from-sky-500 to-blue-600",
      },
      {
        title: "Salon",
        sub: "Beauty and self-care",
        icon: BadgePercent,
        tint: "from-fuchsia-500 to-purple-600",
      },
      {
        title: "Rides",
        sub: "Quick city travel",
        icon: Zap,
        tint: "from-slate-600 to-slate-800",
      },
      {
        title: "Food",
        sub: "Meals and bites",
        icon: Gift,
        tint: "from-orange-500 to-red-500",
      },
      {
        title: "Health",
        sub: "Care on demand",
        icon: ShieldCheck,
        tint: "from-teal-500 to-cyan-600",
      },
      {
        title: "Rewards",
        sub: "Earn and redeem more",
        icon: BadgePercent,
        tint: "from-purple-500 to-pink-500",
      },
    ],
    [],
  );

  const finishAuth = () => {
    setAuthComplete(true);
    go({ name: "dashboard" });
  };

  const featurePages = useMemo(() => {
    const pages: typeof featureCards[] = [];
    for (let i = 0; i < featureCards.length; i += 2) {
      pages.push(featureCards.slice(i, i + 2));
    }
    return pages;
  }, [featureCards]);

  useEffect(() => {
    if (featurePages.length <= 1) return;
    const timer = window.setTimeout(() => {
      setRailPage((page) => (page + 1) % featurePages.length);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [railPage, featurePages.length]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_45%,#eef2ff_100%)] px-6 py-3">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[460px] flex-col justify-center">
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(34,197,94,0.15)]"
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Welcome to</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center">
                <div className="text-[52px] leading-none font-black tracking-[-0.08em] text-emerald-600">LIV</div>
                <div className="relative -ml-1 flex h-16 w-16 items-center justify-center rounded-full bg-lime-500 text-white shadow-[0_12px_30px_-10px_rgba(132,204,22,0.85)]">
                  <span className="text-[28px] leading-none font-black tracking-[-0.1em]">EZY</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-medium tracking-[0.4em] text-emerald-700/80">LIFE MADE EASY</div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-2 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_22px_60px_-34px_rgba(79,70,229,0.5)] backdrop-blur-md"
        >
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            Login with OTP
          </div>

          {step === "phone" && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
              <div className="text-sm font-semibold text-slate-900">Continue with OTP</div>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Sign in quickly with your mobile number and a one-time password.
              </p>
              <label className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Mobile number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="+91 98765 43210"
              />
              <div className="mt-2 text-[11px] leading-5 text-slate-500">
                By continuing, you agree to Livezy&apos;s Terms & Privacy Policy.
              </div>
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setStep("verify")}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition active:scale-95"
                >
                  Send OTP
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === "verify" && (
            <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <div className="text-sm font-semibold text-slate-900">Enter OTP</div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                We sent a 6-digit code to {phone.trim() || "your phone"}.
              </p>

              <div className="mt-3 flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="justify-center"
                  autoFocus={step === "verify"}
                >
                  <InputOTPGroup className="gap-1.5">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <button
                type="button"
                disabled={!isOtpReady}
                onClick={finishAuth}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Verify & Continue
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-transparent text-sm font-semibold text-indigo-700 active:scale-[0.99]"
              >
                Change mobile number
              </button>
              <div className="mt-4">
                <div className="text-center text-[11px] uppercase tracking-[0.22em] text-slate-400">Explore Livezy services</div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={finishAuth}
                    className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 active:scale-[0.99]"
                  >
                    <Chrome className="h-4 w-4 text-slate-900" />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={finishAuth}
                    className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 active:scale-[0.99]"
                  >
                    <Apple className="h-4 w-4 text-slate-900" />
                    Apple
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>

        <div className="mt-6 overflow-hidden">
          <motion.div
            className="flex w-full py-1"
            animate={{ x: `-${railPage * 100}%` }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {featurePages.map((page, pageIndex) => (
              <div key={pageIndex} className="w-full shrink-0 px-0.5">
                <div className="grid grid-cols-2 gap-3">
                  {page.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={`${item.title}-${idx}`}
                        className={`rounded-2xl border border-white/20 bg-gradient-to-br ${item.tint} p-3 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.35)]`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-slate-800 shadow-sm backdrop-blur-md">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white">{item.title}</div>
                            <div className="text-xs text-white/80">{item.sub}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {page.length === 1 && <div className="rounded-2xl border border-white/20 bg-slate-800/10" />}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={finishAuth}
            className="rounded-full bg-white/90 px-6 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 active:scale-95 transition-all hover:bg-white hover:ring-slate-300"
          >
            Skip for now
          </button>
        </div>

      </div>
    </div>
  );
}
