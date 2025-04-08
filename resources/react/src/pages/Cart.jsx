import React, { useEffect, useState } from 'react'
import CartCard from '../componants/CartCard';
import { getAPICall } from '../util/api';

function Cart() {
    const [cartItems,setCartItems]=useState([]);


 async function cartData(){
        const responce=await getAPICall("/api/cart?customer_id=1");
        setCartItems(responce);
        }
useEffect(()=>{
cartData();
},[])
  return (
    <div className="min-h-screen bg-gray-100 p-4">
    <h1 className="text-xl font-bold mb-4 text-center">Your Cart</h1>
    {cartItems.map(item => (
      <CartCard key={item.id} item={item} cartData={cartData} />
    ))}
  </div>
  )
}

export default Cart
