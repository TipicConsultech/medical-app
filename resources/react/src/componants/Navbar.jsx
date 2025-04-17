import React from 'react';
import cart from './../assets/icons/cart.png';
import { Link } from 'react-router-dom';

function Navbar() {
  
  return (
    <div className="sticky top-0 w-full flex items-center justify-between px-4 py-2 bg-amber-500 shadow-md z-50">
      <h1 className="text-xl font-bold text-white">Sharada Medical</h1>
      <div className="relative flex">
      
        <a href="/#/cart"><img
          src={cart}
          alt="Cart"
          className="w-8 h-8 rounded-md transition-all duration-200 hover:border hover:border-amber-950 focus:border focus:border-amber-950"
        /></a>
      </div>
    </div>
  );
}

export default Navbar;
