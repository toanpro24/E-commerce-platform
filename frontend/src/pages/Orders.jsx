import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";
import { useLang } from "../context/LanguageContext";
import Spinner from "../components/Spinner";
import "./Orders.css";

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { t } = useLang();
  const o = t.orders;

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="orders-page page-enter">
      <h1>{o.title}</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>{o.empty}</p>
          <Link to="/products" className="orders-browse">
            {o.browseProducts}
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const total = order.details.reduce((s, d) => s + d.price, 0);
            const isOpen = expanded === order.id;

            return (
              <div key={order.id} className="order-card">
                <div
                  className="order-header"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <div className="order-meta">
                    <span className="order-id">{o.orderId}{order.id}</span>
                    <span className="order-date">{formatDate(order.order_date)}</span>
                  </div>
                  <div className="order-meta-right">
                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                    <span className="order-total">{formatVND(total)}</span>
                    <span className="order-toggle">{isOpen ? "\u25B2" : "\u25BC"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="order-details">
                    <table>
                      <thead>
                        <tr>
                          <th>{o.product}</th>
                          <th>{o.qty}</th>
                          <th>{o.subtotal}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.details.map((d) => (
                          <tr key={d.id}>
                            <td>{d.product_name}</td>
                            <td>{d.quantity}</td>
                            <td>{formatVND(d.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
