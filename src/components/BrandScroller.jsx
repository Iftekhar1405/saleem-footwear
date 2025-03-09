import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import columbus from "./images/columbus.png";
import paragon from "./images/paragon.jpg";
import shoe from "./images/shoe.jpg";
import shoefact from "./images/shoefact.jpeg";

const ModernBrandCarousel = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleBrands, setVisibleBrands] = useState(5);

  const brands = [
    { id: 1, name: "Paragon", image: paragon },
    { id: 2, name: "Shoe Factory", image: shoefact },
    { id: 3, name: "Columbus", image: columbus },
    { id: 4, name: "--Others--", image: shoe },
    { id: 5, name: "Paragon", image: paragon },
    { id: 6, name: "Shoe Factory", image: shoefact },
    { id: 7, name: "Columbus", image: columbus },
  ];

  // Determine visible brands based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleBrands(3);
      } else if (window.innerWidth < 1024) {
        setVisibleBrands(4);
      } else {
        setVisibleBrands(5);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle brand click
  const handleBrandClick = (brand) => {
    if (!isDragging) {
      navigate(`/category-grid/brand=${brand}`);
    }
  };

  // Handle scroll to update active brand
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const containerWidth = scrollRef.current.clientWidth;
      const itemWidth = containerWidth / visibleBrands;
      const index = Math.round(scrollPosition / itemWidth);
      setActiveIndex(Math.min(index, brands.length - 1));
    }
  };

  // Scroll to brand index
  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const itemWidth = containerWidth / visibleBrands;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth"
      });
    }
  };

  // Handle next/prev navigation
  const handleNavigation = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, brands.length - 1)
      : Math.max(activeIndex - 1, 0);
    
    scrollToIndex(newIndex);
  };

  return (
    <div className="w-full relative py-6 px-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl shadow-sm mb-8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-indigo-400/5 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="relative mb-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center"
        >
          <span className="h-6 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></span>
          <h3 className="text-lg font-bold text-slate-800">
            Featured Brands
          </h3>
        </motion.div>
        
        {/* Desktop navigation arrows */}
        <div className="hidden md:flex space-x-2">
          <button 
            onClick={() => handleNavigation('prev')}
            disabled={activeIndex === 0}
            className={`p-2 rounded-full ${activeIndex === 0 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-200'} transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => handleNavigation('next')}
            disabled={activeIndex === brands.length - 1}
            className={`p-2 rounded-full ${activeIndex === brands.length - 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-200'} transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main carousel container - constrained width */}
      <div className="max-w-full relative">
        {/* Scrollable container */}
        <div 
          ref={scrollRef}
          className="w-full overflow-x-auto scrollbar-hide"
          onScroll={handleScroll}
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex pb-4 pt-2 gap-4" style={{ width: 'max-content' }}>
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 0.05 }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.15)" 
                }}
                className={`flex-shrink-0 cursor-pointer transition-all duration-300`}
                // onClick={() => handleBrandClick(brand.name)}
                onMouseDown={() => setIsDragging(false)}
                onMouseMove={() => setIsDragging(true)}
                onMouseUp={() => setTimeout(() => setIsDragging(false), 10)}
                onTouchStart={() => setIsDragging(false)}
                onTouchMove={() => setIsDragging(true)}
                onTouchEnd={() => setTimeout(() => setIsDragging(false), 10)}
              >
                <div 
                  className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex flex-col items-center justify-center rounded-xl p-3
                    ${activeIndex === index 
                      ? 'bg-white shadow-lg' 
                      : 'bg-slate-50'}
                    ${activeIndex === index 
                      ? 'border border-blue-500/20' 
                      : 'border border-slate-200'}
                    transition-all duration-300 relative overflow-hidden`}
                >
                  {/* Active indicator */}
                  {activeIndex === index && (
                    <>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                      <div className="absolute -right-1 -top-1 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rotate-45 opacity-20"></div>
                    </>
                  )}
                  
                  {/* Brand image */}
                  <div className="h-3/5 w-full flex items-center justify-center mb-3">
                    <motion.img
                      src={brand.image}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm rounded"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        transition: { delay: index * 0.05 + 0.2 }
                      }}
                    />
                  </div>
                  
                  {/* Brand name */}
                  <p 
                    className={`text-sm font-medium text-center truncate max-w-full
                      ${activeIndex === index 
                        ? 'text-blue-600' 
                        : 'text-slate-700'}`}
                  >
                    {brand.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
      </div>
      
      {/* Mobile navigation */}
      <div className="flex md:hidden justify-between mt-4">
        <button 
          onClick={() => handleNavigation('prev')}
          disabled={activeIndex === 0}
          className={`p-2 rounded-md ${activeIndex === 0 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-700'} transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Indicator dots */}
        <div className="flex items-center justify-center gap-1">
          {brands.map((_, index) => (
            <motion.button
              key={index}
              className="focus:outline-none"
              onClick={() => scrollToIndex(index)}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: index === activeIndex ? 1 : 0.3,
                width: index === activeIndex ? "16px" : "6px",
                height: "6px",
                backgroundColor: index === activeIndex ? "#3B82F6" : "#CBD5E1",
                borderRadius: "9999px",
                transition: { duration: 0.2 }
              }}
            />
          ))}
        </div>
        
        <button 
          onClick={() => handleNavigation('next')}
          disabled={activeIndex === brands.length - 1}
          className={`p-2 rounded-md ${activeIndex === brands.length - 1 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-700'} transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* View all brands button (optional) */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate('/all-brands')}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View all brands
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModernBrandCarousel;