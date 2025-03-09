import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Flex, 
  Image, 
  Text, 
  Button, 
  useBreakpointValue,
  IconButton,
  Heading,
  Container,
  useColorModeValue
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function ModernFuturisticCarousel() {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  const slideWidth = useBreakpointValue({ base: "100%", md: "33.333%" });
  const carouselHeight = useBreakpointValue({ base: "40vh", md: "40vh" });
  
  // Dark, futuristic color scheme
  const bgColor = useColorModeValue("#0a0a1a", "#0a0a1a");
  const glowColor = "rgba(88, 103, 221, 0.6)";
  const buttonBg = "rgba(30, 41, 59, 0.6)";
  const buttonHoverBg = "rgba(44, 82, 130, 0.8)";

  // Images array for carousel
  const images = [
    {
      src: "https://paragonfootwear.com/cdn/shop/files/Men.webp?height=619&v=1715769708&width=480",
      alt: "Men's Collection",
      label: "Men's Collection",
    },
    {
      src: "https://paragonfootwear.com/cdn/shop/files/women.webp?height=619&v=1715769717&width=480",
      alt: "Women's Collection",
      label: "Women's Collection",
    },
    {
      src: "https://paragonfootwear.com/cdn/shop/files/Kids.webp?height=619&v=1715769727&width=480",
      alt: "Kids Collection",
      label: "Kids' Collection",
    },
  ];

  // Duplicate array for infinite scroll effect
  const allImages = [...images, ...images, ...images];

  // Automatic scrolling animation
  useEffect(() => {
    if (isHovering) return;

    const scrollInterval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [isHovering, images.length]);

  // Smooth scroll effect when active index changes
  useEffect(() => {
    if (carouselRef.current) {
      const scrollPosition = activeIndex * (carouselRef.current.offsetWidth / (isMobile ? 1 : 3));
      carouselRef.current.style.transform = `translateX(-${scrollPosition}px)`;
    }
  }, [activeIndex, isMobile]);

  // Navigate to specific slide
  const goToSlide = (index) => {
    setActiveIndex(index % images.length);
  };

  // Animation variants for Framer Motion
  const slideVariants = {
    active: {
      scale: 1.02,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
    },
    inactive: {
      scale: 0.98,
      opacity: 0.6,
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } },
    rest: { scale: 1, transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } }
  };

  const contentVariants = {
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] } 
    },
    hidden: { 
      y: 10, 
      opacity: 0, 
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] } 
    }
  };

  return (
    <Container maxW="full" p={0}>
      <Box
        position="relative"
        width="100%"
        overflow="hidden"
        bg={bgColor}
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.25)"
        height={carouselHeight}
        borderRadius="lg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          ref={carouselRef}
          style={{
            display: "flex",
            height: "100%",
            transition: "transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000)"
          }}
        >
          {allImages.map((image, index) => {
            const isActive = index % images.length === activeIndex % images.length;
            
            return (
              <motion.div
                key={index}
                variants={slideVariants}
                animate={isActive ? "active" : "inactive"}
                style={{
                  flexShrink: 0,
                  width: slideWidth,
                  padding: "0 12px",
                  height: "100%",
                  position: "relative"
                }}
              >
                <Box
                  position="relative"
                  height="100%"
                  overflow="hidden"
                  borderRadius="md"
                  boxShadow={isActive ? `0 0 25px ${glowColor}` : "none"}
                  transition="box-shadow 0.5s ease"
                >
                  <motion.div
                    variants={imageVariants}
                    animate={isHovering && isActive ? "hover" : "rest"}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      objectPosition="center"
                    />
                  </motion.div>
                  
                  <motion.div
                    variants={contentVariants}
                    animate={isActive ? "visible" : "hidden"}
                    style={{
                      position: "absolute",
                      height:"100%",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "20px",
                      background: "linear-gradient(0deg, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)",
                      color: "white"
                    }}
                  >
                    <Box position="relative" pb={6} >
                      <Heading
                        as="h3"
                        fontSize={isMobile ? "18px" : "24px"}
                        fontWeight="600"
                        textShadow="0 2px 4px rgba(0,0,0,0.5)"
                        mb={3}
                        letterSpacing="wide"
                      >
                        {image.label}
                      </Heading>
                      
                      <Button
                        size={isMobile ? "sm" : "md"}
                        bg={buttonBg}
                        color="white"
                        border="1px solid rgba(255,255,255,0.3)"
                        borderRadius="md"
                        _hover={{
                          bg: buttonHoverBg,
                          transform: "translateY(-2px)",
                          boxShadow: `0 0 15px ${glowColor}`
                        }}
                        backdropFilter="blur(4px)"
                        transition="all 0.3s ease"
                      >
                        Shop Now
                      </Button>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation dots */}
        <Flex
          position="absolute"
          bottom="16px"
          left="50%"
          transform="translateX(-50%)"
          gap="8px"
          zIndex={10}
        >
          {images.map((_, index) => {
            const isActive = index === activeIndex % images.length;
            
            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  width: isActive ? "24px" : "8px",
                  backgroundColor: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"
                }}
                transition={{ duration: 0.3 }}
                style={{
                  height: "8px",
                  borderRadius: "12px",
                  cursor: "pointer"
                }}
                onClick={() => goToSlide(index)}
              />
            );
          })}
        </Flex>

        {/* Navigation arrows */}
        {!isMobile && (
          <>
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconButton
                    icon={<ChevronLeftIcon boxSize={6} />}
                    onClick={() => goToSlide(activeIndex - 1 + images.length)}
                    position="absolute"
                    left="16px"
                    top="50%"
                    transform="translateY(-50%)"
                    bg={buttonBg}
                    color="white"
                    borderRadius="full"
                    size="lg"
                    _hover={{
                      bg: buttonHoverBg,
                      transform: "translateY(-50%) scale(1.1)",
                      boxShadow: `0 0 15px ${glowColor}`
                    }}
                    backdropFilter="blur(4px)"
                    transition="all 0.3s ease"
                    aria-label="Previous slide"
                    zIndex={10}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconButton
                    icon={<ChevronRightIcon boxSize={6} />}
                    onClick={() => goToSlide(activeIndex + 1)}
                    position="absolute"
                    right="16px"
                    top="50%"
                    transform="translateY(-50%)"
                    bg={buttonBg}
                    color="white"
                    borderRadius="full"
                    size="lg"
                    _hover={{
                      bg: buttonHoverBg,
                      transform: "translateY(-50%) scale(1.1)",
                      boxShadow: `0 0 15px ${glowColor}`
                    }}
                    backdropFilter="blur(4px)"
                    transition="all 0.3s ease"
                    aria-label="Next slide"
                    zIndex={10}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </Box>
    </Container>
  );
}

export default ModernFuturisticCarousel;