import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Image,
  Flex,
  Spinner,
  useBreakpointValue,
  Skeleton,
  SkeletonText,
  Container,
  chakra,
  shouldForwardProp,
} from "@chakra-ui/react";
import { isValidMotionProp, motion } from "framer-motion";

const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

const MotionHeading = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const URL = "https://saleem-footwear-api.vercel.app/api/v1";

const useFetchData = (url, limit = 20) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Changed to true initially
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const fetchData = async (page) => {
    if ((loading && page > 1) || !hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get(url, {
        params: { page, limit },
      });
      if (response.data.products.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...response.data.products]);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageRef.current);
  }, [url]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollPosition = window.scrollY;
      if (
        currentScrollPosition >= scrollableHeight - 100 &&
        hasMore &&
        !loading
      ) {
        pageRef.current += 1;
        fetchData(pageRef.current);
      }
    };

    if (hasMore) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return { data, loading, error, hasMore };
};

const ProductCard = ({ product, index }) => {
  return (
    <MotionGridItem
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="lg"
      _hover={{
        boxShadow: "2xl",
      }}
      transform="auto"
    >
      <Link to={`/product/${product._id}`}>
        <Box position="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={product.images[0]}
              alt={`${product.brand} ${product.article}`}
              boxSize="100%"
              objectFit="contain"
              height="250px"
              padding={"0.2em"}
              transition="0.3s ease-in-out"
            />
          </motion.div>
          <Box
            position="absolute"
            top="4"
            right="4"
            background="rgba(255, 255, 255, 0.9)"
            p={2}
            borderRadius="full"
            boxShadow="md"
          >
            <Text
              fontSize="sm"
              color="red.500"
              fontWeight="bold"
              textTransform="uppercase"
            >
              {product.brand}
            </Text>
          </Box>
        </Box>

        <Box p={6} bg="white">
          <Heading size="md" noOfLines={1} color="red.600" mb={2}>
            {product.article}
          </Heading>
          <Text color="gray.700" fontSize="lg" fontWeight="bold" mb={3}>
            ₹{product.price}
          </Text>
          <Text
            fontSize="sm"
            color="gray.500"
            noOfLines={2}
            fontWeight="medium"
          >
            Colors:{" "}
            {product.colors && Object.keys(product.colors).length > 0
              ? Object.keys(product.colors).join(", ")
              : "N/A"}
          </Text>
        </Box>
      </Link>
    </MotionGridItem>
  );
};

const ProductCardSkeleton = () => (
  <GridItem borderRadius="lg" overflow="hidden" bg="white" boxShadow="lg">
    <Box position="relative">
      <Skeleton height="250px" />
      <Box position="absolute" top="4" right="4" width="60px">
        <Skeleton height="24px" borderRadius="full" />
      </Box>
    </Box>

    <Box p={6} bg="white">
      <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="6" />
      <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="4" />
      <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="3" />
    </Box>
  </GridItem>
);

const ProductGrid = () => {
  const {
    data: products,
    loading,
    error,
    hasMore,
  } = useFetchData(`${URL}/products`);
  const columns = useBreakpointValue({
    base: "repeat(2, 1fr)", // Changed to always show 2 columns on mobile
    md: "repeat(3, 1fr)",
    lg: "repeat(4, 1fr)",
    xl: "repeat(5, 1fr)",
  });

  if (error) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Heading as="h2" color="red.500">
          Something went wrong
        </Heading>
      </Flex>
    );
  }

  const skeletonArray = Array.from({ length: 8 }, (_, index) => index);

  return (
    <Box bg="gray.50" minHeight="100vh">
      <Container maxW="8xl" py={{ base: 8, md: 12 }}>
        <MotionHeading
          as="h1"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="800"
          textAlign="center"
          mb={{ base: 6, md: 10 }}
          color="red.600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          letterSpacing="tight"
        >
          Our Products
          <Box
            as="span"
            display="block"
            height="4px"
            bg="red.500"
            width="60px"
            mx="auto"
            mt={3}
            borderRadius="full"
          />
        </MotionHeading>

        <MotionGrid
          templateColumns={columns}
          gap={{ base: 3, md: 6, lg: 8 }}
          p={{ base: 2, md: 4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading && products.length === 0
            ? skeletonArray.map((index) => <ProductCardSkeleton key={index} />)
            : products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
        </MotionGrid>

        {loading && products.length > 0 && (
          <Flex
            justify="center"
            mt={8}
            mb={8}
            direction="column"
            align="center"
            gap={4}
          >
            <Spinner size="xl" color="red.500" thickness="4px" speed="0.65s" />
            <Text color="gray.600" fontSize="lg">
              Loading more products...
            </Text>
          </Flex>
        )}
      </Container>
    </Box>
  );
};

export default ProductGrid;
