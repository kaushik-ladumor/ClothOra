import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Order() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { product, products } = state || {};

  // Handle navigation when no product/products data is available
  useEffect(() => {
    if (!product && !products) {
      navigate("/");
    }
  }, [product, products, navigate]);

  // Return loading or null while navigation happens
  if (!product && !products) {
    return (
      <div className="bg-[#2B2B2B] min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Redirecting...</div>
      </div>
    );
  }

  // Handle both single product (from ProductDetails) and multiple products (from Cart)
  const orderProducts = products || [product];
  const totalAmount = orderProducts.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const handleProceedToCheckout = () => {
    navigate("/checkout", {
      state: {
        products: orderProducts,
        from: state?.from || "order"
      }
    });
  };

  return (
    <div className="bg-[#2B2B2B] min-h-screen p-4 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-[#2B2B2B] mb-6">Review Your Order</h1>
         
          <div className="space-y-6 mb-8">
            {orderProducts.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg">
                <div className="md:w-1/4 bg-[#F5F5F5] p-4 rounded-lg">
                  <img
                    src={item.imagesByColor?.[item.color] || item.imageUrl || item.productId?.imageUrl}
                    alt={item.title || item.name}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="md:w-3/4">
                  <h2 className="text-xl font-bold mb-2">{item.title || item.name}</h2>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                 
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="font-medium">{item.color || "Default"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-medium">{item.size || "Default"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                 
                  <div className="border-t pt-4">
                    <p className="flex justify-between font-bold">
                      <span>Item Total</span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({orderProducts.length} item{orderProducts.length > 1 ? 's' : ''})</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
         
          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleProceedToCheckout}
              className="px-6 py-2 bg-[#2B2B2B] text-white rounded-lg font-medium hover:bg-[#1A1A1A]"
            >
              Proceed to Checkout (₹{totalAmount.toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;