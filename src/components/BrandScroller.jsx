import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import columbus from "./images/columbus.png";
import paragon from "./images/paragon.jpg";
import shoe from "./images/shoe.jpg";
import shoefact from "./images/shoefact.jpeg";
// Custom style to hide scrollbars (to be included in your CSS)
const scrollbarHideStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;
const ModernBrandCarousel = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);


  const brands = [
    { id: 1, name: "Paragon", image: paragon },
    { id: 2, name: "Shoe Factory", image: shoefact },
    { id: 3, name: "Columbus", image: columbus },
    { id: 4, name: "--Others--", image: shoe },
    { id: 5, name: "Paragon", image: paragon },
    { id: 6, name: "Shoe Factory", image: shoefact },
    { id: 7, name: "Columbus", image: columbus },
  ];
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
      const itemWidth = scrollRef.current.offsetWidth / 5; // Assuming 5 visible items
      const index = Math.round(scrollPosition / itemWidth);
      setActiveIndex(Math.min(index, brands.length - 1));
    }
  };

  // Scroll to brand index
  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth / 5;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full relative py-4 px-4 bg-[#f7fafc] backdrop-blur-md  mb-6 ">
      {/* Gradient accents */}
      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-blue-400/10 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 bg-indigo-400/10 rounded-full blur-3xl -z-0" />
      
      {/* Header */}
      <div className="relative mb-4 z-10">
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200"
        >
          <span className="relative pb-1 after:content-[''] font-extrabold tracking-[0.3em] text-lg text-[#282321] after:absolute after:w-1/3 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-transparent after:bottom-0 after:left-0">
            Brands
          </span>
        </motion.h3>
      </div>
      
      {/* Scrollable container */}
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto scrollbar-hide" 
        onScroll={handleScroll}
        style={{ 
          scrollbarWidth: 'none',  // Firefox
          msOverflowStyle: 'none',  // IE/Edge
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex gap-4 pb-4 pt-2 min-w-max">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { delay: index * 0.05 }
              }}
              whileHover={{ scale: 1.05 }}
              className={`flex-shrink-0 cursor-pointer`}
              onClick={() => handleBrandClick(brand.name)}
              onMouseDown={() => setIsDragging(false)}
              onMouseMove={() => setIsDragging(true)}
              onMouseUp={() => setTimeout(() => setIsDragging(false), 10)}
              onTouchStart={() => setIsDragging(false)}
              onTouchMove={() => setIsDragging(true)}
              onTouchEnd={() => setTimeout(() => setIsDragging(false), 10)}
            >
              <div 
                className={`w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center rounded-lg p-3
                  ${activeIndex === index 
                    ? 'bg-white/10 border border-blue-400/30 shadow-lg shadow-blue-400/10' 
                    : 'bg-white/5 border border-white/10'}
                  transition-all duration-300 backdrop-blur-sm
                  relative`}
              >
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                
                {/* Brand image */}
                <div className="h-3/5 w-full flex items-center justify-center mb-2">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm rounded"
                  />
                </div>
                
                {/* Brand name */}
                <p 
                  className={`text-xs md:text-sm font-medium text-center truncate max-w-full
                    ${activeIndex === index ? 'text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {brand.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Indicator dots */}
      <div className="flex justify-center gap-1 mt-3">
        {brands.map((_, index) => (
          <motion.button
            key={index}
            className="focus:outline-none"
            onClick={() => scrollToIndex(index)}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: index === activeIndex ? 1 : 0.3,
              width: index === activeIndex ? "12px" : "4px",
              height: "4px",
              backgroundColor: index === activeIndex ? "#8AB4F8" : "rgba(138, 180, 248, 0.3)",
              borderRadius: "9999px",
              transition: { duration: 0.2 }
            }}
          />
        ))}
      </div>
      
      {/* Subtle scroll cue - fades out after initial load */}
      <motion.div
        className="absolute -right-1 top-1/2 transform -translate-y-1/2 h-12 w-8 bg-gradient-to-l from-slate-50/90 to-transparent dark:from-slate-900/90 pointer-events-none z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.8, 1], transition: { repeat: 3, duration: 1.5 } }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="h-8 w-8 flex items-center justify-center"
          animate={{ x: [0, 4, 0], transition: { repeat: 3, duration: 1.5 } }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};



export default ModernBrandCarousel;