import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    Image,
    Spinner,
    Grid,
    GridItem,
    useColorModeValue,
    Button,
    HStack,
    Icon,
    IconButton,
    Tooltip,
    Checkbox,
    Slide,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { URL } from "../context/url";
import { FaChevronDown, FaCheck, FaWhatsapp, FaLanguage, FaTh, FaThLarge } from "react-icons/fa";
import logo from "../components/images/logo.png"; // Fallback image

// Helper to convert UPPERCASE to Title Case
const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

// Derive BOT_URL from the context URL (stripping /api/v1)
const BASE_URL = URL.replace("/api/v1", "");
const BOT_URL = `${BASE_URL}/bot`;

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

// Translations
const translations = {
    en: {
        explore: "Explore",
        selectCategory: "Select Category",
        showingResults: "Showing results for",
        noItems: "No items found for this category.",
        noMoreItems: "No more items to load.",
        clickToChat: "Click to enquire on WhatsApp",
        sendEnquiry: "Send Enquiry",
        selected: "Selected",
        bulkMessageIntro: "Hello, I am interested in these products:",
        itemLabel: "Item",
        articleLabel: "Article",
        imageLabel: "Image",
    },
    hi: {
        explore: "खोजें", // Explore
        selectCategory: "श्रेणी चुनें", // Select Category
        showingResults: "परिणाम दिखाए जा रहे हैं", // Showing results for
        noItems: "इस श्रेणी के लिए कोई आइटम नहीं मिला।", // No items found
        noMoreItems: "लोड करने के लिए और आइटम नहीं हैं।", // No more items
        clickToChat: "व्हाट्सएप पर पूछताछ करने के लिए क्लिक करें", // Click to enquire
        sendEnquiry: "पूछताछ भेजें", // Send Enquiry
        selected: "चयनित", // Selected
        bulkMessageIntro: "नमस्ते, मैं इन उत्पादों में रुचि रखता हूँ:", // Hello, I am interested
        itemLabel: "आइटम", // Item
        articleLabel: "आर्टिकल", // Article
        imageLabel: "छवि", // Image
    },
};

const Explore = () => {
    // --- States ---
    // Language
    const [lang, setLang] = useState("hi"); // 'en' or 'hi'
    const [isSingleColumn, setIsSingleColumn] = useState(false); // Mobile grid toggle


    // Categories (Dropdown)
    const [categories, setCategories] = useState([]);
    const [catPage, setCatPage] = useState(1);
    const [catHasMore, setCatHasMore] = useState(true);
    const [catLoading, setCatLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Selected Category & Product Items
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [itemsPage, setItemsPage] = useState(1);
    const [itemsHasMore, setItemsHasMore] = useState(true);
    const [itemsLoading, setItemsLoading] = useState(false);

    // Multi-select
    const [selectedItems, setSelectedItems] = useState([]);

    // Refs
    const dropdownListRef = useRef(null);

    const [searchParams] = useSearchParams();

    // Theme Colors
    const bgGradient = useColorModeValue(
        "linear-gradient(to bottom, white, #f7f7f9)",
        "linear-gradient(to bottom, gray.900, gray.800)"
    );
    const cardBg = useColorModeValue("white", "gray.800");
    const accentColor = "red.500";
    const hoverBg = useColorModeValue("gray.50", "gray.700");

    const t = translations[lang];

    // --- Effects ---

    // Reset selection when category changes
    useEffect(() => {
        setSelectedItems([]);
    }, [selectedCategory]);

    // 1. Initial Load: Fetch categories & Check Session/Params
    useEffect(() => {
        fetchCategories(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Fetch items when category changes
    useEffect(() => {
        if (selectedCategory) {
            // Save to session storage
            sessionStorage.setItem("selectedCategory", JSON.stringify(selectedCategory));

            setItems([]);
            setItemsPage(1);
            setItemsHasMore(true);
            fetchItems(selectedCategory.name, 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    // --- Functions ---

    const toggleItemSelection = (e, item) => {
        e.stopPropagation(); // Prevent card click
        const isSelected = selectedItems.find(i => i._id === item._id);
        if (isSelected) {
            setSelectedItems(prev => prev.filter(i => i._id !== item._id));
        } else {
            setSelectedItems(prev => [...prev, item]);
        }
    };

    const toggleLanguage = () => {
        setLang((prev) => (prev === "en" ? "hi" : "en"));
    };

    const fetchCategories = async (page) => {
        if (catLoading) return;
        setCatLoading(true);
        try {
            const { data } = await axios.get(`${BOT_URL}/categories`, {
                params: { page, limit: 10 },
            });

            const newCats = data.categories;
            if (page === 1) {
                setCategories(newCats);

                // Check URL Params first
                const paramCategory = searchParams.get("category");

                if (paramCategory) {
                    setSelectedCategory({ name: paramCategory });
                } else {
                    // Then Check session storage
                    const savedCategory = sessionStorage.getItem("selectedCategory");
                    if (savedCategory) {
                        setSelectedCategory(JSON.parse(savedCategory));
                    } else if (newCats.length > 0 && !selectedCategory) {
                        // Default select first category
                        setSelectedCategory(newCats[0]);
                    }
                }
            } else {
                setCategories((prev) => [...prev, ...newCats]);
            }

            const totalPages = data.meta.totalPages;
            setCatHasMore(page < totalPages);

        } catch (err) {
            console.error("Failed to fetch categories", err);
        } finally {
            setCatLoading(false);
        }
    };

    const fetchItems = async (catName, page) => {
        if (page > 1 && !itemsHasMore) return;

        setItemsLoading(true);
        try {
            const { data } = await axios.get(`${BOT_URL}/categories/${encodeURIComponent(catName)}`, {
                params: { page, limit: 10 },
            });

            const newItems = data.items;
            setItems((prev) => (page === 1 ? newItems : [...prev, ...newItems]));

            const totalPages = data.meta.totalPages;
            setItemsHasMore(page < totalPages);

        } catch (err) {
            console.error("Failed to fetch items", err);
        } finally {
            setItemsLoading(false);
        }
    };

    const handleWhatsAppRedirect = (item) => {
        const phoneNumber = "918962317774";
        let message = "";

        if (lang === "hi") {
            message = `नमस्ते, मैं इस प्रोडक्ट के बारे में जानकारी चाहता हूँ। आर्टिकल: ${item.article} Image: ${item.imageUrl}`;

        } else {
            message = `Hello, I am interested in this product:\nArticle: ${item.article}\nImage: ${item.imageUrl}`;
        }

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const handleBulkWhatsAppRedirect = () => {
        const phoneNumber = "918962317774";
        let message = `${t.bulkMessageIntro}\n\n`;

        selectedItems.forEach((item, index) => {
            if (lang === "hi") {
                message += `${index + 1}. ${t.articleLabel}: ${item.article}\n${t.imageLabel}: ${item.imageUrl}\n\n`;
            } else {
                message += `${index + 1}. ${t.articleLabel}: ${item.article}\n${t.imageLabel}: ${item.imageUrl}\n\n`;
            }
        });

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };


    // --- Scroll Handlers ---

    const handleDropdownScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50 && catHasMore && !catLoading) {
            const nextPage = catPage + 1;
            setCatPage(nextPage);
            fetchCategories(nextPage);
        }
    };

    const loadMoreItems = () => {
        if (itemsHasMore && !itemsLoading && selectedCategory) {
            const nextPage = itemsPage + 1;
            setItemsPage(nextPage);
            fetchItems(selectedCategory.name, nextPage);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScrollPosition = window.scrollY;

            if (
                currentScrollPosition >= scrollableHeight * 0.9 &&
                itemsHasMore &&
                !itemsLoading
            ) {
                loadMoreItems();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsHasMore, itemsLoading, itemsPage, selectedCategory]);


    return (
        <Box bgGradient={bgGradient} minHeight="100vh" pt="">
            <Container maxW="8xl" py={{ base: 6, md: 10 }}>

                {/* Header Section */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "start", md: "center" }}
                    mb={{ base: 6, md: 8 }}
                    gap={4}
                >
                    <HStack style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }} spacing={4}>
                        <div>
                            <Heading
                                as="h1"
                                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                                fontWeight="800"
                                color={accentColor}
                                letterSpacing="tight"
                                textTransform="uppercase"
                            >
                                {t.explore}
                            </Heading>

                            {/* Language Toggle */}
                            <Tooltip label={lang === 'en' ? "हिंदी में देखें" : "View in English"}>
                                <IconButton
                                    icon={<FaLanguage size="22px" />}
                                    aria-label="Toggle Language"
                                    onClick={toggleLanguage}
                                    variant="ghost"
                                    colorScheme="red"
                                />
                            </Tooltip>
                        </div>

                        {/* Mobile Grid Toggle (Tabular) */}
                        <div>
                            <HStack
                                display={{ base: "flex", md: "none" }}
                                spacing={0}
                                bg="gray.100"
                                p="2px"
                                borderRadius="md"
                                border="1px solid"
                                borderColor="gray.200"
                            >
                                <IconButton
                                    icon={<FaThLarge />}
                                    aria-label="Single Column"
                                    size="sm"
                                    variant={isSingleColumn ? "solid" : "ghost"}
                                    colorScheme={isSingleColumn ? "red" : "gray"}
                                    bg={isSingleColumn ? "white" : "transparent"}
                                    shadow={isSingleColumn ? "sm" : "none"}
                                    onClick={() => setIsSingleColumn(true)}
                                    borderRadius="md"
                                />
                                <IconButton
                                    icon={<FaTh />}
                                    aria-label="Double Column"
                                    size="sm"
                                    variant={!isSingleColumn ? "solid" : "ghost"}
                                    colorScheme={!isSingleColumn ? "red" : "gray"}
                                    bg={!isSingleColumn ? "white" : "transparent"}
                                    shadow={!isSingleColumn ? "sm" : "none"}
                                    onClick={() => setIsSingleColumn(false)}
                                    borderRadius="md"
                                />
                            </HStack>
                        </div>

                    </HStack>

                    {/* Dropdown */}
                    <Box position="relative" width={{ base: "100%", md: "300px" }} zIndex={100}>
                        <Button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            width="100%"
                            justifyContent="space-between"
                            rightIcon={<Icon as={FaChevronDown} transform={dropdownOpen ? "rotate(180deg)" : ""} transition="0.3s" />}
                            bg={cardBg}
                            boxShadow="sm"
                            border="1px solid"
                            borderColor="gray.200"
                            _hover={{ boxShadow: "md" }}
                            py={6}
                        >
                            <Text isTruncated>
                                {selectedCategory ? toTitleCase(selectedCategory.name) : t.selectCategory}
                            </Text>
                        </Button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <MotionBox
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    position="absolute"
                                    top="110%"
                                    left="0"
                                    right="0"
                                    bg={cardBg}
                                    borderRadius="md"
                                    boxShadow="xl"
                                    border="1px solid"
                                    borderColor="gray.100"
                                    maxH="300px"
                                    overflowY="auto"
                                    onScroll={handleDropdownScroll}
                                    ref={dropdownListRef}
                                >
                                    {categories.map((cat, idx) => (
                                        <HStack
                                            key={`${cat.name}-${idx}`}
                                            p={3}
                                            cursor="pointer"
                                            _hover={{ bg: hoverBg }}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setDropdownOpen(false);
                                            }}
                                            justify="space-between"
                                        >
                                            <Text fontWeight={selectedCategory?.name === cat.name ? "bold" : "normal"}>
                                                {toTitleCase(cat.name)}
                                            </Text>
                                            {selectedCategory?.name === cat.name && <Icon as={FaCheck} color="green.500" />}
                                        </HStack>
                                    ))}
                                    {catLoading && (
                                        <Flex justify="center" p={2}>
                                            <Spinner size="sm" color={accentColor} />
                                        </Flex>
                                    )}
                                </MotionBox>
                            )}
                        </AnimatePresence>
                    </Box>
                </Flex>

                {/* Selected Category Status */}
                {selectedCategory && (
                    <Box mb={6}>
                        <Text fontSize="lg" color="gray.500" fontWeight="medium">
                            {t.showingResults} <Text as="span" color={accentColor} fontWeight="bold">{toTitleCase(selectedCategory.name)}</Text>
                        </Text>
                    </Box>
                )}

                {/* Items Grid */}
                <MotionGrid
                    templateColumns={{
                        base: isSingleColumn ? "repeat(1, 1fr)" : "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                        xl: "repeat(5, 1fr)",
                    }}
                    gap={{ base: 4, md: 6 }}
                    p={{ base: 2, md: 4 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    pb="100px" // Space for sticky footer
                >
                    {items.map((item, index) => {
                        const isSelected = selectedItems.some(i => i._id === item._id);
                        return (
                            <GridItem
                                key={`${item._id}-${index}`}
                                as={motion.div}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                borderRadius="xl"
                                overflow="hidden"
                                bg={cardBg}
                                boxShadow={isSelected ? "outline" : "md"}
                                border={isSelected ? "2px solid" : "none"}
                                borderColor={isSelected ? accentColor : "transparent"}
                                _hover={{ y: -5, boxShadow: "xl" }}
                                position="relative"
                                cursor="pointer"
                                onClick={() => handleWhatsAppRedirect(item)}
                                title={t.clickToChat}
                            >
                                <Box
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    zIndex={10}
                                    onClick={(e) => toggleItemSelection(e, item)}
                                    cursor="default"
                                >
                                    <Checkbox
                                        size="lg"
                                        colorScheme="red"
                                        isChecked={isSelected}
                                        bg="white"
                                        borderRadius="sm"
                                        pointerEvents="none" // Pass clicks to parent Box
                                        isReadOnly
                                    />
                                </Box>

                                <Box height="4px" width="100%" bg={accentColor} />
                                <Box p={4} display="flex" flexDirection="column" alignItems="center">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.article}
                                        objectFit="contain"
                                        boxSize="200px"
                                        fallbackSrc={logo} // Use Fallback
                                        mb={4}
                                        transition="transform 0.3s"
                                        _hover={{ transform: "scale(1.05)" }}
                                        onError={(e) => {
                                            e.target.src = logo; // Double fallback on error
                                        }}
                                    />
                                    <Heading size="md" color="gray.700">{item.article}</Heading>
                                    <HStack mt={2} color="green.500">
                                        <Icon as={FaWhatsapp} />
                                        <Text fontSize="xs" fontWeight="bold">{t.clickToChat}</Text>
                                    </HStack>
                                </Box>
                            </GridItem>
                        )
                    })}

                    {/* Loading Skeletons */}
                    {itemsLoading && Array.from({ length: 5 }).map((_, i) => (
                        <GridItem
                            key={`skeleton-${i}`}
                            borderRadius="xl"
                            overflow="hidden"
                            bg={cardBg}
                            boxShadow="sm"
                            p={4}
                        >
                            <Box bg="gray.200" height="200px" borderRadius="md" mb={4} />
                            <Box bg="gray.200" height="20px" width="60%" borderRadius="md" mb={2} />
                            <Box bg="gray.200" height="15px" width="40%" borderRadius="md" />
                        </GridItem>
                    ))}
                </MotionGrid>

                {!itemsHasMore && items.length > 0 && (
                    <Flex justify="center" mt={8}>
                        <Text color="gray.500">{t.noMoreItems}</Text>
                    </Flex>
                )}

                {!itemsLoading && items.length === 0 && selectedCategory && (
                    <Flex justify="center" mt={10} direction="column" align="center">
                        <Text fontSize="xl" color="gray.500">{t.noItems}</Text>
                    </Flex>
                )}

            </Container>

            {/* Sticky Bottom Bar for Bulk Send */}
            <Slide direction="bottom" in={selectedItems.length > 0} style={{ zIndex: 200 }}>
                <Box
                    p={4}
                    bg={cardBg}
                    boxShadow="0 -4px 6px rgba(0, 0, 0, 0.1)"
                    borderTop="1px solid"
                    borderColor="gray.200"
                >
                    <Flex justify="space-between" align="center" maxW="8xl" mx="auto" px={4}>
                        <Text fontWeight="bold" fontSize="lg">
                            {selectedItems.length} {t.selected}
                        </Text>

                        <Button
                            rightIcon={<FaWhatsapp />}
                            colorScheme="green"
                            size="lg"
                            onClick={handleBulkWhatsAppRedirect}
                        >
                            {t.sendEnquiry} ({selectedItems.length})
                        </Button>
                    </Flex>
                </Box>
            </Slide>
        </Box>

    );
};

export default Explore;
