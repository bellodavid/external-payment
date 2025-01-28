// components/Cart.tsx
import React from "react";
import { Product } from "@/types";

interface CartProps {
  items: Product[];
  removeFromCart: (productId: number) => void;
  totalAmount: number;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  removeFromCart,
  totalAmount,
  onCheckout,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-600">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <ul className="space-y-4 mb-4">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span className="text-gray-600">{item.name}</span>
                <div>
                  <span className="mr-4 text-gray-600">
                    N{item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-600">Total:</span>
              <span className="text-xl font-bold text-gray-600">
                N{totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-[#4c3f84] text-white px-4 py-2 rounded hover:bg-[#4c3f84] transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
