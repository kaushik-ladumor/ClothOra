import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isEmailFromProfile, setIsEmailFromProfile] = useState(false); // New state to track email source

  const token = localStorage.getItem("token");

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) return;
      
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const response = await fetch(`${API_URL}profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserDetails(userData);
          // Pre-fill customer info if available
          if (userData && userData.email) {
            setCustomerInfo(prev => ({
              ...prev,
              email: userData.email,
              phone: userData.phone || userData.phoneNumber || prev.phone, // Keep existing phone if no profile phone
            }));
            setIsEmailFromProfile(true); // Mark that email is from profile
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token]);

  useEffect(() => {
    // Handle navigation and data initialization
    if (!state || !state.products || state.products.length === 0) {
      navigate("/", { replace: true });
      return;
    }

    // Process products based on source
    let processedProducts = [];
    
    if (state.from === "cart" || state.from === "cart-buy-now") {
      processedProducts = state.products.map(product => ({
        ...product,
        _id: product._id || product.productId?._id,
        name: product.name || product.name || product.productId?.name || product.productId?.name,
        price: product.price || product.productId?.price || 0,
        quantity: product.quantity || 1,
        color: product.color || "Default",
        size: product.size || "Default",
        imageUrl: product.imageUrl || product.productId?.imageUrl
      }));
    } else if (state.from === "product" || state.from === "order") {
      processedProducts = state.products.map(product => ({
        ...product,
        _id: product._id || product.productId,
        name: product.name || product.title,
        price: product.price || 0,
        quantity: product.quantity || 1,
        color: product.color || "Default",
        size: product.size || "Default"
      }));
    }

    // Validate processed products
    const validProducts = processedProducts.filter(product => 
      product._id && product.name && product.price > 0
    );

    if (validProducts.length === 0) {
      console.error("No valid products found", processedProducts);
      navigate("/", { replace: true });
      return;
    }

    setProducts(validProducts);
    setIsInitialized(true);
  }, [state, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(customerInfo.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(customerInfo.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    
    if (!customerInfo.street.trim()) newErrors.street = "Street address is required";
    if (!customerInfo.city.trim()) newErrors.city = "City is required";
    if (!customerInfo.state.trim()) newErrors.state = "State is required";
    if (!customerInfo.postalCode.trim()) newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return products.reduce((acc, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 1;
      return acc + (price * quantity);
    }, 0);
  };

  const clearCartAfterOrder = async () => {
    if (!token) return;
    
    try {
      await fetch(`${API_URL}cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const getProductImage = (product) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.image) return product.image;
    if (product.images?.length) return product.images[0];
    if (product.imagesByColor?.[product.color]) return product.imagesByColor[product.color];
    if (product.productId?.imageUrl) return product.productId.imageUrl;
    if (product.productId?.images?.length) return product.productId.images[0];
    return 'https://via.placeholder.com/150';
  };

  // Format phone number for Razorpay (ensure it starts with +91)
  const formatPhoneForRazorpay = (phone) => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // If it's already 10 digits, add +91
    if (cleanPhone.length === 10) {
      return `+91${cleanPhone}`;
    }
    
    // If it starts with 91 and is 12 digits total, add +
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      return `+${cleanPhone}`;
    }
    
    // If it already starts with +91, return as is
    if (phone.startsWith('+91')) {
      return phone;
    }
    
    // Default case: assume it's an Indian number and add +91
    return `+91${cleanPhone}`;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const total = calculateTotal();
    if (total <= 0) {
      alert("Invalid order total.");
      return;
    }

    if (!token) {
      navigate("/login", { state: { from: "checkout" } });
      return;
    }

    setLoading(true);

    try {
      const orderProducts = products.map(product => ({
        name: product.name,
        color: product.color || "Default",
        size: product.size || "Default",
        quantity: Number(product.quantity) || 1,
        price: Number(product.price) || 0,
        productId: product._id,
        image: getProductImage(product)
      }));

      const orderData = {
        products: orderProducts,
        totalAmount: total,
        customerInfo: {
          email: customerInfo.email.trim(),
          phone: customerInfo.phone.trim()
        },
        shippingAddress: {
          street: customerInfo.street.trim(),
          city: customerInfo.city.trim(),
          state: customerInfo.state.trim(),
          postalCode: customerInfo.postalCode.trim(),
          country: "India"
        },
        paymentMethod,
        phoneNumber: customerInfo.phone.trim(), // This will be saved in order schema
      };

      const orderResponse = await fetch(`${API_URL}order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Order failed: ${orderResponse.status}`);
      }

      const orderResult = await orderResponse.json();
      const order = orderResult.order;

      if (!order || !order._id) {
        throw new Error("Invalid order response");
      }

      if (paymentMethod === "Online") {
        const paymentRes = await fetch(`${API_URL}order/pay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: total }),
        });

        if (!paymentRes.ok) {
          const payErr = await paymentRes.json().catch(() => ({}));
          throw new Error(payErr.message || "Failed to initiate payment");
        }

        const paymentData = await paymentRes.json();

        if (!window.Razorpay) {
          throw new Error("Razorpay not loaded. Please refresh and try again.");
        }

        // Debug: Log the phone number being sent to Razorpay
        console.log("Phone number being sent to Razorpay:", formatPhoneForRazorpay(customerInfo.phone));
        console.log("Original phone number:", customerInfo.phone);
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

        console.log(razorpayKey);
        const options = {
          key: razorpayKey,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: "Clothora",
          description: "Order Payment",
          order_id: paymentData.order_id,
          handler: async function (response) {
            try {
              await fetch(`${API_URL}order/update-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  orderId: order._id,
                  isPaid: true,
                  paymentId: response.razorpay_payment_id,
                }),
              });

              // Clear cart if order came from cart
              if (state.from === "cart") {
                await clearCartAfterOrder();
              }

              navigate("/order-confirm", {
                state: {
                  orderDetails: {
                    orderId: order._id,
                    orderDate: order.orderedAt,
                    price: total,
                    paymentMethod: "Online",
                    paymentStatus: "Paid",
                    customerEmail: customerInfo.email,
                    phoneNumber: customerInfo.phone,
                  },
                },
                replace: true,
              });
            } catch (err) {
              console.error("Payment update failed:", err);
              alert(
                "Payment successful but failed to update order. Please contact support."
              );
            }
          },
          prefill: {
            name: userDetails?.name || userDetails?.firstName || "Customer",
            email: customerInfo.email,
            contact: formatPhoneForRazorpay(customerInfo.phone), // Use the phone number from form
          },
          notes: {
            customer_phone: customerInfo.phone,
            order_id: order._id,
          },
          theme: { color: "#2B2B2B" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          console.error("Payment failed:", response);
          alert("Payment failed. Please try again.");
        });
        rzp.open();
      } else {
        // COD Order
        if (state.from === "cart") {
          await clearCartAfterOrder();
        }
        
        navigate("/order-confirm", {
          state: {
            orderDetails: {
              orderId: order._id,
              orderDate: order.orderedAt,
              price: total,
              paymentMethod: "COD",
              paymentStatus: "Pending",
              customerEmail: customerInfo.email,
              phoneNumber: customerInfo.phone
            }
          },
          replace: true
        });
      }
    } catch (err) {
      console.error("Order error:", err);
      alert(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="bg-[#2B2B2B] min-h-screen flex justify-center items-center">
        <div className="text-white text-lg">Loading checkout...</div>
      </div>
    );
  }

  // Show error if no products
  if (products.length === 0) {
    return (
      <div className="bg-[#2B2B2B] min-h-screen flex flex-col justify-center items-center">
        <div className="text-white text-lg mb-4">No products found for checkout</div>
        <button
          onClick={() => navigate("/products")}
          className="bg-white text-[#2B2B2B] px-6 py-2 rounded-lg hover:bg-gray-100"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="bg-[#2B2B2B] min-h-screen p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#2B2B2B]">Order Summary</h2>
            <div className="space-y-4">
              {products.map((product, index) => {
                const price = Number(product.price) || 0;
                const quantity = Number(product.quantity) || 1;
                const name = product.name || 'Unknown Product';
                
                return (
                  <div key={index} className="flex justify-between items-start border-b border-[#D4D4D4] pb-4">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={getProductImage(product)} 
                        alt={name} 
                        className="w-16 h-16 object-cover rounded-lg border border-[#B3B3B3]"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-[#2B2B2B]">{name}</h3>
                        <p className="text-sm text-[#B3B3B3]">
                          {product.color && `Color: ${product.color}`}
                          {product.size && ` | Size: ${product.size}`}
                          {` | Qty: ${quantity}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#2B2B2B]">₹{(price * quantity).toLocaleString()}</p>
                      <p className="text-sm text-[#B3B3B3]">₹{price.toLocaleString()} each</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-[#D4D4D4] flex justify-between text-lg font-bold text-[#2B2B2B]">
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Info + Shipping + Payment */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#2B2B2B]">Customer Information</h2>
            <div className="space-y-4 mb-6">
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={(e) => {
                    // Only allow changes if email is not from profile
                    if (!isEmailFromProfile) {
                      setCustomerInfo({ ...customerInfo, email: e.target.value });
                    }
                  }}
                  className={`w-full p-3 border rounded-lg ${errors.email ? "border-red-500" : "border-[#D4D4D4]"} ${
                    isEmailFromProfile ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                  }`}
                  disabled={isEmailFromProfile} // Disable if email is from profile
                  readOnly={isEmailFromProfile} // Make it read-only as well
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                {/* {isEmailFromProfile && (
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </p>
                )} */}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={customerInfo.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setCustomerInfo({ ...customerInfo, phone: value });
                  }}
                  className={`w-full p-3 border rounded-lg ${errors.phone ? "border-red-500" : "border-[#D4D4D4]"}`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 text-[#2B2B2B]">Shipping Address</h2>
            <div className="space-y-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={customerInfo.street}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, street: e.target.value })}
                  className={`w-full p-3 border rounded-lg ${errors.street ? "border-red-500" : "border-[#D4D4D4]"}`}
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    className={`w-full p-3 border rounded-lg ${errors.city ? "border-red-500" : "border-[#D4D4D4]"}`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State"
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                    className={`w-full p-3 border rounded-lg ${errors.state ? "border-red-500" : "border-[#D4D4D4]"}`}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={customerInfo.postalCode}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                  className={`w-full p-3 border rounded-lg ${errors.postalCode ? "border-red-500" : "border-[#D4D4D4]"}`}
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 text-[#2B2B2B]">Payment Method</h2>
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#2B2B2B] focus:ring-[#2B2B2B]"
                />
                <span className="text-[#2B2B2B]">Cash on Delivery (COD)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#2B2B2B] focus:ring-[#2B2B2B]"
                />
                <span className="text-[#2B2B2B]">Online Payment</span>
              </label>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || total <= 0}
              className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                loading || total <= 0 
                  ? "bg-[#B3B3B3] cursor-not-allowed" 
                  : "bg-[#2B2B2B] hover:bg-[#1A1A1A]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : `Place Order - ₹${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;