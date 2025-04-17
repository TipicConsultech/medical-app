import React, { useEffect, useState } from 'react';
import CartCard from '../componants/CartCard';
import { getAPICall, logout } from '../util/api';
import emptyCart from "./../assets/emptyCart.png"
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser, isLogIn } from '../util/session';
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmptyMsg, setShowEmptyMsg] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const location = useLocation();
   const user= getUser();
  const navigate=useNavigate();
    useEffect(() => {
      if (isLogIn()) {
        setLoginStatus(true);
      }
    }, []);
  async function cartData() {
    setLoading(true);
    const response = await getAPICall(`/api/cart?customer_id=${user.id}`);
    setCartItems(response);
    setLoading(false);

    // If response is empty, show "empty cart" message after a short delay
    if (response.length === 0) {
      setTimeout(() => {
        setShowEmptyMsg(true);
      }, 1500); // Adjust delay as needed
    }
  }

  useEffect(() => {
    cartData();
  }, []);


 async function proceedToPay(){
    try{
      const responce=await getAPICall("/api/proceedToPay");
      if(responce.prescription===true){
        navigate("/prescriptionUpload");
      }else if(responce.prescription===false){
        navigate("/address");
      }
    }
    catch(e){
        console.log(e);
        
    }
 }

  return (
    <>
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Your Cart</h1>

      {loginStatus === true ? (
  loading ? (
    <div className="flex justify-center items-center mt-10">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-amber-500"></div>
    </div>
  ) : cartItems.length === 0 && showEmptyMsg ? (
    <div className="flex-1 align-middle justify-center">
      <img src={emptyCart} alt="Empty Cart" />
      <div className="text-center font-bold text-gray-600 mt-10">Your cart is empty !!</div>
    </div>
  ) : (
    cartItems.map((item) => (
      <div key={item.id}>
        <CartCard item={item} cartData={cartData} />
      </div>
    ))
  )
) : (
  <div className='flex flex-col  align-middle'>
    <h1 className="mb-3 text-center">Please Login to See Cart</h1>
    <button className="border rounded-xl p-2" onClick={()=>  navigate(`/login?currentPage=${location.pathname}`)}>Login</button>
  </div>
)}


      
    </div>
    {cartItems.length !== 0 && !showEmptyMsg && (<div className='flex justify-center gap-3 bg-white'>
    <button onClick={logout} className='text-xl font-bold bottom-10 border px-3 py-2 border-2 ml-4 rounded-lg'>logout </button>

    <button onClick={proceedToPay} className='text-xl font-bold mr-4 bottom-10 border px-3 py-2 rounded-lg'>Proceed to Pay </button>

    </div>) }
    
    </>
  );
}

export default Cart;
