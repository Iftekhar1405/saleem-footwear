import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useOutsideClick,
  Tooltip,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RoleBasedComponent from "../RoleBasedComponents";
import { iconVariants } from "./Header";
import { SearchIcon, XIcon } from "lucide-react";

// Motion components
const MotionFlex = motion(Flex);
const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionInput = motion(Input);

const textVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2 * i,
    },
  }),
};

const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const MotionText2 = ({ text }) => {
  return (
    <motion.div variants={textVariants} initial="hidden" animate="visible">
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

function Nav() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef();
  const searchRef = useRef();

  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsOpen(false),
  });

  useOutsideClick({
    ref: searchRef,
    handler: () => {
      if (showSearch) {
        setShowSearch(false);
      }
    },
  });

  // Sleek, minimal background
  const bgColor = "rgba(10, 10, 12, 0.7)";
  const glassEffect = {
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  const buttonHoverBg = "rgba(255, 255, 255, 0.05)";

  const logout = () => {
    const confirm = window.confirm("Are you sure you want to log out?");
    if (confirm) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  // Enhanced animation variants
  const navbarVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const textVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      color: "#00f5ff",
      textShadow: "0 0 8px rgba(0, 245, 255, 0.5)",
      transition: { duration: 0.2 },
    },
  };

  const searchVariants = {
    closed: {
      width: "0%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      width: "100%",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const menuItemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
    exit: { opacity: 0, x: -10 },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const navItems = [
    { path: "/orders", label: "ORDERS", roles: ["all"] },
    { path: "/catalog", label: "CATALOGUE", roles: ["all"] },
    { path: "/register", label: "REGISTER", roles: ["admin"] },
    { path: "/profile", label: "PROFILE", roles: ["all"] },
  ];

  return (
    <MotionBox
  initial="hidden"
  animate="visible"
  variants={navbarVariants}
  position="sticky"
  top="0"
  zIndex="1000"
>
  <Box
    py={3}
    px={{ base: 4, md: 6 }}
    bg={bgColor}
    color="white"
    style={glassEffect}
    borderBottom="1px solid rgba(255, 255, 255, 0.05)"
  >
    <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
      {/* Brand Logo - Only show when search isn't active on mobile */}
      <Box display={{ base: showSearch ? "none" : "block", md: "block" }}>
        <Link to="/">
          <Box position={"relative"}>
            <MotionText
              variants={textVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover="hover"
              transition={{ duration: 1.0, ease: "easeOut" }}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="light"
              letterSpacing=".5em"
              cursor="pointer"
              textTransform="uppercase"
              fontFamily="monospace"
            >
              <MotionText2 text="SALIM" />
            </MotionText>

            <MotionText
              variants={textVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              fontSize={{ base: "10", md: "sm" }}
              textAlign={"center"}
              fontWeight="light"
              letterSpacing=".6em"
              cursor="pointer"
              textTransform="uppercase"
              fontFamily="monospace"
              position={"absolute"}
              top={"5"}
            >
              <MotionText2 text="FOOTWEAR" />
            </MotionText>
          </Box>
        </Link>
      </Box>

      {/* Mobile View: Search container */}
      <AnimatePresence>
        {showSearch && (
          <MotionBox
            ref={searchRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={searchVariants}
            display={{ base: "block", md: "none" }}
            flexGrow={1}
            mr={2}
          >
            <form onSubmit={handleSearch}>
              <InputGroup size="md">
                <MotionInput
                  autoFocus
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="rgba(0, 0, 0, 0.2)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  _focus={{
                    borderColor: "#00f5ff",
                    boxShadow: "0 0 0 1px #00f5ff",
                  }}
                  borderRadius="full"
                  color="white"
                  pl={4}
                  pr={10}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Close search"
                    icon={<XIcon size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSearch(false)}
                    _hover={{ bg: "transparent" }}
                  />
                </InputRightElement>
              </InputGroup>
            </form>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Mobile menu and search buttons */}
      <Flex display={{ base: "flex", md: "none" }} position="relative">
        {/* Search Button - Mobile */}
        {!showSearch && (
          <Tooltip hasArrow label="Search" bg="#00f5ff" color="black">
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
              onClick={() => setShowSearch(true)}
              mr={1}
            />
          </Tooltip>
        )}

        {/* Menu Dropdown - Mobile (hide when search is active) */}
        {!showSearch && (
          <Box ref={dropdownRef}>
            <IconButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Menu"
              icon={
                isOpen ? (
                  <ChevronUpIcon w={5} h={5} />
                ) : (
                  <ChevronDownIcon w={5} h={5} />
                )
              }
              onClick={() => setIsOpen(!isOpen)}
              variant="unstyled"
              display="flex"
              alignItems="center"
              justifyContent="center"
            />

            <AnimatePresence>
              {isOpen && (
                <MotionBox
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  position="absolute"
                  right="0"
                  mt={2}
                  width="200px"
                  bg="rgba(15, 15, 20, 0.9)"
                  style={glassEffect}
                  borderRadius="md"
                  overflow="hidden"
                  border="1px solid rgba(255, 255, 255, 0.05)"
                  zIndex={10}
                >
                  <Flex direction="column" py={1}>
                    {navItems.map(
                      (item, i) =>
                        (item.roles.includes("all") ||
                          (localStorage.getItem("role") === "admin" &&
                            item.roles.includes("admin"))) && (
                          <Link to={item.path} key={item.path}>
                            <MotionBox
                              custom={i}
                              variants={menuItemVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              px={4}
                              py={2}
                              fontSize="sm"
                              fontWeight="light"
                              letterSpacing="0.1em"
                              _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
                              onClick={() => setIsOpen(false)}
                            >
                              {item.label}
                            </MotionBox>
                          </Link>
                        )
                    )}
                    <MotionBox
                      custom={navItems.length}
                      variants={menuItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Button
                        w="full"
                        variant="ghost"
                        justifyContent="flex-start"
                        py={2}
                        px={4}
                        color="white"
                        fontWeight="light"
                        letterSpacing="0.1em"
                        fontSize="sm"
                        onClick={() => {
                          token ? logout() : navigate("/login");
                          setIsOpen(false);
                        }}
                        _hover={{ bg: "rgba(0, 245, 255, 0.1)" }}
                        leftIcon={token ? null : null}
                      >
                        {token ? "LOGOUT" : "LOGIN"}
                      </Button>
                    </MotionBox>
                  </Flex>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        )}
      </Flex>

      {/* Desktop Navigation and Search */}
      <Flex
        align="center"
        justify="flex-end"
        gap={5}
        display={{ base: "none", md: "flex" }}
        position="relative"
      >
        {/* Desktop Nav Items Container - maintain width when search is active */}
        <Box display="flex" justifyContent="center" alignItems="center" position="relative" width="100%">
          {/* Desktop search container */}
          <Box 
            position="absolute" 
            right="0" 
            zIndex="10" 
            width="300px"
          >
            <AnimatePresence>
              {showSearch && (
                <MotionBox
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={searchVariants}
                  overflow="hidden"
                  width="100%"
                >
                  <form onSubmit={handleSearch}>
                    <InputGroup size="sm">
                      <MotionInput
                        autoFocus
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        bg="rgba(0, 0, 0, 0.2)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        _focus={{
                          borderColor: "#00f5ff",
                          boxShadow: "0 0 0 1px #00f5ff",
                        }}
                        borderRadius="full"
                        color="white"
                        pl={4}
                        pr={10}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label="Close search"
                          icon={<XIcon size={14} />}
                          size="xs"
                          variant="ghost"
                          onClick={() => setShowSearch(false)}
                          _hover={{ bg: "transparent" }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </form>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>

          {/* Desktop navigation items */}
          <Flex
            justifyContent="space-evenly"
            alignItems="center"
            gap="4"
            opacity={showSearch ? 0 : 1}
            transition="opacity 0.3s ease"
          >
            {navItems.map(
              (item) =>
                (item.roles.includes("all") ||
                  (localStorage.getItem("role") === "admin" &&
                    item.roles.includes("admin"))) && (
                  <Link to={item.path} key={item.path}>
                    <MotionText
                      variants={textVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      fontSize="xs"
                      fontWeight="light"
                      letterSpacing="0.15em"
                      position="relative"
                      pb={1}
                      _after={{
                        content: '""',
                        position: "absolute",
                        width:
                          location.pathname === item.path ? "100%" : "0%",
                        height: "1px",
                        bottom: "0",
                        left: "0",
                        bg:
                          location.pathname === item.path
                            ? "#00f5ff"
                            : "white",
                        transition: "width 0.3s ease",
                      }}
                      _hover={{
                        _after: {
                          width: "100%",
                          bg: "#00f5ff",
                        },
                      }}
                    >
                      {item.label}
                    </MotionText>
                  </Link>
                )
            )}
          </Flex>

         {!showSearch && ( <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // transition={{ delay: 0.5 }}
            ml={2}
            opacity={showSearch ? 0 : 1}
            transition="opacity 0.3s ease"
          >
            <Button
              as={motion.button}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 10px rgba(0, 245, 255, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              size="sm"
              bg="transparent"
              border="1px solid rgba(0, 245, 255, 0.3)"
              color="white"
              onClick={token ? logout : () => navigate("/login")}
              borderRadius="full"
              fontSize="xs"
              px={4}
              py={1}
              fontWeight="light"
              letterSpacing="0.1em"
              _hover={{ bg: "rgba(0, 245, 255, 0.1)" }}
            >
              {token ? "LOGOUT" : "LOGIN"}
            </Button>
          </MotionBox>)}
        </Box>

        {/* Search Button - Desktop (position outside the nav items) */}
        <Tooltip hasArrow label="Search" bg="#00f5ff" color="black">
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
            onClick={() => setShowSearch(!showSearch)}
          />
        </Tooltip>
      </Flex>
    </Flex>
  </Box>
</MotionBox>
  );
}

export default Nav;
