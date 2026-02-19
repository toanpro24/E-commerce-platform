import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "../../api/admin";
import { getCategories } from "../../api/products";
import { useToast } from "../../components/Toast";
import { useLang } from "../../context/LanguageContext";

const fmtVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n
  );

const emptyForm = {
  name: "",
  price: "",
  description: "",
  image: "",
  is_active: true,
  origin: "",
  category_id: "",
};

export default function AdminProducts() {
  const { t } = useLang();
  const a = t.admin;
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    adminGetProducts().then(setProducts).catch(() => {});
  };

  useEffect(() => {
    load();
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image || "",
      is_active: product.is_active,
      origin: product.origin || "",
      category_id: product.category_id || "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      image: form.image,
      is_active: form.is_active,
      origin: form.origin,
      category_id: form.category_id ? Number(form.category_id) : null,
    };

    try {
      if (editingId) {
        await adminUpdateProduct(editingId, payload);
        toast.success(a.productUpdated);
      } else {
        await adminCreateProduct(payload);
        toast.success(a.productCreated);
      }
      handleCancel();
      load();
    } catch {
      toast.error(a.updateError);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(a.confirmDelete)) return;
    try {
      await adminDeleteProduct(id);
      toast.success(a.productDeleted);
      load();
    } catch {
      toast.error(a.updateError);
    }
  };

  return (
    <div>
      {/* Search + Add */}
      <div className="admin-search">
        <input
          type="text"
          placeholder={a.searchProducts}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-primary" onClick={openAdd}>
          <Plus /> {a.addProduct}
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="admin-form">
          <h3>{editingId ? a.editProduct : a.addProduct}</h3>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>{a.productName}</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-field">
              <label>{a.price}</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-field">
              <label>{a.category}</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
              >
                <option value="">--</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form-field">
              <label>{a.origin}</label>
              <input
                name="origin"
                value={form.origin}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-field">
              <label>{a.image}</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="btn-primary" onClick={handleSave}>
              {a.save}
            </button>
            <button className="btn-secondary" onClick={handleCancel}>
              {a.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{a.productName}</th>
              <th>{a.price}</th>
              <th>{a.origin}</th>
              <th>{a.active}</th>
              <th>{a.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>{a.noProducts}</td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{fmtVND(p.price)}</td>
                  <td>{p.origin}</td>
                  <td>
                    <span className={p.is_active ? "active-yes" : "active-no"}>
                      {p.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => openEdit(p)}
                        title={a.editProduct}
                      >
                        <Pencil />
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(p.id)}
                        title={a.confirmDelete}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
