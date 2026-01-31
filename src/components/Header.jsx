import React, { useEffect, useState } from "react";
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
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { URL } from "../context/url";
import logo from "./images/logo.png";
import axios from "axios";

// Motion components
const MotionBox = motion(Box);
const MotionHStack = motion(HStack);
const MotionText = motion(Text);
const MotionImage = motion(Image);
const MotionBadge = motion(Badge);

// Icon variants for hover and tap animations
export const iconVariants = {
  hover: {
    scale: 1.15,
    filter: "drop-shadow(0 0 8px rgba(0, 245, 255, 0.7))",
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

// Logo animation variants
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
    filter: "drop-shadow(0 0 8px rgba(255, 107, 107, 0.7))",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

// Text animation variants for staggered appearance
const textVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  hover: {
    color: "#FF6B6B",
    textShadow: "0 0 8px rgba(255, 107, 107, 0.5)",
    transition: { duration: 0.2 },
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

  // Modern background with gradient
  const bgGradient =
    "linear(to-r, rgba(0, 0, 0, 0.9), rgba(10, 10, 12, 0.8), rgba(0, 0, 0, 0.9))";
  const glassEffect = {
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };
  const buttonHoverBg = "rgba(255, 107, 107, 0.1)";
  const hideCart = ["/"];
  const shouldHideCart = hideCart.includes(location.pathname);

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

  // Animation variants for header appearance/disappearance
  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.05,
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

  // Cart badge animation
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
      boxShadow: [
        "0 0 0px rgba(255, 107, 107, 0)",
        "0 0 10px rgba(255, 0, 0, 0.7)",
        "0 0 0px rgba(255, 107, 107, 0)",
      ],
      transition: {
        duration: 0.6,
        repeat: 3,
        repeatType: "loop",
      },
    },
  };

  // Navigation item animation for staggered appearance
  const navigationItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.07,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      <MotionBox
        variants={headerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        bgGradient={bgGradient}
        color="white"
        py={"15px"}
        px={6}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        boxShadow="0px 2px 15px rgba(0, 0, 0, 0.5)"
        borderBottom="1px solid rgba(255, 107, 107, 0.1)"
        style={glassEffect}
      >
        <MotionHStack
          spacing={{ base: 2, md: 5 }}
          justify={{ base: "space-between", md: "space-between" }}
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
                whilehover="hover"
                whileTap="tap"
                aria-label="Back"
                icon={
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </motion.svg>
                }
                variant="ghost"
                colorScheme="whiteAlpha"
                fontSize="lg"
                onClick={handleBack}
                borderRadius="full"
                _hover={{ bg: buttonHoverBg }}
              />
            </Tooltip>
          </HStack>

          {/* Center Logo - Visible on all screen sizes */}
          <Link to="/">
            <MotionImage
              display={{ base: "block", md: "block" }}
              as={motion.img}
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whilehover="hover"
              src={logo}
              alt="Company Logo"
              height={{ base: "30px", md: "40px" }}
              fallbackSrc="https://via.placeholder.com/120x40?text=BRAND"
              cursor="pointer"
              filter="drop-shadow(0px 2px 4px rgba(255, 107, 107, 0.3))"
            />
          </Link>

          {/* Main Navigation - Desktop */}
          <HStack
            spacing={5}
            display={{ base: "none", md: "flex" }}
            justify={{ base: "center", md: "flex-end" }}
            width={"100%"}
          >
            {["SHOP", "CATEGORIES", "CONTACT US"].map((item, i) => (
              <Link to={`/${item.toLowerCase().replace(" ", "-")}`} key={item}>
                <MotionText
                  custom={i}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  whilehover="hover"
                  fontSize="sm"
                  fontWeight="medium"
                  letterSpacing="0.1em"
                  cursor="pointer"
                  position="relative"
                  px={2}
                  _after={{
                    content: '""',
                    position: "absolute",
                    width:
                      location.pathname ===
                      `/${item.toLowerCase().replace(" ", "-")}`
                        ? "100%"
                        : "0%",
                    height: "1px",
                    bottom: "-5px",
                    left: "0",
                    bg: "#FF6B6B",
                    transition: "width 0.3s ease",
                  }}
                  _hover={{
                    _after: {
                      width: "100%",
                    },
                  }}
                >
                  {item}
                </MotionText>
              </Link>
            ))}

          </HStack>

          {/* Action Icons */}
          <HStack spacing={{ base: 1, md: 4 }}>
            {(!shouldHideCart || cartLength > 0) &&  (
              <Tooltip hasArrow label="Cart" bg="#FF6B6B">
                <Link to="/cart">
                  <IconButton
                    as={motion.button}
                    variants={iconVariants}
                    initial="initial"
                    whilehover="hover"
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
                              boxShadow="0px 2px 5px rgba(255, 0, 128, 0.3)"
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
            )}

            {/* Mobile menu button */}
            <IconButton
              as={motion.button}
              variants={iconVariants}
              initial="initial"
              whilehover="hover"
              whileTap="tap"
              display={{ base: "flex", md: "none" }}
              onClick={onOpen}
              icon={
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </motion.svg>
              }
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
        <DrawerOverlay backdropFilter="blur(5px)" bg="rgba(0, 0, 0, 0.7)" />
        <DrawerContent bg="rgba(10, 10, 12, 0.95)" style={glassEffect}>
          <DrawerCloseButton
            color="white"
            borderRadius="full"
            size="lg"
            _hover={{ bg: "rgba(255, 107, 107, 0.1)" }}
          />
          <DrawerBody pt={12}>
            {/* Logo in Mobile Menu */}
            <Box textAlign="center" mb={8}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <Image
                  src={logo}
                  alt="Company Logo"
                  height="40px"
                  mx="auto"
                  fallbackSrc="https://via.placeholder.com/120x40?text=BRAND"
                  filter="drop-shadow(0px 2px 8px rgba(255, 107, 107, 0.4))"
                />
              </motion.div>
            </Box>

            <VStack spacing={4} align="stretch">
              {[
                { to: "/", label: "HOME" },
                { to: "/products", label: "SHOP" },
                { to: "/categories", label: "CATEGORIES" },
                { to: "/contact-us", label: "CONTACT US" },
                { to: "/terms-and-conditions", label: "TERMS & CONDITIONS" },
                { to: "/privacy-policy", label: "PRIVACY POLICY" },
                { to: "/cart", label: "CART", count: cartLength },
              ].map((item, i) => (
                <Link key={item.to} to={item.to} onClick={onClose}>
                  <MotionBox
                    custom={i}
                    variants={navigationItemVariants}
                    initial="hidden"
                    animate="visible"
                    whilehover={{ x: 5, transition: { duration: 0.2 } }}
                  >
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
                        item.label === "CART" ? (
                          <Box position="relative">
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
                        ) : item.label === "CONTACT US" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FF6B6B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        ) : null
                      }
                      position="relative"
                      _hover={{ bg: "rgba(255, 107, 107, 0.1)" }}
                      _after={{
                        content: '""',
                        position: "absolute",
                        width: location.pathname === item.to ? "3px" : "0px",
                        height: "60%",
                        left: "0",
                        bg: "#FF6B6B",
                        transition: "width 0.3s ease",
                      }}
                    >
                      {item.label} {item.count ? `(${item.count})` : ""}
                    </Button>
                  </MotionBox>
                </Link>
              ))}
              <Link to="/search" onClick={onClose}>
                <MotionBox
                  custom={5}
                  variants={navigationItemVariants}
                  initial="hidden"
                  animate="visible"
                  whilehover={{ x: 5, transition: { duration: 0.2 } }}
                >
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF6B6B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    }
                    _hover={{ bg: "rgba(255, 107, 107, 0.1)" }}
                  >
                    SEARCH
                  </Button>
                </MotionBox>
              </Link>
            </VStack>

            {/* Footer in mobile menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Box position="absolute" bottom="4" width="85%">
                <Text
                  textAlign="center"
                  color="gray.400"
                  fontSize="sm"
                  mt={12}
                  fontFamily="monospace"
                  letterSpacing="0.1em"
                >
                  © 2025 iRAD. All rights reserved.
                </Text>
              </Box>
            </motion.div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
