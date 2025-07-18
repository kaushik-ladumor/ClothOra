import React from "react";

function OrderDetailsModal({ order, onClose }) {
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const createPlaceholderImage = () => {
    const svg = `
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#F5F5F5"/>
        <text x="40" y="40" text-anchor="middle" dominant-baseline="middle" fill="#B3B3B3" font-family="Arial" font-size="12">No Image</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const handleImageError = (e) => {
    e.target.src = createPlaceholderImage();
    e.target.onerror = null;
  };

  const getCustomerInfo = () => {
    // Check multiple possible locations for customer info
    if (order.customerInfo) {
      return {
        email: order.customerInfo.email || "Not provided",
        phone: order.customerInfo.phone || "Not provided"
      };
    }

    if (order.email || order.phoneNumber) {
      return {
        email: order.email || "Not provided",
        phone: order.phoneNumber || order.phone || "Not provided"
      };
    }

    return {
      email: "Not provided",
      phone: "Not provided"
    };
  };

  const getShippingInfo = () => {
    if (order.shippingInfo) {
      return order.shippingInfo;
    }

    if (order.shippingAddress) {
      return {
        address: order.shippingAddress.street || "Not provided",
        city: order.shippingAddress.city || "Not provided",
        state: order.shippingAddress.state || "Not provided",
        zipCode: order.shippingAddress.postalCode || "Not provided",
        phone: order.phoneNumber || order.phone || "Not provided",
        email: order.email || "Not provided"
      };
    }

    return null;
  };
  const API_URL = import.meta.env.VITE_API_KEY;
  const getImageUrl = (image) => {
    if (!image) return createPlaceholderImage();
    if (image.startsWith("http")) return image;
    if (image.startsWith("data:image")) return image;
    return `${API_URL}${image}`;
  };

  const customerInfo = getCustomerInfo();
  const shippingInfo = getShippingInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Order Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Order Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Order Summary
              </h3>

              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-medium text-gray-800 break-all text-right">
                    {order._id || order.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Date</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(order.createdAt || order.orderedAt || order.orderDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(
                      order.deliveryStatus || order.status
                    )}`}
                  >
                    {formatStatus(order.deliveryStatus || order.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-800">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Payment Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {formatStatus(order.paymentStatus)}
                  </span>
                </div>
                {(order.razorpayPaymentId || order.paymentId) && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment ID</span>
                    <span className="font-medium text-gray-800 break-all text-right">
                      {order.razorpayPaymentId || order.paymentId}
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Information Section */}
              <h3 className="text-lg font-semibold mt-6 md:mt-8 mb-3 md:mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Customer Information
              </h3>

              <div className="bg-gray-50 p-3 md:p-4 rounded border border-gray-200 mb-6">
                <div className="space-y-2">
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
                    <span className="text-gray-800 font-medium">
                      {customerInfo.email}
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
                    <span className="text-gray-800 font-medium">
                      {customerInfo.phone}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Shipping Address
              </h3>

              <div className="bg-gray-50 p-3 md:p-4 rounded border border-gray-200">
                {shippingInfo ? (
                  <>
                    <p className="text-gray-800">{shippingInfo.address}</p>
                    <p className="text-gray-800">
                      {shippingInfo.city}, {shippingInfo.state} -{" "}
                      {shippingInfo.zipCode}
                    </p>
                    {shippingInfo.phone && shippingInfo.phone !== "Not provided" && (
                      <p className="text-gray-800 mt-2">
                        Phone: {shippingInfo.phone}
                      </p>
                    )}
                    {shippingInfo.email && shippingInfo.email !== "Not provided" && (
                      <p className="text-gray-800">
                        Email: {shippingInfo.email}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-800">No shipping information available</p>
                )}
              </div>
            </div>

            {/* Right Column - Order Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Order Items
              </h3>

              <div className="space-y-3 md:space-y-4 max-h-80 overflow-y-auto pr-2">
                {order.products?.map((item) => (
                  <div
                    key={item._id || item.productId}
                    className="flex border-b border-gray-200 pb-3 md:pb-4"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={getImageUrl(item.image || item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="ml-3 md:ml-4 flex-1">
                      <h4 className="font-medium text-gray-800 line-clamp-2 text-sm md:text-base">
                        {item.name || item.productName}
                      </h4>
                      {item.color && (
                        <p className="text-xs text-gray-500 mt-1">
                          Color: {item.color}
                        </p>
                      )}
                      {item.size && (
                        <p className="text-xs text-gray-500">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs md:text-sm mt-1">
                        ₹{item.price?.toFixed(2) || "0.00"} × {item.quantity || 1}
                      </p>
                      <p className="text-gray-800 text-xs md:text-sm mt-1">
                        Total: ₹{((item.price || 0) * (item.quantity || 1))?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 md:mt-6 border-t border-gray-200 pt-3 md:pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-green-600">
                      -₹{order.discount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-800">
                    {order.shippingCharge
                      ? `₹${order.shippingCharge.toFixed(2)}`
                      : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base md:text-lg mt-3 md:mt-4 pt-2 border-t border-gray-200">
                  <span className="text-gray-800">Total</span>
                  <span className="text-gray-800">
                    ₹
                    {(
                      (order.totalAmount || 0) -
                      (order.discount || 0) +
                      (order.shippingCharge || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 flex justify-end border-t border-gray-200 pt-4 md:pt-6">
            <button
              onClick={onClose}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;