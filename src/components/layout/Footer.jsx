import React from "react";
import {
    Box,
    Container,
    Stack,
    Text,
    Link,
    Flex,
    HStack,
    VStack,
    Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import packageInfo from "../../../package.json";

const MotionBox = motion(Box);
const MotionLink = motion(Link);
const MotionFlex = motion(Flex);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            as="footer"
            position="relative"
            mt="auto"
            overflow="hidden"
        >
            {/* Futuristic gradient border top */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                height="1px"
                bgGradient="linear(to-r, transparent, #00f5ff, #FF6B6B, transparent)"
                opacity={0.6}
            />

            {/* Main footer content */}
            <Box
                position="relative"
                bg="rgba(10, 10, 12, 0.95)"
                backdropFilter="blur(20px)"
                pt={12}
                pb={8}
            >
                <Container maxW="7xl">
                    {/* Top section - Brand and Links */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align={{ base: "center", md: "flex-start" }}
                        gap={8}
                        mb={8}
                    >
                        {/* Brand */}
                        <VStack align={{ base: "center", md: "flex-start" }} spacing={3}>
                            <MotionBox
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    bgGradient="linear(to-r, #FF6B6B, white)"
                                    bgClip="text"
                                    letterSpacing="wider"
                                    fontFamily="monospace"
                                >
                                    SALIM FOOTWEAR
                                </Text>
                            </MotionBox>
                            <Text
                                fontSize="sm"
                                color="gray.500"
                                fontFamily="mono"
                                letterSpacing="wide"
                            >
                                PREMIUM QUALITY SINCE INCEPTION
                            </Text>
                        </VStack>

                        {/* Navigation Links */}
                        <HStack
                            spacing={8}
                            display={{ base: "none", md: "flex" }}
                            align="center"
                        >
                            {[
                                { to: "/privacy-policy", label: "Privacy" },
                                { to: "/terms-and-conditions", label: "Terms" },
                                { to: "/contact-us", label: "Contact" },
                            ].map((link, idx) => (
                                <MotionLink
                                    key={idx}
                                    as={RouterLink}
                                    to={link.to}
                                    fontSize="sm"
                                    color="gray.400"
                                    fontWeight="500"
                                    position="relative"
                                    whileHover={{ y: -2 }}
                                    _hover={{
                                        color: "#00f5ff",
                                        textDecoration: "none",
                                    }}
                                    _before={{
                                        content: '""',
                                        position: "absolute",
                                        bottom: "-4px",
                                        left: 0,
                                        width: "0%",
                                        height: "2px",
                                        bg: "#00f5ff",
                                        transition: "width 0.3s ease",
                                    }}
                                    sx={{
                                        "&:hover::before": {
                                            width: "100%",
                                        },
                                    }}
                                >
                                    {link.label}
                                </MotionLink>
                            ))}
                        </HStack>

                        {/* Mobile Navigation */}
                        <VStack
                            spacing={4}
                            display={{ base: "flex", md: "none" }}
                            align="center"
                        >
                            {[
                                { to: "/privacy-policy", label: "Privacy" },
                                { to: "/terms-and-conditions", label: "Terms" },
                                { to: "/contact-us", label: "Contact" },
                            ].map((link, idx) => (
                                <MotionLink
                                    key={idx}
                                    as={RouterLink}
                                    to={link.to}
                                    fontSize="sm"
                                    color="gray.400"
                                    fontWeight="500"
                                    whileHover={{ scale: 1.05 }}
                                    _hover={{
                                        color: "#00f5ff",
                                        textDecoration: "none",
                                    }}
                                >
                                    {link.label}
                                </MotionLink>
                            ))}
                        </VStack>
                    </Flex>

                    {/* Divider with glow effect */}
                    <Box position="relative" my={8}>
                        <Divider
                            borderColor="whiteAlpha.100"
                            opacity={0.3}
                        />
                        <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            width="100px"
                            height="1px"
                            bg="linear-gradient(90deg, transparent, #00f5ff, transparent)"
                            filter="blur(2px)"
                        />
                    </Box>

                    {/* Bottom section - Copyright and Credits */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align="center"
                        gap={4}
                    >
                        {/* Copyright */}
                        <HStack spacing={2} fontSize="xs" color="gray.500">
                            <Text>©</Text>
                            <Text>{currentYear}</Text>
                            <Text>SALIM FOOTWEAR</Text>
                            <Text>•</Text>
                            <Text>All rights reserved</Text>
                        </HStack>

                        {/* iRAD Credit - Professional Branding */}
                        <MotionFlex
                            align="center"
                            gap={3}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <VStack spacing={0} align={{ base: "center", md: "flex-end" }}>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    fontWeight="500"
                                    letterSpacing="wide"
                                >
                                    ENGINEERED BY
                                </Text>
                                <Link
                                    href="https://irad.solutions/"
                                    isExternal
                                    _hover={{ textDecoration: "none" }}
                                >
                                    <HStack spacing={2} align="center">
                                        {/* iRAD Logo/Icon Effect */}
                                        <Box
                                            position="relative"
                                            w="24px"
                                            h="24px"
                                        >
                                            <Box
                                                position="absolute"
                                                inset={0}
                                                border="2px solid"
                                                borderColor="#FF6B6B"
                                                borderRadius="4px"
                                                transform="rotate(45deg)"
                                                opacity={0.6}
                                            />
                                            <Flex
                                                position="absolute"
                                                inset={0}
                                                align="center"
                                                justify="center"
                                            >
                                                <Text
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                    color="#FF6B6B"
                                                    fontFamily="mono"
                                                >
                                                    i
                                                </Text>
                                            </Flex>
                                        </Box>
                                        
                                        <VStack spacing={0} align="flex-start">
                                            <Text
                                                fontSize="md"
                                                fontWeight="bold"
                                                bgGradient="linear(to-r, #FF6B6B, #00f5ff)"
                                                bgClip="text"
                                                letterSpacing="wider"
                                                fontFamily="sans-serif"
                                                lineHeight="1"
                                            >
                                                iRAD
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color="gray.600"
                                                fontFamily="mono"
                                                letterSpacing="widest"
                                                lineHeight="1"
                                            >
                                                SOLUTIONS
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Link>
                            </VStack>
                        </MotionFlex>

                        {/* Version */}
                        <HStack
                            spacing={2}
                            fontSize="xs"
                            color="gray.500"
                            fontFamily="mono"
                        >
                            <Text>v{packageInfo.version}</Text>
                        </HStack>
                    </Flex>
                </Container>

                {/* Ambient glow effect */}
                <Box
                    position="absolute"
                    bottom={0}
                    left="50%"
                    transform="translateX(-50%)"
                    width="600px"
                    height="100px"
                    bgGradient="radial(circle, rgba(0, 245, 255, 0.05) 0%, transparent 70%)"
                    pointerEvents="none"
                    filter="blur(40px)"
                />
            </Box>
        </Box>
    );
};

export default Footer;