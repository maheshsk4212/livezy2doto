import { SlidersHorizontal, Percent, Truck, Sparkles, Tag, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { categories, products } from "../../data/products";
import { ProductCard } from "../ProductCard";
import { HScroll } from "../HScroll";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useStore, inr } from "../../store";

const fashionSubcats = [
  { id: "men", name: "Men", image: "https://images.unsplash.com/photo-1744535814652-9cd3a3dea348?auto=format&fit=crop&w=200&q=80" },
  { id: "women", name: "Women", image: "https://images.unsplash.com/photo-1602303894456-398ce544d90b?auto=format&fit=crop&w=200&q=80" },
  { id: "kids", name: "Kids", image: "https://images.unsplash.com/photo-1557503800-1bdcd9acdc67?auto=format&fit=crop&w=200&q=80" },
  { id: "ethnic", name: "Ethnic", image: "https://images.unsplash.com/photo-1758120221788-d576fa58f520?auto=format&fit=crop&w=200&q=80" },
  { id: "footwear", name: "Footwear", image: "https://images.unsplash.com/photo-1710643301056-1e384538cd2a?auto=format&fit=crop&w=200&q=80" },
  { id: "bags", name: "Bags", image: "https://images.unsplash.com/photo-1774259479601-69a44c70bed1?auto=format&fit=crop&w=200&q=80" },
];

const brands = [
  { name: "Nike", off: "Min 40% off" },
  { name: "Zara", off: "Up to 50% off" },
  { name: "Levi's", off: "Flat 45% off" },
  { name: "H&M", off: "Under ₹999" },
  { name: "Adidas", off: "Min 30% off" },
  { name: "Fabindia", off: "Festive edit" },
];

export function Category({ categoryId }: { categoryId: string }) {
  const { go } = useStore();
  const cat = categories.find((c) => c.id === categoryId);
  const list = products.filter((p) => p.category === categoryId);
  const [sort, setSort] = useState("popular");
  const gridRef = useRef<HTMLDivElement | null>(null);
  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openAllProducts = () => go({ name: "shop-category-list", categoryId });

  const subcatFirst: Record<string, string | undefined> = {
    men: list.find((p) => ["p9", "p13", "p15", "p18", "p20"].includes(p.id))?.id,
    women: list.find((p) => ["p14", "p19"].includes(p.id))?.id,
    kids: list.find((p) => p.id === "p22")?.id,
    ethnic: list.find((p) => ["p16", "p17"].includes(p.id))?.id,
    footwear: list.find((p) => p.id === "p1")?.id,
    bags: list.find((p) => p.id === "p19")?.id,
  };
  const sorted = [...list].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const isFashion = categoryId === "fashion";
  const under999 = list.filter((p) => p.price < 1500).slice(0, 6);
  const trending = [...list].sort((a, b) => b.reviews - a.reviews).slice(0, 6);
  const deals = list.filter((p) => (p.mrp - p.price) / p.mrp >= 0.4).slice(0, 6);
  const newArr = list.filter((p) => p.tags?.includes("new")).slice(0, 6);

  const chips = ["All", "Under ₹2,000", "₹2,000–₹5,000", "Premium", "Top rated", "New"];

  return (
    <div className="pb-6">
          {isFashion && (
        <>
          {/* Hero sale banner */}
          <section className="px-4 pt-3">
            <div className="relative h-36 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
                alt="Fashion sale"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 p-4 text-white flex flex-col justify-center" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>
                <div className="text-[10px] uppercase tracking-widest text-amber-300" style={{ fontWeight: 700 }}>Fashion Days</div>
                <div className="text-xl leading-tight mt-0.5" style={{ fontWeight: 800 }}>Up to 70% off</div>
                <div className="text-xs opacity-90 mt-1">Top brands · Ends Sunday</div>
                <button onClick={scrollToGrid} className="mt-2 bg-white text-slate-900 self-start text-xs px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-transform" style={{ fontWeight: 700 }}>
                  Shop now
                </button>
              </div>
            </div>
          </section>

          {/* Subcategories */}
          <section className="mt-4">
            <HScroll className="pb-2">
              {fashionSubcats.map((s) => {
                const pid = subcatFirst[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => (pid ? go({ name: "shop-pdp", productId: pid }) : scrollToGrid())}
                    className="snap-start shrink-0 flex flex-col items-center gap-1.5 w-16 active:scale-95 transition-transform"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-pink-200 ring-offset-2 ring-offset-white shadow-sm">
                      <ImageWithFallback src={s.image} alt={s.name} className="w-full h-full object-cover scale-125" />
                    </div>
                    <div className="text-[11px] text-slate-700">{s.name}</div>
                  </button>
                );
              })}
            </HScroll>
          </section>

          {/* Deals */}
          {deals.length > 0 && (
            <section className="mt-5">
              <div className="px-4 flex items-center justify-between mb-2.5">
                <div className="text-sm flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                  <Percent className="w-3.5 h-3.5 text-rose-600" />
                  Steal deals · 40%+ off
                </div>
                <div className="text-xs text-rose-500">Ends 23:14:02</div>
              </div>
              <HScroll className="pb-2">
                {deals.map((p) => (
                  <div key={p.id} className="snap-start shrink-0 w-40">
                    <ProductCard p={p} />
                  </div>
                ))}
              </HScroll>
            </section>
          )}

          {/* Under 1500 */}
          {under999.length > 0 && (
            <section className="mt-5">
              <div className="px-4 flex items-center justify-between mb-2.5">
                <div className="text-sm" style={{ fontWeight: 600 }}>Under {inr(1500)}</div>
                <button onClick={openAllProducts} className="text-xs text-indigo-600">
                  View all
                </button>
              </div>
              <HScroll className="pb-2">
                {under999.map((p) => (
                  <div key={p.id} className="snap-start shrink-0 w-40">
                    <ProductCard p={p} />
                  </div>
                ))}
              </HScroll>
            </section>
          )}

          {/* New arrivals */}
          {newArr.length > 0 && (
            <section className="mt-5">
              <div className="px-4 flex items-center justify-between mb-2.5">
                <div className="text-sm flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Just in
                </div>
                <button onClick={openAllProducts} className="text-xs text-indigo-600">View all</button>
              </div>
              <HScroll className="pb-2">
                {newArr.map((p) => (
                  <div key={p.id} className="snap-start shrink-0 w-40">
                    <ProductCard p={p} />
                  </div>
                ))}
              </HScroll>
            </section>
          )}

          {/* Trending */}
          {trending.length > 0 && (
            <section className="mt-5">
              <div className="px-4 flex items-center justify-between mb-2.5">
                <div className="text-sm" style={{ fontWeight: 600 }}>Trending in fashion</div>
                <button onClick={openAllProducts} className="text-xs text-indigo-600">View all</button>
              </div>
              <HScroll className="pb-2">
                {trending.map((p) => (
                  <div key={p.id} className="snap-start shrink-0 w-40">
                    <ProductCard p={p} />
                  </div>
                ))}
              </HScroll>
            </section>
          )}

          {/* Offer strip */}
          <section className="px-4 mt-5 grid grid-cols-3 gap-2">
            <button onClick={() => scrollToGrid()} className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 p-2.5 border border-rose-100 text-left active:scale-95 transition-transform">
              <Percent className="w-4 h-4 text-rose-600" />
              <div className="text-[11px] mt-1" style={{ fontWeight: 700 }}>Flat 50%</div>
              <div className="text-[10px] text-slate-500 truncate">On 2000+ styles</div>
            </button>
            <button onClick={() => scrollToGrid()} className="rounded-xl bg-gradient-to-br from-indigo-50 to-sky-50 p-2.5 border border-indigo-100 text-left active:scale-95 transition-transform">
              <Truck className="w-4 h-4 text-indigo-600" />
              <div className="text-[11px] mt-1" style={{ fontWeight: 700 }}>Delivery by</div>
              <div className="text-[10px] text-slate-500 truncate">On orders ₹499+</div>
            </button>
            <button onClick={() => scrollToGrid()} className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-2.5 border border-amber-100 text-left active:scale-95 transition-transform">
              <Tag className="w-4 h-4 text-amber-600" />
              <div className="text-[11px] mt-1" style={{ fontWeight: 700 }}>Extra {inr(200)}</div>
              <div className="text-[10px] text-slate-500 truncate">HDFC cards</div>
            </button>
          </section>

          {/* Brands strip */}
          <section className="mt-5">
            <div className="px-4 flex items-center justify-between mb-2.5">
              <div className="text-sm" style={{ fontWeight: 600 }}>Top brands</div>
              <button onClick={openAllProducts} className="text-xs text-indigo-600">View all</button>
            </div>
            <HScroll className="pb-2">
              {brands.map((b) => (
                <button
                  key={b.name}
                  onClick={() => scrollToGrid()}
                  className="snap-start shrink-0 w-28 h-20 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-0.5 px-2 active:scale-95 transition-transform"
                >
                  <div className="text-sm" style={{ fontWeight: 700 }}>{b.name}</div>
                  <div className="text-[10px] text-rose-600" style={{ fontWeight: 600 }}>{b.off}</div>
                </button>
              ))}
            </HScroll>
          </section>

          <div className="h-px bg-slate-100 mx-4 mt-6" />
        </>
      )}

      <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {chips.map((c, i) => (
          <button
            key={c}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border ${
              i === 0 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="px-4 flex items-center justify-between text-xs text-slate-600 mt-1">
        <div className="min-w-0 pr-2">
          Showing {sorted.length} items in <span className="text-slate-900">{cat?.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-8 w-[92px] appearance-none text-xs bg-white border border-slate-200 rounded-full pl-2.5 pr-8 leading-none text-slate-700"
            >
              <option value="popular">Popular</option>
              <option value="rating">Top rated</option>
              <option value="low">Price low → high</option>
              <option value="high">Price high → low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-slate-500" />
          </div>
          <button className="h-8 inline-flex items-center gap-1 border border-slate-200 rounded-full px-2.5 text-xs bg-white whitespace-nowrap">
            <SlidersHorizontal className="w-3 h-3" /> Filter
          </button>
        </div>
      </div>

      <div ref={gridRef} className="mt-3 px-4 grid grid-cols-2 gap-3 scroll-mt-16">
        {sorted.map((p) => <ProductCard key={p.id} p={p} />)}
        {sorted.length === 0 && (
          <div className="col-span-2 text-center text-slate-500 py-10 text-sm">
            No products yet in this category.
          </div>
        )}
      </div>
    </div>
  );
}
