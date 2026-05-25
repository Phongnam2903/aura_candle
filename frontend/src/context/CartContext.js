import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import CONFIG from "../config";
import { getCart, addToCart, updateCart, removeFromCart, clearCart } from "../api/cart/cartApi";

const CartContext = createContext();

// ─── Helper: đọc cart từ localStorage (dùng cho guest) ──────────────────────
const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    localStorage.removeItem("cart");
    return [];
  }
};

// ─── Helper: build URL ảnh ───────────────────────────────────────────────────
const getImageUrl = (image, images = []) => {
  if (image && image.startsWith("https")) return image;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    return first.startsWith("https") ? first : `${CONFIG.API_URL}${first}`;
  }
  return "https://via.placeholder.com/80";
};

// ─── Helper: chuyển item từ server response → định dạng context ──────────────
// Server trả về { product: { _id, name, price, images }, quantity }
// Context dùng { id, name, price, image, quantity }
const normalizeServerItem = (serverItem) => {
  const p = serverItem.product;
  if (!p) return null;
  return {
    id: p._id || p.id,
    name: p.name,
    price: p.price,
    image: getImageUrl(null, p.images),
    fragrance: p.fragrance || null,
    quantity: serverItem.quantity,
  };
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART": {
      // Gán lại toàn bộ cart (dùng khi load từ server)
      return action.payload;
    }
    case "ADD": {
      const item = action.payload;
      const exist = state.find((p) => p.id === item.id);
      if (exist) {
        return state.map((p) =>
          p.id === item.id
            ? { ...p, quantity: (p.quantity || 0) + (item.quantity || 1) }
            : p
        );
      }
      return [...state, { ...item, quantity: item.quantity || 1 }];
    }
    case "REMOVE":
      return state.filter((p) => p.id !== action.id);
    case "UPDATE_QTY":
      return state.map((p) =>
        p.id === action.id ? { ...p, quantity: action.quantity } : p
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  // isLoggedIn được xác định từ localStorage token — đủ để biết có user không
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    () => !!localStorage.getItem("token")
  );
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [loading, setLoading] = React.useState(true);

  // Lắng nghe thay đổi token (login/logout từ AuthContext)
  useEffect(() => {
    const syncToken = () => setIsLoggedIn(!!localStorage.getItem("token"));
    // Polling nhẹ — hoặc có thể dùng storage event nếu cần cross-tab
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  // Load cart khi khởi động hoặc khi login state thay đổi
  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      setLoading(true);
      if (isLoggedIn) {
        try {
          const data = await getCart();
          if (cancelled) return;
          const normalized = (data.items || [])
            .map(normalizeServerItem)
            .filter(Boolean);
          dispatch({ type: "SET_CART", payload: normalized });
        } catch {
          // Nếu lỗi server, fallback về localStorage
          dispatch({ type: "SET_CART", payload: getLocalCart() });
        }
      } else {
        // Guest: đọc từ localStorage
        dispatch({ type: "SET_CART", payload: getLocalCart() });
      }
      if (!cancelled) setLoading(false);
    };

    loadCart();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  // Đồng bộ localStorage cho guest (khi logged in thì server là source of truth)
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const addItem = useCallback(async (product) => {
    const item = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.image, product.images),
      fragrance: product.fragrance || null,
    };

    // Optimistic update (UI phản hồi ngay)
    dispatch({ type: "ADD", payload: item });

    // Nếu đã login → đồng bộ server
    if (isLoggedIn) {
      try {
        await addToCart(item.id, 1);
      } catch (err) {
        console.error("[Cart] addToCart server error:", err?.message);
        // Không rollback — optimistic đủ dùng cho trường hợp này
      }
    }
  }, [isLoggedIn]);

  const removeItem = useCallback(async (id) => {
    dispatch({ type: "REMOVE", id });

    if (isLoggedIn) {
      try {
        await removeFromCart(id);
      } catch (err) {
        console.error("[Cart] removeFromCart server error:", err?.message);
      }
    }
  }, [isLoggedIn]);

  const updateItem = useCallback(async (id, quantity) => {
    dispatch({ type: "UPDATE_QTY", id, quantity });

    if (isLoggedIn) {
      try {
        await updateCart(id, quantity);
      } catch (err) {
        console.error("[Cart] updateCart server error:", err?.message);
      }
    }
  }, [isLoggedIn]);

  const clearCartItems = useCallback(async () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("cart");

    if (isLoggedIn) {
      try {
        await clearCart();
      } catch (err) {
        console.error("[Cart] clearCart server error:", err?.message);
      }
    }
  }, [isLoggedIn]);

  // Gọi sau khi login — merge localStorage vào server rồi load lại
  const reloadCartFromServer = useCallback(async () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const contextValue = React.useMemo(() => ({
    cart,
    loading,
    addItem,
    removeItem,
    updateItem,
    clearCart: clearCartItems,
    reloadCartFromServer,
  }), [cart, loading, addItem, removeItem, updateItem, clearCartItems, reloadCartFromServer]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được dùng bên trong CartProvider");
  }
  return context;
};
