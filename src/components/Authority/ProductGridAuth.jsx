import { AddIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ProductCardAuth.css";
import "./ProductGridAuth.css";
import { URL } from "../../context/url";

// API Constants
// const URL = "https://saleem-footwear-api.vercel.app/api/v1";

/**
 * Custom hook for fetching paginated data with infinite scroll
 */
const useFetchData = (url, limit = 20) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const fetchData = async (page) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(url, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.products.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...response.data.products]);
      }
    } catch (err) {
      setError(true);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data when component mounts
  useEffect(() => {
    setData([]);
    pageRef.current = 1;
    setHasMore(true);
    fetchData(pageRef.current);
  }, [url]);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    // Only proceed if we have content that's actually scrollable
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      return; // Page doesn't have a scrollbar, so exit early
    }

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollThreshold = 200; // Load more when within 200px of bottom
    const scrollPosition = window.scrollY;

    // console.log(scrollPosition, scrollableHeight - scrollThreshold);

    // Make sure we've actually scrolled a bit before loading more
    if (
      scrollPosition >= scrollableHeight - scrollThreshold &&
      scrollPosition > 0 && // Ensure some scrolling has happened
      !loading &&
      hasMore
    ) {
      pageRef.current += 1;
      fetchData(pageRef.current);
    }
  }, [loading, hasMore, fetchData]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { data, loading, error, hasMore };
};

/**
 * Product Card Component for display mode
 */
const ProductCard = ({ product, onEdit, onDelete }) => {
  // Helper function to check if a specific color is in stock
  const isColorInStock = (colorName) => {
    if (!product.colorsStock || !Array.isArray(product.colorsStock))
      return true;
    const colorStock = product.colorsStock.find(
      (item) => item.color === colorName
    );
    return colorStock ? colorStock.inStock : true;
  };

  return (
    <Card
      overflow="hidden"
      variant="outline"
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
      height="100%"
    >
      <Box position="relative" height="200px">
        <Image
          src={product.images[0] || "/placeholder-image.jpg"}
          alt={product.article}
          objectFit="cover"
          width="100%"
          height="100%"
          fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
        />
        <HStack position="absolute" top={2} right={2} spacing={2}>
          <Tooltip label="Edit Product">
            <IconButton
              icon={<EditIcon />}
              onClick={() => onEdit(product)}
              colorScheme="blue"
              size="sm"
              variant="solid"
              borderRadius="full"
            />
          </Tooltip>
          <Tooltip label="Delete Product">
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => onDelete(product._id)}
              colorScheme="red"
              size="sm"
              variant="solid"
              borderRadius="full"
            />
          </Tooltip>
        </HStack>
        {!product.inStock && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme="red"
            fontSize="sm"
            px={2}
            py={1}
          >
            Out of Stock
          </Badge>
        )}
      </Box>

      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Heading size="md" noOfLines={1}>
            {product.article}
          </Heading>
          <Text color="gray.600" fontSize="sm" fontWeight="bold">
            {product.brand}
          </Text>
          <Text noOfLines={2} color="gray.600">
            {product.description}
          </Text>

          <Divider />

          <HStack justify="space-between">
            <Badge colorScheme="red" fontSize="md" px={2} py={1}>
              ₹{product.price.toLocaleString()}
            </Badge>
            <Badge colorScheme="blue" fontSize="sm">
              {product.gender}
            </Badge>
          </HStack>

          <HStack>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              Material:
            </Text>
            <Text fontSize="sm">{product.material || "N/A"}</Text>
          </HStack>

          <HStack>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              Category:
            </Text>
            <Text fontSize="sm">{product.category || "N/A"}</Text>
          </HStack>

          {Object.keys(product.colors || {}).length > 0 && (
            <VStack align="stretch" spacing={2}>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Colors:
              </Text>
              <Box>
                {Object.keys(product.colors).map((color) => (
                  <Badge
                    key={color}
                    colorScheme={isColorInStock(color) ? "green" : "red"}
                    mr={2}
                    mb={2}
                  >
                    {color} {isColorInStock(color) ? "" : "(Out of Stock)"}
                  </Badge>
                ))}
              </Box>
            </VStack>
          )}

          {product.colorsStock && product.colorsStock.length > 0 && (
            <Text fontSize="xs" color="gray.500">
              {product.colorsStock.filter((c) => c.inStock).length} of{" "}
              {product.colorsStock.length} colors in stock
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

/**
 * Product Edit Form Component
 */
const ProductEditForm = ({ product, onSave, onCancel }) => {
  const [editedProduct, setEditedProduct] = useState({
    ...product,
    // Ensure colorsStock exists
    colorsStock: product.colorsStock || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleBooleanChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value === "true",
    }));
  };

  const handleColorStockChange = (colorName, inStock) => {
    setEditedProduct((prev) => {
      // Get current colorsStock or initialize if not exists
      const colorsStock = [...(prev.colorsStock || [])];

      // Find if this color already exists in colorsStock
      const colorIndex = colorsStock.findIndex(
        (item) => item.color === colorName
      );

      if (colorIndex >= 0) {
        // Update existing color stock status
        colorsStock[colorIndex] = {
          ...colorsStock[colorIndex],
          inStock,
        };
      } else {
        // Add new color stock entry
        colorsStock.push({
          color: colorName,
          inStock,
        });
      }

      return {
        ...prev,
        colorsStock,
      };
    });
  };

  const handleImageChange = (e, index, type = "default") => {
    if (type === "default") {
      const updatedImages = [...(editedProduct.images || [])];
      updatedImages[index] = e.target.value;
      setEditedProduct((prev) => ({
        ...prev,
        images: updatedImages,
      }));
    } else {
      const updatedColorImages = [...(editedProduct.colors[type] || [])];
      updatedColorImages[index] = e.target.value;
      setEditedProduct((prev) => ({
        ...prev,
        colors: {
          ...prev.colors,
          [type]: updatedColorImages,
        },
      }));
    }
  };

  const addImageField = (type = "default") => {
    if (type === "default") {
      setEditedProduct((prev) => ({
        ...prev,
        images: [...(prev.images || []), ""],
      }));
    } else {
      setEditedProduct((prev) => ({
        ...prev,
        colors: {
          ...prev.colors,
          [type]: [...(prev.colors[type] || []), ""],
        },
      }));
    }
  };

  const handleImageRemove = (index, type = "default") => {
    if (type === "default") {
      const updatedImages = [...(editedProduct.images || [])];
      updatedImages.splice(index, 1);
      setEditedProduct((prev) => ({
        ...prev,
        images: updatedImages,
      }));
    } else {
      const updatedColorImages = [...(editedProduct.colors[type] || [])];
      updatedColorImages.splice(index, 1);
      setEditedProduct((prev) => ({
        ...prev,
        colors: {
          ...prev.colors,
          [type]: updatedColorImages,
        },
      }));
    }
  };

  const addColorField = () => {
    const newColorName = `color${
      Object.keys(editedProduct.colors || {}).length + 1
    }`;

    setEditedProduct((prev) => {
      // Add the color to colors object
      const newColors = {
        ...prev.colors,
        [newColorName]: [],
      };

      // Also add an entry in colorsStock for this new color
      const newColorsStock = [...(prev.colorsStock || [])];
      newColorsStock.push({
        color: newColorName,
        inStock: true,
      });

      return {
        ...prev,
        colors: newColors,
        colorsStock: newColorsStock,
      };
    });
  };

  const handleColorNameChange = (oldColor, newColor) => {
    if (!newColor.trim()) return;

    setEditedProduct((prev) => {
      // Update the color in the colors object
      const newColors = { ...prev.colors };
      newColors[newColor] = newColors[oldColor];
      delete newColors[oldColor];

      // Also update the color name in colorsStock
      const newColorsStock = (prev.colorsStock || []).map((item) => {
        if (item.color === oldColor) {
          return { ...item, color: newColor };
        }
        return item;
      });

      return {
        ...prev,
        colors: newColors,
        colorsStock: newColorsStock,
      };
    });
  };

  const handleRemoveColor = (color) => {
    setEditedProduct((prev) => {
      // Remove color from colors object
      const updatedColors = { ...prev.colors };
      delete updatedColors[color];

      // Also remove the color from colorsStock
      const updatedColorsStock = (prev.colorsStock || []).filter(
        (item) => item.color !== color
      );

      return {
        ...prev,
        colors: updatedColors,
        colorsStock: updatedColorsStock,
      };
    });
  };

  // Helper function to get stock status for a color
  const getColorStockStatus = (colorName) => {
    if (!editedProduct.colorsStock) return true;

    const colorStock = editedProduct.colorsStock.find(
      (item) => item.color === colorName
    );
    return colorStock ? colorStock.inStock : true;
  };

  return (
    <Card
      overflow="hidden"
      variant="outline"
      borderRadius="lg"
      boxShadow="sm"
      bg="white"
    >
      <VStack spacing={4} p={6} align="stretch">
        <Heading size="md" color="blue.600" mb={2}>
          Edit Product
        </Heading>

        <Divider />

        {/* Basic Details Section */}
        <Box>
          <Heading size="sm" mb={4}>
            Basic Details
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl>
              <FormLabel>Article</FormLabel>
              <Input
                name="article"
                value={editedProduct.article || ""}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Brand</FormLabel>
              <Input
                name="brand"
                value={editedProduct.brand || ""}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                name="price"
                value={editedProduct.price || ""}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Main Stock</FormLabel>
              <Select
                name="inStock"
                value={editedProduct.inStock?.toString() || "true"}
                onChange={handleBooleanChange}
              >
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={editedProduct.gender || ""}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
                <option value="kids">Kids</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input
                name="category"
                value={editedProduct.category || ""}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Material</FormLabel>
              <Input
                name="material"
                value={editedProduct.material || ""}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        </Box>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            name="description"
            value={editedProduct.description || ""}
            onChange={handleChange}
          />
        </FormControl>

        <Divider />

        {/* Default Images Section */}
        <Box>
          <Heading size="sm" mb={2}>
            Default Images
          </Heading>
          <VStack spacing={2} align="stretch">
            {(editedProduct.images || []).map((imgUrl, index) => (
              <HStack key={`image-${index}`}>
                <Input
                  value={imgUrl}
                  onChange={(e) => handleImageChange(e, index)}
                  size="sm"
                />
                <IconButton
                  icon={<CloseIcon />}
                  onClick={() => handleImageRemove(index)}
                  colorScheme="red"
                  size="sm"
                  aria-label="Remove image"
                />
              </HStack>
            ))}
            <Button
              leftIcon={<AddIcon />}
              onClick={() => addImageField()}
              size="sm"
              colorScheme="blue"
              variant="ghost"
            >
              Add Image
            </Button>
          </VStack>
        </Box>

        <Divider />

        {/* Colors Section with Stock Management */}
        <Box>
          <Heading size="sm" mb={2}>
            Colors Management
          </Heading>
          <VStack spacing={4} align="stretch">
            {Object.keys(editedProduct.colors || {}).map(
              (color, colorIndex) => (
                <Card
                  key={`color-${colorIndex}`}
                  variant="outline"
                  p={4}
                  bg="gray.50"
                >
                  <VStack spacing={2} align="stretch">
                    <HStack>
                      <Input
                        value={color}
                        onChange={(e) =>
                          handleColorNameChange(color, e.target.value)
                        }
                        placeholder="Color name"
                        size="sm"
                        width="60%"
                      />

                      {/* Color Stock Status Select */}
                      <Select
                        value={getColorStockStatus(color).toString()}
                        onChange={(e) =>
                          handleColorStockChange(
                            color,
                            e.target.value === "true"
                          )
                        }
                        size="sm"
                        width="30%"
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </Select>

                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => handleRemoveColor(color)}
                        colorScheme="red"
                        size="sm"
                        aria-label="Remove color"
                      />
                    </HStack>

                    {(editedProduct.colors[color] || []).map(
                      (imgUrl, index) => (
                        <HStack key={`${color}-image-${index}`}>
                          <Input
                            value={imgUrl}
                            onChange={(e) => handleImageChange(e, index, color)}
                            size="sm"
                          />
                          <IconButton
                            icon={<CloseIcon />}
                            onClick={() => handleImageRemove(index, color)}
                            colorScheme="red"
                            size="sm"
                            aria-label="Remove color image"
                          />
                        </HStack>
                      )
                    )}
                    <Button
                      leftIcon={<AddIcon />}
                      onClick={() => addImageField(color)}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                    >
                      Add Image for {color}
                    </Button>
                  </VStack>
                </Card>
              )
            )}
            <Button
              leftIcon={<AddIcon />}
              onClick={addColorField}
              colorScheme="blue"
              variant="ghost"
            >
              Add New Color
            </Button>
          </VStack>
        </Box>

        <Divider />

        <HStack spacing={4} justify="flex-end">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => onSave(editedProduct)} colorScheme="green">
            Save Changes
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};

/**
 * Main ProductGridAuth Component
 */
const ProductGridAuth = () => {
  const { data: products, loading, error } = useFetchData(`${URL}/products`);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productList, setProductList] = useState([]);

  // Dialog controls
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deletingProductId, setDeletingProductId] = useState(null);
  const cancelRef = useRef();

  const toast = useToast();

  // Update local product list when API data changes
  useEffect(() => {
    setProductList(products);
  }, [products]);

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
  };

  const handleDeleteProduct = (productId) => {
    setDeletingProductId(productId);
    onDeleteOpen();
  };

  const handleSaveProduct = async (editedProduct) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${URL}/products/${editedProduct._id}`,
        editedProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      // Update the local product list
      setProductList(
        productList.map((product) =>
          product._id === editedProduct._id ? response.data.data : product
        )
      );

      setEditingProductId(null);

      toast({
        title: "Product updated",
        description: "The product was successfully updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving product:", error);

      toast({
        title: "Error updating product",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDeleteProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${URL}/products/${deletingProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted product from the local list
      setProductList(
        productList.filter((product) => product._id !== deletingProductId)
      );

      toast({
        title: "Product deleted",
        description: "The product was successfully deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setDeletingProductId(null);
      onDeleteClose();
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading && products.length === 0) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Loading products...</Text>
        </VStack>
      </Flex>
    );
  }

  if (error && products.length === 0) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <VStack spacing={4}>
          <Heading size="lg" color="red.500">
            Something went wrong
          </Heading>
          <Button onClick={() => window.location.reload()} colorScheme="blue">
            Try Again
          </Button>
        </VStack>
      </Flex>
    );
  }

  const getEditingProduct = () => {
    return productList.find((product) => product._id === editingProductId);
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} color="gray.700">
        Product Management
      </Heading>

      {loading && products.length > 0 && (
        <Flex justify="center" my={4}>
          <Spinner size="md" color="blue.500" />
        </Flex>
      )}

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={6}
        minHeight="50vh"
      >
        {productList.map((product) => (
          <Box key={product._id}>
            {editingProductId === product._id ? (
              <ProductEditForm
                product={getEditingProduct()}
                onSave={handleSaveProduct}
                onCancel={() => setEditingProductId(null)}
              />
            ) : (
              <ProductCard
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            )}
          </Box>
        ))}
      </SimpleGrid>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteProduct} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProductGridAuth;
