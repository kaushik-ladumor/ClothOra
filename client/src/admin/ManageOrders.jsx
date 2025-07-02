import React, { useState, useEffect } from 'react';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:8080/admin/order', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:8080/admin/order/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          deliveryStatus: newStatus 
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update status: ${response.status} - ${errorData}`);
      }

      const updatedOrder = await response.json();

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, deliveryStatus: newStatus }
            : order
        )
      );

      alert('✅ Order status updated successfully!');
    } catch (err) {
      console.error('Failed to update delivery status:', err);
      alert(`❌ Failed to update status: ${err.message}`);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#D4D4D4] text-green-800';
      case 'Cancelled':
        return 'bg-[#D4D4D4] text-red-800';
      case 'Processing':
        return 'bg-[#D4D4D4] text-yellow-800';
      case 'Shipped':
        return 'bg-[#D4D4D4] text-purple-800';
      default:
        return 'bg-[#D4D4D4] text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-[#D4D4D4] text-green-800';
      case 'failed':
        return 'bg-[#D4D4D4] text-red-800';
      case 'pending':
        return 'bg-[#D4D4D4] text-yellow-800';
      default:
        return 'bg-[#D4D4D4] text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2B2B2B] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FFFFFF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2B2B2B] p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-[#FFFFFF] p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Orders</h1>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2B2B2B] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">Manage Orders</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="text-[#FFFFFF] bg-[#B3B3B3] px-4 py-2 rounded-lg text-center">
              Total Orders: {orders.length}
            </div>
            <button
              onClick={fetchOrders}
              className="bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] px-4 py-2 rounded-lg transition-colors border border-[#FFFFFF]"
            >
              Refresh Orders
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-lg p-8 text-center shadow">
            <p className="text-[#B3B3B3] text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFFFF] rounded-lg shadow p-4 md:p-6 border border-[#D4D4D4]"
              >
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#2B2B2B] mb-2">
                      Order #{order._id?.substring(0, 8).toUpperCase()}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#2B2B2B]">
                      <div>
                        <span className="font-medium">Placed:</span> {formatDate(order.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Customer:</span> {order.user?.name || order.userId}
                      </div>
                      {order.user?.email && (
                        <div>
                          <span className="font-medium">Email:</span> {order.user.email}
                        </div>
                      )}
                      {order.user?.phone && (
                        <div>
                          <span className="font-medium">Phone:</span> {order.user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.deliveryStatus)}`}>
                        {order.deliveryStatus || 'Processing'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={order.deliveryStatus || 'Processing'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingOrder === order._id}
                        className="px-3 py-1 sm:py-2 border border-[#D4D4D4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B3B3B3] disabled:opacity-50 text-sm"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      
                      {updatingOrder === order._id && (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#2B2B2B]"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-[#D4D4D4] rounded-lg">
                  <div>
                    <h3 className="text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      Total Amount
                    </h3>
                    <p className="text-base font-semibold text-[#2B2B2B]">
                      ₹{order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      Payment Method
                    </h3>
                    <p className="text-base font-semibold text-[#2B2B2B]">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      Items Count
                    </h3>
                    <p className="text-base font-semibold text-[#2B2B2B]">
                      {order.products?.length || 0} items
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">
                      Order ID
                    </h3>
                    <p className="text-xs font-mono text-[#2B2B2B] break-all">
                      {order._id}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mb-4 p-3 bg-[#D4D4D4] rounded-lg">
                    <h3 className="text-base font-semibold text-[#2B2B2B] mb-2">
                      Shipping Address
                    </h3>
                    <div className="text-[#2B2B2B]">
                      <p className="font-medium">{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Products Section */}
                <div className="border-t border-[#D4D4D4] pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold text-[#2B2B2B]">
                      Products ({order.products?.length || 0} items)
                    </h3>
                    <button
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="text-[#2B2B2B] hover:text-[#B3B3B3] font-medium text-sm"
                    >
                      {expandedOrders.has(order._id) ? 'Show Less' : 'Show All'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {order.products && order.products.length > 0 ? (
                      order.products
                        .slice(0, expandedOrders.has(order._id) ? order.products.length : 2)
                        .map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[#D4D4D4] rounded-lg bg-[#FFFFFF]">
                            <div className="flex items-start sm:items-center mb-2 sm:mb-0">
                              {item.image && (
                                <img
                                  src={item.image.startsWith('http') ? item.image : `http://localhost:8080/${item.image}`}
                                  alt={item.name}
                                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg mr-3 border border-[#D4D4D4]"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <h4 className="font-semibold text-[#2B2B2B]">{item.name}</h4>
                                <div className="text-xs sm:text-sm text-[#B3B3B3] mt-1">
                                  <span className="mr-2">Qty: {item.quantity}</span>
                                  <span className="mr-2">Price: ₹{item.price?.toFixed(2)}</span>
                                  {item.color && item.color !== 'Default' && (
                                    <span className="mr-2">Color: {item.color}</span>
                                  )}
                                  {item.size && item.size !== 'Default' && (
                                    <span>Size: {item.size}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-base sm:text-lg text-[#2B2B2B]">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-[#B3B3B3] text-center py-4">No products found</p>
                    )}
                    
                    {!expandedOrders.has(order._id) && order.products?.length > 2 && (
                      <div className="text-center py-2">
                        <p className="text-xs sm:text-sm text-[#B3B3B3]">
                          + {order.products.length - 2} more items
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                {(order.razorpayPaymentId || order.razorpayOrderId) && (
                  <div className="mt-4 p-3 bg-[#D4D4D4] rounded-lg">
                    <h3 className="text-base font-semibold text-[#2B2B2B] mb-2">
                      Payment Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      {order.razorpayPaymentId && (
                        <div>
                          <span className="font-medium text-[#2B2B2B]">Payment ID:</span>
                          <p className="font-mono text-[#2B2B2B] break-all">{order.razorpayPaymentId}</p>
                        </div>
                      )}
                      {order.razorpayOrderId && (
                        <div>
                          <span className="font-medium text-[#2B2B2B]">Razorpay Order ID:</span>
                          <p className="font-mono text-[#2B2B2B] break-all">{order.razorpayOrderId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery Details */}
                {order.deliveredAt && (
                  <div className="mt-3 p-2 bg-[#D4D4D4] rounded-lg">
                    <p className="text-[#2B2B2B] font-medium text-sm">
                      Delivered on: {formatDate(order.deliveredAt)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageOrders;