import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { URL } from "../../context/url";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [visibleCategories, setVisibleCategories] = useState(10);

  useEffect(() => {
    fetchCategories();
    
    // Responsive grid handling
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCategories(6); // 2 rows of 3 on mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCategories(8); // 2 rows of 4 on tablet
      } else {
        setVisibleCategories(10); // 2 rows of 5 on desktop
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/search/category`);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/category-grid/category=${category}`);
  };

  const handleSeeMore = () => {
    setShowAll(true);
  };

  const handleMouseEnter = (category, event) => {
    // Calculate position based on mouse and viewport
    const rect = event.currentTarget.getBoundingClientRect();
    let x = rect.left + rect.width / 2;
    if (x < 90) x = x * 1.6;
    if (x > 210) x = x/1.2;
    const y = rect.top - 10; // Position above the element
    
    setHoverPosition({ x, y });
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
  };

  const hoverBoxVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    }
  };

  const displayCategories = showAll ? categories : categories.slice(0, visibleCategories);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full relative py-8 px-5 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl shadow-sm mb-8 overflow-hidden">
        {/* Background decorations - enhanced matching the carousel component */}
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
              Explore Categories
            </h3>
          </motion.div>
        </div>
        
        {/* Categories grid - enhanced with better spacing and transition effects */}
        <div className="relative" ref={containerRef}>
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading
              ? [...Array(visibleCategories)].map((_, index) => (
                  <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                    <div className="w-full aspect-square rounded-xl bg-white shadow-sm border border-slate-200 p-3 flex flex-col items-center justify-center">
                      <div className="h-3/5 w-full bg-slate-100 rounded-lg mb-3 animate-pulse"></div>
                      <div className="h-4 w-2/3 bg-slate-100 rounded-md animate-pulse"></div>
                    </div>
                  </motion.div>
                ))
              : displayCategories.map((category, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    onClick={() => handleCategoryClick(category.category)}
                    onMouseEnter={(e) => handleMouseEnter(category, e)}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={(e) => handleMouseEnter(category, e)}
                    onTouchEnd={handleMouseLeave}
                    className="cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" 
                      }}
                      className="w-full aspect-square rounded-xl bg-white shadow-sm border border-slate-200/80 hover:border-blue-400/10 p-3 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Top accent bar */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Top right corner accent */}
                      <div className="absolute -right-2 -top-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rotate-45 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      
                      {/* Category image */}
                      <div className="h-3/5 w-full flex items-center justify-center mb-3">
                        <motion.img
                          src={category.image}
                          alt={category.category}
                          className="max-h-full max-w-full object-contain filter drop-shadow-sm rounded"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ 
                            y: 0, 
                            opacity: 1,
                            transition: { delay: index * 0.05 + 0.2 }
                          }}
                        />
                      </div>
                      
                      {/* Category name */}
                      <p className="text-sm font-medium text-center truncate max-w-full text-slate-600 hover:text-blue-600 transition-colors duration-300">
                        {category.category}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
          </motion.div>
          
          {/* Hover info box - enhanced with better styling */}
          <AnimatePresence>
            {hoveredCategory && (
              <motion.div
                variants={hoverBoxVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed z-50 bg-white rounded-xl shadow-xl p-4 pointer-events-none transform -translate-x-1/2 -translate-y-full w-60 border border-slate-100"
                style={{ 
                  top: `${hoverPosition.y}px`, 
                  left: `${hoverPosition.x}px` 
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 mb-3 flex items-center justify-center">
                    <img
                      src={hoveredCategory.image}
                      alt={hoveredCategory.category}
                      className="max-h-20 max-w-20 object-contain drop-shadow-sm"
                    />
                  </div>
                  
                  <h4 className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    {hoveredCategory.category}
                  </h4>
                  
                  <p className="text-sm text-gray-600 text-center">
                    Explore our {hoveredCategory.category} collection with the latest styles and trends.
                  </p>
                  
                  {/* Triangle pointer - refined */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      {/* See more button */}
      {!showAll && !loading && categories.length > visibleCategories && (
        <div className="mt-6 py-2 px-7 text-center">
          <motion.button 
            onClick={handleSeeMore}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
          >
            <span className="flex items-center px-6 bg-black/50 text-stone-200 backdrop-blur-md p-2 rounded-lg">
  Show All
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
</span>

          </motion.button>
        </div>
      )}
      </div>
    </div>
  );
};

export default CategoryGrid;