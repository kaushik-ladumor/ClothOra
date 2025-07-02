import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (['/login', '/register', '/verify'].includes(location.pathname)) return null;

  return (
    <nav className="bg-[#2B2B2B] text-[#FFFFFF] shadow-md border-b border-[#B3B3B3]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-semibold hover:text-[#D4D4D4] transition-colors">
          <ShoppingBag size={24} />
          <span>ClothOra</span>
        </Link>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden text-[#FFFFFF] hover:text-[#D4D4D4] transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8 text-sm">
          <Link to="/" className="hover:text-[#D4D4D4] transition-colors">Home</Link>
          <Link to="/products" className="hover:text-[#D4D4D4] transition-colors">Shop</Link>
          <Link to="/cart" className="flex items-center gap-1 hover:text-[#D4D4D4] transition-colors">
            <ShoppingCart size={16} />
            Cart
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-1 hover:text-[#D4D4D4] transition-colors">
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-[#D4D4D4] transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 hover:text-[#D4D4D4] transition-colors">
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/register" className="flex items-center gap-1 hover:text-[#D4D4D4] transition-colors">
                <UserPlus size={16} />
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden px-6 pb-4 space-y-3 text-sm bg-[#2B2B2B] border-t border-[#B3B3B3]">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)} 
            className="block py-2 hover:text-[#D4D4D4] transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/products" 
            onClick={() => setIsOpen(false)} 
            className="block py-2 hover:text-[#D4D4D4] transition-colors"
          >
            Shop
          </Link>
          <Link 
            to="/cart" 
            onClick={() => setIsOpen(false)} 
            className="flex items-center gap-1 py-2 hover:text-[#D4D4D4] transition-colors"
          >
            <ShoppingCart size={16} />
            Cart
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-1 py-2 hover:text-[#D4D4D4] transition-colors"
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 py-2 hover:text-[#D4D4D4] transition-colors w-full text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-1 py-2 hover:text-[#D4D4D4] transition-colors"
              >
                <LogIn size={16} />
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-1 py-2 hover:text-[#D4D4D4] transition-colors"
              >
                <UserPlus size={16} />
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;