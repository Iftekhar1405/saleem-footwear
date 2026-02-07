
import { AddIcon, DeleteIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Textarea,
  Tooltip,
  VStack,
  useColorModeValue,
  useToast,
  Collapse,
  Badge,
  Progress,
} from "@chakra-ui/react";
import {
  MdAddAPhoto,
  MdCloudUpload,
  MdInfo,
  MdColorLens,
  MdFormatSize,
  MdDescription,
  MdCheckCircle,
} from "react-icons/md";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { URL, BOT_URL } from "../../context/url";
import { CreatableSelect } from "chakra-react-select";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

function AddProduct() {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [product, setProduct] = useState({
    images: [],
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

  const [brandOptions, setBrandOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // State for image upload
  const [isUploading, setIsUploading] = useState(false);
  const [colorFields, setColorFields] = useState([
    { colorName: "", selectedImages: [], newColorImages: [] },
  ]);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    images: true,
    colors: false,
    details: false,
    sizes: false,
    description: false,
  });

  // Colors for styling
  const bgColor = useColorModeValue("white", "gray.800");
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("red.500", "red.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 6;

    if (product.images.length > 0) completed++;
    if (colorFields.some(f => f.colorName && f.selectedImages.length > 0)) completed++;
    if (product.brand && product.article && product.material) completed++;
    if (product.gender && product.price && product.category) completed++;
    if (product.itemSet.some(s => s.size && s.lengths)) completed++;
    if (product.description) completed++;

    return Math.round((completed / total) * 100);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle primary images upload
  const handlePrimaryImagesChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(`${URL}/upload-img-test`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImageUrls = response.data.images;

      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...uploadedImageUrls],
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Success",
        description: `${files.length} images uploaded successfully!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAreaClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Fetch Brands, Materials, and Categories
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingBrands(true);
      setLoadingMaterials(true);
      setLoadingCategories(true);
      try {
        const [brandsRes, materialsRes, categoriesRes] = await Promise.all([
          axios.get(`${URL}/products/brands`),
          axios.get(`${URL}/products/materials`),
          axios.get(`${BOT_URL}/categories`, { params: { page: 1, limit: 100 } })
        ]);

        if (brandsRes.data.success) {
          const formattedBrands = brandsRes.data.brands.map(b => ({ label: b.toUpperCase(), value: b }));
          setBrandOptions(formattedBrands);
        }

        if (materialsRes.data.success) {
          const formattedMaterials = materialsRes.data.materials.map(m => ({ label: m.toUpperCase(), value: m }));
          setMaterialOptions(formattedMaterials);
        }

        if (categoriesRes.data.categories) {
          const formattedCategories = categoriesRes.data.categories.map(c => ({
            label: c.name.toUpperCase(),
            value: c.name
          }));
          setCategoryOptions(formattedCategories);
        }

      } catch (error) {
        console.error("Failed to fetch options", error);
        toast({
          title: "Error",
          description: "Failed to fetch master data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingBrands(false);
        setLoadingMaterials(false);
        setLoadingCategories(false);
      }
    };

    fetchOptions();
  }, [toast]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isUploading) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const mockEvent = {
      target: {
        files: droppedFiles,
      },
    };

    handlePrimaryImagesChange(mockEvent);
  };

  const isImageUsedByColor = (imageUrl, currentColorIndex) => {
    return colorFields.some(
      (field, index) =>
        index !== currentColorIndex && field.selectedImages.includes(imageUrl)
    );
  };

  const isColorSpecificImage = (imageUrl) => {
    for (const field of colorFields) {
      if (field.newColorImages.includes(imageUrl)) {
        return true;
      }
    }
    return false;
  };

  const getColorNameForImage = (imageUrl) => {
    for (const field of colorFields) {
      if (field.newColorImages.includes(imageUrl)) {
        return field.colorName || "specific color";
      }
    }
    return "";
  };

  const handleRemovePrimaryImage = (indexToRemove) => {
    const removedImageUrl = product.images[indexToRemove];

    setProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_, index) => index !== indexToRemove),
    }));

    setColorFields((prevColorFields) => {
      return prevColorFields.map((field) => {
        return {
          ...field,
          selectedImages: field.selectedImages.filter(
            (url) => url !== removedImageUrl
          ),
          newColorImages: field.newColorImages.filter(
            (url) => url !== removedImageUrl
          ),
        };
      });
    });
  };

  const handleAddColorField = () => {
    setColorFields([
      ...colorFields,
      { colorName: "", selectedImages: [], newColorImages: [] },
    ]);
  };

  const handleColorNameChange = (index, e) => {
    const updatedColorFields = [...colorFields];
    updatedColorFields[index].colorName = e.target.value;
    setColorFields(updatedColorFields);
  };

  const handleImageSelection = (colorIndex, imageUrl) => {
    const updatedColorFields = [...colorFields];
    const selectedImages = updatedColorFields[colorIndex].selectedImages;

    if (selectedImages.includes(imageUrl)) {
      updatedColorFields[colorIndex].selectedImages = selectedImages.filter(
        (url) => url !== imageUrl
      );
    } else {
      updatedColorFields[colorIndex].selectedImages = [
        ...selectedImages,
        imageUrl,
      ];
    }

    setColorFields(updatedColorFields);
  };

  const handleColorSpecificImageUpload = async (colorIndex, e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(`${URL}/upload-img-test`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImageUrls = response.data.images;

      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...uploadedImageUrls],
      }));

      const updatedColorFields = [...colorFields];
      updatedColorFields[colorIndex].selectedImages = [
        ...updatedColorFields[colorIndex].selectedImages,
        ...uploadedImageUrls,
      ];
      updatedColorFields[colorIndex].newColorImages = [
        ...updatedColorFields[colorIndex].newColorImages,
        ...uploadedImageUrls,
      ];
      setColorFields(updatedColorFields);

      e.target.value = "";

      toast({
        title: "Success",
        description: `${files.length} images uploaded successfully for ${colorFields[colorIndex].colorName || "this color"
          }!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to upload color-specific images. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Error uploading color-specific images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getAvailableImagesForColorVariant = (colorIndex) => {
    return product.images.filter((imageUrl) => {
      for (let i = 0; i < colorFields.length; i++) {
        if (
          i !== colorIndex &&
          colorFields[i].newColorImages.includes(imageUrl)
        ) {
          return false;
        }
      }
      return true;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSetChange = (index, field, e) => {
    const newSet = [...product.itemSet];
    newSet[index][field] = e.target.value;
    setProduct({ ...product, itemSet: newSet });
  };

  const handleAddSet = () => {
    setProduct({
      ...product,
      itemSet: [...product.itemSet, { size: "", lengths: "" }],
    });
  };

  const handleRemoveSet = (index) => {
    const newSet = product.itemSet.filter((_, i) => i !== index);
    setProduct({ ...product, itemSet: newSet });
  };

  const prepareColorsObject = () => {
    const colorsObj = {};

    colorFields.forEach((field) => {
      if (field.colorName && field.selectedImages.length > 0) {
        colorsObj[field.colorName] = field.selectedImages;
      }
    });

    return colorsObj;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const colorsObject = prepareColorsObject();

    const productData = {
      ...product,
      colors: colorsObject,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${URL}/products`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Success",
        description: "Product added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // Reset form
      setProduct({
        images: [],
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
      setColorFields([
        { colorName: "", selectedImages: [], newColorImages: [] },
      ]);
    } catch (error) {
      console.log("🪵 ~ handleSubmit ~ error:", error)
      toast({
        title: "Error",
        description: error.response.data.msg || "Failed to add product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.error("Error adding product:", error);
    }
  };

  const SectionHeader = ({ icon, title, section, isComplete }) => (
    <Flex
      align="center"
      justify="space-between"
      cursor="pointer"
      onClick={() => toggleSection(section)}
      p={4}
      bg={expandedSections[section] ? sectionBg : "transparent"}
      borderRadius="md"
      transition="all 0.2s"
      _hover={{ bg: sectionBg }}
    >
      <HStack spacing={3}>
        <Icon as={icon} color={accentColor} boxSize="20px" />
        <Heading size="sm" color={headingColor}>
          {title}
        </Heading>
        {isComplete && (
          <Icon as={MdCheckCircle} color="green.500" boxSize="18px" />
        )}
      </HStack>
      <Icon
        as={expandedSections[section] ? ChevronUpIcon : ChevronDownIcon}
        boxSize="20px"
        color="gray.500"
      />
    </Flex>
  );

  return (
    <Container maxW="container.lg" py={{ base: 4, md: 6 }} px={{ base: 3, md: 6 }}>
      {/* Sticky Header with Progress */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg={cardBg}
        borderRadius="lg"
        boxShadow="md"
        mb={4}
        p={4}
      >
        <VStack spacing={3} align="stretch">
          <Flex align="center" justify="space-between">
            <Heading size={{ base: "sm", md: "md" }} color={headingColor}>
              Add New Product
            </Heading>
            <Badge colorScheme="red" fontSize={{ base: "xs", md: "sm" }} px={3} py={1} borderRadius="full">
              {getCompletionPercentage()}% Complete
            </Badge>
          </Flex>
          <Progress
            value={getCompletionPercentage()}
            size="sm"
            colorScheme="red"
            borderRadius="full"
            hasStripe
            isAnimated
          />
        </VStack>
      </Box>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {/* Images Section */}
          <Card variant="outline" borderRadius="xl">
            <SectionHeader
              icon={MdAddAPhoto}
              title="Product Images"
              section="images"
              isComplete={product.images.length > 0}
            />
            <Collapse in={expandedSections.images} animateOpacity>
              <CardBody p={{ base: 4, md: 6 }} position="relative" zIndex={1}>
                <VStack spacing={4} align="stretch">
                  <Box
                    border="2px dashed"
                    borderColor={borderColor}
                    borderRadius="xl"
                    p={{ base: 6, md: 8 }}
                    textAlign="center"
                    cursor={isUploading ? "not-allowed" : "pointer"}
                    transition="all 0.3s"
                    _hover={{
                      borderColor: isUploading ? borderColor : accentColor,
                      bg: hoverBg,
                      transform: isUploading ? "none" : "scale(1.01)",
                    }}
                    onClick={handleUploadAreaClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    opacity={isUploading ? 0.7 : 1}
                  >
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handlePrimaryImagesChange}
                      accept="image/*"
                      display="none"
                      disabled={isUploading}
                    />
                    <VStack spacing={3}>
                      {isUploading ? (
                        <>
                          <Spinner size="lg" color={accentColor} thickness="3px" />
                          <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                            Uploading...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Icon
                            as={MdCloudUpload}
                            w={{ base: 10, md: 12 }}
                            h={{ base: 10, md: 12 }}
                            color={accentColor}
                          />
                          <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }}>
                            Tap to upload or drag images here
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                            PNG, JPG, GIF up to 10MB
                          </Text>
                        </>
                      )}
                    </VStack>
                  </Box>

                  {product.images.length > 0 && (
                    <MotionBox
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Text fontWeight="medium" fontSize="sm" mb={3} color="gray.600">
                        {product.images.length} image{product.images.length !== 1 ? 's' : ''} uploaded
                      </Text>
                      <SimpleGrid columns={{ base: 3, sm: 4, md: 5 }} spacing={3}>
                        {product.images.map((imageUrl, idx) => (
                          <MotionBox
                            key={idx}
                            position="relative"
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="md"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            role="group"
                          >
                            <Image
                              src={imageUrl}
                              alt={`Product ${idx + 1}`}
                              width="100%"
                              height={{ base: "80px", md: "100px" }}
                              objectFit="cover"
                            />
                            {isColorSpecificImage(imageUrl) && (
                              <Box
                                position="absolute"
                                top="2"
                                left="2"
                                bg="rgba(0,0,0,0.75)"
                                color="white"
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="md"
                                fontWeight="medium"
                              >
                                {getColorNameForImage(imageUrl)}
                              </Box>
                            )}
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              aria-label="Remove image"
                              position="absolute"
                              top="2"
                              right="2"
                              onClick={() => handleRemovePrimaryImage(idx)}
                              opacity="0"
                              _groupHover={{ opacity: 1 }}
                              transition="opacity 0.2s"
                            />
                          </MotionBox>
                        ))}
                      </SimpleGrid>
                    </MotionBox>
                  )}
                </VStack>
              </CardBody>
            </Collapse>
          </Card>

          {/* Color Variants Section */}
          <Card variant="outline" borderRadius="xl">
            <SectionHeader
              icon={MdColorLens}
              title="Color Variants"
              section="colors"
              isComplete={colorFields.some(f => f.colorName && f.selectedImages.length > 0)}
            />
            <Collapse in={expandedSections.colors} animateOpacity>
              <CardBody p={{ base: 4, md: 6 }} position="relative" zIndex={1}>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddColorField}
                    colorScheme="red"
                    variant="outline"
                    size={{ base: "md", md: "sm" }}
                    width="full"
                    height={{ base: "48px", md: "auto" }}
                  >
                    Add Color Variant
                  </Button>

                  <AnimatePresence>
                    {colorFields.map((field, index) => (
                      <MotionBox
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card variant="outline" boxShadow="sm" borderRadius="lg">
                          <CardBody p={{ base: 3, md: 4 }}>
                            <VStack spacing={4} align="stretch">
                              <HStack justify="space-between">
                                <Badge colorScheme="red" fontSize="sm">
                                  Variant {index + 1}
                                </Badge>
                                {index > 0 && (
                                  <IconButton
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => {
                                      const newFields = colorFields.filter((_, i) => i !== index);
                                      setColorFields(newFields);
                                    }}
                                  />
                                )}
                              </HStack>

                              <FormControl>
                                <FormLabel fontSize={{ base: "sm", md: "xs" }}>Color Name</FormLabel>
                                <Input
                                  value={field.colorName}
                                  onChange={(e) => handleColorNameChange(index, e)}
                                  placeholder="e.g., Red, Blue, Black"
                                  bg={bgColor}
                                  size={{ base: "md", md: "sm" }}
                                  height={{ base: "48px", md: "auto" }}
                                />
                              </FormControl>

                              {product.images.length > 0 && (
                                <FormControl>
                                  <FormLabel fontSize={{ base: "sm", md: "xs" }}>
                                    Select Images for this Color
                                  </FormLabel>
                                  <SimpleGrid columns={{ base: 3, md: 4 }} spacing={2}>
                                    {getAvailableImagesForColorVariant(index).map((imageUrl, imgIdx) => {
                                      const isUsedByOther = isImageUsedByColor(imageUrl, index);
                                      const isSelected = field.selectedImages.includes(imageUrl);
                                      const isDisabled = isUsedByOther && !isSelected;

                                      return (
                                        <Box
                                          key={imgIdx}
                                          position="relative"
                                          borderWidth="2px"
                                          borderRadius="md"
                                          borderColor={isSelected ? accentColor : "transparent"}
                                          overflow="hidden"
                                          cursor={isDisabled ? "not-allowed" : "pointer"}
                                          opacity={isDisabled ? 0.5 : 1}
                                          onClick={() =>
                                            !isDisabled && handleImageSelection(index, imageUrl)
                                          }
                                        >
                                          <Image
                                            src={imageUrl}
                                            alt={`Image ${imgIdx + 1}`}
                                            width="100%"
                                            height={{ base: "60px", md: "70px" }}
                                            objectFit="cover"
                                          />
                                          <Checkbox
                                            position="absolute"
                                            top="1"
                                            right="1"
                                            colorScheme="red"
                                            isChecked={isSelected}
                                            isDisabled={isDisabled}
                                            onChange={() => { }}
                                            size={{ base: "md", md: "sm" }}
                                          />
                                        </Box>
                                      );
                                    })}
                                  </SimpleGrid>
                                </FormControl>
                              )}

                              <Box>
                                <Input
                                  id={`color-image-input-${index}`}
                                  type="file"
                                  multiple
                                  onChange={(e) => handleColorSpecificImageUpload(index, e)}
                                  accept="image/*"
                                  display="none"
                                />
                                <Button
                                  leftIcon={<MdCloudUpload />}
                                  onClick={() =>
                                    document.getElementById(`color-image-input-${index}`).click()
                                  }
                                  variant="outline"
                                  size={{ base: "md", md: "sm" }}
                                  width="full"
                                  height={{ base: "48px", md: "auto" }}
                                  isLoading={isUploading}
                                >
                                  Upload Color-Specific Images
                                </Button>
                              </Box>

                              {field.selectedImages.length > 0 && (
                                <Text fontSize="xs" color="gray.600">
                                  {field.selectedImages.length} image{field.selectedImages.length !== 1 ? 's' : ''} selected
                                </Text>
                              )}
                            </VStack>
                          </CardBody>
                        </Card>
                      </MotionBox>
                    ))}
                  </AnimatePresence>
                </VStack>
              </CardBody>
            </Collapse>
          </Card>

          {/* Product Details Section */}
          <Card variant="outline" borderRadius="xl">
            <SectionHeader
              icon={MdInfo}
              title="Product Details"
              section="details"
              isComplete={product.brand && product.article && product.material && product.gender && product.price && product.category}
            />
            <Collapse in={expandedSections.details} animateOpacity>
              <CardBody p={{ base: 4, md: 6 }} position="relative" zIndex={1}>
                <VStack spacing={4} align="stretch">
                  {/* All Select Fields at Top */}
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "xs" }}>Brand</FormLabel>
                      <CreatableSelect
                        name="brand"
                        value={product.brand ? { label: product.brand, value: product.brand } : null}
                        onChange={(newValue) => setProduct({ ...product, brand: newValue ? newValue.value : "" })}
                        options={brandOptions}
                        isLoading={loadingBrands}
                        placeholder="Select or Create Brand"
                        isClearable
                        size={{ base: "md", md: "sm" }}
                        chakraStyles={{
                          container: (provided) => ({ ...provided, bg: bgColor }),
                          control: (provided) => ({ ...provided, minHeight: { base: "48px", md: "32px" } }),
                          menu: (provided) => ({ ...provided, zIndex: 10000 }),
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "xs" }}>Material</FormLabel>
                      <CreatableSelect
                        name="material"
                        value={product.material ? { label: product.material, value: product.material } : null}
                        onChange={(newValue) => setProduct({ ...product, material: newValue ? newValue.value : "" })}
                        options={materialOptions}
                        isLoading={loadingMaterials}
                        placeholder="Select or Create Material"
                        isClearable
                        size={{ base: "md", md: "sm" }}
                        chakraStyles={{
                          container: (provided) => ({ ...provided, bg: bgColor }),
                          control: (provided) => ({ ...provided, minHeight: { base: "48px", md: "32px" } }),
                          menu: (provided) => ({ ...provided, zIndex: 10000 }),
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <FormControl isRequired>
                    <FormLabel fontSize={{ base: "sm", md: "xs" }}>Category</FormLabel>
                    <CreatableSelect
                      name="category"
                      value={product.category ? { label: product.category, value: product.category } : null}
                      onChange={(newValue) => setProduct({ ...product, category: newValue ? newValue.value : "" })}
                      options={categoryOptions}
                      isLoading={loadingCategories}
                      placeholder="Select or Create Category"
                      isClearable
                      size={{ base: "md", md: "sm" }}
                      chakraStyles={{
                        container: (provided) => ({ ...provided, bg: bgColor }),
                        control: (provided) => ({ ...provided, minHeight: { base: "48px", md: "32px" } }),
                        menu: (provided) => ({ ...provided, zIndex: 10000 }),
                      }}
                    />
                  </FormControl>

                  {/* Other Fields Below */}
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "xs" }}>Article Code</FormLabel>
                      <Input
                        name="article"
                        value={product.article}
                        onChange={handleChange}
                        bg={bgColor}
                        placeholder="Enter article code"
                        size={{ base: "md", md: "sm" }}
                        height={{ base: "48px", md: "auto" }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "xs" }}>Gender</FormLabel>
                      <Select
                        name="gender"
                        value={product.gender}
                        onChange={handleChange}
                        bg={bgColor}
                        placeholder="Select Gender"
                        size={{ base: "md", md: "sm" }}
                        height={{ base: "48px", md: "auto" }}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </Select>
                    </FormControl>
                  </Grid>

                  <FormControl isRequired>
                    <FormLabel fontSize={{ base: "sm", md: "xs" }}>Price</FormLabel>
                    <Input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      bg={bgColor}
                      placeholder="0.00"
                      size={{ base: "md", md: "sm" }}
                      height={{ base: "48px", md: "auto" }}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Collapse>
          </Card>

          {/* Size & Quantity Section */}
          <Card variant="outline" borderRadius="xl">
            <SectionHeader
              icon={MdFormatSize}
              title="Size & Quantity"
              section="sizes"
              isComplete={product.itemSet.some(s => s.size && s.lengths)}
            />
            <Collapse in={expandedSections.sizes} animateOpacity>
              <CardBody p={{ base: 4, md: 6 }}>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddSet}
                    colorScheme="red"
                    variant="outline"
                    size={{ base: "md", md: "sm" }}
                    width="full"
                    height={{ base: "48px", md: "auto" }}
                  >
                    Add Size Set
                  </Button>

                  {product.itemSet.map((set, index) => (
                    <Card key={index} variant="outline" boxShadow="sm">
                      <CardBody p={{ base: 3, md: 4 }}>
                        <Grid
                          templateColumns={{ base: "1fr", md: "1fr 1fr auto" }}
                          gap={3}
                          alignItems="end"
                        >
                          <FormControl>
                            <FormLabel fontSize={{ base: "sm", md: "xs" }}>Size Range</FormLabel>
                            <Input
                              placeholder="e.g., 6-10, 8-12"
                              value={set.size}
                              onChange={(e) => handleSetChange(index, "size", e)}
                              bg={bgColor}
                              size={{ base: "md", md: "sm" }}
                              height={{ base: "48px", md: "auto" }}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize={{ base: "sm", md: "xs" }}>Quantity</FormLabel>
                            <Input
                              placeholder="Number of pieces"
                              value={set.lengths}
                              onChange={(e) => handleSetChange(index, "lengths", e)}
                              bg={bgColor}
                              type="number"
                              size={{ base: "md", md: "sm" }}
                              height={{ base: "48px", md: "auto" }}
                            />
                          </FormControl>
                          {index > 0 && (
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleRemoveSet(index)}
                              aria-label="Delete size set"
                              size={{ base: "md", md: "sm" }}
                              height={{ base: "48px", md: "auto" }}
                            />
                          )}
                        </Grid>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </CardBody>
            </Collapse>
          </Card>

          {/* Description Section */}
          <Card variant="outline" borderRadius="xl">
            <SectionHeader
              icon={MdDescription}
              title="Product Description"
              section="description"
              isComplete={product.description.length > 0}
            />
            <Collapse in={expandedSections.description} animateOpacity>
              <CardBody p={{ base: 4, md: 6 }}>
                <FormControl>
                  <Textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={5}
                    bg={bgColor}
                    placeholder="Enter detailed product description including features, benefits, and any other important information..."
                    resize="vertical"
                    size={{ base: "md", md: "sm" }}
                    minHeight={{ base: "120px", md: "100px" }}
                  />
                </FormControl>
              </CardBody>
            </Collapse>
          </Card>

          <Box
            position={{ base: "sticky", md: "relative" }}
            bottom={{ base: 0, md: "auto" }}
            left={0}
            right={0}
            p={{ base: 4, md: 0 }}
            bg={{ base: cardBg, md: "transparent" }}
            boxShadow={{ base: "0 -2px 10px rgba(0,0,0,0.1)", md: "none" }}
            zIndex={1}
          >
            <Button
              type="submit"
              colorScheme="red"
              size="lg"
              width="full"
              height={{ base: "56px", md: "48px" }}
              fontSize={{ base: "lg", md: "md" }}
              boxShadow="lg"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "xl",
              }}
              transition="all 0.2s"
            >
              Add Product
            </Button>
          </Box>
        </VStack>
      </form>
    </Container>
  );
}

export default AddProduct;
