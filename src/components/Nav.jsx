// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Button,
//   Flex,
//   IconButton,
//   Text,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   useBreakpointValue,
//   Tooltip,
//   useOutsideClick,
// } from "@chakra-ui/react";
// import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
// import { motion } from "framer-motion";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import RoleBasedComponent from "../RoleBasedComponents";
// import { iconVariants } from "./Header";
// import { User2Icon } from "lucide-react";

// // Create motion components
// const MotionFlex = motion(Flex);
// const MotionBox = motion(Box);
// const MotionText = motion(Text);

// function Nav() {
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef();
  
//   // For mobile dropdown
//   useOutsideClick({
//     ref: dropdownRef,
//     handler: () => setIsOpen(false),
//   });
  
//   // Gradient background colors to match Header
//   const bgGradient = "linear(to-r, #000000, #1a1a1a, #000000)";
//   const buttonHoverBg = "rgba(255, 255, 255, 0.1)";

//   const logout = () => {
//     const confirm = window.confirm("Are you sure you want to log out?");
//     if (confirm) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("role");
//       navigate("/");
//     }
//   };

//   // Animation variants
//   const navbarVariants = {
//     hidden: {
//       y: -100,
//       opacity: 0,
//     },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//       },
//     },
//   };

//   const textVariants = {
//     initial: { opacity: 0, y: -5 },
//     animate: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 20,
//         delay: 0.2
//       }
//     },
//     hover: {
//       scale: 1.05,
//       color: "#FF6B6B",
//       transition: { type: "spring", stiffness: 300, damping: 15 },
//     }
//   };

//   const dropdownVariants = {
//     hidden: {
//       opacity: 0,
//       y: -20,
//       scale: 0.95,
//       transition: {
//         duration: 0.2,
//       },
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 15,
//       },
//     },
//   };

//   return (
//     <>
//       <MotionBox
//         initial="hidden"
//         animate="visible"
//         variants={navbarVariants}
//         position="sticky"
//         top="0"
//         zIndex="1000"
//       >
//         <Box 
//           py={4} 
//           px={6} 
//           bgGradient={bgGradient} 
//           color="white"
//           boxShadow="0px 2px 15px rgba(0, 0, 0, 0.5)"
//           borderBottomWidth="1px"
//           borderBottomColor="rgba(255, 255, 255, 0.1)"
//         >
//           <Flex 
//             align="center" 
//             justify="space-between" 
//             maxW="1200px" 
//             mx="auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.1, duration: 0.5 }}
//           >
//             <Flex align="center">
//               {/* Brand Logo/Name */}
//               <Link to="/">
//                 <MotionText
//                   variants={textVariants}
//                   initial="initial"
//                   animate="animate"
//                   whileHover="hover"
//                   fontSize={{ base: "xl", md: "2xl" }}
//                   fontWeight="extrabold"
//                   bgGradient="linear(to-r, #FF0080, #FF6B6B)"
//                   bgClip="text"
//                   fontFamily={"Al-Navrada"}
//                   letterSpacing=".2em"
//                   cursor="pointer"
//                   filter="drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5))"
//                 >
//                   SALIM FOOTWEAR
//                 </MotionText>
//               </Link>
//             </Flex>

//             {/* Mobile menu button with dropdown */}
//             <Box display={{ base: "block", md: "none" }} position="relative" ref={dropdownRef}>
//               <Tooltip hasArrow label="Menu" bg="#FF6B6B">
//                 <IconButton
//                   as={motion.button}
//                   variants={iconVariants}
//                   initial="initial"
//                   whileHover="hover"
//                   whileTap="tap"
//                   aria-label="Open menu"
//                   icon={<User2Icon w={6} h={6}/>}
//                   onClick={() => setIsOpen(!isOpen)}
//                   variant="ghost"
//                   colorScheme="whiteAlpha"
//                   fontSize="lg"
//                   borderRadius="full"
//                   _hover={{ bg: buttonHoverBg }}
//                 />
//               </Tooltip>
              
//               {/* Mobile dropdown menu */}
//               <MotionBox
//                 initial="hidden"
//                 animate={isOpen ? "visible" : "hidden"}
//                 variants={dropdownVariants}
//                 position="absolute"
//                 right="0"
//                 mt={2}
//                 width="240px"
//                 bg="rgba(0, 0, 0, 0.95)"
//                 borderRadius="md"
//                 overflow="hidden"
//                 boxShadow="0px 5px 15px rgba(0, 0, 0, 0.3)"
//                 borderWidth="1px"
//                 borderColor="rgba(255, 255, 255, 0.1)"
//                 zIndex={10}
//                 display={{ base: "block", md: "none" }}
//               >
//                 <Box py={2}>
//                   <Link to="/orders">
//                     <Button
//                       w="full"
//                       variant="ghost"
//                       colorScheme="whiteAlpha"
//                       fontWeight="medium"
//                       justifyContent="flex-start"
//                       py={3}
//                       px={4}
//                       color="white"
//                       _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
//                       _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
//                       onClick={() => setIsOpen(false)}
//                     >
//                       ORDERS
//                     </Button>
//                   </Link>
//                   <Link to="/catalog">
//                     <Button
//                       w="full"
//                       variant="ghost"
//                       colorScheme="whiteAlpha"
//                       fontWeight="medium"
//                       justifyContent="flex-start"
//                       py={3}
//                       px={4}
//                       color="white"
//                       _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
//                       _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
//                       onClick={() => setIsOpen(false)}
//                     >
//                       CATALOGUE
//                     </Button>
//                   </Link>
                  
//                   <RoleBasedComponent allowedRoles={["admin"]}>
//                     <Link to="/register">
//                       <Button
//                         w="full"
//                         variant="ghost"
//                         colorScheme="whiteAlpha"
//                         fontWeight="medium"
//                         justifyContent="flex-start"
//                         py={3}
//                         px={4}
//                         color="white"
//                         _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
//                         _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
//                         onClick={() => setIsOpen(false)}
//                       >
//                         REGISTER USERS
//                       </Button>
//                     </Link>
//                   </RoleBasedComponent>
                  
//                   <Link to="/profile">
//                     <Button
//                       w="full"
//                       variant="ghost"
//                       colorScheme="whiteAlpha"
//                       fontWeight="medium"
//                       justifyContent="flex-start"
//                       py={3}
//                       px={4}
//                       color="white"
//                       _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
//                       _active={{ bg: "rgba(255, 255, 255, 0.2)" }}
//                       onClick={() => setIsOpen(false)}
//                     >
//                       PROFILE
//                     </Button>
//                   </Link>
                  
//                   {token ? (
//                     <Button
//                       w="full"
//                       variant="ghost"
//                       colorScheme="red"
//                       justifyContent="flex-start"
//                       py={3}
//                       px={4}
//                       onClick={() => {
//                         logout();
//                         setIsOpen(false);
//                       }}
//                       _hover={{ bg: "rgba(255, 107, 107, 0.2)" }}
//                     >
//                       LOG OUT
//                     </Button>
//                   ) : (
//                     <Button
//                       w="full"
//                       variant="ghost"
//                       colorScheme="blue"
//                       justifyContent="flex-start"
//                       py={3}
//                       px={4}
//                       onClick={() => {
//                         navigate("/login");
//                         setIsOpen(false);
//                       }}
//                       _hover={{ bg: "rgba(255, 107, 107, 0.2)" }}
//                     >
//                       LOG IN
//                     </Button>
//                   )}
//                 </Box>
//               </MotionBox>
//             </Box>

//             {/* Desktop Navigation */}
//             <Flex
//               as="nav"
//               align="center"
//               justify="space-between"
//               display={{ base: "none", md: "flex" }}
//               gap={6}
//             >
//               <Link to="/orders">
//                 <Button
//                   as={motion.button}
//                   variants={iconVariants}
//                   initial="initial"
//                   whileHover="hover"
//                   whileTap="tap"
//                   variant="ghost"
//                   colorScheme="whiteAlpha"
//                   fontSize="sm"
//                   fontWeight="medium"
//                   borderRadius="full"
//                   px={4}
//                   _hover={{ bg: buttonHoverBg }}
//                   isActive={location.pathname === "/orders"}
//                   _active={{
//                     bg: "rgba(255, 255, 255, 0.2)",
//                     borderBottom: "2px solid",
//                     borderColor: "#FF6B6B",
//                   }}
//                 >
//                   ORDERS
//                 </Button>
//               </Link>
              
//               <Link to="/catalog">
//                 <Button
//                   as={motion.button}
//                   variants={iconVariants}
//                   initial="initial"
//                   whileHover="hover"
//                   whileTap="tap"
//                   variant="ghost"
//                   colorScheme="whiteAlpha"
//                   fontSize="sm"
//                   fontWeight="medium"
//                   borderRadius="full"
//                   px={4}
//                   _hover={{ bg: buttonHoverBg }}
//                   isActive={location.pathname === "/catalog"}
//                   _active={{
//                     bg: "rgba(255, 255, 255, 0.2)",
//                     borderBottom: "2px solid",
//                     borderColor: "#FF6B6B",
//                   }}
//                 >
//                   CATALOGUE
//                 </Button>
//               </Link>

//               <RoleBasedComponent allowedRoles={["admin"]}>
//                 <Link to="/register">
//                   <Button
//                     as={motion.button}
//                     variants={iconVariants}
//                     initial="initial"
//                     whileHover="hover"
//                     whileTap="tap"
//                     variant="ghost"
//                     colorScheme="whiteAlpha"
//                     fontSize="sm"
//                     fontWeight="medium"
//                     borderRadius="full"
//                     px={4}
//                     _hover={{ bg: buttonHoverBg }}
//                     isActive={location.pathname === "/register"}
//                     _active={{
//                       bg: "rgba(255, 255, 255, 0.2)",
//                       borderBottom: "2px solid",
//                       borderColor: "#FF6B6B",
//                     }}
//                   >
//                     REGISTER USERS
//                   </Button>
//                 </Link>
//               </RoleBasedComponent>

//               <Link to="/profile">
//                 <Button
//                   as={motion.button}
//                   variants={iconVariants}
//                   initial="initial"
//                   whileHover="hover"
//                   whileTap="tap"
//                   variant="ghost"
//                   colorScheme="whiteAlpha"
//                   fontSize="sm"
//                   fontWeight="medium"
//                   borderRadius="full"
//                   px={4}
//                   _hover={{ bg: buttonHoverBg }}
//                   isActive={location.pathname === "/profile"}
//                   _active={{
//                     bg: "rgba(255, 255, 255, 0.2)",
//                     borderBottom: "2px solid",
//                     borderColor: "#FF6B6B",
//                   }}
//                 >
//                   PROFILE
//                 </Button>
//               </Link>

//               {token ? (
//                 <Button
//                   as={motion.button}
//                   variants={iconVariants}
//                   initial="initial"
//                   whileHover="hover"
//                   whileTap="tap"
//                   variant="outline"
//                   colorScheme="red"
//                   onClick={logout}
//                   borderRadius="full"
//                   fontSize="sm"
//                   fontWeight="medium"
//                   borderColor="#FF6B6B"
//                   _hover={{ bg: "rgba(255, 107, 107, 0.2)" }}
//                 >
//                   LOG OUT
//                 </Button>
//               ) : (
//                 <Button
//                   as={motion.button}
//                   variants={iconVariants}
//                   initial="initial"
//                   whileHover="hover"
//                   whileTap="tap"
//                   variant="outline"
//                   colorScheme="blue"
//                   onClick={() => navigate("/login")}
//                   borderRadius="full"
//                   fontSize="sm"
//                   fontWeight="medium"
//                   borderColor="#FF6B6B"
//                   _hover={{ bg: "rgba(255, 107, 107, 0.2)" }}
//                 >
//                   LOG IN
//                 </Button>
//               )}
//             </Flex>
//           </Flex>
//         </Box>
//       </MotionBox>
//     </>
//   );
// }

// export default Nav;














import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useOutsideClick,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RoleBasedComponent from "../RoleBasedComponents";

// Motion components
const MotionFlex = motion(Flex);
const MotionBox = motion(Box);
const MotionText = motion(Text);

function Nav() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  
  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsOpen(false),
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

  // Enhanced animation variants
  const navbarVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const textVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      color: "#00f5ff",
      textShadow: "0 0 8px rgba(0, 245, 255, 0.5)",
      transition: { duration: 0.2 }
    }
  };

  const menuItemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.2
      }
    }),
    exit: { opacity: 0, x: -10 }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 }
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
        delayChildren: 0.1
      }
    }
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
        <Flex 
          align="center" 
          justify="space-between" 
          maxW="1200px" 
          mx="auto"
        >
          <Link to="/">
            <MotionText
              variants={textVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="light"
              letterSpacing=".5em"
              cursor="pointer"
              textTransform="uppercase"
              fontFamily="monospace"
            >
              SALIM
            </MotionText>
          </Link>

          {/* Mobile menu button */}
          <Box display={{ base: "block", md: "none" }} position="relative" ref={dropdownRef}>
            <IconButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Menu"
              icon={isOpen ? <ChevronUpIcon w={5} h={5} /> : <ChevronDownIcon w={5} h={5} />}
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
                    {navItems.map((item, i) => (
                      ((item.roles.includes("all") || 
                       (localStorage.getItem("role") === "admin" && item.roles.includes("admin"))) && (
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
                      ))
                    ))}
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

          {/* Desktop Navigation */}
          <Flex
            align="center"
            justify="flex-end"
            gap={5}
            display={{ base: "none", md: "flex" }}
          >
            {navItems.map((item) => (
              ((item.roles.includes("all") || 
               (localStorage.getItem("role") === "admin" && item.roles.includes("admin"))) && (
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
                      width: location.pathname === item.path ? "100%" : "0%",
                      height: "1px",
                      bottom: "0",
                      left: "0",
                      bg: location.pathname === item.path ? "#00f5ff" : "white",
                      transition: "width 0.3s ease"
                    }}
                    _hover={{
                      _after: {
                        width: "100%",
                        bg: "#00f5ff"
                      }
                    }}
                  >
                    {item.label}
                  </MotionText>
                </Link>
              ))
            ))}

            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              ml={2}
            >
              <Button
                as={motion.button}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 10px rgba(0, 245, 255, 0.5)"
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
            </MotionBox>
          </Flex>
        </Flex>
      </Box>
    </MotionBox>
  );
}

export default Nav;