import { Box, Button, Center, Divider, Flex, Heading, HStack, Image, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Category.css';

const URL = 'https://saleem-footwear-api.vercel.app/api/v1/search/category';
const CATEGORIES_PER_PAGE = 10; // Set the limit for categories per page

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if more categories are available
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async (page) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const response = await axios.get(URL, {
        params: {
          page,
          limit: CATEGORIES_PER_PAGE
        }
      });
      
      // Append new categories to existing ones
      setCategories((prevCategories) => [...prevCategories, ...response.data.data]);

      // Check if there are more categories to load
      setHasMore(response.data.data.length === CATEGORIES_PER_PAGE);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Increment page to load more categories
  };

  const handleCategoryClick = (category) => {
    navigate(`/category-grid/category=${category}`);
  };

  return (
    <Box mt={5} boxShadow="lg" p={5} borderRadius="md" bg="gray.50">
      <Heading as="h3" size="md" mb={4} textAlign="left">
        Explore Your Category:
      </Heading>

      <HStack
        spacing={4}
        overflowX="auto"
        py={2}
        px={1}
        css={{
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(50, 50, 93, 0.25)",
            borderRadius: "8px",
          },
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={index}
            flexShrink={0}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            boxShadow="sm"
            bg="white"
            p={3}
            textAlign="center"
            cursor="pointer"
            _hover={{ boxShadow: "md", transform: "scale(1.05)", transition: "0.3s" }}
            onClick={() => handleCategoryClick(category.category)}
          >
            <Image
              src={category.image}
              alt={category.category}
              h="130px"
              w="full"
              objectFit="cover"
              mb={2}
              borderRadius="sm"
            />
            <Text fontWeight="bold" color="red.600">
              {category.category}
            </Text>
          </Box>
        ))}
      </HStack>

      <Flex justifyContent="center" mt={4}>
        {hasMore && !loading && (
          <Button
            colorScheme="red"
            onClick={handleLoadMore}
            size="sm"
            variant="solid"
          >
            Load More
          </Button>
        )}
        {loading && (
          <Center>
            <Spinner size="sm" />
          </Center>
        )}
      </Flex>
      <Divider borderColor="gray.800"  mt={5}/>;
    </Box>
  );
};

export default CategoryGrid;
