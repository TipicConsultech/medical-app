import React, { useState, useEffect } from 'react';

import { Link, useParams } from 'react-router-dom';
import { getAPICall } from '../util/api';
 
const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [productPrice,setProductPrice]=useState(0);
  const [discountPrice,setDiscountPrice]=useState(0);
  const { id } = useParams();
  useEffect(() => {
    const fetchData=async()=>{
      try {
        const response = await getAPICall(`/api/products/${id}`);
        setProduct(response?.product);
        setProductPrice(response?.product?.price)
        setDiscountPrice(response?.product?.price - (response?.product?.price * (response?.product?.discount_percentage / 100)))
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    // async function fetchData() {
     
    // }
    fetchData();
  }, [id]);
 
  if (!product) {
    return (
    <div className="min-h-screen flex items-center justify-center">
     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    );
  }
  const discountedPrice = product?.price - (product?.price * (product?.discount_percentage / 100));

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

  function price (price,discount,qty){
  const discountedPrice = price - (price * (discount / 100));
  const dPriceQty=discountedPrice*qty;
  const PriceQty=price*qty;
  setProductPrice(PriceQty);
  setDiscountPrice(dPriceQty);
  }
     
  return (
     <div className="min-h-screen bg-gray-50">

      {/* Navigation */}
     <nav className="sticky top-0 z-50 bg-white shadow-sm backdrop-blur-md bg-opacity-80">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="flex items-center justify-between h-16">
     <Link to="/">
     <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition">
     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
     </svg>
     <span>Back</span>
     </button>
     </Link>
     </div>
     </div>
     </nav>
 
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">

          {/* Image gallery */}
<div className="flex flex-col">
<div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
<img

                src={product.images[activeImage]}

                alt={product.title}

                className="w-full h-full object-center object-cover hover:scale-105 transition-transform duration-300"

              />
</div>

            {/* Image selector */}
<div className="mt-4 grid grid-cols-4 gap-2">

              {product?.images.map((image, index) => (
<button

                  key={index}

                  onClick={() => setActiveImage(index)}

                  className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${

                    activeImage === index ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'

                  }`}
>
<img src={image} alt="" className="w-full h-full object-center object-cover" />
</button>

              ))}
</div>
</div>
 
          {/* Product info */}
<div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
<h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>
<div className="mt-3">
{/* <p className="text-lg text-gray-500">{product?.manufacturer}</p> */}
<p className="text-sm text-gray-500 mb-3">{product.manufacturer} &nbsp; &nbsp;<span className="inline-flex items-center px-2.5 py-0.8 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{Weights(product.weight,product.weight_type,product.qty)}</span></p>

</div>

 
            {/* Rating */}
{/* <div className="mt-4 flex items-center space-x-2">
<div className="flex text-lg">{renderStars(product.rating)}</div>
<span className="text-sm text-gray-600">({product.rating} / 5)</span>
</div> */}
 
            {/* Price */}
<div className="mt-6">
<div className="flex items-center space-x-3">
<span className="text-3xl font-bold text-gray-900">₹{discountPrice.toFixed(2)}</span>

                {product.discount_percentage > 0 && (
<>
<span className="text-lg text-gray-500 line-through">₹{productPrice}</span>
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">

                      {product.discount_percentage}% OFF
</span>
</>

                )}
</div>
</div>
 
            {/* Stock status */}
<div className="mt-6 flex items-center space-x-2">
<span className={`inline-block w-2 h-2 rounded-full ${

                product.available== true ? 'bg-green-500' : 'bg-red-500'

              }`}></span>
<span className={`text-sm font-medium ${

               product.available== true  ? 'text-green-700' : 'text-red-700'
              }`}>
                {product.available== true ? 'In Stock' : 'Low Stock'}
</span>
</div>
 
            {/* Quantity selector and Add to cart */}
<div className="mt-8">
{/* <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"> */}
<div className="flex justify-center  space-y-4  gap-7">

<div className="flex justify-start items-center border border-gray-300 rounded-md">
<button

                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"

                    onClick={() => {
                      setQuantity(Math.max(1, quantity - 1))
                      price (product.price,product.discount_percentage,Math.max(1, quantity - 1))
                    }}
>

                    -
</button>
<span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
<button

                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"

                    // onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    onClick={() =>{ setQuantity(Math.min(quantity + 1))
                          price(product.price,product.discount_percentage,Math.min(quantity + 1))
                    }}

>

                    +
</button>
</div>
<button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out flex items-center justify-center space-x-2">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
</svg>
<span>Add to Cart</span>
</button>
</div>
</div>
 
            {/* Description */}
<div className="mt-8">
<h3 className="text-lg font-medium text-gray-900">Description</h3>
<div className="mt-4 prose prose-sm text-gray-500">
<p>

                  {showFullDescription ? product.description : `${product.description.slice(0, 300)}...`}
</p>
<button

                  className="mt-2 text-blue-600 hover:text-blue-800 transition"

                  onClick={() => setShowFullDescription(!showFullDescription)}
>

                  {showFullDescription ? 'Show less' : 'Read more'}
</button>
</div>
</div>
 
            {/* Shipping & Returns */}
<div className="mt-8 border-t border-gray-200 pt-8">
<div className="space-y-4">
<div className="flex items-center space-x-3">
<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
</svg>
<span className="text-sm text-gray-600">Free shipping on orders over ₹100</span>
</div>
<div className="flex items-center space-x-3">
<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
</svg>
<span className="text-sm text-gray-600">30-day return policy</span>
</div>
</div>
</div>
</div>
</div>
 
        {/* Reviews */}
{/* <div className="mt-16">
<h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
<div className="mt-6 space-y-6"> */}

            {/* {product.reviews.map((review, index) => (
<div key={index} className="border-b border-gray-200 pb-6">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<div className="flex text-yellow-400">

                      {renderStars(review.rating)}
</div>
<p className="text-sm font-medium text-gray-900">{review.reviewerName}</p>
</div>
<p className="text-sm text-gray-500">

                    {new Date(review.date).toLocaleDateString()}
</p>
</div>
<p className="mt-4 text-gray-600">{review.comment}</p>
</div>

            ))} */}
{/* </div> */}
{/* </div> */}
</main>
</div>

  );

};
 
export default ProductDetail;
 