import React, { useState } from 'react';
import { put } from '../util/api';

const CartCard = ({ item, cartData }) => {
  const decreaseQuantity = async (qty) => {
    if (qty > 1) {
      let newQty = qty - 1;
      const response = await put(`/api/cart/${item.id}`, { qty: newQty });
      cartData();
    }
  };

  const increaseQuantity = async (qty) => {
    let newQty = qty + 1;
    const response = await put(`/api/cart/${item.id}`, { qty: newQty });
    cartData();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4 w-full max-w-md mx-auto my-2">
      <img
        src={item.product.thumbnail}
        alt={item.product.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h2 className="text-base font-semibold">{item.product.title}</h2>
        <p className="text-sm text-gray-500">${item.product.price}</p>
        <div className="flex items-center mt-2 space-x-2">
          <button
            onClick={() => decreaseQuantity(item.qty)}
            disabled={item.qty <= 1}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
          >
            -
          </button>
          <span className="text-sm font-medium">{item.qty}</span>
          <button
            onClick={() => increaseQuantity(item.qty)}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
