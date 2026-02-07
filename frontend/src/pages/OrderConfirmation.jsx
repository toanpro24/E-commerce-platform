import { useParams, Link } from "react-router-dom";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const { id } = useParams();

  return (
    <div className="confirmation page-enter">
      <div className="confirmation-card">
        <div className="confirmation-icon">&#10003;</div>
        <h2>Order Placed Successfully!</h2>
        <p className="confirmation-order">
          Order <strong>#{id}</strong> has been confirmed
        </p>
        <p className="confirmation-msg">
          Thank you for your purchase! You'll receive updates as your order ships.
        </p>
        <div className="confirmation-actions">
          <Link to="/orders" className="btn-primary">
            View My Orders
          </Link>
          <Link to="/" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
