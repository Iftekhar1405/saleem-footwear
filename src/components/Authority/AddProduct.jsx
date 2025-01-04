import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

function AddProduct() {
  const toast = useToast();
  const [product, setProduct] = useState({
    images: [""],
    brand: "",
    article: "",
    material: "",
    colors: {},
    itemSet: [{ size: "", lengths: "" }],
    description: "",
    gender: "",
    price: "",
    category: "",
  });

  // State for photo upload
  const [primaryImages, setPrimaryImages] = useState([]);
  const [colorFields, setColorFields] = useState([
    { colorName: "", colorImages: [] },
  ]);

  // Handle primary images change
  const handlePrimaryImagesChange = (e) => {
    setPrimaryImages(Array.from(e.target.files));
  };

  // Handle adding new color field
  const handleAddColorField = () => {
    setColorFields([...colorFields, { colorName: "", colorImages: [] }]);
  };

  // Handle color name change
  const handlePhotoColorNameChange = (index, e) => {
    const updatedColorFields = [...colorFields];
    updatedColorFields[index].colorName = e.target.value;
    setColorFields(updatedColorFields);
  };

  // Handle color images change
  const handleColorImagesChange = (index, e) => {
    const updatedColorFields = [...colorFields];
    updatedColorFields[index].colorImages = Array.from(e.target.files);
    setColorFields(updatedColorFields);
  };

  // Handle photo submission
  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append primary images
    primaryImages.forEach((image, index) => {
      formData.append(`primaryImages[]`, image);
    });

    // Append color-specific images and color names
    colorFields.forEach((field, index) => {
      if (field.colorName && field.colorImages.length > 0) {
        formData.append(`colorName[${index}]`, field.colorName);
        field.colorImages.forEach((image) => {
          formData.append(`colorImg[${index}][]`, image);
        });
      }
    });

    try {
      const response = await axios.post(
        "https://saleem-footwear-api.vercel.app/api/v1/upload-img",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Get the uploaded image data from the response
      const { primaryImage, colorImage } = response.data.images;

      // Prepare the updated product data
      const updatedColors = {};
      colorImage.forEach((color) => {
        updatedColors[color.colorName] = color.images;
      });

      // Update the product state
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: primaryImage.length > 0 ? primaryImage : prevProduct.images,
        colors: updatedColors,
      }));

      toast({
        title: "Success",
        description: "Images uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error uploading images:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle item set changes
  const handleSetChange = (index, field, e) => {
    const newSet = [...product.itemSet];
    newSet[index][field] = e.target.value;
    setProduct({ ...product, itemSet: newSet });
  };

  // Handle adding new item set
  const handleAddSet = () => {
    setProduct({
      ...product,
      itemSet: [...product.itemSet, { size: "", lengths: "" }],
    });
  };

  // Handle removing item set
  const handleRemoveSet = (index) => {
    const newSet = product.itemSet.filter((_, i) => i !== index);
    setProduct({ ...product, itemSet: newSet });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const colors = Object.fromEntries(
      Object.entries(product.colors).filter(
        ([key, value]) => key && value.length > 0
      )
    );

    const productData = {
      ...product,
      colors,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://saleem-footwear-api.vercel.app/api/v1/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Product added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setProduct({
        images: [""],
        brand: "",
        article: "",
        material: "",
        colors: {},
        itemSet: [{ size: "", lengths: "" }],
        description: "",
        gender: "",
        price: "",
        category: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error adding product:", error);
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Card variant="outline" mb={8} boxShadow="sm">
        <CardHeader bg="red.50">
          <Heading size="lg" color="red.600">
            Add New Product
          </Heading>
        </CardHeader>
        <CardBody>
          {/* Image Upload Section */}
          <Box
            bg="gray.50"
            p={6}
            borderRadius="md"
            mb={8}
            border="1px"
            borderColor="gray.200"
          >
            <Heading size="md" mb={4} color="red.600">
              Upload Images
            </Heading>
            <form onSubmit={handlePhotoSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="medium">Primary Images</FormLabel>
                  <Input
                    type="file"
                    multiple
                    onChange={handlePrimaryImagesChange}
                    p={1}
                    border="none"
                    accept="image/*"
                  />
                </FormControl>

                {colorFields.map((field, index) => (
                  <Card key={index} variant="outline">
                    <CardBody>
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="medium" color="gray.700">
                          Color Variant {index + 1}
                        </Text>
                        {index > 0 && (
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => {
                              const newFields = colorFields.filter(
                                (_, i) => i !== index
                              );
                              setColorFields(newFields);
                            }}
                          />
                        )}
                      </HStack>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel>Color Name</FormLabel>
                          <Input
                            value={field.colorName}
                            onChange={(e) =>
                              handlePhotoColorNameChange(index, e)
                            }
                            placeholder="Enter color name"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Color Images</FormLabel>
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => handleColorImagesChange(index, e)}
                            p={1}
                            border="none"
                            accept="image/*"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}

                <VStack spacing={4}>
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddColorField}
                    colorScheme="red"
                    variant="outline"
                  >
                    Add Color Variant
                  </Button>
                  <Button type="submit" colorScheme="red">
                    Upload Images
                  </Button>
                </VStack>
              </VStack>
            </form>
          </Box>

          {/* Product Details Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Box
                bg="gray.50"
                p={6}
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
              >
                <Heading size="md" mb={6} color="red.600">
                  Basic Information
                </Heading>
                <VStack spacing={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                    <FormControl isRequired>
                      <FormLabel>Brand</FormLabel>
                      <Input
                        name="brand"
                        value={product.brand}
                        onChange={handleChange}
                        bg="white"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Article</FormLabel>
                      <Input
                        name="article"
                        value={product.article}
                        onChange={handleChange}
                        bg="white"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired>
                    <FormLabel>Material</FormLabel>
                    <Input
                      name="material"
                      value={product.material}
                      onChange={handleChange}
                      bg="white"
                    />
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                    <FormControl isRequired>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        name="gender"
                        value={product.gender}
                        onChange={handleChange}
                        bg="white"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Price</FormLabel>
                      <Input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        bg="white"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Category</FormLabel>
                      <Input
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        bg="white"
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </Box>

              <Box
                bg="gray.50"
                p={6}
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
              >
                <Heading size="md" mb={6} color="red.600">
                  Item Sets
                </Heading>
                <VStack spacing={4}>
                  {product.itemSet.map((set, index) => (
                    <HStack key={index} spacing={4} w="full">
                      <FormControl>
                        <Input
                          placeholder="Size"
                          value={set.size}
                          onChange={(e) => handleSetChange(index, "size", e)}
                          bg="white"
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          placeholder="Pcs"
                          value={set.lengths}
                          onChange={(e) => handleSetChange(index, "lengths", e)}
                          bg="white"
                        />
                      </FormControl>
                      {index > 0 && (
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleRemoveSet(index)}
                        />
                      )}
                    </HStack>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddSet}
                    colorScheme="red"
                    variant="outline"
                    alignSelf="start"
                  >
                    Add Size Set
                  </Button>
                </VStack>
              </Box>

              <Box
                bg="gray.50"
                p={6}
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
              >
                <Heading size="md" mb={6} color="red.600">
                  Product Description
                </Heading>
                <FormControl isRequired>
                  <Textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={6}
                    bg="white"
                    placeholder="Enter detailed product description..."
                  />
                </FormControl>
              </Box>

              <Button
                type="submit"
                colorScheme="red"
                size="lg"
                isFullWidth
                height="14"
                fontSize="md"
              >
                Add Product
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}

export default AddProduct;
