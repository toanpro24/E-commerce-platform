import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import { checkout } from "../api/orders";
import Spinner from "../components/Spinner";
import "./Cart.css";

export default function Cart() {
  const { user } = useAuth();
  const { items, cartTotal, updateQuantity, removeItem, loading, clearCart } =
    useCart();
  const toast = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-page page-enter">
        <h2>Shopping Cart</h2>
        <div className="cart-empty">
          <p>
            Please <Link to="/login">sign in</Link> to view your cart.
          </p>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      const order = await checkout();
      await clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Checkout failed");
    }
  };

  if (loading) return <Spinner text="Loading cart..." />;

  return (
    <div className="cart-page page-enter">
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <div className="cart-empty">
          <p className="cart-empty-icon">&#128722;</p>
          <h3>Your cart is empty</h3>
          <p>
            <Link to="/">Continue shopping</Link>
          </p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={`http://localhost:8000/images/${item.product_image}`}
                  alt={item.product_name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/80x80?text=No+Img";
                  }}
                />
                <div className="cart-item-details">
                  <Link to={`/product/${item.product_id}`} className="cart-item-name">
                    {item.product_name}
                  </Link>
                  <p className="cart-item-price">
                    ${item.product_price.toFixed(2)}
                  </p>
                </div>
                <div className="cart-item-qty">
                  <div className="qty-control">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.min(10, item.quantity + 1))
                      }
                      disabled={item.quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-subtotal">
                  ${(item.product_price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => {
                    removeItem(item.id);
                    toast.info(`${item.product_name} removed from cart`);
                  }}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <button onClick={handleCheckout} className="btn-checkout">
              Proceed to Checkout
            </button>
            <Link to="/" className="cart-continue">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
