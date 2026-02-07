import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../../api/admin";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = () => {
    const params = statusFilter ? { status: statusFilter } : {};
    getAdminOrders(params).then(setOrders).catch(() => {});
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Orders</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-select"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <>
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer_name}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td>
                  $
                  {order.details
                    .reduce((sum, d) => sum + d.price, 0)
                    .toFixed(2)}
                </td>
                <td>
                  <button
                    className="btn-admin btn-admin-primary"
                    onClick={() =>
                      setExpandedId(expandedId === order.id ? null : order.id)
                    }
                  >
                    {expandedId === order.id ? "Hide" : "Details"}
                  </button>
                </td>
              </tr>
              {expandedId === order.id && (
                <tr key={`${order.id}-details`}>
                  <td colSpan={6} style={{ background: "#fafafa", padding: "1rem" }}>
                    <table style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.details.map((d) => (
                          <tr key={d.id}>
                            <td>{d.product_name}</td>
                            <td>{d.quantity}</td>
                            <td>${d.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
