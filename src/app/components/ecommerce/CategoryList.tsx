import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, products } from "../../data/products";
import { ProductCard } from "../ProductCard";
import { useStore } from "../../store";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function CategoryList({ categoryId }: { categoryId: string }) {
  const { go } = useStore();
  const cat = categories.find((c) => c.id === categoryId);
  const [sort, setSort] = useState("popular");

  const sorted = useMemo(() => {
    const list = products.filter((p) => p.category === categoryId);
    return [...list].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });
  }, [categoryId, sort]);

  return (
    <div className="pb-6">
      <section className="px-4 pt-4">
        <div className="relative h-40 rounded-2xl overflow-hidden">
          <ImageWithFallback
            src={cat?.image ?? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80"}
            alt={cat?.name ?? "Products"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
          <div className="absolute inset-0 p-4 text-white flex flex-col justify-end">
            <div className="text-[11px] uppercase tracking-widest opacity-80">Shop the edit</div>
            <div className="text-2xl leading-tight mt-0.5" style={{ fontWeight: 800 }}>
              All {cat?.name ?? "Category"} Products
            </div>
            <div className="text-xs opacity-90 mt-1">
              Browse the complete list in one dedicated page
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 mt-5 flex items-center justify-between text-xs text-slate-600">
        <div>
          Showing {sorted.length} items in <span className="text-slate-900">{cat?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs bg-transparent border border-slate-200 rounded-full px-2 py-1"
          >
            <option value="popular">Popular</option>
            <option value="rating">Top rated</option>
            <option value="low">Price low → high</option>
            <option value="high">Price high → low</option>
          </select>
          <button className="flex items-center gap-1 border border-slate-200 rounded-full px-2 py-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
          </button>
        </div>
      </div>

      <div className="px-4 mt-5 grid grid-cols-2 gap-3">
        {sorted.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
        {sorted.length === 0 && (
          <div className="col-span-2 text-center text-slate-500 py-10 text-sm">
            No products yet in this category.
          </div>
        )}
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={() => go({ name: "shop-category", categoryId })}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm flex items-center justify-center gap-1.5"
        >
          Back to category page <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
