import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCards = () => {
  const categories = [
    {
      title: "Children's Wear",
      description: "Trendy and comfy clothing for kids of all ages.",
      image: "https://plus.unsplash.com/premium_photo-1675183689613-f28f2d39cb9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fENoaWxkcmVuJ3MlMjBXZWFyfGVufDB8fDB8fHww",
      link: "/products?category=kids"
    },
    {
      title: "Women's Wear",
      description: "Elegant fashion and seasonal trends for women.",
      image: "https://plus.unsplash.com/premium_photo-1664202526475-8f43ee70166d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TGFkaWVzJyUyMFdlYXJ8ZW58MHx8MHx8fDA%3D",
      link: "/products?category=women"
    },
    {
      title: "Men's Wear",
      description: "Smart styles and essentials for the modern man.",
      image: "https://images.unsplash.com/photo-1523205565295-f8e91625443b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVucyUyMFdlYXJ8ZW58MHx8MHx8fDA%3D",
      link: "/products?category=men"
    },
  ];

  return (
    <div className="bg-[#2B2B2B] py-12 px-4 md:px-12">
      <h2 className="text-3xl font-bold text-[#FFFFFF] mb-10 text-center">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            className="bg-[#FFFFFF] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="w-full h-60 object-cover" 
              loading="lazy"
            />
            <div className="p-5 bg-[#FFFFFF]">
              <h3 className="text-xl font-semibold mb-2 text-[#2B2B2B]">{cat.title}</h3>
              <p className="text-sm text-[#B3B3B3] mb-4">{cat.description}</p>
              <Link
                to={cat.link}
                className="inline-block bg-[#D4D4D4] hover:bg-[#B3B3B3] text-[#2B2B2B] px-4 py-2 rounded-md text-sm font-medium transition-all hover:scale-105"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;