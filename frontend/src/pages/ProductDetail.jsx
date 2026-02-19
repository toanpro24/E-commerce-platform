import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProduct, getCategories } from "../api/products";
import { addToCart } from "../api/cart";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { localName } from "../utils/localize";
import { useToast } from "../components/Toast";
import Spinner from "../components/Spinner";
import "./ProductDetail.css";

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t, lang } = useLang();
  const pd = t.productDetail;
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    Promise.all([getProduct(id), getCategories()])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(cats);
      })
      .catch(() => navigate("/products", { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      window.dispatchEvent(new Event("cart-change"));
      toast.success(pd.addedToCart);
    } catch {
      toast.error(pd.addError || "Error");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner />;
  if (!product) return null;

  const isVideo = product.image && product.image.endsWith(".mp4");
  const cat = categories.find((c) => c.id === product.category_id);
  const catName = localName(cat, lang);

  return (
    <div className="detail-page page-enter">
      <div className="detail-back">
        <Link to="/products">&larr; {pd.backToProducts}</Link>
      </div>

      <div className="detail-layout">
        <div className="detail-media">
          {product.image &&
            (isVideo ? (
              <video
                src={`http://localhost:8000/images/${encodeURIComponent(product.image)}`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                ref={(el) => { if (el) el.play().catch(() => {}); }}
              />
            ) : (
              <img
                src={`http://localhost:8000/images/${encodeURIComponent(product.image)}`}
                alt={product.name}
              />
            ))}
        </div>

        <div className="detail-info">
          <h1>{localName(product, lang)}</h1>

          <div className="detail-badges">
            {catName && <span className="detail-cat">{catName}</span>}
            {product.origin && <span className="detail-origin">{pd.origin}: {product.origin}</span>}
          </div>

          <p className="detail-price">{formatVND(product.price)}</p>

          <div className="detail-qty">
            <label>{pd.quantity}</label>
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              />
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          <button
            className="detail-add-btn"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "..." : pd.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
