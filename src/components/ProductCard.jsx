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
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  // Chakra UI AlertDialog state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dialogMessage, setDialogMessage] = useState("");
  const cancelRef = React.useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://saleem-footwear-api.vercel.app/api/v1/products/${id}`
        );
        setProduct(response.data.product);
        if (response.data.product.itemSet) {
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
        "https://saleem-footwear-api.vercel.app/api/v1/cart/add-to-cart", // Replace with your actual endpoint
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
      });
      return;
    }

    try {
      await addToCart(product, selectedColor, selectedSize, quantity);
      toast({
        title: "Success",
        description: "Item added to cart",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      <Flex height="100vh" justify="center" align="center">
        <Box textAlign="center">
          <Spinner size="xl" color="red.500" thickness="4px" />
        </Box>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={8}>
        {/* Image Gallery */}
        <Box
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          bg="gray.50"
        >
          <Box position="relative" paddingBottom="">
            {imagesToShow && imagesToShow.length > 0 ? (
              <Box position="relative">
                <Image
                  src={imagesToShow[currentImageIndex]}
                  alt={`${product.brand} ${product.article}`}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  position="relative"
                  top="0"
                  left="0"
                />
                <IconButton
                  icon={<ChevronLeftIcon />}
                  border={"1px solid rgb(174, 191, 221)"}
                  position="absolute"
                  left={2}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={prevImage}
                  bg="white"
                  _hover={{ bg: "gray.100" }}
                  isRound
                />
                <IconButton
                  icon={<ChevronRightIcon />}
                  border={"1px solid rgb(174, 191, 221)"}
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={nextImage}
                  bg="white"
                  _hover={{ bg: "gray.100" }}
                  isRound
                />
              </Box>
            ) : (
              <Flex h="100%" align="center" justify="center">
                <Text>No images available</Text>
              </Flex>
            )}
          </Box>

          {/* Thumbnails */}
          <Flex mt={1} gap={2} overflowX="auto" p={1}>
            {imagesToShow?.map((img, idx) => (
              <Box
                key={idx}
                as="button"
                flexShrink={0}
                w="14"
                h="14"
                borderRadius="md"
                overflow="hidden"
                border={currentImageIndex === idx ? "2px solid" : "none"}
                borderColor="red.500"
                onClick={() => setCurrentImageIndex(idx)}
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

        {/* Product Details */}
        <Stack >
          <Box>
            <Heading  size="lg">
              {product.article}
            </Heading>
            <Text fontSize="md" color="gray.600" >
              {product.brand}
            </Text>
          

          
            <Text fontSize="xl" fontWeight="bold" color="red.600" mt={1}>
              ₹{product.price}
            </Text>
            <Text color="gray.600" >
              {product.description}
            </Text>
          </Box>

          {/* Color Selection */}
          <Box>
            <Text fontWeight="semibold" mb={2}>
              Select Color
            </Text>
            <Flex wrap="wrap" gap={2}>
              {product.colors &&
                Object.keys(product.colors).map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "solid" : "outline"}
                    colorScheme='red'
                    borderBottomColor={color}
                    onClick={() => setSelectedColor(color)}
                    px={6}
                    size={'sm'}
                  >
                    {color}
                  </Button>
                ))}
            </Flex>
          </Box>

          {/* Size Selection */}
          <Box>
            <Text fontWeight="semibold" mb={2}>
              Select Size
            </Text>
            <Grid
              templateColumns="repeat(auto-fill, minmax(80px, 1fr))"
              gap={2}
            >
              {product.itemSet.map((item, index) => (
                <Button
                  key={index}
                  variant={selectedSize === item.size ? "solid" : "outline"}
                  colorScheme="red"
                  onClick={() =>
                    setSelectedSize({ size: item.size, lengths: item.lengths })
                  }
                  position="relative"
                >
                  {item.size}
                  <Badge
                    padding={".5em .7em"}
                    position="absolute"
                    top="-3"
                    right="-5"
                    colorScheme="red"
                    fontSize="sm"
                    borderRadius="full"
                  >
                    {`${item.lengths}Pcs`}
                  </Badge>
                </Button>
              ))}
            </Grid>
          </Box>

          {/* Quantity Selector */}
          <Flex align="center" gap={4}>
            <Text fontWeight="semibold">Quantity:</Text>
            <Flex align="center" gap={2}>
              <IconButton
                icon={<MinusIcon />}
                onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                colorScheme="red"
                variant="outline"
                size="sm"
              />
              <Text fontWeight="medium" w="8" textAlign="center">
                {quantity}
              </Text>
              <IconButton
                icon={<AddIcon />}
                onClick={() => setQuantity((q) => q + 1)}
                colorScheme="red"
                variant="outline"
                size="sm"
              />
            </Flex>
          </Flex>

          {/* Add to Cart Button */}
          <Button
            colorScheme="red"
            size="lg"
            onClick={handleAddToCart}
            w="100%"
            h="14"
            fontSize="lg"
          >
            Add to Cart
          </Button>
        </Stack>
      </Grid>

      {/* Alert Dialog */}
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
