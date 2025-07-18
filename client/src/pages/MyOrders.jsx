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
        const API_URL = import.meta.env.VITE_API_KEY;
        const response = await fetch(`${API_URL}order/all`, {
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

  const API_URL = import.meta.env.VITE_API_KEY;
  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/150";
    if (image.startsWith("http")) return image;
    if (image.startsWith("data:image")) return image;
    return `h${API_URL}${image}`;
  };

  const getCustomerEmail = (order) => {
    return order.customerInfo?.email || order.email || "Not provided";
  };

  const getCustomerPhone = (order) => {
    return order.customerInfo?.phone || order.phoneNumber || order.phone || "Not provided";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Orders
          </h1>
          <p className="mb-6 text-gray-800">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <button
            onClick={() => navigate("/")}
            className="hidden md:block bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4555/4555971.png"
              alt="No orders"
              className="w-32 h-32 mx-auto mb-6 opacity-80"
            />
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              No Orders Found
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
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
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Order Id - {order._id?.substring(0, 8) || "N/A"}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Placed on {formatDate(order.createdAt || order.orderedAt)}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.deliveryStatus === "delivered"
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
                  <div className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-500"
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
                        <span className="text-gray-800 text-sm">
                          {getCustomerEmail(order)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-500"
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
                        <span className="text-gray-800 text-sm">
                          {getCustomerPhone(order)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </h3>
                        <p className="text-lg font-semibold text-gray-800">
                          ₹{order.totalAmount?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </h3>
                        <p className="text-lg font-semibold text-gray-800">
                          {order.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : "Online Payment"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </h3>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatStatus(order.paymentStatus)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Products
                      </h3>
                      <div className="space-y-4">
                        {order.products?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                              <img
                                src={getImageUrl(item.image || item.imageUrl)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/150";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium text-gray-800 line-clamp-1">
                                {item.name || item.productName}
                              </h4>
                              <p className="text-gray-500 text-sm">
                                ₹{item.price?.toFixed(2) || "0.00"} × {item.quantity || 1}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.products?.length > 2 && (
                          <p className="text-sm text-gray-500">
                            + {order.products.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:border-gray-400"
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