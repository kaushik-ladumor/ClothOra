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
        return "bg-[#D4D4D4] text-green-800";
      case "cancelled":
        return "bg-[#D4D4D4] text-red-800";
      case "processing":
        return "bg-[#D4D4D4] text-yellow-800";
      case "shipped":
        return "bg-[#D4D4D4] text-purple-800";
      default:
        return "bg-[#D4D4D4] text-[#2B2B2B]";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-[#D4D4D4] text-green-800";
      case "failed":
        return "bg-[#D4D4D4] text-red-800";
      case "pending":
        return "bg-[#D4D4D4] text-yellow-800";
      default:
        return "bg-[#D4D4D4] text-[#2B2B2B]";
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

  const getCustomerEmail = () => {
    return order.customerInfo?.email || order.email || "Not provided";
  };

  const getCustomerPhone = () => {
    return order.customerInfo?.phone || order.phoneNumber || order.phone || "Not provided";
  };

  const getImageUrl = (image) => {
    if (!image) return createPlaceholderImage();
    if (image.startsWith("http")) return image;
    if (image.startsWith("data:image")) return image;
    return `http://localhost:8080/${image}`;
  };

  return (
    <div className="fixed inset-0 bg-[#2B2B2B] bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFFFFF] rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-[#D4D4D4] pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#2B2B2B]">
              Order Details
            </h2>
            <button
              onClick={onClose}
              className="text-[#B3B3B3] hover:text-[#2B2B2B] transition-colors"
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
              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-[#2B2B2B] border-b border-[#D4D4D4] pb-2">
                Order Summary
              </h3>

              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Order ID</span>
                  <span className="font-medium text-[#2B2B2B] break-all text-right">
                    {order._id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Order Date</span>
                  <span className="font-medium text-[#2B2B2B]">
                    {formatDate(order.createdAt || order.orderedAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#B3B3B3]">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(
                      order.deliveryStatus
                    )}`}
                  >
                    {formatStatus(order.deliveryStatus)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B3B3B3]">Payment Method</span>
                  <span className="font-medium text-[#2B2B2B]">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#B3B3B3]">Payment Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {formatStatus(order.paymentStatus)}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-[#B3B3B3]">Payment ID</span>
                    <span className="font-medium text-[#2B2B2B] break-all text-right">
                      {order.razorpayPaymentId}
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Information Section */}
              <h3 className="text-lg font-semibold mt-6 md:mt-8 mb-3 md:mb-4 text-[#2B2B2B] border-b border-[#D4D4D4] pb-2">
                Customer Information
              </h3>

              <div className="bg-[#F5F5F5] p-3 md:p-4 rounded border border-[#D4D4D4] mb-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-[#B3B3B3]"
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
                    <span className="text-[#2B2B2B] font-medium">
                      {getCustomerEmail()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-[#B3B3B3]"
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
                    <span className="text-[#2B2B2B] font-medium">
                      {getCustomerPhone()}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-[#2B2B2B] border-b border-[#D4D4D4] pb-2">
                Shipping Address
              </h3>

              <div className="bg-[#F5F5F5] p-3 md:p-4 rounded border border-[#D4D4D4]">
                {order.shippingInfo ? (
                  <>
                    <p className="font-medium text-[#2B2B2B]">
                      {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    </p>
                    <p className="text-[#2B2B2B]">{order.shippingInfo.address}</p>
                    <p className="text-[#2B2B2B]">
                      {order.shippingInfo.city}, {order.shippingInfo.state} -{" "}
                      {order.shippingInfo.zipCode}
                    </p>
                    {order.shippingInfo.phone && (
                      <p className="text-[#2B2B2B]">
                        Phone: {order.shippingInfo.phone}
                      </p>
                    )}
                    {order.shippingInfo.email && (
                      <p className="text-[#2B2B2B]">
                        Email: {order.shippingInfo.email}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-[#2B2B2B]">No shipping information available</p>
                )}
              </div>
            </div>

            {/* Right Column - Order Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-[#2B2B2B] border-b border-[#D4D4D4] pb-2">
                Order Items
              </h3>

              <div className="space-y-3 md:space-y-4 max-h-80 overflow-y-auto pr-2">
                {order.products?.map((item) => (
                  <div
                    key={item._id}
                    className="flex border-b border-[#D4D4D4] pb-3 md:pb-4"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#F5F5F5] rounded overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="ml-3 md:ml-4 flex-1">
                      <h4 className="font-medium text-[#2B2B2B] line-clamp-2 text-sm md:text-base">
                        {item.name}
                      </h4>
                      <p className="text-[#B3B3B3] text-xs md:text-sm mt-1">
                        ₹{item.price?.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="text-[#2B2B2B] text-xs md:text-sm mt-1">
                        Total: ₹{(item.price * item.quantity)?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 md:mt-6 border-t border-[#D4D4D4] pt-3 md:pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[#B3B3B3]">Subtotal</span>
                  <span className="font-medium text-[#2B2B2B]">
                    ₹{order.totalAmount?.toFixed(2)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-[#B3B3B3]">Discount</span>
                    <span className="font-medium text-green-600">
                      -₹{order.discount?.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className="text-[#B3B3B3]">Shipping</span>
                  <span className="font-medium text-[#2B2B2B]">
                    {order.shippingCharge
                      ? `₹${order.shippingCharge.toFixed(2)}`
                      : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base md:text-lg mt-3 md:mt-4 pt-2 border-t border-[#D4D4D4]">
                  <span className="text-[#2B2B2B]">Total</span>
                  <span className="text-[#2B2B2B]">
                    ₹
                    {(
                      order.totalAmount -
                      (order.discount || 0) +
                      (order.shippingCharge || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 flex justify-end border-t border-[#D4D4D4] pt-4 md:pt-6">
            <button
              onClick={onClose}
              className="bg-[#2B2B2B] hover:bg-[#1A1A1A] text-[#FFFFFF] px-4 md:px-6 py-2 rounded-lg font-medium transition-colors"
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