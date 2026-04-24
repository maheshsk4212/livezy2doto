import { ReactNode, useRef, PointerEvent, useState, useEffect, RefObject } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  snap?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
};

export function HScroll({ children, className = "", snap = true, scrollRef }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef) (scrollRef as { current: HTMLDivElement | null }).current = ref.current;
  });
  const drag = useRef<{ startX: number; startScroll: number; moved: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    drag.current = { startX: e.clientX, startScroll: el.scrollLeft, moved: 0 };
    el.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !drag.current) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el && e.pointerId != null && el.hasPointerCapture?.(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    // Suppress click if user actually dragged.
    const moved = drag.current?.moved ?? 0;
    drag.current = null;
    if (moved > 6) {
      const stop = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
        window.removeEventListener("click", stop, true);
      };
      window.addEventListener("click", stop, true);
      setTimeout(() => window.removeEventListener("click", stop, true), 50);
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`flex overflow-x-auto no-scrollbar select-none ${snap ? "snap-x" : ""} ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      style={{
        gap: 12,
        paddingLeft: 16,
        paddingRight: 16,
        scrollPaddingLeft: 16,
        scrollPaddingRight: 16,
        scrollSnapType: snap && !dragging ? "x proximity" : "none",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x",
        overscrollBehaviorX: "contain",
      }}
    >
      {children}
    </div>
  );
}
