import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cart")) || [];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const item = action.payload;
      const exist = state.find((p) => p.id === item.id);
      if (exist) {
        // cộng dồn quantity từ item.quantity
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

// ✅ Hàm xử lý ảnh chuẩn
const getImageUrl = (image, images = []) => {
  if (image && image.startsWith("https")) return image;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    return first.startsWith("https")
      ? first
      : `http://localhost:5000${first}`;
  }
  return "https://via.placeholder.com/80";
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Lưu giỏ hàng vào localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product) => {
    dispatch({
      type: "ADD",
      payload: {
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: getImageUrl(product.image, product.images),
        fragrance: product.fragrance || null,
      },
    });
  };

  const removeItem = (id) => dispatch({ type: "REMOVE", id });
  const updateItem = (id, quantity) =>
    dispatch({ type: "UPDATE_QTY", id, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
