import React, { useState, useEffect } from "react";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Show notification popup
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    const API_URL = import.meta.env.VITE_API_KEY;
    fetch(`${API_URL}/admin/product`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setIsLoading(false);
        showNotification("Failed to load products", "error");
      });
  };

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((product) =>
        product.category.includes(selectedCategory)
      );
    }

    setFilteredData(result);
  }, [searchTerm, selectedCategory, products]);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setDeleteId(productId);
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/admin/product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      showNotification('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.error(err);
      showNotification(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const toggleStockStatus = async (id, currentStock) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/product/${id}/toggle-stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ stock: !currentStock }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, stock: updated.stock } : p))
        );
        setFilteredData((prev) =>
          prev.map((p) => (p._id === id ? { ...p, stock: updated.stock } : p))
        );
        showNotification(`Stock status updated to ${updated.stock ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (error) {
      console.error("Error toggling stock status:", error);
      showNotification('Failed to update stock status', 'error');
    }
  };

  const categories = ["all", ...new Set(products.flatMap((p) => p.category))];

  return (
    <div className="min-h-screen bg-[#2B2B2B] p-4 md:p-8 relative">
      {/* Notification Popup */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${
          notification.type === 'error' 
            ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
            : 'bg-green-100 border-l-4 border-green-500 text-green-700'
        }`}>
          <svg 
            className={`h-6 w-6 mr-2 ${notification.type === 'error' ? 'text-red-500' : 'text-green-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={notification.type === 'error' ? 
                "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" : 
                "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              } 
            />
          </svg>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ ...notification, show: false })}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-1">Manage Products</h1>
            <p className="text-[#B3B3B3] text-sm">
              {products.length} {products.length === 1 ? 'product' : 'products'} in inventory
            </p>
          </div>

          {/* Search and Filter */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[#B3B3B3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-[#2B2B2B] border border-[#D4D4D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3B3B3] text-[#FFFFFF] placeholder-[#B3B3B3]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 bg-[#2B2B2B] border border-[#D4D4D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3B3B3] text-[#FFFFFF]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-[#2B2B2B]"
                >
                  {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFFFFF]"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 bg-[#2B2B2B] rounded-lg border border-[#D4D4D4]">
            <svg
              className="mx-auto h-12 w-12 text-[#B3B3B3]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-[#FFFFFF]">No products found</h3>
            <p className="mt-1 text-[#B3B3B3]">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter"
                : "No products available in inventory"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredData.map((product) => (
              <div
                key={product._id}
                className="bg-[#FFFFFF] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#D4D4D4]"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 sm:h-56 bg-[#F5F5F5] flex items-center justify-center group">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/300x300?text=No+Image"}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                      product.stock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock ? "IN STOCK" : "OUT OF STOCK"}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-[#2B2B2B] line-clamp-2 h-14">
                      {product.title}
                    </h2>
                    <span className="text-lg font-bold text-[#2B2B2B] whitespace-nowrap ml-2">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.category.map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-1 bg-[#D4D4D4] text-[#2B2B2B] text-xs rounded-full font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <p className="text-[#666666] text-sm mb-4 line-clamp-2 h-10">
                    {product.description}
                  </p>

                  {/* Controls */}
                  <div className="flex justify-between items-center border-t border-[#D4D4D4] pt-3">
                    <span className="text-xs text-[#B3B3B3] font-mono">
                      ID: {product._id.slice(-6).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={product.stock}
                            onChange={() =>
                              toggleStockStatus(product._id, product.stock)
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B2B2B]"></div>
                        </div>
                      </label>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={isDeleting && deleteId === product._id}
                        className="text-xs bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1 disabled:opacity-50"
                      >
                        {isDeleting && deleteId === product._id ? (
                          <>
                            <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
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

export default ManageProducts;