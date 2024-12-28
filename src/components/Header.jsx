import { ArrowBackIcon, PhoneIcon, SearchIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, IconButton, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";
const token = localStorage.getItem('token');

// Create motion components
const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

const Header = () => {
  const [cartlength, setCartlength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`${URL}/cart`, { headers });
        setCartlength((response.data.data.items).length || 0);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setCartlength(0);
      }
    };
    fetchCart();
    window.addEventListener('cart-updated', fetchCart);

    return () => window.removeEventListener('cart-updated', fetchCart);
  }, [token, cartlength]);

  const handleBack = () => {
    navigate(-1);
  };

  // Animation variants
  const headerVariants = {
    hidden: {
      y: -100,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const cartCountVariants = {
    update: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      bg="black"
      color="white"
      p={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      borderBottom={'1px solid gray'}
    >
      <MotionHStack
        spacing={4}
        justify="space-between"
        align="center"
        maxW="1200px"
        mx="auto"
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <IconButton
            aria-label="Back"
            icon={<ArrowBackIcon />}
            variant="ghost"
            colorScheme="whiteAlpha"
            fontSize="xl"
            onClick={handleBack}
          />
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link to='/contact-us'>
            <Button
              leftIcon={<PhoneIcon />}
              variant="ghost"
              colorScheme="whiteAlpha"
              fontSize="sm"
            >
              CONTACT US
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link to='/search'>
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              variant="ghost"
              colorScheme="whiteAlpha"
              fontSize="xl"
            />
          </Link>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link to='/cart'>
            <Button
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20" height="20">
                  <path fill="red" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                </svg>
              }
              variant="ghost"
              colorScheme="whiteAlpha"
              fontSize="sm"
              display="flex"
              alignItems="center"
            >
              <motion.div
                variants={cartCountVariants}
                animate="update"
                key={cartlength} // This ensures animation triggers on cartlength change
              >
                <Text ml={2} fontSize="lg" fontWeight="bold">{cartlength}</Text>
              </motion.div>
            </Button>
          </Link>
        </motion.div>
      </MotionHStack>
    </MotionBox>
  );
};

export default Header;