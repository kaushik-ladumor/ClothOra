import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Products() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    setIsLoading(true);
    const API_URL = import.meta.env.VITE_API_KEY;
    fetch(`${API_URL}product`)
      .then((res) => res.json())
      .then((products) => {
        setData(products);
        if (category) {
          const filtered = products.filter((p) =>
            p.category.includes(category.toLowerCase())
          );
          setFilteredData(filtered);
        } else {
          setFilteredData(products);
        }
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setIsLoading(false));
  }, [category]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#2B2B2B]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4D4D4] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-[#B3B3B3]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2B2B2B] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-2">
            {category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
              : "Our Collection"}
          </h1>
          <div className="w-20 h-1 bg-[#D4D4D4] mx-auto"></div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-[#B3B3B3] text-lg mb-4">
              No products found in this category.
            </div>
            <Link
              to="/products"
              className="inline-block px-6 py-2 bg-[#FFFFFF] hover:bg-[#D4D4D4] text-[#2B2B2B] font-medium rounded transition duration-200"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((product) => (
              <div
                key={product._id}
                className={`bg-[#FFFFFF] rounded-lg overflow-hidden hover:translate-y-[-4px] transition duration-300 flex flex-col ${
                  !product.stock ? "opacity-70" : ""
                }`}
              >
                <div className="relative pt-[100%] bg-[#F5F5F5]">
                  <div className="absolute inset-0 p-4 flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300?text=Product+Image";
                      }}
                    />
                  </div>
                  {!product.stock && (
                    <div className="absolute top-3 right-3 bg-[#2B2B2B] text-[#FFFFFF] text-xs font-bold px-3 py-1 rounded-full">
                      Sold Out
                    </div>
                  )}
                  {product.stock && product.stock < 10 && (
                    <div className="absolute top-3 left-3 bg-[#2B2B2B] text-[#FFFFFF] text-xs font-bold px-3 py-1 rounded-full">
                      Low Stock
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 border-t border-[#D4D4D4]">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[#2B2B2B] mb-1 line-clamp-1">
                      {product.title}
                    </h2>
                    <p className="text-xs text-[#B3B3B3] mb-2 uppercase tracking-wider">
                      {product.category.join(" • ")}
                    </p>
                    <p className="text-sm text-[#2B2B2B] mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-[#2B2B2B]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.stock && (
                        <span className="text-xs text-[#B3B3B3]">
                          {product.stock} left
                        </span>
                      )}
                    </div>
                    {product.stock ? (
                      <Link
                        to={`/products/${product._id}`}
                        className="block w-full text-center bg-[#2B2B2B] hover:bg-[#1A1A1A] text-[#FFFFFF] font-medium py-2 px-4 rounded transition duration-200"
                      >
                        View Details
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[#D4D4D4] text-[#2B2B2B] font-medium py-2 px-4 rounded cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;