import { ArrowLeft, Search } from "lucide-react";
import { useStore, inr } from "../../store";
import { products } from "../../data/products";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { productImageClass } from "../productImage";

export function ShopSearch({ query }: { query: string }) {
  const { go, back } = useStore();
  const lowerQ = query.toLowerCase();
  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQ) ||
      p.brand.toLowerCase().includes(lowerQ) ||
      p.category.toLowerCase().includes(lowerQ)
  );

  return (
    <div className="pb-6">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 h-14 px-4 flex items-center gap-3">
        <button onClick={back} className="-ml-1 p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 truncate text-slate-800" style={{ fontWeight: 600 }}>
          Search results for "{query}"
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        {results.length === 0 ? (
          <div className="col-span-2 text-center text-slate-500 mt-8">No results found.</div>
        ) : (
          results.map((p) => (
            <button
              key={p.id}
              onClick={() => go({ name: "shop-pdp", productId: p.id })}
              className="text-left bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
            >
              <div className="aspect-square bg-slate-50">
                <ImageWithFallback src={p.image} alt={p.name} className={productImageClass} />
              </div>
              <div className="p-3">
                <div className="text-[10px] text-slate-500 truncate">{p.brand}</div>
                <div className="text-sm line-clamp-1 mt-0.5">{p.name}</div>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span style={{ fontWeight: 600 }}>{inr(p.price)}</span>
                  {p.mrp > p.price && (
                    <span className="text-[10px] text-slate-400 line-through">{inr(p.mrp)}</span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
