import "./BrandScroller.css";
import { motion } from "framer-motion";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import columbus from "./images/columbus.png";
import paragon from "./images/paragon.jpg";
import shoe from "./images/shoe.jpg";
import shoefact from "./images/shoefact.jpeg";

const brands = [
  { id: 1, name: "Paragon", image: paragon },
  { id: 3, name: "Shoe Factory", image: shoefact },
  { id: 4, name: "Columbus", image: columbus },
  { id: 5, name: "--Others--", image: shoe },
];

const URL = 'https://saleem-footwear-api.vercel.app/api/v1/search/brand';

// Create motion components
const MotionContainer = motion.div;
const MotionCard = motion.div;

const BrandScroller = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(URL, {
          maxBodyLength: Infinity
        });
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category-grid/brand=${category}`);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <MotionContainer
      className="brand-cont"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Brands We Deal in:
      </motion.h3>
      
      <div className="brand-container">
        {brands.map((brand) => (
          <MotionCard
            key={brand.id}
            className="brand-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.img 
              src={brand.image} 
              alt={brand.name}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {brand.name}
            </motion.p>
          </MotionCard>
        ))}
      </div>
    </MotionContainer>
  );
};

export default BrandScroller;