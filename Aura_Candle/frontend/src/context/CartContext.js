import React, { createContext, useReducer, useContext } from "react";

const CartContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      // Nếu sp đã có thì tăng quantity
      const exist = state.find((i) => i.id === action.item.id);
      if (exist) {
        return state.map((i) =>
          i.id === action.item.id
            ? { ...i, quantity: (i.quantity || 1) + (action.item.quantity || 1) }
            : i
        );
      }
      return [...state, { ...action.item, quantity: action.item.quantity || 1 }];

    case "REMOVE":
      return state.filter((i) => i.id !== action.id);

    case "UPDATE_QTY":
      return state.map((i) =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(reducer, []);
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
