import React, { useState } from 'react';
import { deleteAPICall, put } from '../util/api';
import info from "./../assets/icons/info.png";
import remove from "./../assets/icons/delete.png"

const CartCard = ({ item, cartData }) => {
  const decreaseQuantity = async (qty) => {
    if (qty > 1) {
      let newQty = qty - 1;
      const response = await put(`/api/cart/${item.id}`, { qty: newQty });
      cartData();
    }
  };

  const removeProduct = async () => {
      const response = await deleteAPICall(`/api/cart/${item.id}`);
      cartData();
    }

  const increaseQuantity = async (qty) => {
    let newQty = qty + 1;
    const response = await put(`/api/cart/${item.id}`, { qty: newQty });
    cartData();
  };

  function Weights(weight,weightType,qty){
    if(qty==1){
      weightType == "gm"? "gram":"ml";
      return Math.floor(weight)+" "+weightType;
    }
    else{
      let str="tablets in 1 strip"
      return qty +" " + str;
    } 
  }

  function price (price,qty){
   
    const PriceQty=price*qty;
    return PriceQty.toFixed(2);
    }
    function discountPrice(price,discount,qty){
        const discountedPrice = price - (price * (discount / 100));
        const dPriceQty=discountedPrice*qty;
     return dPriceQty.toFixed(2);
       
        }

  

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4 w-full max-w-md  mx-auto my-2">
      <img
        src={item.product.thumbnail}
        alt={item.product.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        {/* <h2 className="text-base font-semibold">{item.product.title}</h2> */}
        <p className="text-sm text-gray-500 mb-3">{item.product.manufacturer} &nbsp; &nbsp;<span className="inline-flex items-center px-2.5 py-0.8 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{Weights(item.product.weight,item.product.weight_type,item.product.qty)}</span></p>

        <div className="flex items-center space-x-3">
<span className="text-xl font-bold text-gray-900">₹{discountPrice(item.product.price,item.product.discount_percentage,item.qty)}</span>

                {item.product.discount_percentage > 0 && (
<>
<span className="text-lg text-gray-500 line-through">₹{price(item.product.price,item.qty)}</span>
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">

                      {item.product.discount_percentage}% OFF
</span>
</>

                )}
</div>
{item.product.schedule_h=== true && (
    <div className='flex mb-3'>
    <img src={info} className='h-5 w-5 mt-1 mr-2' alt="info"/>
    <h1 className='text-sm text-stone-600'>Prescription required to buy this medicine.</h1>
</div>
    )
}
        <div className="flex items-center mt-2 space-x-2">
{
    item.qty=== 1 ?(<>
     <button
            onClick={() => removeProduct()}
           
          >
           <img src={remove} className='h-6 w-6'/>
          </button>
    </>):(<>
          <button
            onClick={() => decreaseQuantity(item.qty)}
            disabled={item.qty <= 1}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
             >
            -
            </button>
           </>)
          }
       
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
