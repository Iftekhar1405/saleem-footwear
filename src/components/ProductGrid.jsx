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
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { isValidMotionProp, motion } from "framer-motion";
import { URL } from "../context/url";
import altImage from "./images/altImage.jpeg"

// Motion components configuration
const MotionGrid = motion(Grid);
const MotionGridItem = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});
const MotionHeading = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});
const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});
const MotionImage = chakra(motion.img, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

// Custom hook for data fetching remains the same
const useFetchData = (url, limit = 20) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const fetchData = async (page, isInitialFetch = false) => {
    if ((loadingMore && page > 1) || !hasMore) return;

    if (isInitialFetch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(url, {
        params: { page, limit },
      });

      if (response.data.products.length === 0) {
        setHasMore(false);
      } else {
        const newProducts = response.data.products;
        setData((prevData) => {
          return page === 1 ? newProducts : [...prevData, ...newProducts];
        });
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData(1, true);
  }, [url]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollPosition = window.scrollY;

      if (
        currentScrollPosition >= scrollableHeight * 0.85 &&
        hasMore &&
        !loading &&
        !loadingMore
      ) {
        pageRef.current += 1;
        fetchData(pageRef.current, false);
      }
    };

    if (hasMore) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

  return { data, loading, loadingMore, error, hasMore };
};

// Enhanced ProductCard Component - Fixed hooks issue
const ProductCard = ({ product, index }) => {
  // All hooks must be called unconditionally at the top level
  const [isHovered, setIsHovered] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const accentColor = useColorModeValue("red.500", "red.300");
  const animationDelay = Math.min((index % 12) * 0.05, 0.3);

  // Generate a gradient based on brand
  const generateBrandGradient = (brand) => {
    if (!brand)
      return "linear-gradient(135deg, hsl(350, 80%, 55%), hsl(330, 85%, 40%))";
    const brandHash = brand
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue1 = (brandHash % 60) + 330; // Keep in red/purple range
    const hue2 = ((brandHash * 7) % 60) + 330;
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 55%), hsl(${hue2}, 85%, 40%))`;
  };

  const brandGradient = generateBrandGradient(product.brand);

  return (
    <MotionGridItem
      as="article"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay, ease: "easeOut" }}
      whilehover={{ y: -8, transition: { duration: 0.2 } }}
      borderRadius="xl"
      overflow="hidden"
      bg={bgColor}
      boxShadow="md"
      position="relative"
      zIndex={1}
      _hover={{
        boxShadow: "xl",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Link
        to={`/product/${product._id}`}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Card top accent line with brand gradient */}
        <Box height="4px" width="100%" background={brandGradient} />

        <Box
          position="relative"
          overflow="hidden"
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={3}
        >
          {/* Futuristic backdrop glow on hover */}
          <MotionBox
            position="absolute"
            top="50%"
            left="50%"
            width="80%"
            height="80%"
            borderRadius="full"
            bg={`${accentColor}20`}
            filter="blur(20px)"
            zIndex="-1"
            animate={{
              scale: isHovered ? 1.2 : 0.8,
              opacity: isHovered ? 0.8 : 0,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ x: "-50%", y: "-50%" }}
          />

          <MotionImage
            src={ product.images[0] }
            alt={altImage}
            objectFit="contain"
            maxHeight={{ base: "160px", sm: "180px", md: "220px" }}
            width="100%"
            animate={{
              scale: isHovered ? 1.05 : 1,
              y: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.4 }}
            filter={!product.inStock ? "grayscale(80%)" : "none"}
          />

          {/* Improved Out of Stock Overlay - only render if not in stock */}
          {!product.inStock && (
            <MotionBox
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="rgba(0, 0, 0, 0.4)"
              backdropFilter="blur(3px)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MotionBox
                bg={brandGradient}
                color="white"
                px={4}
                py={2}
                borderRadius="lg"
                boxShadow="0 4px 20px rgba(0,0,0,0.3)"
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "sm", md: "md" }}
                  textShadow="0 2px 4px rgba(0,0,0,0.2)"
                  letterSpacing="wider"
                >
                  OUT OF STOCK
                </Text>
              </MotionBox>
            </MotionBox>
          )}

          {/* Floating brand badge */}
          <MotionBox
            position="absolute"
            top={3}
            right={3}
            background="rgba(255, 255, 255, 0.95)"
            backdropFilter="blur(8px)"
            p={2}
            borderRadius="full"
            boxShadow="0 2px 10px rgba(0,0,0,0.15)"
            animate={{
              scale: isHovered ? 1.1 : 1,
              y: isHovered ? -2 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="bold"
              bgClip="text"
              bgGradient={brandGradient}
              textTransform="uppercase"
              letterSpacing="tight"
            >
              {product.brand}
            </Text>
          </MotionBox>
        </Box>

        <Box
          p={4}
          bg={bgColor}
          borderTopWidth="1px"
          borderColor="gray.100"
          position="relative"
          zIndex={2}
        >
          <Flex justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Heading
              size={{ base: "sm", md: "md" }}
              noOfLines={1}
              color={accentColor}
              fontWeight="700"
              letterSpacing="tight"
            >
              {product.article}
            </Heading>

            {product.inStock && (
              <Badge
                colorScheme="green"
                variant="subtle"
                borderRadius="full"
                px={2}
                fontSize="xs"
              >
                In Stock
              </Badge>
            )}
          </Flex>

          <Flex justifyContent="space-between" alignItems="center" mt={3}>
            <Text
              color={textColor}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
            >
              ₹
              {product.price && typeof product.price === "number"
                ? product.price.toLocaleString()
                : product.price}
            </Text>

            {/* Small indicator for number of colors */}
            {product.colors && Object.keys(product.colors).length > 0 && (
              <Flex alignItems="center">
                <Text fontSize="xs" color="gray.500" mr={1}>
                  {Object.keys(product.colors).length} color
                  {Object.keys(product.colors).length > 1 ? "s" : ""}
                </Text>
                <Flex>
                  {Object.keys(product.colors)
                    .slice(0, 3)
                    .map((color, i) => (
                      <Box
                        key={color}
                        w="10px"
                        h="10px"
                        borderRadius="full"
                        bg={color.toLowerCase()}
                        ml="-2px"
                        borderWidth="1px"
                        borderColor="gray.200"
                        zIndex={3 - i}
                      />
                    ))}
                  {Object.keys(product.colors).length > 3 && (
                    <Text fontSize="8px" ml={1} color="gray.500">
                      +{Object.keys(product.colors).length - 3}
                    </Text>
                  )}
                </Flex>
              </Flex>
            )}
          </Flex>

          {/* Reveal more on hover */}
          <MotionBox
            height={isHovered ? "auto" : "0px"}
            opacity={isHovered ? 1 : 0}
            mt={isHovered ? 2 : 0}
            transition={{ duration: 0.3 }}
            overflow="hidden"
          >
            <Text fontSize="xs" color="gray.500">
              {product.colors && Object.keys(product.colors).length > 0
                ? Object.keys(product.colors).join(", ")
                : "No color options available"}
            </Text>
          </MotionBox>
        </Box>
      </Link>
    </MotionGridItem>
  );
};

// Enhanced ProductCardSkeleton with pulse animation
const ProductCardSkeleton = () => {
  // Always call hooks unconditionally
  const bgColor = useColorModeValue("white", "gray.800");
  const pulseAnimation = `pulse 1.5s infinite ease-in-out`;

  return (
    <GridItem
      borderRadius="xl"
      overflow="hidden"
      bg={bgColor}
      boxShadow="md"
      position="relative"
      height="100%"
    >
      <Box height="4px" width="100%" bg="gray.200" />

      <Box
        position="relative"
        height={{ base: "160px", sm: "180px", md: "220px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={3}
      >
        <Skeleton
          height="80%"
          width="80%"
          borderRadius="lg"
          sx={{ animation: pulseAnimation }}
        />

        <Box position="absolute" top={3} right={3} width="60px">
          <Skeleton height="24px" borderRadius="full" />
        </Box>
      </Box>

      <Box p={4} bg={bgColor}>
        <Flex justifyContent="space-between">
          <SkeletonText width="70%" noOfLines={1} skeletonHeight="5" />
          <Skeleton width="20%" height="20px" borderRadius="full" />
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" mt={3}>
          <Skeleton width="30%" height="24px" />
          <Skeleton width="15%" height="16px" />
        </Flex>
      </Box>
    </GridItem>
  );
};

// Enhanced ProductGrid
const ProductGrid = () => {
  const {
    data: products,
    loading,
    loadingMore,
    error,
    hasMore,
  } = useFetchData(`${URL}/products`);

  // Always call hooks unconditionally
  const columns =
    useBreakpointValue({
      base: "repeat(2, 1fr)",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
      lg: "repeat(4, 1fr)",
      xl: "repeat(5, 1fr)",
    }) || "repeat(1, 1fr)"; // Provide fallback value

  const bgGradient = useColorModeValue(
    "linear-gradient(to bottom, white, #f7f7f9)",
    "linear-gradient(to bottom, gray.900, gray.800)"
  );

  // Get the skeleton count only once, at the top level
  const skeletonCount =
    useBreakpointValue({ base: 2, sm: 4, md: 6, lg: 8 }) || 4;
  const skeletonArray = Array.from(
    { length: skeletonCount },
    (_, index) => index
  );

  // Render error state
  if (error) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="50vh"
        direction="column"
        gap={3}
      >
        <MotionBox
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Heading as="h2" color="red.500">
            Something went wrong
          </Heading>
        </MotionBox>
        <Text>Please try refreshing the page</Text>
      </Flex>
    );
  }

  // Main render
  return (
    <Box bgGradient={bgGradient} minHeight="100vh">
      <Container maxW="8xl" py={{ base: 6, md: 10 }}>
        <MotionHeading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          fontWeight="800"
          textAlign="center"
          mb={{ base: 6, md: 8 }}
          color="red.600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          letterSpacing="tight"
          textTransform="uppercase"
        >
          Our Products
          <MotionBox
            as="span"
            display="block"
            height="4px"
            bg="red.500"
            width={{ base: "40px", md: "60px" }}
            mx="auto"
            mt={2}
            borderRadius="full"
            initial={{ width: "0px" }}
            animate={{ width: ["0px", "60px"] }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </MotionHeading>

        <MotionGrid
          templateColumns={columns}
          gap={{ base: 4, md: 6 }}
          p={{ base: 2, md: 4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {products &&
            products.length > 0 &&
            products.map((product, index) => (
              <ProductCard
                key={`${product._id}-${index}`}
                product={product}
                index={index}
              />
            ))}

          {/* Add placeholder skeletons at the bottom when loading more */}
          {loadingMore &&
            skeletonArray.map((index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}
        </MotionGrid>

        {loading && (!products || products.length === 0) && (
          <MotionGrid
            templateColumns={columns}
            gap={{ base: 4, md: 6 }}
            p={{ base: 2, md: 4 }}
            animate={{
              y: [0, 5, 0],
              transition: { repeat: Infinity, duration: 2 },
            }}
          >
            {skeletonArray.map((index) => (
              <ProductCardSkeleton key={`initial-skeleton-${index}`} />
            ))}
          </MotionGrid>
        )}

        {loadingMore && (
          <Flex
            justify="center"
            mt={8}
            mb={4}
            direction="column"
            align="center"
            gap={2}
          >
            <MotionBox
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Spinner
                size="md"
                color="red.500"
                thickness="3px"
                speed="0.65s"
              />
            </MotionBox>
            <Text color="gray.600" fontSize="sm" fontWeight="medium">
              Loading more products...
            </Text>
          </Flex>
        )}

        {!hasMore && products && products.length > 0 && (
          <MotionBox
            textAlign="center"
            mt={8}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text color="gray.500" fontSize="sm">
              You've reached the end of our product catalog
            </Text>
          </MotionBox>
        )}
      </Container>
    </Box>
  );
};

export default ProductGrid;
