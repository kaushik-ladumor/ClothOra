import React from 'react';
import { Link } from 'react-router-dom';

const HeroCard = () => {
  return (
    <div className="relative w-full h-[400px] overflow-hidden shadow-xl bg-[#2B2B2B]">
      {/* Background Image */}
      <img
        src="https://media.istockphoto.com/id/941051278/photo/close-up-of-woman-hand-choosing-thrift-young-and-discount-t-shirt-clothes-in-store-searching.jpg?s=612x612&w=0&k=20&c=ciDyJBQokFT-KwGtyjxuz_0Rrzf_ttYe8zHDzV9lJyA="
        alt="Fashion shopping"
        className="w-full h-full object-cover opacity-30"
        loading="lazy"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 text-[#FFFFFF]">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
          Fashion That Defines You
        </h1>
        <p className="text-md md:text-lg max-w-xl text-[#D4D4D4] mb-6">
          Explore handpicked collections crafted for every occasion.
          Shop from premium quality clothing at unbeatable prices.
        </p>
        <Link
          to="/products"
          className="bg-[#FFFFFF] hover:bg-[#D4D4D4] text-[#2B2B2B] px-6 py-3 rounded-lg text-md font-semibold transition-all shadow hover:scale-105"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default HeroCard;