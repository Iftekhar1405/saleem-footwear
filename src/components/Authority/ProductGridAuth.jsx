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
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ProductCardAuth.css";
import "./ProductGridAuth.css";

const URL = "https://saleem-footwear-api.vercel.app/api/v1";
// const URL = "http://localhost:7000/api/v1"
const token = localStorage.getItem("token");

const useFetchData = (url, limit = 20) => {
  const [data, setData] = useState([]); // Store fetched data
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(false); // Track errors
  const [hasMore, setHasMore] = useState(true); // Track if there's more data to load
  const pageRef = useRef(1); // Use useRef to track the current page

  const fetchData = async (page) => {
    if (loading || !hasMore) return; // Prevent fetching when loading or no more data

    setLoading(true);
    try {
      const response = await axios.get(url, {
        params: { page, limit }, // Send current page and limit in the request
      });

      if (response.data.products.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setData((prevData) => [...prevData, ...response.data.products]); // Append new data to the existing data
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when the page changes
  useEffect(() => {
    fetchData(pageRef.current); // Fetch based on the ref value
  }, [url]); // Only refetch if the URL changes

  const handleScroll = useCallback(() => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const currentScrollPosition = window.scrollY;

    // Check if user has scrolled near the bottom and if more data is available
    if (
      currentScrollPosition >= scrollableHeight - 100 &&
      !loading &&
      hasMore
    ) {
      pageRef.current += 1; // Increment the page using the ref
      fetchData(pageRef.current); // Fetch the next page
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const onScroll = () => {
      if (hasMore) {
        handleScroll(); // Only call the scroll handler if more data is available
      }
    };
    if (hasMore) {
      window.addEventListener("scroll", onScroll);
    } else {
      window.removeEventListener("scroll", onScroll);
    } // Clean up event listener
  }, [handleScroll, hasMore]); // Re-run only if handleScroll or hasMore changes

  return { data, loading, error, hasMore };
};

const ProductGridAuth = () => {
  const { data: products, loading, error } = useFetchData(`${URL}/products`);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [deletingProductId, setDeletingProductId] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();

  const startEditing = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) =>
      name === "inStock"
        ? { ...prevState, [name]: value === "true" ? true : false }
        : {
            ...prevState,
            [name]: value,
          }
    );
  };

  const handleImageChange = (e, index, type = "default") => {
    if (type === "default") {
      const updatedImages = [...(editedProduct.images || [])];
      updatedImages[index] = e.target.value;
      setEditedProduct((prevState) => ({
        ...prevState,
        images: updatedImages,
      }));
    } else {
      const updatedColorImages = [...(editedProduct.colors[type] || [])];
      updatedColorImages[index] = e.target.value;
      setEditedProduct((prevState) => ({
        ...prevState,
        colors: {
          ...prevState.colors,
          [type]: updatedColorImages,
        },
      }));
    }
  };

  const addImageField = (type = "default") => {
    if (type === "default") {
      setEditedProduct((prevState) => ({
        ...prevState,
        images: [...(prevState.images || []), ""],
      }));
    } else {
      setEditedProduct((prevState) => ({
        ...prevState,
        colors: {
          ...prevState.colors,
          [type]: [...(prevState.colors[type] || []), ""],
        },
      }));
    }
  };

  const handleImageRemove = (index, type = "default") => {
    if (type === "default") {
      const updatedImages = [...(editedProduct.images || [])];
      updatedImages.splice(index, 1);
      setEditedProduct((prevState) => ({
        ...prevState,
        images: updatedImages,
      }));
    } else {
      const updatedColorImages = [...(editedProduct.colors[type] || [])];
      updatedColorImages.splice(index, 1);
      setEditedProduct((prevState) => ({
        ...prevState,
        colors: {
          ...prevState.colors,
          [type]: updatedColorImages,
        },
      }));
    }
  };

  const addColorField = () => {
    setEditedProduct((prevState) => ({
      ...prevState,
      colors: {
        ...prevState.colors,
        [`color${Object.keys(prevState.colors || {}).length + 1}`]: [],
      },
    }));
  };

  const handleSizeRemove = (index) => {
    const updatedItemSet = [...(editedProduct.itemSet || [])];
    updatedItemSet.splice(index, 1);
    setEditedProduct((prevState) => ({
      ...prevState,
      itemSet: updatedItemSet,
    }));
  };

  const saveProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log(editedProduct._id);

      const response = await axios.patch(
        `${URL}/products/${editedProduct._id}`,
        editedProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // setData(products.map(product => product._id === editedProduct._id ? response.data : product));
      setEditingProductId(null);
      console.log(response);
      toast({
        title: "Product updated.",
        description: "The product was successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      alert("Error saving product:", error);
      toast({
        title: "Error updating product.",
        description: error.message,
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
      toast({
        title: "Product deleted.",
        description: "The product was successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setDeletingProductId(null);
      onDeleteClose();
    } catch (error) {
      toast({
        title: "Error deleting product.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cancelDelete = () => {
    setDeletingProductId(null);
    onDeleteClose();
  };
  const handleColorImageChange = (e, color, index) => {
    const updatedColorImages = [...(editedProduct.colors[color] || [])];
    updatedColorImages[index] = e.target.value;
    setEditedProduct((prevState) => ({
      ...prevState,
      colors: {
        ...prevState.colors,
        [color]: updatedColorImages,
      },
    }));
  };
  console.log(editedProduct);

  const handleColorNameChange = (e, oldColor) => {
    const newColor = e.target.value;

    if (!newColor.trim()) {
      // If the new color name is empty, do nothing or alert the user
      return;
    }

    setEditedProduct((prevState) => {
      const newColors = { ...prevState.colors };

      // Rename the key for the color in the object
      newColors[newColor] = newColors[oldColor];
      delete newColors[oldColor];

      return {
        ...prevState,
        colors: newColors,
      };
    });
  };
  const handleColorImageRemove = (color, index) => {
    setEditedProduct((prevState) => {
      const updatedColorImages = [...(prevState.colors[color] || [])];
      updatedColorImages.splice(index, 1); // Remove the image at the specified index

      return {
        ...prevState,
        colors: {
          ...prevState.colors,
          [color]: updatedColorImages,
        },
      };
    });
  };
  const handleRemoveColor = (color) => {
    setEditedProduct((prevState) => {
      const updatedColors = { ...prevState.colors };

      // Delete the color from the colors object
      delete updatedColors[color];

      return {
        ...prevState,
        colors: updatedColors,
      };
    });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Heading size="lg" color="red.500">
          Something went wrong
        </Heading>
      </Flex>
    );
  }
  return (
    <Box p={6}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {products.map((product) => (
          <Card
            key={product._id}
            overflow="hidden"
            variant="outline"
            borderRadius="lg"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            bg="white"
          >
            {editingProductId === product._id ? (
              <VStack spacing={4} p={6}>
                <Heading size="md" color="red.600" mb={2}>
                  Edit Product
                </Heading>

                {/* Basic Details */}
                <FormControl>
                  <FormLabel>Article</FormLabel>
                  <Input
                    name="article"
                    value={editedProduct.article || ""}
                    onChange={handleEditChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Brand</FormLabel>
                  <Input
                    name="brand"
                    value={editedProduct.brand || ""}
                    onChange={handleEditChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>In Stock</FormLabel>
                  <Select
                    name="inStock"
                    value={editedProduct.inStock.toString() || ""}
                    onChange={handleEditChange}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    value={editedProduct.description || ""}
                    onChange={handleEditChange}
                  />
                </FormControl>

                <Grid templateColumns="repeat(2, 1fr)" gap={4} width="full">
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type="number"
                      name="price"
                      value={editedProduct.price || ""}
                      onChange={handleEditChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Material</FormLabel>
                    <Input
                      name="material"
                      value={editedProduct.material || ""}
                      onChange={handleEditChange}
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4} width="full">
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name="gender"
                      value={editedProduct.gender || ""}
                      onChange={handleEditChange}
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
                      onChange={handleEditChange}
                    />
                  </FormControl>
                </Grid>

                {/* Default Images Section */}
                <Box width="full">
                  <Text fontWeight="bold" mb={2}>
                    Default Images
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {(editedProduct.images || []).map((imgUrl, index) => (
                      <HStack key={`${product._id}-image-${index}`}>
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

                {/* Colors Section */}
                <Box width="full">
                  <Text fontWeight="bold" mb={2}>
                    Colors and Images
                  </Text>
                  <VStack spacing={4} align="stretch">
                    {Object.keys(editedProduct.colors).map(
                      (color, colorIndex) => (
                        <Card
                          key={`${product._id}-color-${colorIndex}`}
                          variant="outline"
                          p={4}
                        >
                          <VStack spacing={2} align="stretch">
                            <HStack>
                              <Input
                                value={color}
                                onChange={(e) =>
                                  handleColorNameChange(e, color)
                                }
                                placeholder="Color name"
                                size="sm"
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                onClick={() => handleRemoveColor(color)}
                                colorScheme="red"
                                size="sm"
                              />
                            </HStack>

                            {editedProduct.colors[color].map(
                              (imgUrl, index) => (
                                <HStack
                                  key={`${product._id}-${color}-${index}`}
                                >
                                  <Input
                                    value={imgUrl}
                                    onChange={(e) =>
                                      handleColorImageChange(e, color, index)
                                    }
                                    size="sm"
                                  />
                                  <IconButton
                                    icon={<CloseIcon />}
                                    onClick={() =>
                                      handleColorImageRemove(color, index)
                                    }
                                    colorScheme="red"
                                    size="sm"
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
                              Add Image
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
                      Add Color
                    </Button>
                  </VStack>
                </Box>

                <HStack spacing={4} width="full" justify="flex-end">
                  <Button
                    onClick={() => setEditingProductId(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveProduct} colorScheme="green">
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <>
                <Box position="relative" height="200px">
                  <Image
                    src={product.images[0]}
                    alt={product.article}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                  <HStack position="absolute" top={2} right={2} spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => startEditing(product)}
                      colorScheme="blue"
                      size="sm"
                      variant="solid"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => {
                        setDeletingProductId(product._id);
                        onDeleteOpen();
                      }}
                      colorScheme="red"
                      size="sm"
                      variant="solid"
                    />
                  </HStack>
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

                    <HStack justify="space-between">
                      <Badge colorScheme="red" fontSize="md" px={2} py={1}>
                        ₹{product.price}
                      </Badge>
                      <Badge colorScheme="blue" fontSize="sm">
                        {product.gender}
                      </Badge>
                    </HStack>

                    <Text fontSize="sm" color="gray.600">
                      Material: {product.material}
                    </Text>
                  </VStack>
                </CardBody>
              </>
            )}
          </Card>
        ))}
      </SimpleGrid>
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={cancelDelete}
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
              <Button ref={cancelRef} onClick={cancelDelete}>
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
