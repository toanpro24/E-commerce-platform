import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem } from "../api/cart";
import { checkout } from "../api/orders";
import { useLang } from "../context/LanguageContext";
import { useToast } from "../components/Toast";
import Spinner from "../components/Spinner";
import "./Cart.css";

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const { t } = useLang();
  const c = t.cart;
  const toast = useToast();
  const navigate = useNavigate();

  const fetchCart = () => {
    setLoading(true);
    getCart()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCart, []);

  const handleQtyChange = async (item, newQty) => {
    if (newQty < 1) return;
    try {
      const updated = await updateCartItem(item.id, newQty);
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      window.dispatchEvent(new Event("cart-change"));
    } catch {
      toast.error("Error");
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeCartItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      window.dispatchEvent(new Event("cart-change"));
    } catch {
      toast.error("Error");
    }
  };

  const handleCheckout = async () => {
    setChecking(true);
    try {
      await checkout();
      window.dispatchEvent(new Event("cart-change"));
      toast.success(c.checkoutSuccess);
      navigate("/orders");
    } catch {
      toast.error(c.checkoutError);
    } finally {
      setChecking(false);
    }
  };

  const subtotal = items.reduce(
    (sum, i) => sum + i.product_price * i.quantity,
    0
  );

  if (loading) return <Spinner />;

  return (
    <div className="cart-page page-enter">
      <h1>{c.title}</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>{c.empty}</p>
          <Link to="/products" className="cart-continue">
            {c.continueShopping}
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.product_image && (
                    item.product_image.endsWith(".mp4") ? (
                      <video
                        src={`http://localhost:8000/images/${encodeURIComponent(item.product_image)}`}
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img
                        src={`http://localhost:8000/images/${encodeURIComponent(item.product_image)}`}
                        alt={item.product_name}
                      />
                    )
                  )}
                </div>

                <div className="cart-item-info">
                  <h3>{item.product_name}</h3>
                  <p className="cart-item-price">{formatVND(item.product_price)}</p>
                </div>

                <div className="cart-item-qty">
                  <div className="qty-control">
                    <button onClick={() => handleQtyChange(item, item.quantity - 1)}>-</button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQtyChange(item, Math.max(1, Number(e.target.value)))
                      }
                    />
                    <button onClick={() => handleQtyChange(item, item.quantity + 1)}>+</button>
                  </div>
                </div>

                <div className="cart-item-total">
                  {formatVND(item.product_price * item.quantity)}
                </div>

                <button className="cart-remove" onClick={() => handleRemove(item)}>
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <Link to="/products" className="cart-continue">
              {c.continueShopping}
            </Link>
            <div className="cart-summary">
              <span className="cart-subtotal-label">{c.subtotal}:</span>
              <span className="cart-subtotal-value">{formatVND(subtotal)}</span>
              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={checking}
              >
                {checking ? "..." : c.checkout}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
