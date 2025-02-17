import { ArrowBackIcon, PhoneIcon, SearchIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, IconButton, Text } from "@chakra-ui/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const URL = "https://saleem-footwear-api.vercel.app/api/v1";
const token = localStorage.getItem("token");

// Create motion components
const MotionBox = motion(Box);
const MotionHStack = motion(HStack);
const MotionText = motion(Text);

const Header = () => {
  const [cartlength, setCartlength] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${URL}/cart`, { headers });
        setCartlength(response.data.data.items.length || 0);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartlength(0);
      }
    };
    fetchCart();
    window.addEventListener("cart-updated", fetchCart);

    // Handle scroll behavior
    const controlHeader = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        // Hide header on scroll down
        setIsVisible(false);
      } else {
        // Show header on scroll up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlHeader);

    return () => {
      window.removeEventListener("cart-updated", fetchCart);
      window.removeEventListener("scroll", controlHeader);
    };
  }, [token, cartlength, lastScrollY]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MotionBox
      initial={{ y: -100 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      bg="black"
      color="white"
      p={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      borderBottom={"1px solid gray"}
    >
      <MotionHStack
        spacing={4}
        justify="space-between"
        align="center"
        maxW="1200px"
        mx="auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <IconButton
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back"
          icon={<ArrowBackIcon />}
          variant="ghost"
          colorScheme="whiteAlpha"
          fontSize="xl"
          onClick={handleBack}
        />

        <Link to="/contact-us">
          <Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            leftIcon={<PhoneIcon />}
            variant="ghost"
            colorScheme="whiteAlpha"
            fontSize="sm"
          >
            CONTACT US
          </Button>
        </Link>

        <Link to="/search">
          <IconButton
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Search"
            icon={<SearchIcon />}
            variant="ghost"
            colorScheme="whiteAlpha"
            fontSize="xl"
          />
        </Link>

        <Link to="/cart">
          <Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            leftIcon={
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                width="20"
                height="20"
                whileHover={{ rotate: 10 }}
              >
                <path
                  fill="red"
                  d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                />
              </motion.svg>
            }
            variant="ghost"
            colorScheme="whiteAlpha"
            fontSize="sm"
            display="flex"
            alignItems="center"
          >
            <AnimatePresence mode="wait">
              <MotionText
                key={cartlength}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                ml={2}
                fontSize="lg"
                fontWeight="bold"
              >
                {cartlength}
              </MotionText>
            </AnimatePresence>
          </Button>
        </Link>
      </MotionHStack>
    </MotionBox>
  );
};

export default Header;