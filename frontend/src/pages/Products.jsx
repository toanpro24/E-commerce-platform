import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../api/products";
import { useLang } from "../context/LanguageContext";
import Spinner from "../components/Spinner";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();
  const p = t.products;

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category_id = activeCategory;
    getProducts(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="products-page page-enter">
      <section className="products-hero">
        <h1>{p.heroTitle}</h1>
        <p>{p.heroSubtitle}</p>
      </section>

      <div className="products-body">
        <div className="category-filter">
          <button
            className={!activeCategory ? "active" : ""}
            onClick={() => setActiveCategory(null)}
          >
            {p.allCategories}
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

        {loading ? (
          <Spinner text={p.loading} />
        ) : products.length === 0 ? (
          <div className="products-empty">
            <p>{p.empty}</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((prod) => (
              <div key={prod.id} className="product-showcase-card">
                {prod.image && (
                  <div className="showcase-img">
                    <img
                      src={`http://localhost:8000/images/${prod.image}`}
                      alt={prod.name}
                    />
                  </div>
                )}
                <div className="showcase-info">
                  <h3>{prod.name}</h3>
                  <span className="showcase-category">
                    {categories.find((c) => c.id === prod.category_id)?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="products-cta">
          <h2>{p.ctaTitle}</h2>
          <p>{p.ctaText}</p>
          <Link to="/contact" className="products-cta-btn">
            {p.ctaBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
