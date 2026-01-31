import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import columbus from "../images/columbus.png";
import paragon from "../images/paragon.jpg";
import shoe from "../images/shoe.jpg";
import shoefact from "../images/shoefact.jpeg";

const ModernBrandCarousel = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleBrands, setVisibleBrands] = useState(5);
  const [itemWidth, setItemWidth] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const brands = [
    { id: 1, name: "Paragon", image: paragon },
    { id: 2, name: "Shoe Factory", image: shoefact },
    { id: 3, name: "Columbus", image: columbus },
    { id: 4, name: "--Others--", image: shoe },
    { id: 5, name: "Paragon", image: paragon },
    { id: 6, name: "Shoe Factory", image: shoefact },
    { id: 7, name: "Columbus", image: columbus },
  ];

  // Calculate item width and update on resize
  useEffect(() => {
    const handleResize = () => {
      if (!scrollRef.current) return;
      
      // Determine visible brands based on screen size
      let newVisibleBrands = 5;
      if (window.innerWidth < 640) {
        newVisibleBrands = 3;
      } else if (window.innerWidth < 1024) {
        newVisibleBrands = 4;
      }
      setVisibleBrands(newVisibleBrands);
      
      // Calculate item width including gap
      const containerWidth = scrollRef.current.clientWidth;
      const gap = 16; // 4rem gap in your flex layout
      const calculatedItemWidth = (containerWidth / newVisibleBrands) - (gap * (newVisibleBrands - 1) / newVisibleBrands);
      setItemWidth(calculatedItemWidth);
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

  // Scroll to brand index with improved calculation
  const scrollToIndex = (index) => {
    if (!scrollRef.current || isScrolling) return;
    
    setIsScrolling(true);
    setActiveIndex(index);
    
    // Calculate scroll position more accurately
    const containerWidth = scrollRef.current.clientWidth;
    const scrollContainer = scrollRef.current.firstChild;
    const items = Array.from(scrollContainer.children);
    
    if (items.length <= index) return;
    
    // Get the actual position of the target element
    const targetItem = items[index];
    const containerLeft = scrollContainer.getBoundingClientRect().left;
    const targetLeft = targetItem.getBoundingClientRect().left;
    const currentScroll = scrollRef.current.scrollLeft;
    
    // Calculate the center position
    const scrollPosition = currentScroll + (targetLeft - containerLeft) - (containerWidth / 2) + (targetItem.offsetWidth / 2);
    
    scrollRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth"
    });
    
    // Reset scrolling state after animation completes
    setTimeout(() => setIsScrolling(false), 500);
  };

  // Handle scroll events with debouncing
  const handleScroll = () => {
    if (!scrollRef.current || isScrolling) return;
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const container = scrollRef.current;
      const scrollPosition = container.scrollLeft;
      const containerWidth = container.clientWidth;
      
      // Calculate which item is most centered in view
      const scrollContainer = container.firstChild;
      const items = Array.from(scrollContainer.children);
      
      let bestVisibleIndex = 0;
      let bestVisibleScore = Infinity;
      
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate how centered this item is
        const itemCenter = rect.left + rect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const distanceFromCenter = Math.abs(itemCenter - containerCenter);
        
        if (distanceFromCenter < bestVisibleScore) {
          bestVisibleScore = distanceFromCenter;
          bestVisibleIndex = index;
        }
      });
      
      if (bestVisibleIndex !== activeIndex) {
        setActiveIndex(bestVisibleIndex);
      }
    });
  };

  // Handle next/prev navigation
  const handleNavigation = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(activeIndex + 1, brands.length - 1)
      : Math.max(activeIndex - 1, 0);
    
    scrollToIndex(newIndex);
  };

  // Improved touch handling
  const handleTouchStart = () => {
    setIsDragging(false);
  };
  
  const handleTouchMove = () => {
    setIsDragging(true);
  };
  
  const handleTouchEnd = () => {
    setTimeout(() => setIsDragging(false), 10);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full relative py-8 px-5 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl shadow-sm mb-8 overflow-hidden">
        {/* Background decorations - more subtle and minimal */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-indigo-400/3 rounded-full blur-3xl" />
        
        {/* Header - Modern and minimal */}
        <div className="relative mb-8 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            <span className="h-5 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></span>
            <h3 className="text-lg font-bold text-slate-800">
              Featured Brands
            </h3>
          </motion.div>
          
          {/* Desktop navigation arrows - more modern styling */}
          <div className="hidden md:flex space-x-2">
            <button 
              onClick={() => handleNavigation('prev')}
              disabled={activeIndex === 0}
              className={`p-2 rounded-full transition-all duration-300 ${
                activeIndex === 0 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => handleNavigation('next')}
              disabled={activeIndex === brands.length - 1}
              className={`p-2 rounded-full transition-all duration-300 ${
                activeIndex === brands.length - 1 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Main carousel container - improved scrolling */}
        <div className="max-w-full relative flex justify-center">
          {/* Scrollable container */}
          <div 
            ref={scrollRef}
            className="w-full overflow-x-auto scrollbar-hide"
            onScroll={handleScroll}
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
          >
            <div className="flex pb-6 pt-2 gap-4" style={{ width: 'max-content' }}>
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
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" 
                  }}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300`}
                  style={{
                    scrollSnapAlign: 'center'
                  }}
                  onClick={() => handleBrandClick(brand.name)}
                  onMouseDown={() => setIsDragging(false)}
                  onMouseMove={() => setIsDragging(true)}
                  onMouseUp={() => setTimeout(() => setIsDragging(false), 10)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex flex-col items-center justify-center rounded-xl p-3
                      ${activeIndex === index 
                        ? 'bg-white shadow-lg transform scale-110' 
                        : 'bg-slate-50'}
                      ${activeIndex === index 
                        ? 'border border-blue-400/10' 
                        : 'border border-slate-200/80'}
                      transition-all duration-300 relative overflow-hidden`}
                  >
                    {/* Active indicator - more subtle and minimal */}
                    {activeIndex === index && (
                      <>
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                        <div className="absolute -right-2 -top-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rotate-45 opacity-10"></div>
                      </>
                    )}
                    
                    {/* Brand image - improved animation */}
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
                    
                    {/* Brand name - improved styling */}
                    <p 
                      className={`text-sm font-medium text-center truncate max-w-full
                        ${activeIndex === index 
                          ? 'text-blue-600' 
                          : 'text-slate-600'}`}
                    >
                      {brand.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Gradient fades on edges - more subtle */}
          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
        </div>
        
        {/* Mobile navigation - improved styling */}
        <div className="flex md:hidden justify-between mt-6 px-4">
          <button 
            onClick={() => handleNavigation('prev')}
            disabled={activeIndex === 0}
            className={`p-2 rounded-lg transition-colors ${
              activeIndex === 0 
                ? 'bg-slate-100 text-slate-300' 
                : 'bg-white text-slate-700 shadow-sm hover:bg-blue-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Indicator dots - more minimal */}
          <div className="flex items-center justify-center gap-1.5">
            {brands.map((_, index) => (
              <motion.button
                key={index}
                className="focus:outline-none"
                onClick={() => scrollToIndex(index)}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: index === activeIndex ? 1 : 0.3,
                  width: index === activeIndex ? "20px" : "6px",
                  height: "5px",
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
            className={`p-2 rounded-lg transition-colors ${
              activeIndex === brands.length - 1 
                ? 'bg-slate-100 text-slate-300' 
                : 'bg-white text-slate-700 shadow-sm hover:bg-blue-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernBrandCarousel;