import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function BottomSheet({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none ${open ? "" : ""}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div
          className={`w-full max-w-[460px] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out pointer-events-auto ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="pt-2 flex justify-center">
            <div className="w-10 h-1.5 rounded-full bg-slate-200" />
          </div>
          {title && (
            <div className="px-5 pt-3 pb-2 flex items-center justify-between">
              <div style={{ fontWeight: 600 }}>{title}</div>
              <button onClick={onClose} className="p-1 -mr-1 rounded-full hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="px-5 pb-5 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
