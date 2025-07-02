import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderDetailsModal from "./OrderDetailsModal";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8080/order/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch orders (${response.status})`);
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatStatus = (status) => {
    return status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown";
  };

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/150";
    if (image.startsWith("http")) return image;
    if (image.startsWith("data:image")) return image;
    return `http://localhost:8080/${image}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-[#D4D4D4]">
          <h1 className="text-2xl font-bold text-[#2B2B2B] mb-4">
            Error Loading Orders
          </h1>
          <p className="mb-6 text-[#2B2B2B]">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-[#2B2B2B] hover:bg-[#1A1A1A] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2B2B2B]">My Orders</h1>
          <button
            onClick={() => navigate("/")}
            className="hidden md:block bg-[#2B2B2B] hover:bg-[#1A1A1A] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#D4D4D4] text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4555/4555971.png"
              alt="No orders"
              className="w-32 h-32 mx-auto mb-6 opacity-80"
            />
            <h2 className="text-2xl font-semibold mb-3 text-[#2B2B2B]">
              No Orders Found
            </h2>
            <p className="text-[#B3B3B3] mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-[#D4D4D4] hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5">
                    <div>
                      <h2 className="text-lg font-semibold text-[#2B2B2B]">
                        Order Id - {order._id.substring(0, 8).toUpperCase()}
                      </h2>
                      <p className="text-[#B3B3B3] text-sm mt-1">
                        Placed on {formatDate(order.createdAt || order.orderedAt)}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.deliveryStatus === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.deliveryStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {formatStatus(order.deliveryStatus)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Contact Information */}
                  <div className="bg-[#F8F9FA] p-4 rounded-lg mb-5 border border-[#E9ECEF]">
                    <h3 className="text-sm font-medium text-[#6C757D] uppercase tracking-wider mb-2">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-[#6C757D]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[#2B2B2B] text-sm">
                          {order.customerInfo?.email || order.email || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-[#6C757D]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-[#2B2B2B] text-sm">
                          {order.customerInfo?.phone || order.phoneNumber || order.phone || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#D4D4D4] pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                      <div>
                        <h3 className="text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                          Total Amount
                        </h3>
                        <p className="text-lg font-semibold text-[#2B2B2B]">
                          ₹{order.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                          Payment Method
                        </h3>
                        <p className="text-lg font-semibold text-[#2B2B2B]">
                          {order.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : "Online Payment"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-[#B3B3B3] uppercase tracking-wider">
                          Payment Status
                        </h3>
                        <p className="text-lg font-semibold text-[#2B2B2B]">
                          {formatStatus(order.paymentStatus)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-xs font-medium text-[#B3B3B3] uppercase tracking-wider mb-2">
                        Products
                      </h3>
                      <div className="space-y-4">
                        {order.products?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-16 h-16 bg-[#F5F5F5] rounded overflow-hidden flex items-center justify-center">
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/150";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium text-[#2B2B2B] line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-[#B3B3B3] text-sm">
                                ₹{item.price?.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.products?.length > 2 && (
                          <p className="text-sm text-[#B3B3B3]">
                            + {order.products.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="bg-white hover:bg-[#F5F5F5] text-[#2B2B2B] border border-[#D4D4D4] px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:border-[#B3B3B3]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default MyOrders;