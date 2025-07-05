import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-[#1F1F1F] text-[#D4D4D4] h-16 items-center px-6 border-b border-[#444]">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/admin-dashboard" className="text-xl font-bold hover:text-white transition">
            ClothOra Admin
          </Link>

          {/* Primary Nav Links */}
          <div className="flex space-x-6">
            <NavLink to="/admin-dashboard" icon={<Home size={18} />} label="Dashboard" />
            <NavLink to="/admin/products" icon={<Package size={18} />} label="Products" />
            <NavLink to="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" />
            <NavLink to="/admin/users" icon={<Users size={18} />} label="Users" />
          </div>

          {/* Right Side Actions */}
          <div className="flex space-x-4">
            <Link 
              to="/admin/add-product" 
              className="flex items-center px-3 py-1 bg-[#2B2B2B] hover:bg-[#383838] rounded text-sm transition"
            >
              <PlusCircle size={16} className="mr-2" />
              Add Product
            </Link>
            <button 
              onClick={() => navigate("/admin/settings")} 
              className="p-2 hover:text-white transition"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:text-white transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-[#1F1F1F] text-[#D4D4D4] h-16 flex items-center px-4 border-b border-[#444]">
        <div className="w-full flex justify-between items-center">
          <Link to="/admin-dashboard" className="text-lg font-bold hover:text-white">
            ClothOra Admin
          </Link>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 focus:outline-none hover:text-white transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2B2B2B] text-[#D4D4D4] border-b border-[#444]">
          <div className="flex flex-col py-2 px-4">
            <MobileNavLink to="/admin-dashboard" icon={<Home size={18} />} label="Dashboard" />
            <MobileNavLink to="/admin/products" icon={<Package size={18} />} label="Products" />
            <MobileNavLink to="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" />
            <MobileNavLink to="/admin/users" icon={<Users size={18} />} label="Users" />
            <MobileNavLink to="/admin/add-product" icon={<PlusCircle size={18} />} label="Add Product" />
            
            <div className="pt-2 border-t border-[#444] mt-1">
              <MobileNavLink to="/admin/settings" icon={<Settings size={18} />} label="Settings" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center py-2 px-3 text-sm hover:bg-[#383838] rounded transition"
              >
                <LogOut className="mr-3" size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="flex items-center hover:text-white transition text-sm"
  >
    <span className="mr-2">{icon}</span>
    {label}
  </Link>
);

// Reusable NavLink component for mobile
const MobileNavLink = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="flex items-center py-2 px-3 hover:bg-[#383838] rounded transition text-sm"
  >
    <span className="mr-3">{icon}</span>
    {label}
  </Link>
);

export default AdminNavbar;