import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Zap, Loader2, Check, X } from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [imageGallery, setImageGallery] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Show notification popup
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_KEY;
        const response = await fetch(`${API_URL}product/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        setProduct(data);
        setSelectedColor(data.colors?.[0] || null);
        setSelectedSize(data.sizes?.[0] || null);
        
        let initialImages = [];
        
        if (data.imagesByColor && data.colors?.[0] && data.imagesByColor[data.colors[0]]) {
          initialImages = Array.isArray(data.imagesByColor[data.colors[0]])
            ? data.imagesByColor[data.colors[0]]
            : [data.imagesByColor[data.colors[0]]];
        } else if (Array.isArray(data.images)) {
          initialImages = data.images;
        } else if (data.imageUrl) {
          initialImages = [data.imageUrl];
        } else {
          initialImages = ["https://via.placeholder.com/800?text=No+Image+Available"];
        }

        setImageGallery(initialImages);
        setMainImage(initialImages[0]);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
        showNotification('Failed to load product details', 'error');
        setImageGallery(["https://via.placeholder.com/800?text=Product+Not+Found"]);
        setMainImage("https://via.placeholder.com/800?text=Product+Not+Found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (selectedColor && product?.imagesByColor?.[selectedColor]) {
      const newImages = Array.isArray(product.imagesByColor[selectedColor])
        ? product.imagesByColor[selectedColor]
        : [product.imagesByColor[selectedColor]];
      setImageGallery(newImages);
      setMainImage(newImages[0]);
    }
  }, [selectedColor, product]);

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      showNotification("Please select color and size before adding to cart", 'error');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Please login to add items to cart", 'error');
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_KEY;
      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity,
          color: selectedColor,
          size: selectedSize,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("Product added to cart successfully!");
      } else {
        showNotification(data.message || "Could not add to cart", 'error');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("Failed to add product to cart", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      showNotification("Please select color and size before proceeding", 'error');
      return;
    }

    navigate("/order", {
      state: {
        product: {
          ...product,
          color: selectedColor,
          size: selectedSize,
          quantity: quantity,
        },
      },
    });
  };

  if (loading && !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-700 animate-spin mx-auto" />
          <p className="mt-4 text-lg text-gray-700">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Notification Popup */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${
          notification.type === 'error' 
            ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
            : 'bg-green-100 border-l-4 border-green-500 text-green-700'
        }`}>
          {notification.type === 'error' ? (
            <X className="h-5 w-5 mr-2 text-red-500" />
          ) : (
            <Check className="h-5 w-5 mr-2 text-green-500" />
          )}
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ ...notification, show: false })}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Products</span>
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row border border-gray-200">
          {/* Image Gallery Section */}
          <div className="lg:w-1/2 p-6 md:p-8">
            <div className="sticky top-8">
              {/* Main Image */}
              <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-opacity duration-300"
                  onLoad={(e) => e.target.classList.remove("opacity-0")}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800?text=Image+Error";
                  }}
                  loading="lazy"
                />
              </div>

              {/* Thumbnail Gallery */}
              {Array.isArray(imageGallery) && imageGallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {imageGallery.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        mainImage === img
                          ? "border-gray-800 scale-105"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200?text=Image+Error";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {product.category?.join(" • ") || "Uncategorized"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price?.toLocaleString() || "N/A"}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-sm bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                {product.taxInfo && (
                  <p className="text-sm text-gray-500 mt-1">
                    {product.taxInfo}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          selectedSize === size
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Select Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === color
                            ? "border-gray-900 scale-110 shadow-md"
                            : "border-gray-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <Check className="w-5 h-5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4 w-fit border border-gray-200 rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-medium text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock && quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleAddToCart}
                disabled={loading || !product.stock}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-300 text-gray-700 cursor-wait"
                    : product.stock
                    ? "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md"
                    : "bg-gray-200 text-gray-700 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                {!product.stock
                  ? "Out of Stock"
                  : loading
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.stock || loading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  product.stock && !loading
                    ? "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50"
                    : "bg-gray-200 text-gray-700 cursor-not-allowed"
                }`}
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;