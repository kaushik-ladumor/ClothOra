import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  LogOut,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-[#1F1F1F] text-[#D4D4D4] h-16 items-center px-4 sm:px-6 shadow-md border-b border-[#444]">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/admin-dashboard" className="flex items-center space-x-2 hover:text-white transition">
            <span className="text-lg sm:text-xl font-bold">ClothOra Admin</span>
          </Link>

          {/* Primary Nav Links */}
          <div className="flex space-x-4 lg:space-x-6">
            <NavLink to="/admin-dashboard" icon={<Home size={18} />} label="Dashboard" />
            <NavLink to="/admin/products" icon={<Package size={18} />} label="Products" />
            <NavLink to="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" />
            <NavLink to="/admin/users" icon={<Users size={18} />} label="Users" />
            <NavLink to="/admin/add-product" icon={<PlusCircle size={18} />} label="Add Product" />
          </div>

          {/* Secondary Nav Links (Right side) */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <button 
              onClick={() => navigate("/admin/settings")} 
              className="flex items-center text-sm hover:text-[#FFFFFF] transition"
            >
              <Settings className="mr-2" size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm hover:text-[#FFFFFF] transition"
            >
              <LogOut className="mr-2" size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-[#1F1F1F] text-[#D4D4D4] h-16 flex items-center px-4 shadow-md border-b border-[#444]">
        <div className="w-full flex justify-between items-center">
          <Link to="/admin-dashboard" className="text-lg font-bold hover:text-white">ClothOra Admin</Link>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 focus:outline-none hover:text-white transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2B2B2B] text-[#D4D4D4] py-2 px-4 shadow-lg">
          <div className="flex flex-col space-y-1">
            <MobileNavLink 
              to="/admin-dashboard" 
              icon={<Home size={18} />} 
              label="Dashboard" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink 
              to="/admin/products" 
              icon={<Package size={18} />} 
              label="Products" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink 
              to="/admin/orders" 
              icon={<ShoppingCart size={18} />} 
              label="Orders" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink 
              to="/admin/users" 
              icon={<Users size={18} />} 
              label="Users" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink 
              to="/admin/add-product" 
              icon={<PlusCircle size={18} />} 
              label="Add Product" 
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <div className="pt-2 border-t border-[#444] mt-1">
              <MobileNavLink 
                to="/admin/settings" 
                icon={<Settings size={18} />} 
                label="Settings" 
                onClick={() => setMobileMenuOpen(false)}
              />
              <button
                onClick={handleLogout}
                className="w-full flex items-center py-2 px-3 text-sm hover:bg-[#383838] rounded transition hover:text-white"
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
    className="flex items-center text-sm hover:text-white transition px-2 py-1 rounded hover:bg-[#383838]"
  >
    <span className="mr-2">{icon}</span>
    {label}
  </Link>
);

// Reusable NavLink component for mobile
const MobileNavLink = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center py-2 px-3 hover:bg-[#383838] rounded transition hover:text-white text-sm"
  >
    <span className="mr-3">{icon}</span>
    {label}
  </Link>
);

export default AdminNavbar;