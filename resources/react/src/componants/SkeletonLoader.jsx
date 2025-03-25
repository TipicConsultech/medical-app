const ProductsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 sm:flex sm:flex-col md:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-300 rounded-lg p-4 space-y-4 animate-pulse"
          >
            <div className="h-32 bg-gray-400 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-400 rounded-md"></div>
            <div className="h-4 bg-gray-400 rounded-md w-2/3"></div>
            <div className="h-4 bg-gray-400 rounded-md w-1/3"></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ProductsSkeleton;
  