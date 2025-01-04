import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoleBasedComponent from '../RoleBasedComponents';
import logo from './images/logo.png';

// Create a motion variant of Box
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function Nav() {
  let token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    const confirm = window.confirm('Are you sure you want to log out?');
    if (confirm) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/');
    }
  };

  const buttonVariant = useBreakpointValue({
    base: 'solid',
    md: 'outline',
  });

  return (
    <>
      {/* Header Container with Fade-In */}
      <MotionBox
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
        p={4} 
        bg="black" 
        color="white"
      >
        <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
          {/* Logo and Title with Fade-In */}
          <MotionFlex
            align="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          >
            <Image src={logo} alt="Logo" h={'60px'} />
            <Text fontSize="xl" fontWeight="bold" color={'gray.200'} letterSpacing={3}>
              SALIM FOOTWEAR
            </Text>
          </MotionFlex>

          {/* Hamburger Menu Icon */}
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            onClick={toggleMenu}
            display={{ base: 'block', md: 'none' }}
            variant="outline"
            colorScheme="whiteAlpha"
          />
          
          {/* Desktop Navigation Links with Staggered Fade-In */}
          <MotionFlex
            as="nav"
            align="center"
            justify="space-between"
            display={{ base: 'none', md: 'flex' }}
            gap={6}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }, // Staggered animation
              },
            }}
          >
            {['/orders', '/catalog', '/profile'].map((path, index) => (
              <MotionBox
                key={index}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link to={path}>
                  <Button variant="link" colorScheme="whiteAlpha">
                    {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Button>
                </Link>
              </MotionBox>
            ))}

            <RoleBasedComponent allowedRoles={['admin']}>
              <MotionBox
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link to="/register">
                  <Button variant="link" colorScheme="whiteAlpha">Register Users</Button>
                </Link>
              </MotionBox>
            </RoleBasedComponent>

            {token ? (
              <MotionBox
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Button variant="outline" colorScheme="red" onClick={logout}>
                  Log-out
                </Button>
              </MotionBox>
            ) : (
              <MotionBox
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Button variant={buttonVariant} colorScheme="blue" onClick={() => navigate('/login')}>
                  Log-in
                </Button>
              </MotionBox>
            )}
          </MotionFlex>
        </Flex>

        {/* Mobile Menu with Fade-In Animation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isOpen ? 1 : 0,
            height: isOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <Box mt={4} display={{ base: 'block', md: 'none' }}>
            {['/orders', '/catalog', '/profile'].map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={path}>
                  <Button w="full" variant="ghost" colorScheme="white">
                    {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Button>
                </Link>
              </motion.div>
            ))}

            <RoleBasedComponent allowedRoles={['admin']}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/register">
                  <Button w="full" variant="ghost" colorScheme="white">Register Users</Button>
                </Link>
              </motion.div>
            </RoleBasedComponent>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              {token ? (
                <Button w="full" variant="outline" colorScheme="red" onClick={logout}>
                  Log-out
                </Button>
              ) : (
                <Button w="full" variant="outline" colorScheme="blue" onClick={() => navigate('/login')}>
                  Log-in
                </Button>
              )}
            </motion.div>
          </Box>
        </motion.div>
      </MotionBox>
    </>
  );
}

export default Nav;
