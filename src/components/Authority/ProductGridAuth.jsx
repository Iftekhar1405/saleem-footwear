import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
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
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { URL } from "../../context/url";

// ─── Data fetching hook ───────────────────────────────────────────────────────

const useFetchData = (url, limit = 20) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const fetchData = useCallback(
    async (page) => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const response = await axios.get(url, {
          params: { page, limit },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.products.length === 0) {
          setHasMore(false);
        } else {
          setData((prev) => [...prev, ...response.data.products]);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [url, limit]
  );

  useEffect(() => {
    setData([]);
    pageRef.current = 1;
    setHasMore(true);
    fetchData(pageRef.current);
  }, [url]);

  const handleScroll = useCallback(() => {
    if (document.documentElement.scrollHeight <= window.innerHeight) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= scrollableHeight - 200 && window.scrollY > 0 && !loading && hasMore) {
      pageRef.current += 1;
      fetchData(pageRef.current);
    }
  }, [loading, hasMore, fetchData]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { data, loading, error };
};

// ─── Color swatch helper ──────────────────────────────────────────────────────

const COLOR_MAP = {
  red: "#FC8181", blue: "#63B3ED", green: "#68D391", black: "#2D3748",
  white: "#EDF2F7", yellow: "#F6E05E", brown: "#975A16", grey: "#A0AEC0",
  gray: "#A0AEC0", pink: "#F687B3", purple: "#B794F4", orange: "#F6AD55",
  navy: "#2A4365", beige: "#F0D9B5", cream: "#FFFDE7", tan: "#C8A97E",
  maroon: "#702459", gold: "#D69E2E", silver: "#CBD5E0", khaki: "#BDB76B",
};

const swatchColor = (name) => COLOR_MAP[name?.toLowerCase()?.trim()] ?? "#CBD5E0";

// ─── Reusable image thumbnail grid ───────────────────────────────────────────

const ImageGrid = ({ images, onRemove }) => {
  if (!images || images.length === 0) return null;
  return (
    <SimpleGrid columns={{ base: 3, md: 4 }} spacing={2} mb={3}>
      {images.map((url, i) => (
        <Box
          key={i}
          position="relative"
          role="group"
          borderRadius="10px"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.100"
        >
          <Image
            src={url}
            alt=""
            width="100%"
            height="80px"
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/120x80?text=..."
          />
          <IconButton
            icon={<CloseIcon boxSize="7px" />}
            size="xs"
            colorScheme="red"
            aria-label="Remove image"
            position="absolute"
            top="4px"
            right="4px"
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.15s"
            onClick={() => onRemove(i)}
            borderRadius="full"
          />
        </Box>
      ))}
    </SimpleGrid>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product, onEdit, onDelete }) => {
  const colors = Object.keys(product.colors || {});

  return (
    <Box
      borderRadius="16px"
      overflow="hidden"
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="0 1px 4px rgba(0,0,0,0.06)"
      transition="all 0.22s ease"
      _hover={{ boxShadow: "0 10px 28px rgba(0,0,0,0.1)", transform: "translateY(-4px)" }}
      role="group"
      display="flex"
      flexDir="column"
      h="100%"
    >
      {/* Image */}
      <Box position="relative" h="200px" flexShrink={0} bg="gray.100">
        <Image
          src={product.images?.[0]}
          alt={product.article}
          objectFit="cover"
          w="100%"
          h="100%"
          fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
        />
        {/* Gradient overlay on hover */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, blackAlpha.500 0%, transparent 55%)"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.22s"
        />
        {/* Action buttons */}
        <HStack
          position="absolute"
          top={3}
          right={3}
          spacing={2}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.22s"
        >
          <Tooltip label="Edit" placement="left">
            <IconButton
              icon={<EditIcon />}
              onClick={() => onEdit(product)}
              size="sm"
              bg="white"
              color="gray.700"
              _hover={{ bg: "blue.50", color: "blue.600" }}
              borderRadius="full"
              aria-label="Edit product"
              shadow="md"
            />
          </Tooltip>
          <Tooltip label="Delete" placement="left">
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => onDelete(product._id)}
              size="sm"
              bg="white"
              color="gray.700"
              _hover={{ bg: "red.500", color: "white" }}
              borderRadius="full"
              aria-label="Delete product"
              shadow="md"
            />
          </Tooltip>
        </HStack>
        {/* Stock badge */}
        {!product.inStock && (
          <Badge
            position="absolute"
            bottom={3}
            left={3}
            colorScheme="red"
            borderRadius="full"
            px={2}
            fontSize="xs"
          >
            Out of Stock
          </Badge>
        )}
      </Box>

      {/* Body */}
      <Box p={4} flex={1} display="flex" flexDir="column">
        <Text fontSize="xs" color="gray.400" fontFamily="mono" letterSpacing="0.5px" mb={0.5}>
          {product.brand}
        </Text>
        <Text fontWeight="700" color="gray.800" fontSize="md" noOfLines={1} mb={2}>
          {product.article}
        </Text>

        <HStack spacing={1.5} mb={3} flexWrap="wrap">
          <Badge colorScheme="purple" borderRadius="full" px={2} fontSize="10px" fontWeight="600">
            {product.gender}
          </Badge>
          {product.category && (
            <Badge colorScheme="blue" borderRadius="full" px={2} fontSize="10px" fontWeight="600">
              {product.category}
            </Badge>
          )}
          {product.material && (
            <Badge colorScheme="gray" borderRadius="full" px={2} fontSize="10px" fontWeight="600">
              {product.material}
            </Badge>
          )}
        </HStack>

        {/* Color swatches */}
        {colors.length > 0 && (
          <HStack spacing={1} mb={3} flexWrap="wrap">
            {colors.slice(0, 9).map((c) => (
              <Tooltip key={c} label={c} placement="top" hasArrow>
                <Box
                  w="14px"
                  h="14px"
                  borderRadius="full"
                  backgroundColor={swatchColor(c)}
                  border="2px solid white"
                  boxShadow="0 0 0 1px rgba(0,0,0,0.12)"
                  cursor="default"
                  flexShrink={0}
                />
              </Tooltip>
            ))}
            {colors.length > 9 && (
              <Text fontSize="10px" color="gray.400" fontWeight="600">
                +{colors.length - 9}
              </Text>
            )}
          </HStack>
        )}

        <Box mt="auto" pt={2} borderTop="1px solid" borderColor="gray.50">
          <Text fontWeight="800" color="gray.900" fontSize="lg">
            ₹{product.price?.toLocaleString("en-IN")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Edit Drawer ──────────────────────────────────────────────────────────────

const ProductEditDrawer = ({ product, isOpen, onClose, onSave }) => {
  const [edited, setEdited] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const primaryFileRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (product) {
      setEdited({ ...product, colorsStock: product.colorsStock || [] });
    }
  }, [product]);

  if (!edited) return null;

  const setField = (name, value, asNumber = false) =>
    setEdited((prev) => ({ ...prev, [name]: asNumber ? Number(value) : value }));

  const uploadImages = async (files, colorKey = null) => {
    if (!files?.length) return;
    setIsUploading(true);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("images", f));
    try {
      const { data } = await axios.post(`${URL}/upload-img-test`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const urls = data.images;
      if (colorKey === null) {
        setEdited((prev) => ({ ...prev, images: [...(prev.images || []), ...urls] }));
      } else {
        setEdited((prev) => ({
          ...prev,
          colors: { ...prev.colors, [colorKey]: [...(prev.colors[colorKey] || []), ...urls] },
        }));
      }
      toast({
        title: `${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({ title: "Upload failed", status: "error", duration: 3000, isClosable: true });
    } finally {
      setIsUploading(false);
    }
  };

  const removePrimaryImage = (i) =>
    setEdited((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  const removeColorImage = (color, i) =>
    setEdited((prev) => ({
      ...prev,
      colors: { ...prev.colors, [color]: prev.colors[color].filter((_, idx) => idx !== i) },
    }));

  const addColor = () => {
    const name = `Color ${Object.keys(edited.colors || {}).length + 1}`;
    setEdited((prev) => ({
      ...prev,
      colors: { ...prev.colors, [name]: [] },
      colorsStock: [...(prev.colorsStock || []), { color: name, inStock: true }],
    }));
  };

  const renameColor = (oldName, newName) => {
    setEdited((prev) => {
      // Rebuild the colors object preserving insertion order so the renamed
      // key stays in place (avoids the list reordering while typing).
      const colors = {};
      Object.keys(prev.colors).forEach((key) => {
        colors[key === oldName ? newName : key] = prev.colors[key];
      });
      return {
        ...prev,
        colors,
        colorsStock: (prev.colorsStock || []).map((s) =>
          s.color === oldName ? { ...s, color: newName } : s
        ),
      };
    });
  };

  const toggleColorStock = (colorName, inStock) =>
    setEdited((prev) => ({
      ...prev,
      colorsStock: (prev.colorsStock || []).map((s) =>
        s.color === colorName ? { ...s, inStock } : s
      ),
    }));

  const removeColor = (colorName) =>
    setEdited((prev) => {
      const colors = { ...prev.colors };
      delete colors[colorName];
      return {
        ...prev,
        colors,
        colorsStock: (prev.colorsStock || []).filter((s) => s.color !== colorName),
      };
    });

  const colorInStock = (name) =>
    (edited.colorsStock || []).find((s) => s.color === name)?.inStock ?? true;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(edited);
    setIsSaving(false);
  };

  const colorKeys = Object.keys(edited.colors || {});

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg" placement="right">
      <DrawerOverlay backdropFilter="blur(3px)" bg="blackAlpha.400" />
      <DrawerContent borderLeftRadius="20px" overflow="hidden">
        <DrawerCloseButton mt={2} />

        <DrawerHeader borderBottomWidth="1px" borderColor="gray.100" pb={4} pt={5}>
          <HStack spacing={3}>
            {product?.images?.[0] && (
              <Image
                src={product.images[0]}
                alt=""
                w="40px"
                h="40px"
                objectFit="cover"
                borderRadius="10px"
                flexShrink={0}
              />
            )}
            <Box>
              <Text fontSize="md" fontWeight="700" color="gray.800" lineHeight="1.2">
                {edited.article}
              </Text>
              <Text fontSize="xs" color="gray.400" mt={0.5}>
                {edited.brand}
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={0} overflowY="auto">
          <Tabs variant="line" colorScheme="blue" isLazy>
            <TabList
              px={6}
              borderBottomWidth="1px"
              borderColor="gray.100"
              position="sticky"
              top={0}
              bg="white"
              zIndex={1}
            >
              <Tab fontSize="sm" fontWeight="500" py={3}>
                Details
              </Tab>
              <Tab fontSize="sm" fontWeight="500" py={3}>
                Images
                {(edited.images?.length ?? 0) > 0 && (
                  <Badge ml={2} colorScheme="blue" borderRadius="full" fontSize="10px">
                    {edited.images.length}
                  </Badge>
                )}
              </Tab>
              <Tab fontSize="sm" fontWeight="500" py={3}>
                Colors
                {colorKeys.length > 0 && (
                  <Badge ml={2} colorScheme="purple" borderRadius="full" fontSize="10px">
                    {colorKeys.length}
                  </Badge>
                )}
              </Tab>
            </TabList>

            <TabPanels>
              {/* ── DETAILS ── */}
              <TabPanel p={6}>
                <VStack spacing={5} align="stretch">
                  <SimpleGrid columns={2} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="0.5px">
                        Article / SKU
                      </FormLabel>
                      <Input
                        value={edited.article || ""}
                        onChange={(e) => setField("article", e.target.value)}
                        size="sm"
                        borderRadius="10px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="0.5px">
                        Brand
                      </FormLabel>
                      <Input
                        value={edited.brand || ""}
                        onChange={(e) => setField("brand", e.target.value)}
                        size="sm"
                        borderRadius="10px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="0.5px">
                        Price (₹)
                      </FormLabel>
                      <Input
                        type="number"
                        value={edited.price || ""}
                        onChange={(e) => setField("price", e.target.value, true)}
                        size="sm"
                        borderRadius="10px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="0.5px">
                        Gender
                      </FormLabel>
                      <Select
                        value={edited.gender || ""}
                        onChange={(e) => setField("gender", e.target.value)}
                        size="sm"
                        borderRadius="10px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="0.5px">
                        Category
                      </FormLabel>
                      <Input
                        value={edited.category || ""}
                        onChange={(e) => setField("category", e.target.value)}
                        size="sm"
                        borderRadius="10px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="0.5px">
                        Material
                      </FormLabel>
                      <Input
                        value={edited.material || ""}
                        onChange={(e) => setField("material", e.target.value)}
                        size="sm"
                        borderRadius="10px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel fontSize="xs" color="gray.500" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="0.5px">
                      Description
                    </FormLabel>
                    <Textarea
                      value={edited.description || ""}
                      onChange={(e) => setField("description", e.target.value)}
                      size="sm"
                      borderRadius="10px"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{ bg: "white", borderColor: "blue.400" }}
                      rows={3}
                      resize="vertical"
                    />
                  </FormControl>

                  {/* Stock toggle */}
                  <Box
                    bg={edited.inStock ? "green.50" : "red.50"}
                    border="1px solid"
                    borderColor={edited.inStock ? "green.100" : "red.100"}
                    borderRadius="12px"
                    p={4}
                  >
                    <HStack justify="space-between">
                      <Box>
                        <Text fontSize="sm" fontWeight="600" color="gray.700">
                          Product Stock
                        </Text>
                        <Text fontSize="xs" color="gray.500" mt={0.5}>
                          Overall availability shown to customers
                        </Text>
                      </Box>
                      <HStack spacing={3}>
                        <Text
                          fontSize="sm"
                          fontWeight="700"
                          color={edited.inStock ? "green.600" : "red.500"}
                        >
                          {edited.inStock ? "In Stock" : "Out of Stock"}
                        </Text>
                        <Switch
                          isChecked={edited.inStock ?? true}
                          onChange={(e) => setField("inStock", e.target.checked)}
                          colorScheme="green"
                          size="lg"
                        />
                      </HStack>
                    </HStack>
                  </Box>
                </VStack>
              </TabPanel>

              {/* ── IMAGES ── */}
              <TabPanel p={6}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={0.5}>
                      Primary Images
                    </Text>
                    <Text fontSize="xs" color="gray.400" mb={4}>
                      First image is used as the product thumbnail. Hover over any image to remove it.
                    </Text>

                    <ImageGrid images={edited.images} onRemove={removePrimaryImage} />

                    <input
                      ref={primaryFileRef}
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        uploadImages(e.target.files, null);
                        e.target.value = "";
                      }}
                    />
                    <Box
                      border="2px dashed"
                      borderColor="blue.200"
                      borderRadius="12px"
                      p={6}
                      textAlign="center"
                      cursor="pointer"
                      bg="blue.50"
                      _hover={{ bg: "blue.100", borderColor: "blue.300" }}
                      transition="all 0.15s"
                      onClick={() => primaryFileRef.current?.click()}
                    >
                      {isUploading ? (
                        <VStack spacing={2}>
                          <Spinner size="sm" color="blue.500" />
                          <Text fontSize="sm" color="blue.500">Uploading…</Text>
                        </VStack>
                      ) : (
                        <VStack spacing={1}>
                          <AddIcon color="blue.400" boxSize={5} />
                          <Text fontSize="sm" fontWeight="600" color="blue.600">
                            {(edited.images?.length ?? 0) > 0 ? "Add More Images" : "Upload Images"}
                          </Text>
                          <Text fontSize="xs" color="blue.400">
                            Click to browse — JPG, PNG, WebP
                          </Text>
                        </VStack>
                      )}
                    </Box>
                  </Box>
                </VStack>
              </TabPanel>

              {/* ── COLORS ── */}
              <TabPanel p={6}>
                <VStack spacing={4} align="stretch">
                  {colorKeys.length === 0 && (
                    <Box textAlign="center" py={6}>
                      <Text fontSize="sm" color="gray.400">
                        No color variants yet.
                      </Text>
                    </Box>
                  )}

                  {colorKeys.map((colorName, idx) => (
                    <Box
                      key={idx}
                      border="1px solid"
                      borderColor="gray.100"
                      borderRadius="14px"
                      overflow="hidden"
                      bg="white"
                      boxShadow="0 1px 4px rgba(0,0,0,0.04)"
                    >
                      {/* Color header */}
                      <HStack
                        px={4}
                        py={3}
                        bg="gray.50"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        justify="space-between"
                      >
                        <HStack spacing={3} flex={1} minW={0}>
                          <Box
                            w="22px"
                            h="22px"
                            borderRadius="full"
                            backgroundColor={swatchColor(colorName)}
                            border="2px solid white"
                            boxShadow="0 0 0 1px rgba(0,0,0,0.12)"
                            flexShrink={0}
                          />
                          <Input
                            value={colorName}
                            onChange={(e) => renameColor(colorName, e.target.value)}
                            size="sm"
                            fontWeight="600"
                            borderRadius="8px"
                            maxW="150px"
                            border="1px solid"
                            borderColor="gray.200"
                            bg="white"
                            _focus={{ borderColor: "blue.400" }}
                          />
                        </HStack>
                        <HStack spacing={3}>
                          <HStack spacing={2}>
                            <Text
                              fontSize="xs"
                              fontWeight="600"
                              color={colorInStock(colorName) ? "green.500" : "red.400"}
                            >
                              {colorInStock(colorName) ? "In Stock" : "Out of Stock"}
                            </Text>
                            <Switch
                              isChecked={colorInStock(colorName)}
                              onChange={(e) => toggleColorStock(colorName, e.target.checked)}
                              colorScheme="green"
                              size="sm"
                            />
                          </HStack>
                          <IconButton
                            icon={<DeleteIcon />}
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            borderRadius="8px"
                            aria-label={`Remove ${colorName}`}
                            onClick={() => removeColor(colorName)}
                          />
                        </HStack>
                      </HStack>

                      {/* Color images */}
                      <Box p={4}>
                        <ImageGrid
                          images={edited.colors[colorName]}
                          onRemove={(i) => removeColorImage(colorName, i)}
                        />
                        <input
                          id={`color-file-${idx}`}
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            uploadImages(e.target.files, colorName);
                            e.target.value = "";
                          }}
                        />
                        <Button
                          leftIcon={<AddIcon />}
                          size="xs"
                          variant="ghost"
                          colorScheme="blue"
                          borderRadius="8px"
                          isLoading={isUploading}
                          loadingText="Uploading…"
                          onClick={() => document.getElementById(`color-file-${idx}`)?.click()}
                        >
                          Add Images for {colorName}
                        </Button>
                      </Box>
                    </Box>
                  ))}

                  <Button
                    leftIcon={<AddIcon />}
                    variant="outline"
                    colorScheme="purple"
                    size="sm"
                    borderRadius="10px"
                    borderStyle="dashed"
                    borderWidth="2px"
                    py={5}
                    onClick={addColor}
                    _hover={{ bg: "purple.50" }}
                  >
                    Add Color Variant
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" borderColor="gray.100" gap={3} py={4}>
          <Button
            variant="ghost"
            onClick={onClose}
            borderRadius="10px"
            color="gray.500"
            _hover={{ bg: "gray.100" }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving…"
            borderRadius="10px"
            flex={1}
            fontWeight="600"
          >
            Save Changes
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ProductGridAuth = () => {
  const { data: products, loading, error } = useFetchData(`${URL}/products`);
  const [productList, setProductList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useDisclosure();
  const [deletingId, setDeletingId] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    setProductList(products);
  }, [products]);

  const filtered = productList.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      p.article?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    openDrawer();
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    openDelete();
  };

  const handleSave = async (edited) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${URL}/products/${edited._id}`,
        edited,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductList((prev) =>
        prev.map((p) => (p._id === edited._id ? data.data : p))
      );
      closeDrawer();
      toast({
        title: "Product updated",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to save",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL}/products/${deletingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductList((prev) => prev.filter((p) => p._id !== deletingId));
      toast({ title: "Product deleted", status: "success", duration: 2500, isClosable: true });
      setDeletingId(null);
      closeDelete();
    } catch (err) {
      toast({
        title: "Failed to delete",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading && products.length === 0) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <VStack spacing={3}>
          <Spinner size="xl" color="blue.500" thickness="3px" />
          <Text color="gray.400" fontSize="sm">Loading products…</Text>
        </VStack>
      </Flex>
    );
  }

  if (error && products.length === 0) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <VStack spacing={3}>
          <Text color="red.500" fontWeight="600">Failed to load products</Text>
          <Button size="sm" onClick={() => window.location.reload()} colorScheme="blue" borderRadius="lg">
            Retry
          </Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb={7} flexWrap="wrap" gap={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color="gray.800" letterSpacing="-0.5px">
            Product Catalog
          </Text>
          <Text color="gray.400" fontSize="sm" mt={0.5}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {searchQuery ? " match your search" : " total"}
          </Text>
        </Box>
        <InputGroup maxW="300px" size="sm">
          <InputLeftElement color="gray.400" pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Search article, brand, category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="10px"
            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
          />
        </InputGroup>
      </Flex>

      {/* Loading more */}
      {loading && productList.length > 0 && (
        <Flex justify="center" mb={5}>
          <Spinner size="sm" color="blue.400" />
        </Flex>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </SimpleGrid>
      ) : (
        !loading && (
          <Flex justify="center" align="center" minH="40vh">
            <Text color="gray.400" fontSize="sm">
              {searchQuery ? "No products match your search." : "No products found."}
            </Text>
          </Flex>
        )
      )}

      {/* Edit Drawer */}
      <ProductEditDrawer
        product={editingProduct}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onSave={handleSave}
      />

      {/* Delete Confirm Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDelete}
      >
        <AlertDialogOverlay backdropFilter="blur(2px)">
          <AlertDialogContent borderRadius="16px" mx={4}>
            <AlertDialogHeader fontSize="md" fontWeight="700" pt={5}>
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody fontSize="sm" color="gray.500">
              This action cannot be undone. The product will be permanently removed.
            </AlertDialogBody>
            <AlertDialogFooter gap={2} pb={5}>
              <Button ref={cancelRef} onClick={closeDelete} size="sm" borderRadius="10px" variant="ghost">
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} size="sm" borderRadius="10px">
                Delete Product
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProductGridAuth;
