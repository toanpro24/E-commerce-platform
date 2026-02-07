import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProducts, getCategories } from "../api/products";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeCategory) params.category_id = activeCategory;
    getProducts(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

  return (
    <div className="home page-enter">
      {!search && !activeCategory && (
        <div className="hero">
          <div className="hero-content">
            <h1>Welcome to ShopHub</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <a href="#products" className="hero-btn">
              Shop Now
            </a>
          </div>
        </div>
      )}

      <div className="home-body" id="products">
        <div className="category-bar">
          <button
            className={!activeCategory ? "active" : ""}
            onClick={() => setActiveCategory(null)}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? "active" : ""}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {search && (
          <div className="search-info">
            <p>
              Results for <strong>"{search}"</strong>
              <Link to="/" className="search-clear">
                Clear search
              </Link>
            </p>
          </div>
        )}

        {loading ? (
          <Spinner text="Loading products..." />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">&#128269;</p>
            <h3>No products found</h3>
            <p>Try a different search term or browse all categories</p>
          </div>
        ) : (
          <>
            <p className="results-count">{products.length} products</p>
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
