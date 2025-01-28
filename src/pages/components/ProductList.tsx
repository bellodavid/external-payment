/* eslint-disable */
// @ts-nocheck

import React from "react";
import { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, addToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl text-gray-600 font-semibold mb-2">
              {product.name}
            </h2>
            <p className="text-gray-600 mb-4">N{product.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-[#4c3f84] text-white px-4 py-2 rounded hover:bg-[#4c3f84] transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
