import { 
  Box, 
  Button, 
  Center, 
  Divider, 
  Flex, 
  Heading, 
  HStack, 
  Image, 
  Skeleton, 
  SkeletonText,
  Spinner, 
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Category.css';

const URL = 'https://saleem-footwear-api.vercel.app/api/v1/search/category';
const CATEGORIES_PER_PAGE = 10;

const MotionBox = motion(Box);
const MotionDivider = motion(Divider);

const CategorySkeleton = () => (
  <Box 
    flexShrink={0} 
    borderWidth="1px" 
    borderRadius="md" 
    overflow="hidden" 
    boxShadow="sm" 
    bg="white" 
    p={3} 
    width="200px"
  >
    <Skeleton height="130px" borderRadius="sm" mb={2} />
    <SkeletonText mt="2" noOfLines={1} spacing="4" />
  </Box>
);

const DecorativeDivider = ({ isTop = true }) => (
  <Flex align="center" my={4}>
    <MotionDivider 
      borderColor="red.400" 
      borderWidth="2px"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 1, delay: 0.2 }}
    />
    <Box 
      bg="red.500" 
      w={3} 
      h={3} 
      borderRadius="full" 
      mx={2}
      transform={isTop ? "translateY(1px)" : "translateY(-1px)"}
    />
    <MotionDivider 
      borderColor="red.400" 
      borderWidth="2px"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 1, delay: 0.2 }}
    />
  </Flex>
);

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  const navigate = useNavigate();

  const fetchCategories = async (page) => {
    if (loadingMore) return;
    
    if (page === 1) {
      setInitialLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(URL, {
        params: {
          page,
          limit: CATEGORIES_PER_PAGE
        }
      });
      
      setCategories((prevCategories) => [...prevCategories, ...response.data.data]);
      setHasMore(response.data.data.length === CATEGORIES_PER_PAGE);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category-grid/category=${category}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

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
        <Heading 
          as="h3" 
          size="md" 
          mb={4} 
          textAlign="left"
          bgGradient="linear(to-r, red.500, red.300)"
          bgClip="text"
        >
          Explore Your Category:
        </Heading>
      </motion.div>

      <HStack
        spacing={4}
        overflowX="auto"
        py={4}
        px={2}
        css={{
          "&::-webkit-scrollbar": {
            height: "1px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#e53e3e",
            borderRadius: "8px",
          },
        }}
      >
        {initialLoading ? (
          [...Array(5)].map((_, index) => (
            <CategorySkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          categories.map((category, index) => (
            <MotionBox
              key={index}
              variants={itemVariants}
              flexShrink={0}
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
                transition: { duration: 0.2 }
              }}
              onClick={() => handleCategoryClick(category.category)}
            >
              <Image
                src={category.image}
                alt={category.category}
                h="130px"
                w="200px"
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
          ))
        )}
        {loadingMore && <CategorySkeleton />}
      </HStack>

      <Flex justifyContent="center" mt={6}>
        {hasMore && !initialLoading && !loadingMore && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              colorScheme="red"
              onClick={handleLoadMore}
              size="md"
              px={8}
              shadow="md"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
              }}
            >
              Load More
            </Button>
          </motion.div>
        )}
        {loadingMore && (
          <Center>
            <Spinner 
              size="md" 
              color="red.500" 
              thickness="3px"
              speed="0.8s"
            />
          </Center>
        )}
      </Flex>

      <DecorativeDivider isTop={false} />
    </MotionBox>
  );
};

export default CategoryGrid;