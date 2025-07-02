import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, ArrowLeft, Search, Mail, Zap } from 'lucide-react';

export default function PageNotFound() {
  const navigate = useNavigate();

  // Unsplash image with your color scheme
  const spaceImage = "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-[#2B2B2B] flex flex-col items-center justify-center p-6 text-center">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#1F1F1F] rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-[#1F1F1F] rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Content Card */}
        <div className="bg-[#1F1F1F] p-8 md:p-10 rounded-xl border border-[#B3B3B3] shadow-lg">
          <span className="inline-block px-4 py-2 bg-[#2B2B2B] text-[#D4D4D4] rounded-full text-sm font-medium mb-4 border border-[#B3B3B3]">
            404 ERROR
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4">
            Lost in Space
          </h1>
          
          <p className="text-lg text-[#B3B3B3] mb-8 max-w-2xl mx-auto">
            This page has drifted into the unknown. Let's get you back to safety.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
            <input
              type="text"
              placeholder="Search our galaxy..."
              className="w-full pl-12 pr-4 py-3 bg-[#2B2B2B] border border-[#B3B3B3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4D4D4] text-[#FFFFFF] placeholder-[#B3B3B3]"
            />
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 text-sm mb-8">
            <span className="text-[#B3B3B3]">Try these instead:</span>
            <Link to="/" className="text-[#D4D4D4] hover:text-white hover:underline">Home</Link>
            <Link to="#" className="text-[#D4D4D4] hover:text-white hover:underline">Features</Link>
            <Link to="#" className="text-[#D4D4D4] hover:text-white hover:underline">Blog</Link>
            <Link to="#" className="text-[#D4D4D4] hover:text-white hover:underline">Contact</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2B2B2B] border border-[#D4D4D4] hover:bg-[#1F1F1F] text-[#D4D4D4] font-medium rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4D4D4] hover:bg-[#B3B3B3] text-[#2B2B2B] font-medium rounded-lg transition-colors"
            >
              <Home size={18} />
              Return Home
            </Link>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-8 text-center">
          <Link 
            to="#" 
            className="inline-flex items-center text-[#D4D4D4] hover:text-white"
          >
            <Mail className="mr-2" size={16} />
            Need help? Contact support
          </Link>
        </div>

        {/* Easter Egg */}
        <div className="mt-10">
          <button 
            onClick={() => alert('✨ You discovered a cosmic secret!')}
            className="text-xs text-[#B3B3B3] hover:text-[#D4D4D4] flex items-center mx-auto"
          >
            <Zap size={12} className="mr-1" />
            <span>Psst... click here</span>
          </button>
        </div>
      </div>
    </div>
  );
}