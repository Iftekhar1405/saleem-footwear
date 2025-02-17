import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoleBasedComponent from "../RoleBasedComponents";
import logo from "./images/logo.png";

// Create a motion box component
const MotionBox = motion(Box);

function Nav() {
  let token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    const confirm = window.confirm("Are you sure you want to log out?");
    if (confirm) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  const buttonVariant = useBreakpointValue({
    base: "solid",
    md: "outline",
  });

  // Animation variants
  const navbarVariants = {
    hidden: {
      y: -100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        position="sticky"
        top="0"
        zIndex="sticky"
      >
        <Box p={4} bg="black" color="white">
          <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
            <Flex align="center">
              <Image src={logo} alt="Logo" h={"60px"} />
              <Text
                fontSize="LG"
                fontFamily={"Al-Navrada"}
                fontWeight="bold"
                color={"gray.200"}
                letterSpacing={3}
              >
                SALIM FOOTWEAR
              </Text>
            </Flex>

            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={toggleMenu}
              display={{ base: "block", md: "none" }}
              variant="outline"
              colorScheme="whiteAlpha"
            />

            <Flex
              as="nav"
              align="center"
              justify="space-between"
              display={{ base: "none", md: "flex" }}
              gap={6}
            >
              <Link to="/orders">
                <Button variant="link" colorScheme="whiteAlpha">
                  Orders
                </Button>
              </Link>
              <Link to="/catalog">
                <Button variant="link" colorScheme="whiteAlpha">
                  Catalogue
                </Button>
              </Link>

              <RoleBasedComponent allowedRoles={["admin"]}>
                <Link to="/register">
                  <Button variant="link" colorScheme="whiteAlpha">
                    Register Users
                  </Button>
                </Link>
              </RoleBasedComponent>

              <Link to="/profile">
                <Button variant="link" colorScheme="whiteAlpha">
                  Profile
                </Button>
              </Link>

              {token ? (
                <Button variant="outline" colorScheme="red" onClick={logout}>
                  Log-out
                </Button>
              ) : (
                <Button
                  variant={buttonVariant}
                  colorScheme="blue"
                  onClick={() => navigate("/login")}
                >
                  Log-in
                </Button>
              )}
            </Flex>
          </Flex>

          <MotionBox
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            variants={mobileMenuVariants}
            display={{ base: "block", md: "none" }}
            overflow="hidden"
          >
            <Box mt={4}>
              <Link to="/orders">
                <Button w="full" variant="ghost" colorScheme="white">
                  Orders
                </Button>
              </Link>
              <Link to="/catalog">
                <Button w="full" variant="ghost" colorScheme="white">
                  Catalogue
                </Button>
              </Link>

              <RoleBasedComponent allowedRoles={["admin"]}>
                <Link to="/register">
                  <Button w="full" variant="ghost" colorScheme="white">
                    Register Users
                  </Button>
                </Link>
              </RoleBasedComponent>

              <Link to="/profile">
                <Button w="full" variant="ghost" colorScheme="white">
                  Profile
                </Button>
              </Link>

              {token ? (
                <Button
                  w="full"
                  variant="outline"
                  colorScheme="red"
                  onClick={logout}
                >
                  Log-out
                </Button>
              ) : (
                <Button
                  w="full"
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => navigate("/login")}
                >
                  Log-in
                </Button>
              )}
            </Box>
          </MotionBox>
        </Box>
      </MotionBox>
    </>
  );
}

export default Nav;
