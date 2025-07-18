import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
} from 'lucide-react';

function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch("http://localhost:8080/admin/product/count"),
          fetch("http://localhost:8080/admin/user/count"),
          fetch("http://localhost:8080/admin/order/count")
        ]);

        const productsData = await productsRes.json();
        const usersData = await usersRes.json();
        const ordersData = await ordersRes.json();

        setProductCount(productsData.count);
        setUserCount(usersData.count);
        setOrderCount(ordersData.count);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSettings = () => {
    navigate("/admin/settings");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#2B2B2B' }}>
              Welcome back! 👋
            </h2>
            <p className="text-base sm:text-lg" style={{ color: '#B3B3B3' }}>
              Here's what's happening with your store today.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#B3B3B3' }}>Total Orders</p>
                <h3 className="text-3xl font-bold mt-2" style={{ color: '#2B2B2B' }}>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    orderCount
                  )}
                </h3>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl">
                <ShoppingCart className="text-yellow-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#B3B3B3' }}>Total Products</p>
                <h3 className="text-3xl font-bold mt-2" style={{ color: '#2B2B2B' }}>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    productCount
                  )}
                </h3>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <Package className="text-green-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#B3B3B3' }}>Total Users</p>
                <h3 className="text-3xl font-bold mt-2" style={{ color: '#2B2B2B' }}>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    userCount
                  )}
                </h3>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <Users className="text-blue-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#2B2B2B' }}>Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/products"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center group"
            >
              <div className="p-4 bg-purple-50 rounded-xl mb-4 group-hover:bg-purple-100 transition-colors duration-200">
                <Package className="text-purple-500" size={24} />
              </div>
              <span className="font-semibold text-sm sm:text-base" style={{ color: '#2B2B2B' }}>
                Manage Products
              </span>
            </Link>
            <Link
              to="/admin/add-product"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center group"
            >
              <div className="p-4 bg-green-50 rounded-xl mb-4 group-hover:bg-green-100 transition-colors duration-200">
                <PlusCircle className="text-green-500" size={24} />
              </div>
              <span className="font-semibold text-sm sm:text-base" style={{ color: '#2B2B2B' }}>
                Add Product
              </span>
            </Link>
            <Link
              to="/admin/orders"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center group"
            >
              <div className="p-4 bg-orange-50 rounded-xl mb-4 group-hover:bg-orange-100 transition-colors duration-200">
                <ShoppingCart className="text-orange-500" size={24} />
              </div>
              <span className="font-semibold text-sm sm:text-base" style={{ color: '#2B2B2B' }}>
                View Orders
              </span>
            </Link>
            <Link
              to="/admin/users"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center group"
            >
              <div className="p-4 bg-blue-50 rounded-xl mb-4 group-hover:bg-blue-100 transition-colors duration-200">
                <Users className="text-blue-500" size={24} />
              </div>
              <span className="font-semibold text-sm sm:text-base" style={{ color: '#2B2B2B' }}>
                Manage Users
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold" style={{ color: '#2B2B2B' }}>Recent Activity</h3>
            <span className="text-sm px-3 py-1 bg-gray-50 rounded-full" style={{ color: '#B3B3B3' }}>
              Live updates
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="p-2 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                <Users size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base" style={{ color: '#2B2B2B' }}>
                  New user registered
                </p>
                <p className="text-xs sm:text-sm mt-1" style={{ color: '#B3B3B3' }}>
                  John Doe - 2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="p-2 bg-green-100 rounded-lg mr-4 flex-shrink-0">
                <ShoppingCart size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base" style={{ color: '#2B2B2B' }}>
                  New order received
                </p>
                <p className="text-xs sm:text-sm mt-1" style={{ color: '#B3B3B3' }}>
                  Order #12345 - 5 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4 flex-shrink-0">
                <Package size={16} className="text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base" style={{ color: '#2B2B2B' }}>
                  Product updated
                </p>
                <p className="text-xs sm:text-sm mt-1" style={{ color: '#B3B3B3' }}>
                  "Summer T-Shirt" - Yesterday
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;