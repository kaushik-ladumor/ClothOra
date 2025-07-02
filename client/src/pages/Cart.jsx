import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingBuyNow, setProcessingBuyNow] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8080/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError(err.message);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, delta) => {
    try {
      const currentItem = cart.items.find(item => item.productId._id === productId);
      if (!currentItem) return;

      const newQuantity = currentItem.quantity + delta;
      if (newQuantity < 1) return;

      const response = await fetch("http://localhost:8080/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          productId, 
          quantity: delta,
          price: currentItem.price || currentItem.productId.price
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(err.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err.message);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      fetchCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.message);
    }
  };

  const buyNowItem = async (item) => {
    setProcessingBuyNow(item.productId._id);
    
    try {
      const checkoutProduct = {
        _id: item.productId._id,
        title: item.productId.name,
        name: item.productId.name,
        price: item.price || item.productId.price,
        quantity: item.quantity,
        color: item.color || "Default",
        size: item.size || "Default",
        productId: {
          _id: item.productId._id,
          title: item.productId.title,
          price: item.productId.price
        }
      };

      // Redirect to order page with the single item
      navigate("/order", { 
        state: { 
          products: [checkoutProduct],
          from: "cart-buy-now" 
        } 
      });
    } catch (err) {
      console.error("Error processing buy now:", err);
      setError("Failed to process buy now. Please try again.");
    } finally {
      setProcessingBuyNow(null);
    }
  };

  const proceedToCheckout = () => {
    const checkoutProducts = cart.items.map(item => ({
      _id: item.productId._id,
      title: item.productId.name,
      name: item.productId.name,
      price: item.price || item.productId.price,
      quantity: item.quantity,
      color: item.color || "Default",
      size: item.size || "Default",
      productId: {
        _id: item.productId._id,
        title: item.productId.title,
        price: item.productId.price
      }
    }));

    navigate("/checkout", { 
      state: { 
        products: checkoutProducts,
        from: "cart" 
      } 
    });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "cart" } });
      return;
    }
    fetchCart();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#2B2B2B]">
        <div className="text-xl text-[#D4D4D4] animate-pulse">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#2B2B2B] p-4">
        <div className="text-xl text-[#D4D4D4] mb-4">{error}</div>
        <button
          onClick={() => token ? fetchCart() : navigate("/login")}
          className="bg-[#FFFFFF] hover:bg-[#D4D4D4] text-[#2B2B2B] px-6 py-2 rounded-lg font-medium"
        >
          {token ? "Retry" : "Go to Login"}
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#2B2B2B] p-4">
        <div className="w-48 h-48 bg-[#B3B3B3] rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#2B2B2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">Your cart is empty</h2>
        <p className="text-[#B3B3B3] mb-6">Looks like you haven't added anything to your cart yet</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-[#FFFFFF] hover:bg-[#D4D4D4] text-[#2B2B2B] px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const total = cart.items.reduce((acc, item) => {
    const price = item.price || item.productId?.price || 0;
    const quantity = item.quantity || 0;
    return acc + (price * quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-[#2B2B2B] px-4 sm:px-8 py-10 text-[#FFFFFF]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#FFFFFF]">Your Shopping Cart</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-[#D4D4D4] hover:text-[#FFFFFF] flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const productPrice = item.price || item.productId.price;
              
              return (
                <div
                  key={item.productId._id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-[#3D3D3D] rounded-lg bg-[#353535] hover:bg-[#3D3D3D] transition-colors"
                >
                  <div className="w-24 h-24 bg-[#2B2B2B] rounded-lg flex items-center justify-center">
                    {item.productId.imageUrl ? (
                      <img 
                        src={item.productId.imageUrl} 
                        alt={item.productId.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#B3B3B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-[#FFFFFF]">
                      {item.productId.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-[#B3B3B3]">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                      <span>₹{productPrice.toLocaleString()} each</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-lg font-bold text-[#FFFFFF]">
                      ₹{(productPrice * item.quantity).toLocaleString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId._id, -1)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          item.quantity <= 1 
                            ? "bg-[#3D3D3D] text-[#B3B3B3] cursor-not-allowed" 
                            : "bg-[#2B2B2B] text-[#D4D4D4] hover:bg-[#3D3D3D]"
                        }`}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-[#D4D4D4] font-medium px-2 min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId._id, 1)}
                        className="w-7 h-7 bg-[#2B2B2B] text-[#D4D4D4] rounded-full flex items-center justify-center hover:bg-[#3D3D3D]"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => removeItem(item.productId._id)}
                        className="text-sm text-[#B3B3B3] hover:text-[#FFFFFF] flex items-center gap-1 px-2 py-1 rounded hover:bg-[#3D3D3D]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>

                      <button
                        onClick={() => buyNowItem(item)}
                        disabled={processingBuyNow === item.productId._id}
                        className={`text-sm px-3 py-1 rounded flex items-center gap-1 ${
                          processingBuyNow === item.productId._id
                            ? "bg-[#3D3D3D] text-[#B3B3B3] cursor-wait"
                            : "bg-[#FFFFFF] hover:bg-[#D4D4D4] text-[#2B2B2B]"
                        }`}
                      >
                        {processingBuyNow === item.productId._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-[#2B2B2B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Buy Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#353535] border border-[#3D3D3D] rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Subtotal ({cart.items.length} items)</span>
                  <span className="text-[#FFFFFF]">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Shipping</span>
                  <span className="text-[#FFFFFF]">Free</span>
                </div>
                <div className="flex justify-between border-t border-[#3D3D3D] pt-3 mt-3">
                  <span className="text-[#B3B3B3] font-medium">Total</span>
                  <span className="text-[#FFFFFF] font-bold text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                className="w-full py-3 bg-[#FFFFFF] hover:bg-[#D4D4D4] text-[#2B2B2B] rounded-lg font-semibold mb-4 transition-colors shadow-md"
              >
                Proceed to Checkout (₹{total.toLocaleString()})
              </button>

              <button
                onClick={clearCart}
                className="w-full py-2.5 text-sm text-[#B3B3B3] hover:text-[#FFFFFF] flex items-center justify-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}