import React from 'react';
import { Instagram, Twitter, Linkedin, Quote, Star, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-6 bg-gradient-to-br from-white via-gray-50 to-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200 mb-8">
              <Star className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" />
              <span className="text-sm font-medium text-gray-700">Premium Fashion Brand</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Redefining Fashion 
              <br />
              Since <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-neutral-900">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              ClothOra was born from a vision to create clothing that blends contemporary design with uncompromising comfort and timeless elegance.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-gray-300 via-neutral-400 to-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Founder Image */}
              <div className="relative">
                <div className="aspect-[4/5] lg:h-full overflow-hidden">
                  <img
                    src="/Image/Owner_Img.jpg"
                    alt="Kaushik Ladumor"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating Quote */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <Quote className="w-8 h-8 text-gray-400 mb-3" />
                  <p className="text-gray-800 font-medium italic">
                    "Fashion should empower, not constrain. Every piece we create tells a story of comfort meeting style."
                  </p>
                </div>
              </div>

              {/* Founder Details */}
              <div className="p-12 lg:p-16 flex flex-col justify-center">
                <div className="mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full mb-6">
                    <Heart className="w-4 h-4 text-red-500 mr-2" fill="currentColor" />
                    <span className="text-sm font-medium text-gray-700">Founder & Visionary</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Kaushik Ladumor</h2>
                  <p className="text-xl text-gray-500 mb-8">Creative Director</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                  <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                    <p>
                      In 2025, I set out to challenge the fashion industry's status quo. ClothOra represents my belief that exceptional clothing should be both beautiful and functional.
                    </p>
                    <p>
                      With no formal training but a passion for design, I approach fashion differently - focusing on how clothes make people feel, not just how they look.
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  <a 
                    href="https://www.instagram.com/kaushik_ahir04/" 
                    className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Instagram size={24} />
                  </a>
                  <a 
                    href="https://x.com/kaushik_ahir04" 
                    className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Twitter size={24} />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/kaushik-ladumor-3a7b18290/" 
                    className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200 mb-8">
              <span className="text-sm font-medium text-gray-700">Our Philosophy</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
              Three Core Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every decision we make is guided by these fundamental beliefs that shape our brand identity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authentic Design",
                description: "We create pieces that reflect real people's lives, not just runway fantasies. Every design starts with understanding how you live, work, and express yourself.",
                img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                number: "01"
              },
              {
                title: "Conscious Craft",
                description: "Every stitch matters. We use premium materials and ethical manufacturing processes to ensure lasting quality that respects both people and planet.",
                img: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
                number: "02"
              },
              {
                title: "Human-Centered",
                description: "Fashion should empower the wearer, not constrain them. Comfort and confidence go hand in hand, creating clothes that make you feel unstoppable.",
                img: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                number: "03"
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-6 right-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold">
                        {item.number}
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "2025", label: "Founded", sublabel: "Started with a vision" },
                { number: "100%", label: "Sustainable", sublabel: "Eco-friendly materials" },
                { number: "24/7", label: "Support", sublabel: "Always here for you" },
                { number: "∞", label: "Possibilities", sublabel: "Limitless creativity" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="mb-4">
                    <div className="text-3xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-500">{stat.sublabel}</div>
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-gray-300 to-neutral-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonial */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-neutral-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
            <Quote className="w-12 h-12 text-gray-300 mx-auto mb-8" />
            <blockquote className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed mb-8 italic">
              "ClothOra doesn't just make clothes, they craft experiences. Every piece feels like it was made specifically for how I live my life."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-neutral-300 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700">K.L</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Kaushik Ladumor</div>
                <div className="text-gray-500">Fashion Enthusiast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-neutral-800 to-gray-900 rounded-3xl shadow-2xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Ready to Experience ClothOra?
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                Discover our debut collection designed for modern living. Where comfort meets style, and quality meets consciousness.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a
                  href="/products"
                  className="px-10 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Shop the Collection
                </a>
                <a
                  href="/story"
                  className="px-10 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  Our Story
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;