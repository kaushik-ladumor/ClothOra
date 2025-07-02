import React, { useEffect, useState } from "react";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    fetch("http://localhost:8080/admin/product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setIsLoading(false);
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

      alert("✅ Product deleted successfully");
      fetchProducts();
    } catch (err) {
      alert("❌ " + err.message);
      console.error(err);
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
      }
    } catch (error) {
      console.error("Error toggling stock status:", error);
    }
  };

  const categories = ["all", ...new Set(products.flatMap((p) => p.category))];

  return (
    <div className="min-h-screen bg-[#2B2B2B] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">Manage Products</h1>

          {/* Search and Filter */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 bg-[#2B2B2B] border border-[#D4D4D4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FFFFFF] text-[#FFFFFF] placeholder-[#B3B3B3]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-[#B3B3B3]"
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

            <select
              className="px-4 py-2 bg-[#2B2B2B] border border-[#D4D4D4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FFFFFF] text-[#FFFFFF]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-[#2B2B2B]"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
            <p className="text-[#B3B3B3] text-lg">
              No products found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredData.map((product) => (
              <div
                key={product._id}
                className="bg-[#FFFFFF] rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full h-48 sm:h-56 bg-[#D4D4D4] flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain p-4"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock
                        ? "bg-[#2B2B2B] text-[#FFFFFF]"
                        : "bg-[#B3B3B3] text-[#2B2B2B]"
                    }`}
                  >
                    {product.stock ? "IN STOCK" : "OUT OF STOCK"}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-[#2B2B2B] line-clamp-1">
                      {product.title}
                    </h2>
                    <span className="text-[#2B2B2B] font-bold">₹{product.price}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.category.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-[#D4D4D4] text-[#2B2B2B] text-xs rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <p className="text-[#B3B3B3] text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Controls */}
                  <div className="flex justify-between items-center border-t border-[#D4D4D4] pt-3">
                    <span className="text-xs text-[#B3B3B3]">
                      ID: {product._id.slice(-6)}
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
                          <div className="w-11 h-6 bg-[#B3B3B3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#FFFFFF] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#FFFFFF] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B2B2B]"></div>
                        </div>
                      </label>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-xs bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] px-3 py-1 rounded transition-colors"
                      >
                        Delete
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