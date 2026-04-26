import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BadgePercent, Chrome, ShieldCheck, Sparkles, Gift, Zap, Apple } from "lucide-react";
import { useStore } from "../store";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type Mode = "login" | "signup";
type Step = "phone" | "verify";

export function Auth() {
  const { go, setAuthComplete } = useStore();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("+91 ");
  const [otp, setOtp] = useState("");

  const isOtpReady = otp.replace(/\D/g, "").length === 6;

  const featureCards = useMemo(
    () => [
      {
        title: "Safe login with OTP",
        sub: "Fast, secure entry",
        icon: ShieldCheck,
        tint: "from-emerald-500 to-teal-600",
      },
      {
        title: "Fast checkout",
        sub: "Across all services",
        icon: Zap,
        tint: "from-indigo-500 to-violet-600",
      },
      {
        title: "Rewards & deals",
        sub: "More reasons to stay",
        icon: BadgePercent,
        tint: "from-fuchsia-500 to-rose-500",
      },
      {
        title: "One account",
        sub: "Shop, wallet & more",
        icon: Gift,
        tint: "from-amber-500 to-orange-500",
      },
    ],
    [],
  );

  const finishAuth = () => {
    setAuthComplete(true);
    go({ name: "dashboard" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_45%,#eef2ff_100%)] px-4 py-5">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[460px] flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(34,197,94,0.15)]"
              />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Welcome to</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div className="text-[56px] leading-none font-black tracking-[-0.08em] text-emerald-600">LIV</div>
                <div className="relative -ml-1 flex h-20 w-20 items-center justify-center rounded-full bg-lime-500 text-white shadow-[0_18px_40px_-16px_rgba(132,204,22,0.85)]">
                  <span className="text-[34px] leading-none font-black tracking-[-0.1em]">EZY</span>
                </div>
              </div>
            </div>
            <div className="text-sm font-medium tracking-[0.38em] text-emerald-700/80">LIFE MADE EASY</div>
          </div>

          <button
            type="button"
            onClick={finishAuth}
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 active:scale-95"
          >
            Skip
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-6 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_22px_60px_-34px_rgba(79,70,229,0.5)] backdrop-blur-md"
        >
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            Login with OTP
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-slate-900">Continue with OTP</div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {mode === "login"
                ? "Sign in quickly with your mobile number and a one-time password."
                : "Create your account in seconds — mobile number first, OTP next."}
            </p>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3">
            <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Mobile number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              placeholder="+91 98765 43210"
            />
            <button
              type="button"
              onClick={() => setStep("verify")}
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white active:scale-95"
            >
              Send OTP
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className={`mt-4 rounded-2xl border ${step === "verify" ? "border-indigo-200 bg-indigo-50/60" : "border-slate-200 bg-slate-50"} p-3`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <div className="text-sm font-semibold text-slate-900">Enter OTP</div>
            </div>
            <p className="mt-1 text-xs text-slate-500">We sent a 6-digit code to your phone.</p>

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
                setMode("signup");
                setStep("phone");
                setOtp("");
              }}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-transparent text-sm font-semibold text-indigo-700 active:scale-[0.99]"
            >
              Sign up
            </button>
            <div className="mt-4">
              <div className="text-center text-[11px] uppercase tracking-[0.22em] text-slate-400">or continue with</div>
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

          <div className="mt-4 overflow-hidden">
            <motion.div
              className="flex w-max gap-3"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            >
              {[...featureCards, ...featureCards].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.title}-${idx}`}
                    className="w-[168px] shrink-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tint} text-white shadow-md`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.sub}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        <div className="pb-2 pt-5 text-center text-[11px] text-slate-500">
          By continuing, you agree to Livezy&apos;s Terms & Privacy Policy.
        </div>
      </div>
    </div>
  );
}
