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
      const API_URL = import.meta.env.VITE_API_KEY;
      const response = await fetch(`${API_URL}/admin/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <div className="max-w-4xl mx-auto bg-[#FFFFFF] p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Orders</h1>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] px-4 py-2 rounded-lg transition-colors duration-200"
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
            <div className="text-[#FFFFFF] bg-[#B3B3B3] px-4 py-2 rounded-lg text-center shadow-sm">
              Total Orders: {orders.length}
            </div>
            <button
              onClick={fetchOrders}
              className="bg-[#2B2B2B] hover:bg-[#B3B3B3] text-[#FFFFFF] px-4 py-2 rounded-lg transition-colors duration-200 border border-[#FFFFFF] hover:border-[#B3B3B3]"
            >
              Refresh Orders
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-lg p-8 text-center shadow-lg">
            <p className="text-[#B3B3B3] text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFFFF] rounded-lg shadow-lg overflow-hidden border border-[#D4D4D4] transition-all duration-200 hover:shadow-xl"
              >
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-[#D4D4D4]">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-[#2B2B2B]">
                          Order #{order._id?.substring(0, 8).toUpperCase()}
                        </h2>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}>
                            {order.deliveryStatus || 'Processing'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#2B2B2B]">
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
                      <div className="flex items-center gap-2">
                        <select
                          value={order.deliveryStatus || 'Processing'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingOrder === order._id}
                          className="px-3 py-2 border border-[#D4D4D4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B3B3B3] disabled:opacity-50 text-sm bg-white"
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
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#F8F8F8] border-b border-[#D4D4D4]">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <h3 className="text-xs font-medium text-[#2B2B2B] uppercase tracking-wider mb-1">
                      Total Amount
                    </h3>
                    <p className="text-lg font-bold text-[#2B2B2B]">
                      ₹{order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <h3 className="text-xs font-medium text-[#2B2B2B] uppercase tracking-wider mb-1">
                      Payment Method
                    </h3>
                    <p className="text-lg font-bold text-[#2B2B2B]">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <h3 className="text-xs font-medium text-[#2B2B2B] uppercase tracking-wider mb-1">
                      Items Count
                    </h3>
                    <p className="text-lg font-bold text-[#2B2B2B]">
                      {order.products?.length || 0} items
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <h3 className="text-xs font-medium text-[#2B2B2B] uppercase tracking-wider mb-1">
                      Order ID
                    </h3>
                    <p className="text-xs font-mono text-[#2B2B2B] break-all">
                      {order._id}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="p-4 border-b border-[#D4D4D4]">
                    <h3 className="text-base font-semibold text-[#2B2B2B] mb-2">
                      Shipping Address
                    </h3>
                    <div className="bg-[#F8F8F8] p-3 rounded-lg">
                      <p className="font-medium text-[#2B2B2B]">{order.shippingAddress.street}</p>
                      <p className="text-[#2B2B2B]">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Products Section */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#2B2B2B]">
                      Products ({order.products?.length || 0} items)
                    </h3>
                    <button
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="text-[#2B2B2B] hover:text-[#B3B3B3] font-medium text-sm flex items-center gap-1"
                    >
                      {expandedOrders.has(order._id) ? (
                        <>
                          <span>Show Less</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Show All</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {order.products && order.products.length > 0 ? (
                      order.products
                        .slice(0, expandedOrders.has(order._id) ? order.products.length : 2)
                        .map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[#D4D4D4] rounded-lg bg-white hover:bg-[#F8F8F8] transition-colors duration-150">
                            <div className="flex items-start sm:items-center mb-2 sm:mb-0 gap-3">
                              {item.image && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={item.image.startsWith('http') ? item.image : `http://localhost:8080/${item.image}`}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg border border-[#D4D4D4]"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="w-16 h-16 hidden items-center justify-center bg-[#D4D4D4] rounded-lg border border-[#D4D4D4]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B3B3B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                              <div>
                                <h4 className="font-semibold text-[#2B2B2B]">{item.name}</h4>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#666666] mt-1">
                                  <span>Qty: {item.quantity}</span>
                                  <span>Price: ₹{item.price?.toFixed(2)}</span>
                                  {item.color && item.color !== 'Default' && (
                                    <span>Color: {item.color}</span>
                                  )}
                                  {item.size && item.size !== 'Default' && (
                                    <span>Size: {item.size}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-base text-[#2B2B2B]">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="bg-[#F8F8F8] p-4 rounded-lg text-center">
                        <p className="text-[#B3B3B3]">No products found</p>
                      </div>
                    )}
                    
                    {!expandedOrders.has(order._id) && order.products?.length > 2 && (
                      <div className="text-center py-2">
                        <p className="text-sm text-[#B3B3B3]">
                          + {order.products.length - 2} more items
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                {(order.razorpayPaymentId || order.razorpayOrderId) && (
                  <div className="p-4 bg-[#F8F8F8] border-t border-[#D4D4D4]">
                    <h3 className="text-base font-semibold text-[#2B2B2B] mb-2">
                      Payment Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.razorpayPaymentId && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <h4 className="font-medium text-[#2B2B2B] text-sm mb-1">Payment ID:</h4>
                          <p className="font-mono text-[#2B2B2B] text-sm break-all">{order.razorpayPaymentId}</p>
                        </div>
                      )}
                      {order.razorpayOrderId && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <h4 className="font-medium text-[#2B2B2B] text-sm mb-1">Razorpay Order ID:</h4>
                          <p className="font-mono text-[#2B2B2B] text-sm break-all">{order.razorpayOrderId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery Details */}
                {order.deliveredAt && (
                  <div className="p-3 bg-[#F8F8F8] border-t border-[#D4D4D4]">
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