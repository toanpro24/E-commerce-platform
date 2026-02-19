import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart } from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const refresh = useCallback(() => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }
    getCart()
      .then((items) => setCount(items.reduce((s, i) => s + i.quantity, 0)))
      .catch(() => setCount(0));
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("cart-change", handler);
    return () => window.removeEventListener("cart-change", handler);
  }, [refresh]);

  return (
    <CartContext.Provider value={{ count, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
