import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoleBasedComponent from '../RoleBasedComponents';
import logo from './images/logo.png';

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
      <Box p={4} bg="black" color="white">
        <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
          <Flex align="center">
            <Image src={logo} alt="Logo"  h={'60px'} />
            <Text  fontSize="xl" fontWeight="bold" color={'gray.200'} letterSpacing={3}>SALIM FOOTWEAR</Text>
          </Flex>

          {/* Hamburger Menu for smaller screens */}
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            onClick={toggleMenu}
            display={{ base: 'block', md: 'none' }}
            variant="outline"
            colorScheme="whiteAlpha"
          />
          
          {/* Desktop Menu */}
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            display={{ base: 'none', md: 'flex' }}
            gap={6}
          >
            <Link to="/orders">
              <Button variant="link" colorScheme="whiteAlpha">Orders</Button>
            </Link>
            <Link to="/catalog">
              <Button variant="link" colorScheme="whiteAlpha">Catalogue</Button>
            </Link>

            {/* Admin Link (Role-based) */}
            <RoleBasedComponent allowedRoles={['admin']}>
              <Link to="/register">
                <Button variant="link" colorScheme="whiteAlpha">Register Users</Button>
              </Link>
            </RoleBasedComponent>

            <Link to="/profile">
              <Button variant="link" colorScheme="whiteAlpha">Profile</Button>
            </Link>

            {/* Login/Logout Button */}
            {token ? (
              <Button variant="outline" colorScheme="red" onClick={logout}>Log-out</Button>
            ) : (
              <Button variant={buttonVariant} colorScheme="blue" onClick={() => navigate('/login')}>Log-in</Button>
            )}
          </Flex>
        </Flex>

        {/* Mobile Menu */}
        {isOpen && (
          <Box mt={4} display={{ base: 'block', md: 'none' }}>
            <Link to="/orders">
              <Button w="full" variant="ghost" colorScheme="white">Orders</Button>
            </Link>
            <Link to="/catalog">
              <Button w="full" variant="ghost" colorScheme="white">Catalogue</Button>
            </Link>

            <RoleBasedComponent allowedRoles={['admin']}>
              <Link to="/register">
                <Button w="full" variant="ghost" colorScheme="white">Register Users</Button>
              </Link>
            </RoleBasedComponent>

            <Link to="/profile">
              <Button w="full" variant="ghost" colorScheme="white">Profile</Button>
            </Link>

            {token ? (
              <Button w="full" variant="outline" colorScheme="red" onClick={logout}>Log-out</Button>
            ) : (
              <Button w="full" variant="outline" colorScheme="blue" onClick={() => navigate('/login')}>Log-in</Button>
            )}
          </Box>
        )}
      </Box>

      
    </>
  );
}

export default Nav;
