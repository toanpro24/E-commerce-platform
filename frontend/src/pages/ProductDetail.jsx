import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct } from "../api/products";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import Spinner from "../components/Spinner";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} x ${product.name} to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner text="Loading product..." />;

  if (!product)
    return (
      <div className="empty-state page-enter" style={{ padding: "4rem 1rem" }}>
        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>&#128533;</p>
        <h3>Product not found</h3>
        <p>
          <Link to="/">Back to shopping</Link>
        </p>
      </div>
    );

  return (
    <div className="product-detail page-enter">
      <div className="product-detail-breadcrumb">
        <Link to="/">Home</Link> / {product.name}
      </div>
      <div className="product-detail-layout">
        <div className="product-detail-img">
          <img
            src={`http://localhost:8000/images/${product.image}`}
            alt={product.name}
            onError={(e) => {
              e.target.src = "https://placehold.co/400x400?text=No+Image";
            }}
          />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <div className="product-detail-price-row">
            <span className="product-detail-price">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <hr className="detail-divider" />
          <p className="product-detail-stock">
            {product.quantity > 0 ? (
              <span className="in-stock">
                In Stock ({product.quantity} available)
              </span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </p>
          <div className="product-detail-actions">
            <div className="qty-control">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="btn-add-cart-lg"
              disabled={product.quantity === 0 || adding}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
