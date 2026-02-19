import { useState, useEffect } from "react";
import { adminGetOrders, adminUpdateOrderStatus } from "../../api/admin";
import { useToast } from "../../components/Toast";
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

const STATUSES = ["pending", "shipped", "delivered"];

export default function AdminOrders() {
  const { t } = useLang();
  const a = t.admin;
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const load = () => {
    adminGetOrders().then(setOrders).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      toast.success(a.statusUpdated);
      load();
    } catch {
      toast.error(a.updateError);
    }
  };

  return (
    <div>
      {/* Filter Pills */}
      <div className="admin-filters">
        {[
          { key: "all", label: a.allStatuses },
          { key: "pending", label: a.pending },
          { key: "shipped", label: a.shipped },
          { key: "delivered", label: a.delivered },
        ].map((f) => (
          <button
            key={f.key}
            className={`filter-pill ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
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
            {filtered.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>{a.noOrders}</td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{fmtDate(order.order_date)}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {a[s]}
                        </option>
                      ))}
                    </select>
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
