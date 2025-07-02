import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Zap, Loader2 } from "lucide-react";

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/product/${id}`);
        
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
      alert("Please select color and size before adding to cart.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/cart/add", {
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
        alert("✅ Product added to cart!");
      } else {
        alert(data.message || "⚠️ Could not add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select color and size before proceeding.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to proceed with your order");
      navigate("/login");
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
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2B2B2B] animate-spin mx-auto" />
          <p className="mt-4 text-lg text-[#2B2B2B]">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
        <div className="text-center p-6 bg-[#FFFFFF] rounded-lg shadow-md max-w-md border border-[#D4D4D4]">
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-2">Error Loading Product</h2>
          <p className="text-[#2B2B2B] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#2B2B2B] text-[#FFFFFF] rounded hover:bg-[#1A1A1A] transition"
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
    <div className="bg-[#FFFFFF] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#2B2B2B] hover:text-[#1A1A1A] transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Products</span>
        </button>

        <div className="bg-[#FFFFFF] rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row border border-[#D4D4D4]">
          {/* Image Gallery Section */}
          <div className="lg:w-1/2 p-6 md:p-8">
            <div className="sticky top-8">
              {/* Main Image */}
              <div className="relative aspect-square w-full bg-[#F5F5F5] rounded-lg overflow-hidden mb-4">
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
                          ? "border-[#2B2B2B] scale-105"
                          : "border-[#D4D4D4] hover:border-[#B3B3B3]"
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
                <h1 className="text-2xl md:text-3xl font-bold text-[#2B2B2B] mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F0F0] text-[#2B2B2B]">
                    {product.category?.join(" • ") || "Uncategorized"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock
                        ? "bg-[#E8F5E9] text-[#2B2B2B]"
                        : "bg-[#FFEBEE] text-[#2B2B2B]"
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
                  <span className="text-3xl font-bold text-[#2B2B2B]">
                    ₹{product.price?.toLocaleString() || "N/A"}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-[#B3B3B3] line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-sm bg-[#E0E0E0] text-[#2B2B2B] px-2 py-0.5 rounded">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                {product.taxInfo && (
                  <p className="text-sm text-[#B3B3B3] mt-1">
                    {product.taxInfo}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <p className="text-[#2B2B2B] leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#2B2B2B] mb-3">
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#2B2B2B] mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-[#2B2B2B]">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#2B2B2B] mb-3">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          selectedSize === size
                            ? "bg-[#2B2B2B] text-[#FFFFFF] shadow-md"
                            : "bg-[#F5F5F5] text-[#2B2B2B] hover:bg-[#E0E0E0]"
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
                  <h3 className="text-lg font-semibold text-[#2B2B2B] mb-3">
                    Select Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === color
                            ? "border-[#2B2B2B] scale-110 shadow-md"
                            : "border-[#D4D4D4] hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#2B2B2B] mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4 w-fit border border-[#D4D4D4] rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-[#F5F5F5] rounded-full hover:bg-[#E0E0E0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-medium text-[#2B2B2B]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock && quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center bg-[#F5F5F5] rounded-full hover:bg-[#E0E0E0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#D4D4D4]">
              <button
                onClick={handleAddToCart}
                disabled={loading || !product.stock}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-[#B3B3B3] text-[#2B2B2B] cursor-wait"
                    : product.stock
                    ? "bg-[#2B2B2B] text-[#FFFFFF] hover:bg-[#1A1A1A] hover:shadow-md"
                    : "bg-[#D4D4D4] text-[#2B2B2B] cursor-not-allowed"
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
                    ? "bg-[#FFFFFF] text-[#2B2B2B] border-2 border-[#2B2B2B] hover:bg-[#F5F5F5]"
                    : "bg-[#D4D4D4] text-[#2B2B2B] cursor-not-allowed"
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