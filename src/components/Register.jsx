import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  ChakraProvider,
  extendTheme,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Icon,
  useToast,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import "./Layout.css";
import { FiUser, FiHome, FiPhone, FiLock, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi';
import { URL } from '../context/url';

// Create a custom ChakraProvider theme (matching the Login theme)
const theme = extendTheme({
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
        fontWeight: '500',
      },
      variants: {
        solid: {
          bg: 'red.400',
          color: 'white',
          _hover: {
            bg: 'red.500',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s ease-in-out',
        },
        outline: {
          borderColor: 'red.400',
          color: 'red.400',
          _hover: {
            bg: 'red.50',
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            borderRadius: 'md',
            _focus: {
              borderColor: 'red.400',
              bg: 'white',
            },
            _hover: {
              bg: 'gray.100',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
  },
});

// Wrap components with motion
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionHeading = motion(Heading);

function Register() {
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  // Chakra color mode values (matching Login component)
  const bgGradient = useColorModeValue(
    'linear(to-r, #89216B, #DA4453)',
    'linear(to-r, #701A5A, #B63245)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    setIsLoading(true);

    const body = {
      name,
      shopName,
      password,
      address,
      phone,
      role,
    };

    try {
      const response = await axios.post(`${URL}/auth/register`, body);
      console.log(response.data);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Redirecting to login...",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      
      // Add a small delay before navigation for better UX
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.msg || "Error registering user",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex
        minHeight="100vh"
        align="center"
        justify="center"
        bgGradient={bgGradient}
        p={4}
        overflow="hidden"
        position="relative"
      >
        {/* Animated background elements (matching login) */}
        <Box
          position="absolute"
          top="10%"
          left="5%"
          width="300px"
          height="300px"
          borderRadius="full"
          bg="rgba(255, 255, 255, 0.05)"
          filter="blur(30px)"
          as={motion.div}
          animate={{
            y: [0, 20, 0],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Box
          position="absolute"
          bottom="15%"
          right="10%"
          width="250px"
          height="250px"
          borderRadius="full"
          bg="rgba(255, 255, 255, 0.03)"
          filter="blur(40px)"
          as={motion.div}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <MotionBox
          maxWidth="500px"
          width="full"
          bg={cardBg}
          borderRadius="xl"
          boxShadow="0 10px 30px -5px rgba(0, 0, 0, 0.2)"
          overflow="hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box p={8}>
            <MotionHeading
              as="h2"
              size="lg"
              textAlign="center"
              mb={6}
              color="red.500"
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Create Account
            </MotionHeading>

            <form onSubmit={handleSubmit}>
              <VStack 
                spacing={4}
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <FormControl isRequired>
                  <FormLabel color="red.600" fontWeight="medium">Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="red.500">
                      <Icon as={FiUser} />
                    </InputLeftElement>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      pl={10}
                      focusBorderColor="red.400"
                      _focus={{ boxShadow: '0 0 0 1px red.400' }}
                      as={motion.input}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="red.600" fontWeight="medium">Shop Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="red.500">
                      <Icon as={FiShoppingBag} />
                    </InputLeftElement>
                    <Input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Enter your shop name"
                      pl={10}
                      focusBorderColor="red.400"
                      _focus={{ boxShadow: '0 0 0 1px red.400' }}
                      as={motion.input}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="red.600" fontWeight="medium">Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="red.500">
                      <Icon as={FiLock} />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      pl={10}
                      focusBorderColor="red.400"
                      _focus={{ boxShadow: '0 0 0 1px red.400' }}
                      as={motion.input}
                      whileFocus={{ scale: 1.01 }}
                    />
                    <InputRightElement width="3rem">
                      <Button 
                        h="1.5rem" 
                        size="sm" 
                        variant="ghost"
                        onClick={togglePassword}
                      >
                        <Icon as={showPassword ? FiEyeOff : FiEye} color="gray.500" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="red.600" fontWeight="medium">Confirm Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="red.500">
                      <Icon as={FiLock} />
                    </InputLeftElement>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      pl={10}
                      focusBorderColor="red.400"
                      _focus={{ boxShadow: '0 0 0 1px red.400' }}
                      as={motion.input}
                      whileFocus={{ scale: 1.01 }}
                    />
                    <InputRightElement width="3rem">
                      <Button 
                        h="1.5rem" 
                        size="sm" 
                        variant="ghost"
                        onClick={toggleConfirmPassword}
                      >
                        <Icon as={showConfirmPassword ? FiEyeOff : FiEye} color="gray.500" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="red.600" fontWeight="medium">Address</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="red.500">
                      <Icon as={FiHome} />
                    </InputLeftElement>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      pl={10}
                      focusBorderColor="red.400"
                      _focus={{ boxShadow: '0 0 0 1px red.400' }}
                      as={motion.input}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="red.600" fontWeight="medium">Phone</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="red.500">
                      <Icon as={FiPhone} />
                    </InputLeftElement>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      pl={10}
                      focusBorderColor="red.400"
                      _focus={{ boxShadow: '0 0 0 1px red.400' }}
                      as={motion.input}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="red"
                  width="full"
                  height="48px"
                  fontSize="md"
                  mt={2}
                  isLoading={isLoading}
                  loadingText="Registering"
                  as={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register
                </Button>

                <MotionFlex 
                  justify="center" 
                  align="center" 
                  width="full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Text fontSize="sm" color={subtleTextColor} mr={2}>
                    Already have an account?
                  </Text>
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    fontWeight="medium"
                    size="sm"
                    onClick={() => navigate('/login')}
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log In
                  </Button>
                </MotionFlex>
              </VStack>
            </form>
          </Box>
        </MotionBox>
      </Flex>
    </ChakraProvider>
  );
}

// Custom InputLeftElement component
const InputLeftElement = ({ children, ...props }) => (
  <Box 
    position="absolute" 
    left="0" 
    top="0" 
    height="100%" 
    width="40px" 
    display="flex" 
    alignItems="center" 
    justifyContent="center"
    {...props}
  >
    {children}
  </Box>
);

export default Register;