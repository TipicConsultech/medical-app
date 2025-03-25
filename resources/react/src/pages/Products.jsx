import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FilterModal from "../componants/FilterModel";
import ProductsSkeleton from "../componants/skeletonLoader";
import { getAPICall } from "../util/api";

const Products = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [query, setQuery] = useState("");
  const { selectedCategory } = useSelector((state) => state?.filters);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAPICall(`/api/products?page=${currentPage}`);
        setProducts(response?.products?.data || []);
        setCurrentPage(response?.products?.current_page);
        setLastPage(response?.products?.last_page);
        setCategories([...new Set(response?.products?.data?.map((p) => p.category))]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    if (query.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [products, selectedCategory, query]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <FilterModal isOpen={isOpen} setIsOpen={setIsOpen} categories={categories} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-96 relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-12 py-3 rounded-xl border border-gray-300 shadow-lg"
              placeholder="Search products..."
            />
          </div>
          <button onClick={() => setIsOpen(true)} className="px-6 py-3 bg-white rounded-xl shadow-lg border">
            Filter
          </button>
        </div>
        {filteredProducts.length === 0 ? (
          <ProductsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => console.log(product.id)}
                className="group bg-white  overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-400"
              >
                <div className="relative h-64 overflow-hidden bg-gray-50">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full  object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center px-3 py-1  text-xs font-medium ${
                        product.available == true
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {product.available === true  ? "In Stock" : "Low Stock"}
                    </span>
                  </div>
                </div>
      
                <div className="py-6 px-6">
                  <h2 className="text-lg font-semibold text-gray-800 truncate mb-1">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">{product.manufacturer}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {/* <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-medium text-gray-600">
                        {product.rating}
                      </span>
                    </div> */}
                  </div>
      
                  <button
                    onClick={() => {console.log(hi);}
                    /*handleRoute(product.id)*/}
                    className="w-full py-3 px-4 bg-gradient-to-r hover:from-[#42A5F6] hover:to-[#42A5F6] text-white  font-medium from-blue-500 to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center mt-6 mb-10">
      <button
        className={`px-3 py-2 rounded-md text-white ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`px-3 py-2 rounded-md ${
            currentPage === page
              ? "bg-blue-700 text-white font-bold"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`px-3 py-2 rounded-md text-white ${
          currentPage === lastPage
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={currentPage === lastPage}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        &gt;
      </button>
      </div>
    </div>
  );
};

export default Products;