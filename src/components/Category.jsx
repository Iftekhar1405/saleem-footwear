import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { URL } from "../context/url";
import {
  Box,
  Container,
  Flex,
  Grid,
  Text,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";

// Enhanced skeleton component with modern styling
const CategorySkeleton = () => (
  <Box
    borderRadius="xl"
    overflow="hidden"
    bg="white"
    boxShadow="sm"
    borderColor="gray.100"
    borderWidth="1px"
    p={4}
    height="100%"
    position="relative"
    transition="all 0.3s"
  >
    <Box 
      height="130px" 
      borderRadius="lg" 
      mb={3}
      bg="gray.100" 
    />
    <Box height="20px" width="70%" mx="auto" bg="gray.100" borderRadius="md" />
    
    {/* Subtle decorative element */}
    <Box 
      position="absolute" 
      top="10%" 
      right="10%" 
      width="20px" 
      height="20px" 
      borderRadius="full"
      background="linear-gradient(45deg, #6366F1, #8B5CF6)"
      opacity="0.1"
      filter="blur(8px)"
    />
  </Box>
);

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const navigate = useNavigate();

  // Responsive values adjusted for 3 on mobile, 5 on desktop
  const gridColumns = useBreakpointValue({ 
    base: 3,     // 3 cards on mobile (small screens)
    md: 4,       // 4 cards on medium screens
    lg: 5        // 5 cards on desktop (large screens)
  });
  
  const initialDisplay = useBreakpointValue({ 
    base: 6,     // Show 6 initially on mobile (2 rows of 3)
    md: 8,       // Show 8 initially on medium screens
    lg: 10       // Show 10 initially on desktop (2 rows of 5)
  });
  
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  
  // Theme colors adjusted for white background
  const accentColor = "indigo.500";
  const accentGradient = "linear(to-r, indigo.400, purple.500)";
  const textGradient = "linear(to-r, indigo.400, purple.500)";

  useEffect(() => {
    fetchCategories();
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

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200,
        delay: 0.1,
      },
    },
  };

  const displayCategories = showAll ? categories : categories.slice(0, initialDisplay);

  return (
    <Container maxW="container.xl" p={{ base: 2, md: 4 }}>
      <Box
        ref={containerRef}
        as={motion.div}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        borderRadius="xl"
        overflow="hidden"
        bg="white"
        p={{ base: 4, md: 6 }}
        position="relative"
        boxShadow="md"
      >
        {/* Subtle decorative elements */}
        <Box 
          position="absolute" 
          top="-5%" 
          left="-5%" 
          width="150px" 
          height="150px" 
          borderRadius="full"
          bgGradient="linear(to-br, indigo.100, purple.100)"
          opacity="0.3"
          filter="blur(40px)"
          zIndex="0"
        />
        
        {/* Title with animated underline */}
        <Flex 
          direction="column" 
          position="relative" 
          zIndex="1"
          mb={6}
        >
          <motion.div variants={titleVariants}>
            <Text
              fontSize={headingSize}
              fontWeight="700"
              bgGradient={textGradient}
              bgClip="text"
              mb={2}
              letterSpacing="tight"
            >
              Explore Categories
            </Text>
          </motion.div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Box 
              h="3px" 
              bgGradient={accentGradient} 
              borderRadius="full"
            />
          </motion.div>
        </Flex>

        {/* Category grid - adjusted for 3/5 columns */}
        <Grid
          as={motion.div}
          variants={containerVariants}
          templateColumns={{ 
            base: "repeat(3, 1fr)", 
            md: "repeat(4, 1fr)", 
            lg: "repeat(5, 1fr)" 
          }}
          gap={{ base: 3, md: 4 }}
          mb={6}
          position="relative"
          zIndex="1"
        >
          <AnimatePresence>
            {loading
              ? [...Array(initialDisplay)].map((_, index) => (
                  <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                    <CategorySkeleton />
                  </motion.div>
                ))
              : displayCategories.map((category, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    layoutId={`category-${index}`}
                  >
                    <Box
                      borderRadius="lg"
                      overflow="hidden"
                      bg="white"
                      boxShadow="sm"
                      borderColor="gray.100"
                      borderWidth="1px"
                      p={{ base: 2, md: 3 }}
                      height="100%"
                      onClick={() => handleCategoryClick(category.category)}
                      cursor="pointer"
                      position="relative"
                      transition="all 0.2s"
                      _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: "md",
                        borderColor: "indigo.100"
                      }}
                      as={motion.div}
                      whileHover={{ 
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Image container with subtle hover effects */}
                      <Flex
                        height={{ base: "100px", md: "130px" }}
                        alignItems="center"
                        justifyContent="center"
                        mb={2}
                        borderRadius="md"
                        overflow="hidden"
                        bg="gray.50"
                        position="relative"
                      >
                        <Box
                          as={motion.img}
                          src={category.image}
                          alt={category.category}
                          maxH="85%"
                          maxW="85%"
                          objectFit="contain"
                          transition="transform 0.3s ease"
                          layoutId={`category-image-${index}`}
                          whileHover={{ scale: 1.05 }}
                        />
                      </Flex>
                      
                      {/* Category name */}
                      <Text
                        fontWeight="600"
                        textAlign="center"
                        fontSize={{ base: "xs", md: "sm" }}
                        color="gray.800"
                        noOfLines={1}
                        transition="all 0.3s"
                        _groupHover={{ 
                          bgGradient: textGradient,
                          bgClip: "text"
                        }}
                      >
                        {category.category}
                      </Text>
                    </Box>
                  </motion.div>
                ))}
          </AnimatePresence>
        </Grid>

        {/* "See More" button with animations */}
        {!showAll && !loading && categories.length > initialDisplay && (
          <Flex justifyContent="center" mt={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSeeMore}
                size={{ base: "md", md: "lg" }}
                px={8}
                py={{ base: 5, md: 6 }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="600"
                borderRadius="full"
                position="relative"
                overflow="hidden"
                bgGradient={accentGradient}
                color="white"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                }}
                _active={{
                  transform: "translateY(1px)",
                  boxShadow: "none",
                }}
              >
                <Text>Explore All</Text>
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="white"
                  opacity="0.1"
                  transform="skewX(-20deg) translateX(-70%)"
                  transition="transform 0.7s ease"
                  _groupHover={{ transform: "skewX(-20deg) translateX(170%)" }}
                />
              </Button>
            </motion.div>
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default CategoryGrid;