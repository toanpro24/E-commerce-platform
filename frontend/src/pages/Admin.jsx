import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { useLang } from "../context/LanguageContext";
import AdminOverview from "./admin/AdminOverview";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import "./Admin.css";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useLang();
  const a = t.admin;

  const tabs = [
    { key: "overview", label: a.overview, icon: <LayoutDashboard /> },
    { key: "products", label: a.products, icon: <Package /> },
    { key: "orders", label: a.orders, icon: <ShoppingCart /> },
  ];

  return (
    <div className="admin-page page-enter">
      <h1>{a.dashboard}</h1>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <AdminOverview />}
      {activeTab === "products" && <AdminProducts />}
      {activeTab === "orders" && <AdminOrders />}
    </div>
  );
}
