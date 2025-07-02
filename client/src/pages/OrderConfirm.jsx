import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function OrderConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = state || {};

  if (!orderDetails) {
    navigate("/");
    return null;
  }

  return (
    <div className="bg-[#2B2B2B] min-h-screen p-4 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#2B2B2B] mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg mb-6">
            Thank you for your purchase. Your order has been received.
          </p>
          
          <div className="bg-[#F5F5F5] rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Order ID:</span> {orderDetails.orderId}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(orderDetails.orderDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Total:</span> ₹
                {orderDetails.price.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {orderDetails.paymentMethod === "Online"
                  ? "Online Payment"
                  : "Cash on Delivery"}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-[#2B2B2B] text-white rounded-lg font-medium hover:bg-[#1A1A1A]"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="px-6 py-2 border border-[#2B2B2B] rounded-lg font-medium hover:bg-[#F5F5F5]"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;