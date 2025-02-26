import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import { ChevronDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { URL } from "../context/url";

// Enhanced animations
const addToCartAnimation = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(0.95); }
  75% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideAnimation = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(30px);
    filter: blur(10px);
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
    filter: blur(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ProductCard = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [sizes, setSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();
  const [isHovering, setIsHovering] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Chakra UI AlertDialog state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dialogMessage, setDialogMessage] = useState("");
  const cancelRef = React.useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${URL}/products/${id}`
        );
        setProduct(response.data.product);
        if (response.data?.product.itemSet) {
          if (response.data.product.itemSet.length > 0) {
            setSelectedSize({
              size: response.data.product.itemSet[0].size,
              lengths: response.data.product.itemSet[0].lengths,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error fetching product",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchProduct();
  }, [id, toast]);

  const addToCart = async (product, selectedColor, selectedSize, quantity) => {
    try {
      // Construct the request body
      const requestBody = {
        productId: product.id, // Assuming `product.id` contains the product ID
        quantity: quantity,
        itemSet: [
          {
            size: selectedSize.size,
            lengths: selectedSize.lengths, // Update this value as needed or make it dynamic
          },
        ],
        color: selectedColor,
      };

      // Make the POST request
      const response = await axios.post(
        `${URL}/cart/add-to-cart`, // Replace with your actual endpoint
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token for authentication
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Return the response from the server
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setDialogMessage("Please log in to add items to your cart");
      onOpen();
      return;
    }

    if (!selectedColor || !selectedSize) {
      toast({
        title: "Selection Required",
        description: "Please select both color and size",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, selectedColor, selectedSize, quantity);
      toast({
        title: "Added to Cart!",
        description: `${quantity} ${product.article} added successfully`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  const imagesToShow = selectedColor
    ? product?.colors[selectedColor] ?? []
    : product?.images ?? [];

  console.log(product);
  const nextImage = () => {
    if (imagesToShow?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imagesToShow.length);
    }
  };

  const prevImage = () => {
    if (imagesToShow?.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + imagesToShow.length) % imagesToShow.length
      );
    }
  };

  if (!product) {
    return (
      <Flex
        height="100vh"
        justify="center"
        align="center"
        transition="all 0.3s ease"
      >
        <Box textAlign="center">
          <Spinner
            size="xl"
            color="red.500"
            thickness="4px"
            transition="all 0.3s ease"
          />
        </Box>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={{ base: 1, md: 1 }}>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={{ base: 4, md: 8, lg: 12 }}
      >
        {/* Image Gallery with Overlay Controls */}
        <Box
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          bg="gray.50"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          transition="transform 0.3s ease-in-out"
          _hover={{ transform: "scale(1.02)" }}
          boxShadow="lg" // Added shadow border
        >
          <Box
            position="relative"
            h={{ base: "450px", md: "600px", lg: "700px" }}
          >
            <Image
              src={imagesToShow[currentImageIndex]}
              alt={product.article}
              objectFit="contain"
              w={{ base: "100%", md: "90%" }}
              h="100%"
              margin="0 auto"
              transition="all 0.5s ease"
              animation={`${slideAnimation} 0.5s ease`}
              boxShadow="lg" // Added shadow border
            />

            {/* Navigation Buttons */}
            <IconButton
              icon={<ChevronLeftIcon />}
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              onClick={prevImage}
              opacity={isHovering ? 0.8 : 0}
              transition="all 0.3s ease"
              _hover={{ opacity: 1, bg: "white" }}
              bg="white"
              size={{ base: "sm", md: "md" }}
              isRound
              boxShadow="lg" // Added shadow border
              zIndex={2}
            />
            <IconButton
              icon={<ChevronRightIcon />}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              onClick={nextImage}
              opacity={isHovering ? 0.8 : 0}
              transition="all 0.3s ease"
              _hover={{ opacity: 1, bg: "white" }}
              bg="white"
              size={{ base: "sm", md: "md" }}
              isRound
              boxShadow="lg" // Added shadow border
              zIndex={2}
            />

            {/* Overlay Thumbnails */}
            <Flex
              position="absolute"
              bottom={4}
              left="50%"
              transform="translateX(-50%)"
              gap={2}
              bg="rgba(255, 255, 255, 0.8)"
              p={2}
              borderRadius="lg"
              maxW="90%"
              overflowX="auto"
              opacity={isHovering ? 1 : 0}
              transition="all 0.3s ease"
              zIndex={2}
              boxShadow="lg" // Added shadow border
              sx={{
                "&::-webkit-scrollbar": {
                  height: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "2px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {imagesToShow?.map((img, idx) => (
                <Box
                  key={idx}
                  as="button"
                  flexShrink={0}
                  w={{ base: "40px", md: "60px" }}
                  h={{ base: "40px", md: "60px" }}
                  borderRadius="md"
                  overflow="hidden"
                  border={currentImageIndex === idx ? "2px solid" : "1px solid"}
                  borderColor={
                    currentImageIndex === idx ? "red.500" : "gray.200"
                  }
                  transition="all 0.2s ease"
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => setCurrentImageIndex(idx)}
                  bg="white"
                  boxShadow="lg" // Added shadow border
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>

        {/* Product Details - Reorganized */}
        <Stack
          spacing={{ base: 1, md: 2 }}
          boxShadow="lg"
          p={{ base: 2, md: 6 }}
        >
          {/* Article Name */}
          <Box boxShadow="sm">
            <Heading size={{ base: "lg", md: "xl" }}>{product.article}</Heading>
          </Box>

          {/* Color Selection with Inline Header */}
          <Box boxShadow="sm">
            <Flex
              align="center"
              maxW="100%"
              overflowX="auto"
              overflowY="hidden"
              whiteSpace="nowrap"
              gap={4}
              css={{
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  height: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(0, 0, 0, 0.1)",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "2px",
                },
                msOverflowStyle: "none",
              }}
            >
              <Text fontWeight="semibold" flexShrink={0} pl={1}>
                Color
              </Text>
              <Flex display="inline-flex" gap={2} py={2}>
                {product.colors &&
                  Object.keys(product.colors).map((color, idx) => (
                    <Button
                      key={color}
                      disabled={!product.colorsStock[idx].inStock}
                      variant={selectedColor === color ? "solid" : "outline"}
                      colorScheme="red"
                      onClick={() => setSelectedColor(color)}
                      transition="all 0.2s ease"
                      _hover={{ transform: "translateY(-2px)" }}
                      size={{ base: "sm", md: "md" }}
                      flexShrink={0}
                      minW="auto"
                      boxShadow="sm"
                    >
                      {color}
                    </Button>
                  ))}
              </Flex>
            </Flex>
          </Box>

          {/* Price */}
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="red.600"
            boxShadow="sm"
          >
            MRP: ₹{product.price}
          </Text>

          {/* Size Selection Dropdown with Inline Header */}
          <Box boxShadow="sm">
            <Flex align="center" gap={4}>
              <Text fontWeight="semibold" flexShrink={0}>
                Size
              </Text>
              <Menu w="full">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  colorScheme="red"
                  variant="outline"
                  flex={1}
                  boxShadow="sm"
                >
                  {selectedSize.size
                    ? `${selectedSize.size} (${selectedSize.lengths} pieces)`
                    : "Select Size"}
                </MenuButton>
                <MenuList>
                  {product.itemSet.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={() =>
                        setSelectedSize({
                          size: item.size,
                          lengths: item.lengths,
                        })
                      }
                    >
                      Size {item.size} ({item.lengths} pieces)
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
          </Box>

          {/* Quantity Selector */}
          <Flex align="center" gap={4} boxShadow="sm">
            <Text fontWeight="semibold">Quantity:</Text>
            <Flex align="center" gap={2}>
              <IconButton
                icon={<MinusIcon />}
                onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                colorScheme="red"
                variant="outline"
                transition="all 0.2s ease"
                _hover={{ transform: "scale(1.1)" }}
                size={{ base: "sm", md: "md" }}
                boxShadow="sm"
              />
              <Text
                fontWeight="medium"
                w="8"
                textAlign="center"
                fontSize={{ base: "md", md: "lg" }}
              >
                {quantity}
              </Text>
              <IconButton
                icon={<AddIcon />}
                onClick={() => setQuantity((q) => q + 1)}
                colorScheme="red"
                variant="outline"
                transition="all 0.2s ease"
                _hover={{ transform: "scale(1.1)" }}
                size={{ base: "sm", md: "md" }}
                boxShadow="sm"
              />
            </Flex>
          </Flex>

          {/* Add to Cart Button */}
          <Button
            colorScheme="red"
            size={{ base: "md", md: "lg" }}
            onClick={handleAddToCart}
            w="100%"
            h={{ base: "12", md: "14" }}
            fontSize={{ base: "md", md: "lg" }}
            mt={4}
            isLoading={isAddingToCart}
            transition="all 0.3s ease"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            _active={{ transform: "scale(0.95)" }}
            animation={
              isAddingToCart ? `${addToCartAnimation} 0.3s ease` : "none"
            }
            boxShadow="lg"
          >
            Add to Cart
          </Button>
        </Stack>
      </Grid>

      {/* Keep Alert Dialog the same */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Notice</AlertDialogHeader>
            <AlertDialogBody>{dialogMessage}</AlertDialogBody>
            <AlertDialogFooter>
              {dialogMessage.includes("log in") ? (
                <>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => navigate("/login")}
                    ml={3}
                  >
                    Go to Login
                  </Button>
                </>
              ) : (
                <Button colorScheme="red" onClick={onClose}>
                  OK
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default ProductCard;
