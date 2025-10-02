import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cart")) || [];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const item = action.payload;
      // Nếu sản phẩm đã có trong giỏ thì tăng số lượng
      const exist = state.find((p) => p.id === item.id);
      if (exist) {
        return state.map((p) =>
          p.id === item.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...state, { ...item, quantity: 1 }];
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

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Lưu giỏ hàng vào localStorage để không mất khi reload
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
        image: product.image || (product.images ? `http://localhost:5000${product.images[0]}` : ""),
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
