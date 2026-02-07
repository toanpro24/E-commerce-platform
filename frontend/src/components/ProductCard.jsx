import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "./Toast";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img
          src={`http://localhost:8000/images/${product.image}`}
          alt={product.name}
          className="product-card-img"
          onError={(e) => {
            e.target.src = "https://placehold.co/200x200?text=No+Image";
          }}
        />
      </Link>
      <div className="product-card-info">
        <Link to={`/product/${product.id}`} className="product-card-name">
          {product.name}
        </Link>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
        {product.quantity > 0 ? (
          <span className="product-card-stock in-stock">In Stock</span>
        ) : (
          <span className="product-card-stock out-of-stock">Out of Stock</span>
        )}
        <button
          onClick={handleAdd}
          className="btn-add-cart"
          disabled={adding || product.quantity === 0}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
