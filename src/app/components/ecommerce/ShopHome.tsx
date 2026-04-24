import { ChevronRight } from "lucide-react";
import { useStore } from "../../store";
import { categories, products, heroBanners } from "../../data/products";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ProductCard } from "../ProductCard";
import { HScroll } from "../HScroll";

export function ShopHome() {
  const { go } = useStore();
  const deals = products.filter((p) => p.tags?.includes("deal") || p.mrp - p.price > 2000).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags?.includes("new") || p.id === "p3" || p.id === "p5");

  return (
    <div className="pb-6">
      <div className="px-4 pt-4">
        <div className="grid grid-cols-4 gap-y-4">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => go({ name: "shop-category", categoryId: c.id })}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div
                className={`w-16 h-16 rounded-full overflow-hidden ring-2 ${c.color} ring-offset-2 ring-offset-white bg-white shadow-sm`}
              >
                <ImageWithFallback
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover scale-125"
                />
              </div>
              <div className="text-[11px] text-slate-700">{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="relative h-40 rounded-2xl overflow-hidden">
          <ImageWithFallback
            src={heroBanners[0].image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-rose-500 opacity-85" />
          <div className="absolute inset-0 p-4 text-white flex flex-col justify-center">
            <div className="text-[11px] uppercase tracking-widest opacity-90">Mega Sale</div>
            <div className="text-2xl leading-tight" style={{ fontWeight: 700 }}>
              Big Fashion<br />Days
            </div>
            <div className="text-xs mt-1 opacity-90">Up to 70% off · Ends Sunday</div>
            <button className="mt-2 bg-white text-rose-600 self-start text-xs px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
              Shop now
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 flex items-center justify-between">
        <div style={{ fontWeight: 600 }}>Deals of the Day</div>
        <div className="text-xs text-rose-500">Ends in 06:42:18</div>
      </div>
      <div className="mt-3 px-4 grid grid-cols-2 gap-3">
        {deals.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>

      <div className="px-4 mt-6 flex items-center justify-between">
        <div style={{ fontWeight: 600 }}>New Arrivals</div>
        <button onClick={() => go({ name: "shop-category", categoryId: "footwear" })} className="text-xs text-indigo-600 flex items-center">
          View all <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <HScroll className="mt-3 pb-2">
        {newArrivals.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-44">
            <ProductCard p={p} />
          </div>
        ))}
      </HScroll>

      <div className="px-4 mt-6">
        <div style={{ fontWeight: 600 }}>Recommended for you</div>
      </div>
      <div className="mt-3 px-4 grid grid-cols-2 gap-3">
        {products.slice(6).map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
