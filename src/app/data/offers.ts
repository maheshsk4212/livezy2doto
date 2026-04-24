export type Offer = {
  id: string;
  title: string;
  sub: string;
  type: "pct" | "flat";
  value: number;
  minCart?: number;
  max?: number;
  code: string;
  tag: "bank" | "coupon" | "livezy";
};

export const offers: Offer[] = [
  {
    id: "o1",
    title: "10% off on Livezy Credit Card",
    sub: "Min. order ₹500 · up to ₹1,500",
    type: "pct",
    value: 10,
    minCart: 500,
    max: 1500,
    code: "LZCARD10",
    tag: "bank",
  },
  {
    id: "o2",
    title: "Flat ₹100 off",
    sub: "New customer coupon · no minimum",
    type: "flat",
    value: 100,
    code: "LIVEZY100",
    tag: "coupon",
  },
  {
    id: "o3",
    title: "Extra 5% off with Livezy ONE",
    sub: "Members save more · stackable",
    type: "pct",
    value: 5,
    max: 500,
    code: "ONEMEMBER",
    tag: "livezy",
  },
  {
    id: "o4",
    title: "No-cost EMI from ₹167/mo",
    sub: "3, 6, 9 month plans available",
    type: "flat",
    value: 0,
    code: "NCEMI",
    tag: "bank",
  },
];

export function applyOffer(price: number, o: Offer): { discount: number; final: number } {
  if (o.minCart && price < o.minCart) return { discount: 0, final: price };
  let d = 0;
  if (o.type === "flat") d = o.value;
  else d = Math.round((price * o.value) / 100);
  if (o.max) d = Math.min(d, o.max);
  d = Math.min(d, price);
  return { discount: d, final: price - d };
}
