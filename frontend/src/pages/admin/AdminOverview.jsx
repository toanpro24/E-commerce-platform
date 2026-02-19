import { useState, useEffect } from "react";
import { ShoppingCart, Clock, DollarSign } from "lucide-react";
import { adminGetOrders } from "../../api/admin";
import { useLang } from "../../context/LanguageContext";

const fmtVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n
  );

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const orderTotal = (order) =>
  order.details.reduce((s, d) => s + d.price, 0);

export default function AdminOverview() {
  const { t } = useLang();
  const a = t.admin;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    adminGetOrders().then(setOrders).catch(() => {});
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue = orders.reduce((sum, o) => sum + orderTotal(o), 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <ShoppingCart />
          </div>
          <div className="stat-info">
            <span className="stat-number">{totalOrders}</span>
            <span className="stat-label">{a.totalOrders}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock />
          </div>
          <div className="stat-info">
            <span className="stat-number">{pendingOrders}</span>
            <span className="stat-label">{a.pendingOrders}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <DollarSign />
          </div>
          <div className="stat-info">
            <span className="stat-number">{fmtVND(revenue)}</span>
            <span className="stat-label">{a.revenue}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <h3 className="admin-section-title">{a.recentOrders}</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{a.orderId}</th>
              <th>{a.customer}</th>
              <th>{a.date}</th>
              <th>{a.status}</th>
              <th>{a.total}</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>{a.noOrders}</td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{fmtDate(order.order_date)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{fmtVND(orderTotal(order))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
