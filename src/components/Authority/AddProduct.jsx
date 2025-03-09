// import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
// import {
//   Box,
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Checkbox,
//   Container,
//   Divider,
//   Flex,
//   FormControl,
//   FormLabel,
//   Grid,
//   HStack,
//   Heading,
//   Icon,
//   IconButton,
//   Image,
//   Input,
//   Select,
//   SimpleGrid,
//   Spinner,
//   Stack,
//   Tag,
//   Text,
//   Textarea,
//   Tooltip,
//   VStack,
//   useColorModeValue,
//   useToast,
// } from "@chakra-ui/react";
// import {
//   MdAddAPhoto,
//   MdCloudUpload,
//   MdDeleteOutline,
//   MdInfo,
// } from "react-icons/md";
// import axios from "axios";
// import React, { useState, useRef } from "react";
// import { URL } from "../../context/url";

// function AddProduct() {
//   const toast = useToast();
//   const fileInputRef = useRef(null);
//   const [product, setProduct] = useState({
//     images: [],
//     brand: "",
//     article: "",
//     material: "",
//     colors: {},
//     itemSet: [{ size: "", lengths: "" }],
//     description: "",
//     gender: "",
//     price: "",
//     category: "",
//   });

//   // State for image upload
//   const [isUploading, setIsUploading] = useState(false);
//   const [colorFields, setColorFields] = useState([
//     { colorName: "", selectedImages: [], newColorImages: [] },
//   ]);

//   // Colors for styling
//   const bgColor = useColorModeValue("white", "gray.800");
//   const sectionBg = useColorModeValue("gray.50", "gray.700");
//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const accentColor = useColorModeValue("red.500", "red.300");
//   const headingColor = useColorModeValue("gray.800", "white");
//   const subheadingColor = useColorModeValue("red.600", "red.300");

//   // Handle primary images upload
//   const handlePrimaryImagesChange = async (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length === 0) return;

//     setIsUploading(true);
//     const formData = new FormData();

//     // Append all selected files to the FormData
//     files.forEach((file) => {
//       formData.append("images", file);
//     });

//     try {
//       const response = await axios.post(`${URL}/upload-img-test`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Get the uploaded image URLs from the response
//       const uploadedImageUrls = response.data.images;

//       // Update the product state with the new images
//       setProduct((prevProduct) => ({
//         ...prevProduct,
//         images: [...prevProduct.images, ...uploadedImageUrls],
//       }));

//       // Clear the file input value so the same files can be selected again if needed
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }

//       toast({
//         title: "Success",
//         description: `${files.length} images uploaded successfully!`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to upload images. Please try again.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//       console.error("Error uploading images:", error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Function to handle the click on the upload area
//   const handleUploadAreaClick = () => {
//     if (!isUploading && fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Handle drag and drop functionality
//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (isUploading) return;

//     const droppedFiles = Array.from(e.dataTransfer.files);
//     if (droppedFiles.length === 0) return;

//     // Create a new event-like object for the file input change handler
//     const mockEvent = {
//       target: {
//         files: droppedFiles,
//       },
//     };

//     // Process the dropped files
//     handlePrimaryImagesChange(mockEvent);
//   };

//   // Check if an image is used by any color variant
//   const isImageUsedByAnyColor = (imageUrl) => {
//     return colorFields.some((field) => field.selectedImages.includes(imageUrl));
//   };

//   // Check if an image is used by a specific color variant
//   const isImageUsedByColor = (imageUrl, currentColorIndex) => {
//     return colorFields.some(
//       (field, index) =>
//         index !== currentColorIndex && field.selectedImages.includes(imageUrl)
//     );
//   };

//   // Check if an image is a color-specific image
//   const isColorSpecificImage = (imageUrl) => {
//     // Check if this image was uploaded specifically for a color
//     for (const field of colorFields) {
//       if (field.newColorImages.includes(imageUrl)) {
//         return true;
//       }
//     }
//     return false;
//   };

//   // Get the color name for a color-specific image
//   const getColorNameForImage = (imageUrl) => {
//     for (const field of colorFields) {
//       if (field.newColorImages.includes(imageUrl)) {
//         return field.colorName || "specific color";
//       }
//     }
//     return "";
//   };

//   // Handle removing a primary image
//   const handleRemovePrimaryImage = (indexToRemove) => {
//     // Get the URL of the image being removed
//     const removedImageUrl = product.images[indexToRemove];

//     // Remove the image from the primary images array
//     setProduct((prevProduct) => ({
//       ...prevProduct,
//       images: prevProduct.images.filter((_, index) => index !== indexToRemove),
//     }));

//     // Also remove the image from any color variant that has it selected
//     setColorFields((prevColorFields) => {
//       return prevColorFields.map((field) => {
//         return {
//           ...field,
//           selectedImages: field.selectedImages.filter(
//             (url) => url !== removedImageUrl
//           ),
//           newColorImages: field.newColorImages.filter(
//             (url) => url !== removedImageUrl
//           ),
//         };
//       });
//     });
//   };

//   // Handle adding new color field
//   const handleAddColorField = () => {
//     setColorFields([
//       ...colorFields,
//       { colorName: "", selectedImages: [], newColorImages: [] },
//     ]);
//   };

//   // Handle color name change
//   const handleColorNameChange = (index, e) => {
//     const updatedColorFields = [...colorFields];
//     updatedColorFields[index].colorName = e.target.value;
//     setColorFields(updatedColorFields);
//   };

//   // Handle image selection for color variant
//   const handleImageSelection = (colorIndex, imageUrl) => {
//     const updatedColorFields = [...colorFields];
//     const selectedImages = updatedColorFields[colorIndex].selectedImages;

//     // Toggle image selection
//     if (selectedImages.includes(imageUrl)) {
//       updatedColorFields[colorIndex].selectedImages = selectedImages.filter(
//         (url) => url !== imageUrl
//       );
//     } else {
//       updatedColorFields[colorIndex].selectedImages = [
//         ...selectedImages,
//         imageUrl,
//       ];
//     }

//     setColorFields(updatedColorFields);
//   };

//   // Handle uploading new images for a specific color variant
//   const handleColorSpecificImageUpload = async (colorIndex, e) => {
//     const files = Array.from(e.target.files);

//     if (files.length === 0) return;

//     setIsUploading(true);
//     const formData = new FormData();

//     // Append all selected files to the FormData
//     files.forEach((file) => {
//       formData.append("images", file);
//     });

//     try {
//       const response = await axios.post(`${URL}/upload-img-test`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Get the uploaded image URLs from the response
//       const uploadedImageUrls = response.data.images;

//       // Add these new images to the primary images list
//       setProduct((prevProduct) => ({
//         ...prevProduct,
//         images: [...prevProduct.images, ...uploadedImageUrls],
//       }));

//       // Update the color fields to include these new images as selected
//       // and mark them as color-specific
//       const updatedColorFields = [...colorFields];
//       updatedColorFields[colorIndex].selectedImages = [
//         ...updatedColorFields[colorIndex].selectedImages,
//         ...uploadedImageUrls,
//       ];
//       // Also mark these as color-specific images
//       updatedColorFields[colorIndex].newColorImages = [
//         ...updatedColorFields[colorIndex].newColorImages,
//         ...uploadedImageUrls,
//       ];
//       setColorFields(updatedColorFields);

//       // Clear the file input
//       e.target.value = "";

//       toast({
//         title: "Success",
//         description: `${files.length} images uploaded successfully for ${
//           colorFields[colorIndex].colorName || "this color"
//         }!`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           "Failed to upload color-specific images. Please try again.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//       console.error("Error uploading color-specific images:", error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Filter images that are available for a specific color variant
//   const getAvailableImagesForColorVariant = (colorIndex) => {
//     // Get all images that are not color-specific for other variants
//     return product.images.filter((imageUrl) => {
//       // If it's a color-specific image for another color, don't show it
//       for (let i = 0; i < colorFields.length; i++) {
//         if (
//           i !== colorIndex &&
//           colorFields[i].newColorImages.includes(imageUrl)
//         ) {
//           return false;
//         }
//       }
//       return true;
//     });
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProduct({ ...product, [name]: value });
//   };

//   // Handle item set changes
//   const handleSetChange = (index, field, e) => {
//     const newSet = [...product.itemSet];
//     newSet[index][field] = e.target.value;
//     setProduct({ ...product, itemSet: newSet });
//   };

//   // Handle adding new item set
//   const handleAddSet = () => {
//     setProduct({
//       ...product,
//       itemSet: [...product.itemSet, { size: "", lengths: "" }],
//     });
//   };

//   // Handle removing item set
//   const handleRemoveSet = (index) => {
//     const newSet = product.itemSet.filter((_, i) => i !== index);
//     setProduct({ ...product, itemSet: newSet });
//   };

//   // Prepare colors object for submission
//   const prepareColorsObject = () => {
//     console.log("ColorField", colorFields);

//     const colorsObj = {};

//     colorFields.forEach((field) => {
//       if (field.colorName && field.selectedImages.length > 0) {
//         colorsObj[field.colorName] = field.selectedImages;
//       }
//     });

//     return colorsObj;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Prepare the colors object
//     const colorsObject = prepareColorsObject();
//     console.log("ColorObj", colorsObject);

//     const productData = {
//       ...product,
//       colors: colorsObject,
//     };
//     console.log(productData);

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(`${URL}/products`, productData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast({
//         title: "Success",
//         description: "Product added successfully!",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });

//       // Reset form
//       setProduct({
//         images: [],
//         brand: "",
//         article: "",
//         material: "",
//         colors: {},
//         itemSet: [{ size: "", lengths: "" }],
//         description: "",
//         gender: "",
//         price: "",
//         category: "",
//       });
//       setColorFields([
//         { colorName: "", selectedImages: [], newColorImages: [] },
//       ]);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to add product. Please try again.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });
//       console.error("Error adding product:", error);
//     }
//   };

//   return (
//     <Container maxW="container.xl" py={10}>
//       <Card
//         overflow="hidden"
//         variant="outline"
//         boxShadow="lg"
//         mb={8}
//         borderRadius="xl"
//       >
//         <CardHeader
//           bg={useColorModeValue("red.50", "red.900")}
//           borderBottom="1px"
//           borderColor={borderColor}
//           py={6}
//         >
//           <Flex align="center" justify="space-between">
//             <Heading size="lg" color={subheadingColor} fontWeight="bold">
//               Add New Product
//             </Heading>
//             <Text color="gray.500" fontSize="sm">
//               Fill in the product details below
//             </Text>
//           </Flex>
//         </CardHeader>

//         <CardBody p={0}>
//           {/* Image Upload Section */}
//           <Box
//             bg={sectionBg}
//             p={8}
//             borderBottom="1px"
//             borderColor={borderColor}
//           >
//             <Flex align="center" mb={6}>
//               <Icon
//                 as={MdAddAPhoto}
//                 mr={2}
//                 color={accentColor}
//                 boxSize="24px"
//               />
//               <Heading size="md" color={headingColor}>
//                 Product Images
//               </Heading>
//             </Flex>

//             <VStack spacing={8} align="stretch">
//               <FormControl>
//                 <FormLabel
//                   fontWeight="medium"
//                   display="flex"
//                   alignItems="center"
//                 >
//                   Primary Images
//                   <Tooltip label="These are the main product images shown in catalog">
//                     <Icon as={MdInfo} ml={2} color="gray.500" />
//                   </Tooltip>
//                 </FormLabel>

//                 <Box
//                   border="2px dashed"
//                   borderColor={borderColor}
//                   borderRadius="md"
//                   p={6}
//                   textAlign="center"
//                   cursor={isUploading ? "not-allowed" : "pointer"}
//                   position="relative"
//                   transition="all 0.2s"
//                   _hover={{
//                     borderColor: isUploading ? borderColor : accentColor,
//                   }}
//                   onClick={handleUploadAreaClick}
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop}
//                   opacity={isUploading ? 0.7 : 1}
//                 >
//                   <Input
//                     ref={fileInputRef}
//                     id="primary-image-input"
//                     type="file"
//                     multiple
//                     onChange={handlePrimaryImagesChange}
//                     accept="image/*"
//                     position="absolute"
//                     opacity="0"
//                     w="0"
//                     h="0"
//                     disabled={isUploading}
//                   />
//                   <VStack spacing={2}>
//                     {isUploading ? (
//                       <>
//                         <Spinner
//                           size="xl"
//                           color={accentColor}
//                           thickness="4px"
//                           speed="0.65s"
//                         />
//                         <Text fontWeight="medium">
//                           Uploading your images...
//                         </Text>
//                         <Text fontSize="sm" color="gray.500">
//                           Please wait
//                         </Text>
//                       </>
//                     ) : (
//                       <>
//                         <Icon
//                           as={MdCloudUpload}
//                           w={12}
//                           h={12}
//                           color="gray.400"
//                         />
//                         <Text fontWeight="medium">
//                           Drag and drop files here or click to browse
//                         </Text>
//                         <Text fontSize="sm" color="gray.500">
//                           PNG, JPG, GIF up to 10MB
//                         </Text>
//                       </>
//                     )}
//                   </VStack>
//                 </Box>

//                 {product.images.length > 0 && (
//                   <Box mt={6}>
//                     <Text fontWeight="medium" mb={3}>
//                       Uploaded Images ({product.images.length})
//                     </Text>
//                     <Flex flexWrap="wrap" gap={4}>
//                       {product.images.map((imageUrl, idx) => (
//                         <Box
//                           key={idx}
//                           position="relative"
//                           width="120px"
//                           height="120px"
//                           borderRadius="md"
//                           overflow="hidden"
//                           boxShadow="md"
//                           transition="transform 0.2s"
//                           _hover={{ transform: "scale(1.05)" }}
//                         >
//                           <Image
//                             src={imageUrl}
//                             alt={`Product image ${idx + 1}`}
//                             width="100%"
//                             height="100%"
//                             objectFit="cover"
//                           />
//                           {isColorSpecificImage(imageUrl) && (
//                             <Box
//                               position="absolute"
//                               top="2"
//                               left="2"
//                               bg="rgba(0,0,0,0.7)"
//                               color="white"
//                               fontSize="xs"
//                               px={2}
//                               py={1}
//                               borderRadius="md"
//                             >
//                               {getColorNameForImage(imageUrl)}
//                             </Box>
//                           )}
//                           <IconButton
//                             icon={<MdDeleteOutline />}
//                             size="sm"
//                             colorScheme="red"
//                             aria-label="Remove image"
//                             position="absolute"
//                             top="2"
//                             right="2"
//                             onClick={() => handleRemovePrimaryImage(idx)}
//                             opacity="0"
//                             _groupHover={{ opacity: 1 }}
//                             _hover={{ opacity: 1 }}
//                           />
//                         </Box>
//                       ))}
//                     </Flex>
//                   </Box>
//                 )}
//               </FormControl>

//               <Divider />

//               <VStack spacing={6} align="stretch">
//                 <Flex justifyContent="space-between" alignItems="center">
//                   <Text fontWeight="medium" fontSize="lg">
//                     Color Variants
//                   </Text>
//                   <Button
//                     leftIcon={<AddIcon />}
//                     onClick={handleAddColorField}
//                     colorScheme="red"
//                     variant="outline"
//                     size="sm"
//                   >
//                     Add Color Variant
//                   </Button>
//                 </Flex>

//                 {colorFields.map((field, index) => (
//                   <Card key={index} variant="outline" boxShadow="sm">
//                     <CardBody>
//                       <HStack justify="space-between" mb={4}>
//                         <HStack>
//                           <Tag colorScheme="red" size="md">
//                             Variant {index + 1}
//                           </Tag>
//                           {field.colorName && (
//                             <Tag variant="solid" colorScheme="gray">
//                               {field.colorName}
//                             </Tag>
//                           )}
//                         </HStack>
//                         {index > 0 && (
//                           <IconButton
//                             icon={<MdDeleteOutline />}
//                             size="sm"
//                             colorScheme="red"
//                             variant="ghost"
//                             onClick={() => {
//                               const newFields = colorFields.filter(
//                                 (_, i) => i !== index
//                               );
//                               setColorFields(newFields);
//                             }}
//                           />
//                         )}
//                       </HStack>

//                       <FormControl mb={6}>
//                         <FormLabel>Color Name</FormLabel>
//                         <Input
//                           value={field.colorName}
//                           onChange={(e) => handleColorNameChange(index, e)}
//                           placeholder="Enter color name"
//                           bg={bgColor}
//                         />
//                       </FormControl>

//                       {/* Image Selection Area */}
//                       <FormControl mb={6}>
//                         <FormLabel display="flex" alignItems="center">
//                           Select Images for this Color
//                           <Tooltip label="Choose which primary images represent this color variant">
//                             <Icon as={MdInfo} ml={2} color="gray.500" />
//                           </Tooltip>
//                         </FormLabel>

//                         {product.images.length > 0 ? (
//                           <Box
//                             borderWidth="1px"
//                             borderRadius="md"
//                             p={4}
//                             bg={bgColor}
//                           >
//                             <Text fontSize="sm" mb={3} color="gray.600">
//                               Select primary images that match this color
//                               variant:
//                             </Text>
//                             <SimpleGrid
//                               columns={{ base: 2, sm: 3, md: 4, lg: 6 }}
//                               spacing={3}
//                             >
//                               {getAvailableImagesForColorVariant(index).map(
//                                 (imageUrl, imgIdx) => {
//                                   const isUsedByOtherColor = isImageUsedByColor(
//                                     imageUrl,
//                                     index
//                                   );
//                                   const isSelected =
//                                     field.selectedImages.includes(imageUrl);
//                                   const isDisabled =
//                                     isUsedByOtherColor && !isSelected;

//                                   return (
//                                     <Box
//                                       key={imgIdx}
//                                       position="relative"
//                                       borderWidth="2px"
//                                       borderRadius="md"
//                                       borderColor={
//                                         isSelected ? accentColor : "transparent"
//                                       }
//                                       overflow="hidden"
//                                       transition="all 0.2s"
//                                       _hover={{
//                                         transform: isDisabled
//                                           ? "none"
//                                           : "scale(1.05)",
//                                       }}
//                                       onClick={() =>
//                                         !isDisabled &&
//                                         handleImageSelection(index, imageUrl)
//                                       }
//                                       cursor={
//                                         isDisabled ? "not-allowed" : "pointer"
//                                       }
//                                       opacity={isDisabled ? 0.5 : 1}
//                                     >
//                                       <Image
//                                         src={imageUrl}
//                                         alt={`Product image ${imgIdx + 1}`}
//                                         width="100%"
//                                         height="80px"
//                                         objectFit="cover"
//                                       />
//                                       {isDisabled && (
//                                         <Box
//                                           position="absolute"
//                                           top="0"
//                                           left="0"
//                                           right="0"
//                                           bottom="0"
//                                           bg="rgba(0,0,0,0.4)"
//                                           display="flex"
//                                           alignItems="center"
//                                           justifyContent="center"
//                                         >
//                                           <Text
//                                             color="white"
//                                             fontSize="xs"
//                                             textAlign="center"
//                                           >
//                                             Used by another color
//                                           </Text>
//                                         </Box>
//                                       )}
//                                       <Checkbox
//                                         position="absolute"
//                                         top="2"
//                                         right="2"
//                                         colorScheme="red"
//                                         isChecked={isSelected}
//                                         isDisabled={isDisabled}
//                                         onChange={() => {}}
//                                         zIndex="1"
//                                       />
//                                     </Box>
//                                   );
//                                 }
//                               )}
//                             </SimpleGrid>
//                           </Box>
//                         ) : (
//                           <Text fontSize="sm" color="gray.500">
//                             Please upload primary images first.
//                           </Text>
//                         )}
//                       </FormControl>

//                       {/* Optional: Upload additional color-specific images */}
//                       <FormControl>
//                         <FormLabel display="flex" alignItems="center">
//                           Add More Images for this Color (Optional)
//                           <Tooltip label="Upload additional images specific to this color that will only be available for this color variant">
//                             <Icon as={MdInfo} ml={2} color="gray.500" />
//                           </Tooltip>
//                         </FormLabel>
//                         <Box
//                           border="2px dashed"
//                           borderColor={borderColor}
//                           borderRadius="md"
//                           p={4}
//                           textAlign="center"
//                           cursor="pointer"
//                           transition="all 0.2s"
//                           _hover={{ borderColor: accentColor }}
//                           onClick={() =>
//                             document
//                               .getElementById(`color-image-input-${index}`)
//                               .click()
//                           }
//                         >
//                           <Input
//                             id={`color-image-input-${index}`}
//                             type="file"
//                             multiple
//                             onChange={(e) =>
//                               handleColorSpecificImageUpload(index, e)
//                             }
//                             accept="image/*"
//                             position="absolute"
//                             opacity="0"
//                           />
//                           <VStack spacing={2} justify="center">
//                             {isUploading ? (
//                               <>
//                                 <Spinner
//                                   size="md"
//                                   color={accentColor}
//                                   thickness="4px"
//                                   speed="0.65s"
//                                 />
//                                 <Text fontSize="sm" color="gray.500">
//                                   Please wait
//                                 </Text>
//                               </>
//                             ) : (
//                               <>
//                                 <Icon
//                                   as={MdCloudUpload}
//                                   w={6}
//                                   h={6}
//                                   color="gray.400"
//                                 />
//                                 <Text fontSize={"12px"}>
//                                   Upload additional images for this color
//                                 </Text>
//                               </>
//                             )}
//                           </VStack>
//                         </Box>
//                       </FormControl>

//                       {/* Selected images summary */}
//                       {field.selectedImages.length > 0 && (
//                         <Box mt={4}>
//                           <Text fontSize="sm" fontWeight="medium" mb={2}>
//                             Selected images for{" "}
//                             {field.colorName || "this color"}:{" "}
//                             {field.selectedImages.length}
//                           </Text>
//                           <Flex flexWrap="wrap" gap={2}>
//                             {field.selectedImages.map((imageUrl, imgIdx) => (
//                               <Box
//                                 key={imgIdx}
//                                 position="relative"
//                                 width="60px"
//                                 height="60px"
//                                 borderRadius="md"
//                                 overflow="hidden"
//                                 boxShadow="sm"
//                               >
//                                 <Image
//                                   src={imageUrl}
//                                   alt={`${field.colorName} image ${imgIdx + 1}`}
//                                   width="100%"
//                                   height="100%"
//                                   objectFit="cover"
//                                 />
//                                 {field.newColorImages.includes(imageUrl) && (
//                                   <Box
//                                     position="absolute"
//                                     top="1"
//                                     left="1"
//                                     bg="rgba(0,0,0,0.7)"
//                                     color="white"
//                                     fontSize="xs"
//                                     px={1}
//                                     py={0}
//                                     borderRadius="sm"
//                                   >
//                                     +
//                                   </Box>
//                                 )}
//                                 <IconButton
//                                   icon={<DeleteIcon />}
//                                   size="xs"
//                                   colorScheme="red"
//                                   aria-label="Remove image"
//                                   position="absolute"
//                                   top="1"
//                                   right="1"
//                                   onClick={() =>
//                                     handleImageSelection(index, imageUrl)
//                                   }
//                                 />
//                               </Box>
//                             ))}
//                           </Flex>
//                         </Box>
//                       )}
//                     </CardBody>
//                   </Card>
//                 ))}
//               </VStack>
//             </VStack>
//           </Box>

//           {/* Product Details Form */}
//           <form onSubmit={handleSubmit}>
//             <VStack spacing={0} align="stretch">
//               <Box
//                 bg={bgColor}
//                 p={8}
//                 borderBottom="1px"
//                 borderColor={borderColor}
//               >
//                 <Flex align="center" mb={6}>
//                   <Icon as={MdInfo} mr={2} color={accentColor} boxSize="24px" />
//                   <Heading size="md" color={headingColor}>
//                     Basic Information
//                   </Heading>
//                 </Flex>

//                 <Stack spacing={8}>
//                   <Grid
//                     templateColumns={{ base: "1fr", md: "1fr 1fr" }}
//                     gap={6}
//                   >
//                     <FormControl isRequired>
//                       <FormLabel>Brand</FormLabel>
//                       <Input
//                         name="brand"
//                         value={product.brand}
//                         onChange={handleChange}
//                         bg={sectionBg}
//                         _focus={{ borderColor: accentColor }}
//                         placeholder="Enter brand name"
//                       />
//                     </FormControl>
//                     <FormControl isRequired>
//                       <FormLabel>Article</FormLabel>
//                       <Input
//                         name="article"
//                         value={product.article}
//                         onChange={handleChange}
//                         bg={sectionBg}
//                         _focus={{ borderColor: accentColor }}
//                         placeholder="Enter article code"
//                       />
//                     </FormControl>
//                   </Grid>

//                   <FormControl isRequired>
//                     <FormLabel>Material</FormLabel>
//                     <Input
//                       name="material"
//                       value={product.material}
//                       onChange={handleChange}
//                       bg={sectionBg}
//                       _focus={{ borderColor: accentColor }}
//                       placeholder="Enter material details"
//                     />
//                   </FormControl>

//                   <Grid
//                     templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
//                     gap={6}
//                   >
//                     <FormControl isRequired>
//                       <FormLabel>Gender</FormLabel>
//                       <Select
//                         name="gender"
//                         value={product.gender}
//                         onChange={handleChange}
//                         bg={sectionBg}
//                         _focus={{ borderColor: accentColor }}
//                         placeholder="Select Gender"
//                       >
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="unisex">Unisex</option>
//                         <option value="kids">Kids</option>
//                       </Select>
//                     </FormControl>

//                     <FormControl isRequired>
//                       <FormLabel>Price</FormLabel>
//                       <Input
//                         type="number"
//                         name="price"
//                         value={product.price}
//                         onChange={handleChange}
//                         bg={sectionBg}
//                         _focus={{ borderColor: accentColor }}
//                         placeholder="0.00"
//                       />
//                     </FormControl>

//                     <FormControl isRequired>
//                       <FormLabel>Category</FormLabel>
//                       <Input
//                         name="category"
//                         value={product.category}
//                         onChange={handleChange}
//                         bg={sectionBg}
//                         _focus={{ borderColor: accentColor }}
//                         placeholder="Enter product category"
//                       />
//                     </FormControl>
//                   </Grid>
//                 </Stack>
//               </Box>

//               <Box
//                 bg={bgColor}
//                 p={8}
//                 borderBottom="1px"
//                 borderColor={borderColor}
//               >
//                 <Flex align="center" mb={6} justify="space-between">
//                   <Flex align="center">
//                     <Icon
//                       as={MdInfo}
//                       mr={2}
//                       color={accentColor}
//                       boxSize="24px"
//                     />
//                     <Heading size="md" color={headingColor}>
//                       Size & Quantity
//                     </Heading>
//                   </Flex>
//                   <Button
//                     leftIcon={<AddIcon />}
//                     onClick={handleAddSet}
//                     colorScheme="red"
//                     variant="outline"
//                     size="sm"
//                   >
//                     Add Size Set
//                   </Button>
//                 </Flex>

//                 <VStack spacing={4} align="stretch">
//                   {product.itemSet.map((set, index) => (
//                     <Card key={index} variant="outline" boxShadow="sm">
//                       <CardBody>
//                         <Grid
//                           templateColumns={{ base: "1fr", md: "1fr 1fr auto" }}
//                           gap={4}
//                         >
//                           <FormControl>
//                             <FormLabel fontSize="sm">Size</FormLabel>
//                             <Input
//                               placeholder="e.g., 6-10, 8-12, etc."
//                               value={set.size}
//                               onChange={(e) =>
//                                 handleSetChange(index, "size", e)
//                               }
//                               bg={sectionBg}
//                               _focus={{ borderColor: accentColor }}
//                             />
//                           </FormControl>
//                           <FormControl>
//                             <FormLabel fontSize="sm">Quantity</FormLabel>
//                             <Input
//                               placeholder="Number of pieces"
//                               value={set.lengths}
//                               onChange={(e) =>
//                                 handleSetChange(index, "lengths", e)
//                               }
//                               bg={sectionBg}
//                               _focus={{ borderColor: accentColor }}
//                               type="number"
//                             />
//                           </FormControl>
//                           {index > 0 && (
//                             <IconButton
//                               icon={<DeleteIcon />}
//                               colorScheme="red"
//                               variant="ghost"
//                               onClick={() => handleRemoveSet(index)}
//                               alignSelf="flex-end"
//                               aria-label="Delete size set"
//                             />
//                           )}
//                         </Grid>
//                       </CardBody>
//                     </Card>
//                   ))}
//                 </VStack>
//               </Box>

//               <Box bg={bgColor} p={8}>
//                 <Flex align="center" mb={6}>
//                   <Icon as={MdInfo} mr={2} color={accentColor} boxSize="24px" />
//                   <Heading size="md" color={headingColor}>
//                     Product Description
//                   </Heading>
//                 </Flex>

//                 <FormControl isRequired>
//                   <Textarea
//                     name="description"
//                     value={product.description}
//                     onChange={handleChange}
//                     rows={6}
//                     bg={sectionBg}
//                     _focus={{ borderColor: accentColor }}
//                     placeholder="Enter detailed product description including features, benefits, and any other important information..."
//                     resize="vertical"
//                   />
//                 </FormControl>
//               </Box>

//               <Box p={8} bg={sectionBg}>
//                 <Button
//                   type="submit"
//                   colorScheme="red"
//                   size="lg"
//                   height="16"
//                   fontSize="md"
//                   isFullWidth
//                   boxShadow="md"
//                   _hover={{
//                     transform: "translateY(-2px)",
//                     boxShadow: "lg",
//                   }}
//                   transition="all 0.2s"
//                 >
//                   Add Product
//                 </Button>
//               </Box>
//             </VStack>
//           </form>
//         </CardBody>
//       </Card>
//     </Container>
//   );
// }

// export default AddProduct;




import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
  Tag,
  Text,
  Textarea,
  Tooltip,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  MdAddAPhoto,
  MdCloudUpload,
  MdDeleteOutline,
  MdInfo,
  MdColorLens,
  MdFormatSize,
  MdDescription,
} from "react-icons/md";
import axios from "axios";
import React, { useState, useRef } from "react";
import { URL } from "../../context/url";

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

  // State for image upload
  const [isUploading, setIsUploading] = useState(false);
  const [colorFields, setColorFields] = useState([
    { colorName: "", selectedImages: [], newColorImages: [] },
  ]);

  // Colors for styling
  const bgColor = useColorModeValue("white", "gray.800");
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("red.500", "red.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const subheadingColor = useColorModeValue("red.600", "red.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Handle primary images upload
  const handlePrimaryImagesChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    // Append all selected files to the FormData
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(`${URL}/upload-img-test`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Get the uploaded image URLs from the response
      const uploadedImageUrls = response.data.images;

      // Update the product state with the new images
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...uploadedImageUrls],
      }));

      // Clear the file input value so the same files can be selected again if needed
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

  // Function to handle the click on the upload area
  const handleUploadAreaClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isUploading) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    // Create a new event-like object for the file input change handler
    const mockEvent = {
      target: {
        files: droppedFiles,
      },
    };

    // Process the dropped files
    handlePrimaryImagesChange(mockEvent);
  };

  // Check if an image is used by any color variant
  const isImageUsedByAnyColor = (imageUrl) => {
    return colorFields.some((field) => field.selectedImages.includes(imageUrl));
  };

  // Check if an image is used by a specific color variant
  const isImageUsedByColor = (imageUrl, currentColorIndex) => {
    return colorFields.some(
      (field, index) =>
        index !== currentColorIndex && field.selectedImages.includes(imageUrl)
    );
  };

  // Check if an image is a color-specific image
  const isColorSpecificImage = (imageUrl) => {
    // Check if this image was uploaded specifically for a color
    for (const field of colorFields) {
      if (field.newColorImages.includes(imageUrl)) {
        return true;
      }
    }
    return false;
  };

  // Get the color name for a color-specific image
  const getColorNameForImage = (imageUrl) => {
    for (const field of colorFields) {
      if (field.newColorImages.includes(imageUrl)) {
        return field.colorName || "specific color";
      }
    }
    return "";
  };

  // Handle removing a primary image
  const handleRemovePrimaryImage = (indexToRemove) => {
    // Get the URL of the image being removed
    const removedImageUrl = product.images[indexToRemove];

    // Remove the image from the primary images array
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_, index) => index !== indexToRemove),
    }));

    // Also remove the image from any color variant that has it selected
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

  // Handle adding new color field
  const handleAddColorField = () => {
    setColorFields([
      ...colorFields,
      { colorName: "", selectedImages: [], newColorImages: [] },
    ]);
  };

  // Handle color name change
  const handleColorNameChange = (index, e) => {
    const updatedColorFields = [...colorFields];
    updatedColorFields[index].colorName = e.target.value;
    setColorFields(updatedColorFields);
  };

  // Handle image selection for color variant
  const handleImageSelection = (colorIndex, imageUrl) => {
    const updatedColorFields = [...colorFields];
    const selectedImages = updatedColorFields[colorIndex].selectedImages;

    // Toggle image selection
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

  // Handle uploading new images for a specific color variant
  const handleColorSpecificImageUpload = async (colorIndex, e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    // Append all selected files to the FormData
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(`${URL}/upload-img-test`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Get the uploaded image URLs from the response
      const uploadedImageUrls = response.data.images;

      // Add these new images to the primary images list
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...uploadedImageUrls],
      }));

      // Update the color fields to include these new images as selected
      // and mark them as color-specific
      const updatedColorFields = [...colorFields];
      updatedColorFields[colorIndex].selectedImages = [
        ...updatedColorFields[colorIndex].selectedImages,
        ...uploadedImageUrls,
      ];
      // Also mark these as color-specific images
      updatedColorFields[colorIndex].newColorImages = [
        ...updatedColorFields[colorIndex].newColorImages,
        ...uploadedImageUrls,
      ];
      setColorFields(updatedColorFields);

      // Clear the file input
      e.target.value = "";

      toast({
        title: "Success",
        description: `${files.length} images uploaded successfully for ${
          colorFields[colorIndex].colorName || "this color"
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

  // Filter images that are available for a specific color variant
  const getAvailableImagesForColorVariant = (colorIndex) => {
    // Get all images that are not color-specific for other variants
    return product.images.filter((imageUrl) => {
      // If it's a color-specific image for another color, don't show it
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

  // Prepare colors object for submission
  const prepareColorsObject = () => {
    const colorsObj = {};

    colorFields.forEach((field) => {
      if (field.colorName && field.selectedImages.length > 0) {
        colorsObj[field.colorName] = field.selectedImages;
      }
    });

    return colorsObj;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the colors object
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
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.error("Error adding product:", error);
    }
  };

  return (
    <Container maxW="container.xl" py={6}>
      <Card
        overflow="hidden"
        variant="outline"
        boxShadow="sm"
        borderRadius="lg"
        borderColor={borderColor}
      >
        <CardHeader
          bg={useColorModeValue("white", "gray.800")}
          borderBottom="1px"
          borderColor={borderColor}
          py={4}
          px={6}
        >
          <Flex align="center" justify="space-between">
            <Heading size="md" color={headingColor} fontWeight="semibold">
              Add New Product
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Fill in the details below
            </Text>
          </Flex>
        </CardHeader>

        <CardBody p={0}>
          {/* Image Upload Section */}
          <Box
            bg={bgColor}
            p={{ base: 4, md: 6 }}
            borderBottom="1px"
            borderColor={borderColor}
          >
            <Flex align="center" mb={4}>
              <Icon
                as={MdAddAPhoto}
                mr={2}
                color={accentColor}
                boxSize="20px"
              />
              <Heading size="sm" color={headingColor}>
                Product Images
              </Heading>
            </Flex>

            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel
                  fontWeight="medium"
                  fontSize="sm"
                  display="flex"
                  alignItems="center"
                >
                  Primary Images
                  <Tooltip label="These are the main product images shown in catalog">
                    <Icon as={MdInfo} ml={2} color="gray.500" boxSize="14px" />
                  </Tooltip>
                </FormLabel>

                <Box
                  border="1px dashed"
                  borderColor={borderColor}
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  cursor={isUploading ? "not-allowed" : "pointer"}
                  position="relative"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: isUploading ? borderColor : accentColor,
                    bg: hoverBg,
                  }}
                  onClick={handleUploadAreaClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  opacity={isUploading ? 0.7 : 1}
                >
                  <Input
                    ref={fileInputRef}
                    id="primary-image-input"
                    type="file"
                    multiple
                    onChange={handlePrimaryImagesChange}
                    accept="image/*"
                    position="absolute"
                    opacity="0"
                    w="0"
                    h="0"
                    disabled={isUploading}
                  />
                  <VStack spacing={2}>
                    {isUploading ? (
                      <>
                        <Spinner
                          size="md"
                          color={accentColor}
                          thickness="3px"
                          speed="0.65s"
                        />
                        <Text fontWeight="medium" fontSize="sm">
                          Uploading...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Icon
                          as={MdCloudUpload}
                          w={8}
                          h={8}
                          color="gray.400"
                        />
                        <Text fontWeight="medium" fontSize="sm">
                          Drag and drop files or click to browse
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          PNG, JPG, GIF up to 10MB
                        </Text>
                      </>
                    )}
                  </VStack>
                </Box>

                {product.images.length > 0 && (
                  <Box mt={4}>
                    <Text fontWeight="medium" fontSize="sm" mb={3}>
                      Uploaded Images ({product.images.length})
                    </Text>
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={3}>
                      {product.images.map((imageUrl, idx) => (
                        <Box
                          key={idx}
                          position="relative"
                          borderRadius="md"
                          overflow="hidden"
                          boxShadow="sm"
                          transition="transform 0.2s"
                          _hover={{ transform: "scale(1.03)" }}
                          role="group"
                        >
                          <Image
                            src={imageUrl}
                            alt={`Product image ${idx + 1}`}
                            width="100%"
                            height="100px"
                            objectFit="cover"
                          />
                          {isColorSpecificImage(imageUrl) && (
                            <Box
                              position="absolute"
                              top="2"
                              left="2"
                              bg="rgba(0,0,0,0.7)"
                              color="white"
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              {getColorNameForImage(imageUrl)}
                            </Box>
                          )}
                          <IconButton
                            icon={<DeleteIcon />}
                            size="xs"
                            colorScheme="red"
                            aria-label="Remove image"
                            position="absolute"
                            top="2"
                            right="2"
                            onClick={() => handleRemovePrimaryImage(idx)}
                            opacity="0"
                            _groupHover={{ opacity: 1 }}
                          />
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
              </FormControl>

              <Divider />

              <VStack spacing={5} align="stretch">
                <Flex justifyContent="space-between" alignItems="center">
                  <HStack>
                    <Icon as={MdColorLens} color={accentColor} />
                    <Text fontWeight="medium" fontSize="sm">
                      Color Variants
                    </Text>
                  </HStack>
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddColorField}
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                  >
                    Add Color
                  </Button>
                </Flex>

                {colorFields.map((field, index) => (
                  <Card key={index} variant="outline" boxShadow="xs" borderRadius="md">
                    <CardBody p={4}>
                      <HStack justify="space-between" mb={3}>
                        <HStack>
                          <Tag colorScheme="red" size="sm" variant="subtle">
                            Variant {index + 1}
                          </Tag>
                          {field.colorName && (
                            <Tag variant="outline" colorScheme="gray" size="sm">
                              {field.colorName}
                            </Tag>
                          )}
                        </HStack>
                        {index > 0 && (
                          <IconButton
                            icon={<DeleteIcon />}
                            size="xs"
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

                      <FormControl mb={4}>
                        <FormLabel fontSize="xs">Color Name</FormLabel>
                        <Input
                          value={field.colorName}
                          onChange={(e) => handleColorNameChange(index, e)}
                          placeholder="Enter color name"
                          bg={bgColor}
                          size="sm"
                        />
                      </FormControl>

                      {/* Image Selection Area */}
                      <FormControl mb={4}>
                        <FormLabel fontSize="xs" display="flex" alignItems="center">
                          Select Images
                          <Tooltip label="Choose which images represent this color variant">
                            <Icon as={MdInfo} ml={2} color="gray.500" boxSize="12px" />
                          </Tooltip>
                        </FormLabel>

                        {product.images.length > 0 ? (
                          <SimpleGrid
                            columns={{ base: 3, md: 4, lg: 5 }}
                            spacing={2}
                          >
                            {getAvailableImagesForColorVariant(index).map(
                              (imageUrl, imgIdx) => {
                                const isUsedByOtherColor = isImageUsedByColor(
                                  imageUrl,
                                  index
                                );
                                const isSelected =
                                  field.selectedImages.includes(imageUrl);
                                const isDisabled =
                                  isUsedByOtherColor && !isSelected;

                                return (
                                  <Box
                                    key={imgIdx}
                                    position="relative"
                                    borderWidth="2px"
                                    borderRadius="md"
                                    borderColor={
                                      isSelected ? accentColor : "transparent"
                                    }
                                    overflow="hidden"
                                    transition="all 0.2s"
                                    _hover={{
                                      transform: isDisabled
                                        ? "none"
                                        : "scale(1.05)",
                                    }}
                                    onClick={() =>
                                      !isDisabled &&
                                      handleImageSelection(index, imageUrl)
                                    }
                                    cursor={
                                      isDisabled ? "not-allowed" : "pointer"
                                    }
                                    opacity={isDisabled ? 0.5 : 1}
                                  >
                                    <Image
                                      src={imageUrl}
                                      alt={`Product image ${imgIdx + 1}`}
                                      width="100%"
                                      height="60px"
                                      objectFit="cover"
                                    />
                                    {isDisabled && (
                                      <Box
                                        position="absolute"
                                        top="0"
                                        left="0"
                                        right="0"
                                        bottom="0"
                                        bg="rgba(0,0,0,0.4)"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                      >
                                        <Text
                                          color="white"
                                          fontSize="xs"
                                          textAlign="center"
                                        >
                                          Used
                                        </Text>
                                      </Box>
                                    )}
                                    <Checkbox
                                      position="absolute"
                                      top="1"
                                      right="1"
                                      colorScheme="red"
                                      isChecked={isSelected}
                                      isDisabled={isDisabled}
                                      onChange={() => {}}
                                      zIndex="1"
                                      size="sm"
                                    />
                                  </Box>
                                );
                              }
                            )}
                          </SimpleGrid>
                        ) : (
                          <Text fontSize="xs" color="gray.500">
                            Please upload primary images first.
                          </Text>
                        )}
                      </FormControl>

                      {/* Upload color-specific images */}
                      <FormControl>
                        <FormLabel fontSize="xs" display="flex" alignItems="center">
                          Add Color-Specific Images
                          <Tooltip label="Upload images specific to this color variant">
                            <Icon as={MdInfo} ml={2} color="gray.500" boxSize="12px" />
                          </Tooltip>
                        </FormLabel>
                        <Box
                          border="1px dashed"
                          borderColor={borderColor}
                          borderRadius="md"
                          p={3}
                          textAlign="center"
                          cursor="pointer"
                          transition="all 0.2s"
                          _hover={{ borderColor: accentColor, bg: hoverBg }}
                          onClick={() =>
                            document
                              .getElementById(`color-image-input-${index}`)
                              .click()
                          }
                        >
                          <Input
                            id={`color-image-input-${index}`}
                            type="file"
                            multiple
                            onChange={(e) =>
                              handleColorSpecificImageUpload(index, e)
                            }
                            accept="image/*"
                            position="absolute"
                            opacity="0"
                          />
                          <HStack spacing={2} justify="center">
                            {isUploading ? (
                              <Spinner
                                size="sm"
                                color={accentColor}
                                thickness="2px"
                                speed="0.65s"
                              />
                            ) : (
                              <Icon
                                as={MdCloudUpload}
                                w={4}
                                h={4}
                                color="gray.400"
                              />
                            )}
                            <Text fontSize="xs">
                              {isUploading ? "Uploading..." : "Upload color-specific images"}
                            </Text>
                          </HStack>
                        </Box>
                      </FormControl>

                      {/* Selected images summary */}
                      {field.selectedImages.length > 0 && (
                        <Box mt={3}>
                          <Text fontSize="xs" fontWeight="medium" mb={2}>
                            Selected: {field.selectedImages.length}
                          </Text>
                          <Flex flexWrap="wrap" gap={2}>
                            {field.selectedImages.map((imageUrl, imgIdx) => (
                              <Box
                                key={imgIdx}
                                position="relative"
                                width="40px"
                                height="40px"
                                borderRadius="md"
                                overflow="hidden"
                                boxShadow="sm"
                              >
                                <Image
                                  src={imageUrl}
                                  alt={`${field.colorName} image ${imgIdx + 1}`}
                                  width="100%"
                                  height="100%"
                                  objectFit="cover"
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  size="xs"
                                  colorScheme="red"
                                  aria-label="Remove image"
                                  position="absolute"
                                  top="1"
                                  right="1"
                                  onClick={() =>
                                    handleImageSelection(index, imageUrl)
                                  }
                                />
                              </Box>
                            ))}
                          </Flex>
                        </Box>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </VStack>
          </Box>

          {/* Product Details Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={0} align="stretch">
              <Box
                bg={bgColor}
                p={{ base: 4, md: 6 }}
                borderBottom="1px"
                borderColor={borderColor}
              >
                <Flex align="center" mb={4}>
                  <Icon as={MdInfo} mr={2} color={accentColor} boxSize="20px" />
                  <Heading size="sm" color={headingColor}>
                    Basic Information
                  </Heading>
                </Flex>

                <Stack spacing={6}>
                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                  >
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Brand</FormLabel>
                      <Input
                        name="brand"
                        value={product.brand}
                        onChange={handleChange}
                        bg={bgColor}
                        _focus={{ borderColor: accentColor }}
                        placeholder="Enter brand name"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Article</FormLabel>
                      <Input
                        name="article"
                        value={product.article}
                        onChange={handleChange}
                        bg={bgColor}
                        _focus={{ borderColor: accentColor }}
                        placeholder="Enter article code"
                        size="sm"
                      />
                    </FormControl>
                  </Grid>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Material</FormLabel>
                    <Input
                      name="material"
                      value={product.material}
                      onChange={handleChange}
                      bg={bgColor}
                      _focus={{ borderColor: accentColor }}
                      placeholder="Enter material details"
                      size="sm"
                    />
                  </FormControl>

                  <Grid
                    templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
                    gap={4}
                  >
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Gender</FormLabel>
                      <Select
                        name="gender"
                        value={product.gender}
                        onChange={handleChange}
                        bg={bgColor}
                        _focus={{ borderColor: accentColor }}
                        placeholder="Select Gender"
                        size="sm"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Price</FormLabel>
                      <Input
                       type="number"
                       name="price"
                       value={product.price}
                       onChange={handleChange}
                       bg={bgColor}
                       _focus={{ borderColor: accentColor }}
                       placeholder="0.00"
                       size="sm"
                     />
                   </FormControl>

                   <FormControl isRequired>
                     <FormLabel fontSize="sm">Category</FormLabel>
                     <Input
                       name="category"
                       value={product.category}
                       onChange={handleChange}
                       bg={bgColor}
                       _focus={{ borderColor: accentColor }}
                       placeholder="Enter product category"
                       size="sm"
                     />
                   </FormControl>
                 </Grid>
               </Stack>
             </Box>

             <Box
               bg={bgColor}
               p={{ base: 4, md: 6 }}
               borderBottom="1px"
               borderColor={borderColor}
             >
               <Flex align="center" mb={4} justify="space-between">
                 <Flex align="center">
                   <Icon
                     as={MdFormatSize}
                     mr={2}
                     color={accentColor}
                     boxSize="20px"
                   />
                   <Heading size="sm" color={headingColor}>
                     Size & Quantity
                   </Heading>
                 </Flex>
                 <Button
                   leftIcon={<AddIcon />}
                   onClick={handleAddSet}
                   colorScheme="red"
                   variant="outline"
                   size="sm"
                 >
                   Add Size Set
                 </Button>
               </Flex>

               <VStack spacing={4} align="stretch">
                 {product.itemSet.map((set, index) => (
                   <Card key={index} variant="outline" boxShadow="xs">
                     <CardBody p={3}>
                       <Grid
                         templateColumns={{ base: "1fr", md: "1fr 1fr auto" }}
                         gap={3}
                       >
                         <FormControl>
                           <FormLabel fontSize="xs">Size</FormLabel>
                           <Input
                             placeholder="e.g., 6-10, 8-12, etc."
                             value={set.size}
                             onChange={(e) =>
                               handleSetChange(index, "size", e)
                             }
                             bg={bgColor}
                             _focus={{ borderColor: accentColor }}
                             size="sm"
                           />
                         </FormControl>
                         <FormControl>
                           <FormLabel fontSize="xs">Quantity</FormLabel>
                           <Input
                             placeholder="Number of pieces"
                             value={set.lengths}
                             onChange={(e) =>
                               handleSetChange(index, "lengths", e)
                             }
                             bg={bgColor}
                             _focus={{ borderColor: accentColor }}
                             type="number"
                             size="sm"
                           />
                         </FormControl>
                         {index > 0 && (
                           <IconButton
                             icon={<DeleteIcon />}
                             colorScheme="red"
                             variant="ghost"
                             onClick={() => handleRemoveSet(index)}
                             alignSelf="flex-end"
                             aria-label="Delete size set"
                             size="sm"
                           />
                         )}
                       </Grid>
                     </CardBody>
                   </Card>
                 ))}
               </VStack>
             </Box>

             <Box bg={bgColor} p={{ base: 4, md: 6 }}>
               <Flex align="center" mb={4}>
                 <Icon as={MdDescription} mr={2} color={accentColor} boxSize="20px" />
                 <Heading size="sm" color={headingColor}>
                   Product Description
                 </Heading>
               </Flex>

               <FormControl >
                 <Textarea
                   name="description"
                   value={product.description}
                   onChange={handleChange}
                   rows={5}
                   bg={bgColor}
                   _focus={{ borderColor: accentColor }}
                   placeholder="Enter detailed product description including features, benefits, and any other important information..."
                   resize="vertical"
                   size="sm"
                 />
               </FormControl>
             </Box>

             <Box p={{ base: 4, md: 6 }} bg={sectionBg}>
               <Button
                 type="submit"
                 colorScheme="red"
                 size="md"
                 isFullWidth
                 boxShadow="md"
                 _hover={{
                   transform: "translateY(-2px)",
                   boxShadow: "lg",
                 }}
                 transition="all 0.2s"
               >
                 Add Product
               </Button>
             </Box>
           </VStack>
         </form>
       </CardBody>
     </Card>
   </Container>
 );
}

export default AddProduct;