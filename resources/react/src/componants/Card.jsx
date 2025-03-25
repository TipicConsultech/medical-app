import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAPICall } from "../util/api";

 
const Cards = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
 
  useEffect(() => {
    async function Data(){
    try{
    const responce=await getAPICall("/products");
    setProducts(responce.products);
      }
    catch(error){
      console.error("Error fetching products:", error);
    }}
    Data();
  }, []);
 
  useEffect(() => {
    let filtered = products;
 
    if (selectedCategory) {
      filtered = products.filter((product) => product.category === selectedCategory);
    }
 
    if (sortOrder === "low-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
 
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, sortOrder, products]);
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
 
  const handleRoute = (id) => {
    navigate(`/product-details/${id}`);
  };
 
  return (
    <div className="max-w-7xl mx-auto px-6 ">
      {/* <h1 className="text-3xl font-bold text-center mb-6">Products</h1> */}
 
      <div className="flex justify-between items-center mb-6">
        <select
          className="p-2 border rounded-lg bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
 
        <select
          className="p-2 border rounded-lg bg-white"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="low-high">Low to High</option>
          <option value="high-low">High to Low</option>
        </select>
      </div>
 
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div onClick={console.log(product.id)} key={product.id} className="bg-[#F2F2F2] shadow-lg border hover:border-gray-400  p-4 hover:bg-gray-50 hover:cursor-pointer  transition duration-300 ">
            <span className={`ml-2 text-xs px-2 py-1  ${product.stock > 5 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {product.stock > 5 ? "In Stock" : "Low Stock"}
              </span>
            <img src={product.thumbnail} alt={product.title} className="h-40 w-full  object-contain mb-4 rounded-md" />
            <h2 className="text-lg font-semibold truncate">{product.title}</h2>
            <p className="text-gray-500 text-sm">{product.brand}</p>
            <p className="text-xl font-bold mt-2">${product.price}</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-yellow-400 text-sm font-bold">{product.rating} ★</span>
              
            </div>
            <div className="flex gap-2">
            <button
              onClick={() => handleRoute(product.id)}
              className="mt-4 bg-gradient-to-r bg-black text-white px-2 py-2  hover:from-purple-600 hover:to-blue-600 transition-transform transform hover:scale-105 duration-300 w-full shadow-md"
            >
             Show Product 
            </button>
           
            </div>
          </div>
        ))}
      </div>
 
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg mx-2 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg mx-2 disabled:opacity-50"
          disabled={indexOfLastItem >= filteredProducts.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
 
export default Cards;
 
 