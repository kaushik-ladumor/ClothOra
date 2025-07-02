import React from 'react';

const AppPromoCard = () => {
  return (
    <div className="flex justify-center items-center py-20 px-4 bg-[#2B2B2B]">
      <div className="bg-[#2B2B2B] max-w-7xl w-full rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#B3B3B3]">
        
        {/* Left Side - App Image */}
        <div className="md:w-1/2 flex justify-center items-center p-10">
          <img
            src="https://media.istockphoto.com/id/1746005194/vector/3d-bill-payment-with-credit-card.jpg?s=612x612&w=0&k=20&c=D0U5ZXocuO0RQB_gn_5hp52ZV07CTK8lmvmAA-Pxqpo="
            alt="ClothOra App"
            className="w-full max-w-[400px] rounded-xl shadow-lg"
            loading="lazy"
          />
        </div>

        {/* Right Side - Text and Buttons */}
        <div className="md:w-1/2 p-10 text-[#FFFFFF] flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Save More with the <span className="text-[#FFFFFF]">ClothOra</span> App
          </h2>
          <p className="text-[#D4D4D4] mb-6 text-lg leading-relaxed">
            Get ₹200 OFF on your first app order, fast delivery, and access to member-only deals.
            Download now from your favorite app store!
          </p>

          {/* Store Buttons */}
          <div className="flex gap-4 flex-col sm:flex-row items-center sm:items-start">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Get it on Google Play"
              className="hover:scale-105 transition-all"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-12 md:h-14 object-contain"
                loading="lazy"
              />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Download on the App Store"
              className="hover:scale-105 transition-all"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-12 md:h-14 object-contain"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPromoCard;