import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as addApi,
  updateCartItem as updateApi,
  removeFromCart as removeApi,
  clearCart as clearApi,
} from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getCart();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const item = await addApi(productId, quantity);
    await fetchCart();
    return item;
  };

  const updateQuantity = async (itemId, quantity) => {
    await updateApi(itemId, quantity);
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await removeApi(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await clearApi();
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
