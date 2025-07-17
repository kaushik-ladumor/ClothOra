import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2B2B2B] text-[#FFFFFF] mt-auto border-t border-[#B3B3B3]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold tracking-wide mb-2">ClothOra</h2>
            <p className="text-sm text-[#B3B3B3] mb-4">Where fashion meets elegance. Explore styles that suit you.</p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-sm">
            <h3 className="font-semibold mb-3 text-[#D4D4D4]">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors">About Us</Link></li>
              <li><Link to="/cart" className="text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-sm">
            <h3 className="font-semibold mb-3 text-[#D4D4D4]">Contact Us</h3>
            <ul className="space-y-2 text-[#B3B3B3]">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 flex-shrink-0" size={16} />
                <span>123 Fashion Ave, Style City, Mumbai 400010</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(91) 7226987466</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>kaushik.ladumor04@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* About Us Summary */}
          <div className="text-sm">
            <h3 className="font-semibold mb-3 text-[#D4D4D4]">Our Story</h3>
            <p className="text-[#B3B3B3] mb-2">
              Founded in 2025, ClothOra began as a small boutique and has grown into a beloved fashion destination.
            </p>
            <Link 
              to="/about" 
              className="text-[#D4D4D4] hover:text-[#FFFFFF] hover:underline inline-flex items-center mt-2 transition-colors"
            >
              Learn more about us →
            </Link>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 border-t border-[#B3B3B3] pt-4 text-sm text-center text-[#B3B3B3]">
          &copy; {new Date().getFullYear()} ClothOra. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;