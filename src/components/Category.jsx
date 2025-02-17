import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Image,
  Skeleton,
  SkeletonText,
  Spinner,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const URL = "https://saleem-footwear-api.vercel.app/api/v1/search/category";

const MotionBox = motion(Box);
const MotionDivider = motion(Divider);
const MotionGrid = motion(Grid);

const CategorySkeleton = () => (
  <Box
    borderWidth="1px"
    borderRadius="md"
    overflow="hidden"
    boxShadow="sm"
    bg="white"
    p={3}
    width="100%"
  >
    <Skeleton height="130px" borderRadius="sm" mb={2} />
    <SkeletonText mt="2" noOfLines={1} spacing="4" />
  </Box>
);

const DecorativeDivider = ({ isTop = true }) => (
  <Flex align="center" my={4}>
    <MotionDivider
      borderColor="slate.400"
      borderWidth="2px"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2.4, delay: 0.6 }}
    />
    <Box
      bg="black"
      w={3}
      h={3}
      borderRadius="full"
      mx={2}
      transform={isTop ? "translateY(1px)" : "translateY(-1px)"}
    />
    <MotionDivider
      borderColor="slate.400"
      borderWidth="2px"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2.4, delay: 0.6 }}
    />
  </Flex>
);

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category-grid/category=${category}`);
  };

  const handleSeeMore = () => {
    setShowAll(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const displayCategories = showAll ? categories : categories.slice(0, 2);

  return (
    <MotionBox
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      mt={1}
      boxShadow="lg"
      p={3}
      borderRadius="md"
      bg="gray.50"
    >
      <DecorativeDivider isTop={true} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#2D3748"
          }}
        >
          Explore Your Category:
        </motion.h3>
      </motion.div>

      <MotionGrid
        templateColumns="repeat(2, 1fr)"
        gap={4}
        px={2}
        py={4}
        variants={containerVariants}
      >
        {loading
          ? [...Array(2)].map((_, index) => (
              <CategorySkeleton key={`skeleton-${index}`} />
            ))
          : displayCategories.map((category, index) => (
              <MotionBox
                key={index}
                variants={itemVariants}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                boxShadow="sm"
                bg="white"
                p={3}
                textAlign="center"
                cursor="pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "xl",
                  transition: { duration: 0.2 },
                }}
                onClick={() => handleCategoryClick(category.category)}
              >
                <Image
                  src={category.image}
                  alt={category.category}
                  h="130px"
                  w="100%"
                  objectFit="contain"
                  mb={2}
                  borderRadius="sm"
                />
                <Text
                  fontWeight="bold"
                  bgGradient="linear(to-r, red.500, red.300)"
                  bgClip="text"
                >
                  {category.category}
                </Text>
              </MotionBox>
            ))}
      </MotionGrid>

      {!showAll && !loading && categories.length > 2 && (
        <Flex justifyContent="center" mt={6}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              colorScheme="red"
              onClick={handleSeeMore}
              size="md"
              px={8}
              shadow="md"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
              }}
            >
              See More
            </Button>
          </motion.div>
        </Flex>
      )}

      <DecorativeDivider isTop={false} />
    </MotionBox>
  );
};

export default CategoryGrid;