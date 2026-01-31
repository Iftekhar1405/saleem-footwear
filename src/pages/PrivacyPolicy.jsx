import React, { useEffect } from "react";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  return (
    <Box bg="gray.100" minH="100vh" pt="100px" pb="50px">
      <Container maxW="container.lg">
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          bg="white"
          p={{ base: 6, md: 10 }}
          borderRadius="lg"
          boxShadow="xl"
        >
          <MotionHeading
            as="h1"
            size="2xl"
            textAlign="center"
            mb={8}
            bgGradient="linear(to-r, #FF6B6B, #FF8E53)"
            bgClip="text"
          >
            Privacy Policy
          </MotionHeading>

          <VStack spacing={6} align="stretch">
            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                1. Information We Collect
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                We collect information to provide better services to all our users. This includes information you provide to us directly, such as when you create an account, making a purchase, or contact us for support.
              </Text>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                2. How We Use Information
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect Saleem Footwear and our users. We also use this information to offer you tailored content – like giving you more relevant search results and ads.
              </Text>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                3. Information We Share
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                We do not share personal information with companies, organizations and individuals outside of Saleem Footwear unless one of the following circumstances applies: With your consent, For external processing, or For legal reasons.
              </Text>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                4. Information Security
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                We work hard to protect Saleem Footwear and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. We review our information collection, storage and processing practices, including physical security measures, to guard against unauthorized access to systems.
              </Text>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                5. Changes
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We will post any privacy policy changes on this page.
              </Text>
            </Box>

          </VStack>

          <Text mt={10} fontSize="sm" color="gray.400" textAlign="center">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
