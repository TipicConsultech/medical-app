import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, setSortOrder } from "../util/productSlice";

const FilterModal = ({ isOpen, setIsOpen, categories }) => {
  const filters = useSelector((state) => state?.filter);
  const { selectedCategory, sortOrder } = filters || {};
  const dispatch = useDispatch();

  // Local state for temporary filter values
  const [tempCategory, setTempCategory] = useState(selectedCategory || "");
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder || "");

  // Update local state when Redux state changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTempCategory(selectedCategory || "");
      setTempSortOrder(sortOrder || "");
    }
  }, [isOpen, selectedCategory, sortOrder]);

  if (!isOpen) return null;

  // Handle apply filters
  const handleApplyFilters = () => {
    dispatch(setCategory(tempCategory));
    dispatch(setSortOrder(tempSortOrder));
    setIsOpen(false);
  };

  // Handle cancel/close
  const handleClearFilter = () => {
    dispatch(setCategory(null));
    dispatch(setSortOrder(null));
    setIsOpen(false);
  };
  const handleClose = () => {setIsOpen(false); }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filter Content */}
          <div className="p-6 space-y-6">
            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 bg-white"
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort By</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 bg-white"
                value={tempSortOrder}
                onChange={(e) => setTempSortOrder(e.target.value)}
              >
                <option value="">Sort by Price</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-4">
            <button
              onClick={handleClearFilter}
              className="w-1/2 px-4 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
             Clear Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="w-1/2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;