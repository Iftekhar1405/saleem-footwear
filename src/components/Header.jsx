import React, { useEffect, useState } from "react";
import {
  ArrowBackIcon,
  PhoneIcon,
  SearchIcon,
  HamburgerIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Text,
  Flex,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Badge,
  Image,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { URL } from "../context/url";
import logo from "./images/logo.png";

// Create motion components
const MotionBox = motion(Box);
const MotionHStack = motion(HStack);
const MotionText = motion(Text);
const MotionFlex = motion(Flex);
const MotionBadge = motion(Badge);
const MotionImage = motion(Image);

export const iconVariants = {
  hover: {
    scale: 1.15,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: {
    scale: 0.9,
    transition: { duration: 0.2 },
  },
  initial: {
    scale: 1,
  },
};

const logoVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.2,
    },
  },
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const Header = () => {
  const [cartLength, setCartLength] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasNewCartItem, setHasNewCartItem] = useState(false);
  const token = localStorage.getItem("token");

  // Gradient background colors
  const bgGradient = "linear(to-r, #000000, #1a1a1a, #000000)";
  const buttonHoverBg = "rgba(255, 255, 255, 0.1)";

  useEffect(() => {
    // Handle scroll behavior with improved threshold and behavior
    const controlHeader = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 120) {
        // Only hide header when scrolling down significantly
        setIsVisible(false);
      } else {
        // Show header on scroll up or near top
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlHeader);

    return () => {
      
      window.removeEventListener("scroll", controlHeader);
    };
  }, [token, lastScrollY]);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${URL}/cart`, { headers });
        const newCartLength = response.data.data.items.length || 0;

        // Check if cart length has increased
        if (newCartLength > cartLength && cartLength !== 0) {
          setHasNewCartItem(true);
          setTimeout(() => setHasNewCartItem(false), 3000);
        }

        setCartLength(newCartLength);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartLength(0);
      }
    };

    fetchCart();

    // Custom event listener for cart updates
    window.addEventListener("cart-updated", fetchCart);

    return () => {
      window.removeEventListener("cart-updated", fetchCart);
    };
  }, [cartLength]);
  const handleBack = () => {
    navigate(-1);
  };

  // Animation variants
  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const cartBadgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    pulse: {
      scale: [1, 1.3, 1],
      backgroundColor: ["#FF6B6B", "#FF0000", "#FF6B6B"],
      transition: {
        duration: 0.6,
        repeat: 3,
        repeatType: "loop",
      },
    },
  };

  return (
    <>
      <MotionBox
        variants={headerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        bgGradient={bgGradient}
        color="white"
        py={4}
        px={6}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        boxShadow="0px 2px 15px rgba(0, 0, 0, 0.5)"
        borderBottomWidth="1px"
        borderBottomColor="rgba(255, 255, 255, 0.1)"
      >
        <MotionHStack
          spacing={{ base: 2, md: 5 }}
          justify="space-between"
          align="center"
          maxW="1200px"
          mx="auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {/* Left Side Icons */}
          <HStack spacing={{ base: 1, md: 4 }}>
            <Tooltip hasArrow label="Back" bg="#FF6B6B">
              <IconButton
                as={motion.button}
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                aria-label="Back"
                icon={<ArrowBackIcon />}
                variant="ghost"
                colorScheme="whiteAlpha"
                fontSize="lg"
                onClick={handleBack}
                borderRadius="full"
                _hover={{ bg: buttonHoverBg }}
              />
            </Tooltip>

            <Tooltip hasArrow label="Search" bg="#FF6B6B">
              <Link to="/search">
                <IconButton
                  as={motion.button}
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="Search"
                  icon={<SearchIcon />}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  fontSize="lg"
                  borderRadius="full"
                  _hover={{ bg: buttonHoverBg }}
                />
              </Link>
            </Tooltip>
          </HStack>

          {/* Center Logo - Visible on all screen sizes */}
          <Link to="/">
            <MotionImage
              as={motion.img}
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              src={logo} // Replace with your actual logo path
              alt="Company Logo"
              height={{ base: "30px", md: "40px" }}
              fallbackSrc="https://via.placeholder.com/120x40?text=BRAND" // Fallback if logo doesn't load
              cursor="pointer"
              filter="drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5))"
            />
          </Link>

          {/* Main Navigation - Desktop */}
          <HStack
            spacing={5}
            display={{ base: "none", md: "flex" }}
            justify="center"
          >
            <Link to="/products">
              <Button
                as={motion.button}
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variant="ghost"
                colorScheme="whiteAlpha"
                fontSize="sm"
                fontWeight="medium"
                borderRadius="full"
                px={4}
                _hover={{ bg: buttonHoverBg }}
                isActive={location.pathname === "/products"}
                _active={{
                  bg: "rgba(255, 255, 255, 0.2)",
                  borderBottom: "2px solid",
                  borderColor: "#FF6B6B",
                }}
              >
                SHOP
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                as={motion.button}
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variant="ghost"
                colorScheme="whiteAlpha"
                fontSize="sm"
                fontWeight="medium"
                borderRadius="full"
                px={4}
                _hover={{ bg: buttonHoverBg }}
                isActive={location.pathname === "/categories"}
                _active={{
                  bg: "rgba(255, 255, 255, 0.2)",
                  borderBottom: "2px solid",
                  borderColor: "#FF6B6B",
                }}
              >
                CATEGORIES
              </Button>
            </Link>
            <Link to="/contact-us">
              <Button
                as={motion.button}
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                leftIcon={<PhoneIcon />}
                variant="ghost"
                colorScheme="whiteAlpha"
                fontSize="sm"
                fontWeight="medium"
                borderRadius="full"
                px={4}
                _hover={{ bg: buttonHoverBg }}
                isActive={location.pathname === "/contact-us"}
                _active={{
                  bg: "rgba(255, 255, 255, 0.2)",
                  borderBottom: "2px solid",
                  borderColor: "#FF6B6B",
                }}
              >
                CONTACT US
              </Button>
            </Link>
          </HStack>

          {/* Action Icons */}
          <HStack spacing={{ base: 1, md: 4 }}>
            <Tooltip hasArrow label="Cart" bg="#FF6B6B">
              <Link to="/cart">
                <IconButton
                  as={motion.button}
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="Cart"
                  icon={
                    <Box position="relative">
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        width="22"
                        height="22"
                        animate={{
                          rotate: hasNewCartItem ? [0, 15, -15, 0] : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: hasNewCartItem ? 1 : 0,
                        }}
                      >
                        <path
                          fill="#FF6B6B"
                          d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                        />
                      </motion.svg>
                      <AnimatePresence>
                        {cartLength > 0 && (
                          <MotionBadge
                            key="cart-badge"
                            variants={cartBadgeVariants}
                            initial="initial"
                            animate={hasNewCartItem ? "pulse" : "animate"}
                            exit="exit"
                            position="absolute"
                            top="-8px"
                            right="-10px"
                            bg="#FF0080"
                            color="white"
                            fontSize="xs"
                            fontWeight="bold"
                            borderRadius="full"
                            minW="20px"
                            height="20px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxShadow="0px 2px 5px rgba(0, 0, 0, 0.3)"
                          >
                            {cartLength}
                          </MotionBadge>
                        )}
                      </AnimatePresence>
                    </Box>
                  }
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  fontSize="sm"
                  borderRadius="full"
                  _hover={{ bg: buttonHoverBg }}
                />
              </Link>
            </Tooltip>

            {/* Mobile menu button */}
            <IconButton
              as={motion.button}
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              display={{ base: "flex", md: "none" }}
              onClick={onOpen}
              icon={<HamburgerIcon w={5} h={5} />}
              variant="ghost"
              colorScheme="whiteAlpha"
              aria-label="Open Menu"
              borderRadius="full"
              _hover={{ bg: buttonHoverBg }}
            />
          </HStack>
        </MotionHStack>
      </MotionBox>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="rgba(0, 0, 0, 0.95)">
          <DrawerCloseButton color="white" />
          <DrawerBody pt={12}>
            {/* Logo in Mobile Menu */}
            <Box textAlign="center" mb={8}>
              <Image
                src={logo} // Replace with your actual logo path
                alt="Company Logo"
                height="40px"
                mx="auto"
                fallbackSrc="https://via.placeholder.com/120x40?text=BRAND"
              />
            </Box>

            <VStack spacing={6} align="stretch">
              <Link to="/" onClick={onClose}>
                <Button
                  w="full"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  fontWeight="medium"
                  fontSize="lg"
                  justifyContent="flex-start"
                  py={6}
                  color="white"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
                >
                  HOME
                </Button>
              </Link>
              <Link to="/products" onClick={onClose}>
                <Button
                  w="full"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  fontWeight="medium"
                  fontSize="lg"
                  justifyContent="flex-start"
                  py={6}
                  color="white"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
                >
                  SHOP
                </Button>
              </Link>
              <Link to="/categories" onClick={onClose}>
                <Button
                  w="full"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  fontWeight="medium"
                  fontSize="lg"
                  justifyContent="flex-start"
                  py={6}
                  color="white"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
                >
                  CATEGORIES
                </Button>
              </Link>
              <Link to="/contact-us" onClick={onClose}>
                <Button
                  w="full"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  fontWeight="medium"
                  fontSize="lg"
                  justifyContent="flex-start"
                  py={6}
                  color="white"
                  leftIcon={<PhoneIcon />}
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
                >
                  CONTACT US
                </Button>
              </Link>
              <Link to="/cart" onClick={onClose}>
                <Button
                  w="full"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  fontWeight="medium"
                  fontSize="lg"
                  justifyContent="flex-start"
                  py={6}
                  color="white"
                  leftIcon={
                    <Box>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="#FF6B6B"
                          d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                        />
                      </svg>
                    </Box>
                  }
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
                >
                  CART ({cartLength})
                </Button>
              </Link>
              <Link to="/search" onClick={onClose}>
                <Button
                  w="full"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  fontWeight="medium"
                  fontSize="lg"
                  justifyContent="flex-start"
                  py={6}
                  color="white"
                  leftIcon={<SearchIcon />}
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
                >
                  SEARCH
                </Button>
              </Link>
            </VStack>

            {/* Footer in mobile menu */}
            <Box position="absolute" bottom="4" width="85%">
              <Text textAlign="center" color="gray.400" fontSize="sm" mt={12}>
                © 2025 iRAD. All rights reserved.
              </Text>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
