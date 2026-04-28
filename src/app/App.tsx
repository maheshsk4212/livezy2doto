import { Toaster } from "sonner";
import { StoreProvider, useStore } from "./store";
import { TopBar } from "./components/TopBar";
import { BottomNav } from "./components/BottomNav";
import { Dashboard } from "./components/Dashboard";
import { ShopHome } from "./components/ecommerce/ShopHome";
import { Category } from "./components/ecommerce/Category";
import { CategoryList } from "./components/ecommerce/CategoryList";
import { ProductDetail } from "./components/ecommerce/ProductDetail";
import { OrderTracker } from "./components/ecommerce/OrderTracker";
import { Cart } from "./components/ecommerce/Cart";
import { Checkout } from "./components/ecommerce/Checkout";
import { OrderSuccess } from "./components/ecommerce/OrderSuccess";
import { Orders } from "./components/ecommerce/Orders";
import { ShopSearch } from "./components/ecommerce/ShopSearch";
import { Account } from "./components/Account";
import { LobStub } from "./components/LobStub";
import { Auth } from "./components/Auth";
import { categories } from "./data/products";

function Shell() {
  const { screen } = useStore();

  const titleForBack = () => {
    switch (screen.name) {
      case "shop-category":
        return categories.find((c) => c.id === screen.categoryId)?.name ?? "Category";
      case "shop-category-list":
        return `${categories.find((c) => c.id === screen.categoryId)?.name ?? "Category"} Products`;
      case "shop-pdp": return "Product Details";
      case "shop-cart": return "My Cart";
      case "shop-checkout": return "Checkout";
      case "shop-success": return "Order Confirmed";
      case "shop-tracker": return "Track Order";
      case "shop-orders": return "My Orders";
      case "account": return "Account";
      case "lob-stub": return "Service";
      default: return "";
    }
  };

  const showDashboardTop = screen.name === "dashboard";
  const showShopTop = screen.name === "shop-home";
  const showBottomNav = ["dashboard", "shop-home", "shop-orders", "account"].includes(screen.name);
  const showAuthTop = screen.name === "auth";
  const hideTopBar = screen.name === "shop-search";

  let content: React.ReactNode = null;
  switch (screen.name) {
    case "dashboard": content = <Dashboard />; break;
    case "auth": content = <Auth />; break;
    case "shop-home": content = <ShopHome />; break;
    case "shop-category": content = <Category categoryId={screen.categoryId} />; break;
    case "shop-category-list": content = <CategoryList categoryId={screen.categoryId} />; break;
    case "shop-pdp": content = <ProductDetail productId={screen.productId} />; break;
    case "shop-cart": content = <Cart />; break;
    case "shop-checkout": content = <Checkout />; break;
    case "shop-success": content = <OrderSuccess orderId={screen.orderId} />; break;
    case "shop-tracker": content = <OrderTracker orderId={screen.orderId} />; break;
    case "shop-orders": content = <Orders />; break;
    case "shop-search": content = <ShopSearch query={screen.query} />; break;
    case "account": content = <Account />; break;
    case "lob-stub": content = <LobStub lob={screen.lob} />; break;
    default: content = <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-[460px] min-h-screen bg-slate-50 relative flex flex-col shadow-xl overflow-x-hidden">
        {showDashboardTop && <TopBar variant="dashboard" />}
        {showShopTop && <TopBar variant="shop" />}
        {!showDashboardTop && !showShopTop && !showAuthTop && !hideTopBar && <TopBar variant="back" title={titleForBack()} />}
        <main className={`flex-1 min-w-0 ${showBottomNav ? "pb-20" : ""}`}>{content}</main>
        {showBottomNav && <BottomNav />}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
      <Toaster position="top-center" richColors />
    </StoreProvider>
  );
}
