import { useEffect, useState } from "react";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/admin";
import { getCategories } from "../../api/products";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    price: "",
    quantity: "",
    category_id: "",
    image: "",
  });

  const fetchProducts = () => {
    const params = search ? { search } : {};
    getAdminProducts(params).then(setProducts).catch(() => {});
  };

  useEffect(() => {
    fetchProducts();
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setEditData({
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      category_id: p.category_id || "",
      image: p.image,
    });
  };

  const saveEdit = async () => {
    try {
      await updateProduct(editId, {
        ...editData,
        price: Number(editData.price),
        quantity: Number(editData.quantity),
        category_id: editData.category_id ? Number(editData.category_id) : null,
      });
      setEditId(null);
      fetchProducts();
    } catch {
      alert("Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to deactivate this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  const handleCreate = async () => {
    try {
      await createProduct({
        ...newData,
        price: Number(newData.price),
        quantity: Number(newData.quantity),
        category_id: newData.category_id ? Number(newData.category_id) : null,
      });
      setShowNew(false);
      setNewData({ name: "", price: "", quantity: "", category_id: "", image: "" });
      fetchProducts();
    } catch {
      alert("Failed to create product");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Products</h2>
        <button
          className="btn-admin btn-admin-success"
          onClick={() => setShowNew(!showNew)}
        >
          {showNew ? "Cancel" : "+ New Product"}
        </button>
      </div>

      <form onSubmit={handleSearch} className="admin-search">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
        <button type="submit">Search</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Category</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {showNew && (
            <tr>
              <td>-</td>
              <td>
                <input
                  value={newData.name}
                  onChange={(e) =>
                    setNewData((d) => ({ ...d, name: e.target.value }))
                  }
                  placeholder="Product name"
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={newData.price}
                  onChange={(e) =>
                    setNewData((d) => ({ ...d, price: e.target.value }))
                  }
                  placeholder="0.00"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newData.quantity}
                  onChange={(e) =>
                    setNewData((d) => ({ ...d, quantity: e.target.value }))
                  }
                  placeholder="0"
                />
              </td>
              <td>
                <select
                  value={newData.category_id}
                  onChange={(e) =>
                    setNewData((d) => ({ ...d, category_id: e.target.value }))
                  }
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>-</td>
              <td>
                <button
                  className="btn-admin btn-admin-success"
                  onClick={handleCreate}
                >
                  Save
                </button>
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.5 }}>
              <td>{p.id}</td>
              <td>
                {editId === p.id ? (
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, name: e.target.value }))
                    }
                  />
                ) : (
                  p.name
                )}
              </td>
              <td>
                {editId === p.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, price: e.target.value }))
                    }
                  />
                ) : (
                  `$${p.price.toFixed(2)}`
                )}
              </td>
              <td>
                {editId === p.id ? (
                  <input
                    type="number"
                    value={editData.quantity}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, quantity: e.target.value }))
                    }
                  />
                ) : (
                  p.quantity
                )}
              </td>
              <td>
                {editId === p.id ? (
                  <select
                    value={editData.category_id}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        category_id: e.target.value,
                      }))
                    }
                  >
                    <option value="">None</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  categories.find((c) => c.id === p.category_id)?.name || "-"
                )}
              </td>
              <td>{p.is_active ? "Yes" : "No"}</td>
              <td>
                <div className="admin-actions">
                  {editId === p.id ? (
                    <>
                      <button
                        className="btn-admin btn-admin-primary"
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="btn-admin"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-admin btn-admin-primary"
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </button>
                      {p.is_active && (
                        <button
                          className="btn-admin btn-admin-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
