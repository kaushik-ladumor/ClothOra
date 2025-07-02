import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  LogOut,
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
    <div className="min-h-screen bg-[#2B2B2B] text-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-[#B3B3B3]">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <div className="bg-[#383838] p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-500/20 mr-3 sm:mr-4">
                <ShoppingCart className="text-yellow-400" size={20} />
              </div>
              <div>
                <p className="text-[#B3B3B3] text-sm">Total Orders</p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {isLoading ? '...' : orderCount}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-[#383838] p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-green-500/20 mr-3 sm:mr-4">
                <Package className="text-green-400" size={20} />
              </div>
              <div>
                <p className="text-[#B3B3B3] text-sm">Products</p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {isLoading ? '...' : productCount}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-[#383838] p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-blue-500/20 mr-3 sm:mr-4">
                <Users className="text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-[#B3B3B3] text-sm">Total Users</p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {isLoading ? '...' : userCount}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link
              to="/admin/products"
              className="bg-[#383838] hover:bg-[#444] transition p-4 sm:p-6 rounded-lg flex flex-col items-center text-center hover:shadow-lg"
            >
              <Package className="text-[#D4D4D4] mb-2 sm:mb-3" size={24} />
              <span className="font-medium text-sm sm:text-base">Manage Products</span>
            </Link>
            <Link
              to="/admin/add-product"
              className="bg-[#383838] hover:bg-[#444] transition p-4 sm:p-6 rounded-lg flex flex-col items-center text-center hover:shadow-lg"
            >
              <PlusCircle className="text-[#D4D4D4] mb-2 sm:mb-3" size={24} />
              <span className="font-medium text-sm sm:text-base">Add Product</span>
            </Link>
            <Link
              to="/admin/orders"
              className="bg-[#383838] hover:bg-[#444] transition p-4 sm:p-6 rounded-lg flex flex-col items-center text-center hover:shadow-lg"
            >
              <ShoppingCart className="text-[#D4D4D4] mb-2 sm:mb-3" size={24} />
              <span className="font-medium text-sm sm:text-base">View Orders</span>
            </Link>
            <Link
              to="/admin/users"
              className="bg-[#383838] hover:bg-[#444] transition p-4 sm:p-6 rounded-lg flex flex-col items-center text-center hover:shadow-lg"
            >
              <Users className="text-[#D4D4D4] mb-2 sm:mb-3" size={24} />
              <span className="font-medium text-sm sm:text-base">Manage Users</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#383838] rounded-lg shadow p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold">Recent Activity</h3>
            <button 
              onClick={handleSettings}
              className="text-[#D4D4D4] hover:text-white flex items-center text-sm"
            >
              <Settings size={16} className="mr-1" /> Settings
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start pb-3 sm:pb-4 border-b border-[#444]">
              <div className="p-1 sm:p-2 rounded-full bg-blue-500/20 mr-3 sm:mr-4">
                <Users size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base">New user registered</p>
                <p className="text-xs sm:text-sm text-[#B3B3B3]">John Doe - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start pb-3 sm:pb-4 border-b border-[#444]">
              <div className="p-1 sm:p-2 rounded-full bg-green-500/20 mr-3 sm:mr-4">
                <ShoppingCart size={16} className="text-green-400" />
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base">New order received</p>
                <p className="text-xs sm:text-sm text-[#B3B3B3]">Order #12345 - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-1 sm:p-2 rounded-full bg-yellow-500/20 mr-3 sm:mr-4">
                <Package size={16} className="text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base">Product updated</p>
                <p className="text-xs sm:text-sm text-[#B3B3B3]">"Summer T-Shirt" - Yesterday</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleLogout}
              className="flex items-center text-[#D4D4D4] hover:text-white text-sm"
            >
              <LogOut size={16} className="mr-1" /> Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;