import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="orders-page">
        <h2>My Orders</h2>
        <p>
          Please <Link to="/login">sign in</Link> to view your orders.
        </p>
      </div>
    );
  }

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="orders-empty">
          No orders yet. <Link to="/">Start shopping</Link>
        </p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-label">Order #{order.id}</span>
                  <span className="order-date">
                    {new Date(order.order_date).toLocaleDateString()}
                  </span>
                </div>
                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-items">
                {order.details.map((d) => (
                  <div key={d.id} className="order-item">
                    <span>{d.product_name}</span>
                    <span>
                      x{d.quantity} &mdash; ${d.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                Total: $
                {order.details
                  .reduce((sum, d) => sum + d.price, 0)
                  .toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
