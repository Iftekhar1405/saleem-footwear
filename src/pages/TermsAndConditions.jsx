import React, { useEffect } from "react";
import { Box, Container, Heading, Text, VStack, List, ListItem, ListIcon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const TermsAndConditions = () => {
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
            Terms and Conditions
          </MotionHeading>

          <VStack spacing={6} align="stretch">
            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                1. Introduction
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                Welcome to Saleem Footwear. By accessing our website and using our services, you agree to bound by the following Terms and Conditions. Please read them carefully.
              </Text>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                2. Use of Our Service
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                You must follow any policies made available to you within the Service. You may not misuse our Service. For example, do not interfere with our Service or try to access it using a method other than the interface and the instructions that we provide.
              </Text>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                3. Privacy Protection
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                Saleseem Footwear's privacy policies explain how we treat your personal data and protect your privacy when you use our Services. By using our Services, you agree that Saleem Footwear can use such data in accordance with our privacy policies.
              </Text>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                4. Your Content in our Services
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                Some of our Services allow you to upload, submit, store, send or receive content. You retain ownership of any intellectual property rights that you hold in that content. In short, what belongs to you stays yours.
              </Text>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                5. Product Descriptions
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                We attempt to be as accurate as possible. However, Saleem Footwear does not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free.
              </Text>
            </Box>
            
             <Box>
              <Heading as="h3" size="lg" mb={3} color="gray.700">
                6. Contact Us
              </Heading>
              <Text color="gray.600" lineHeight="tall">
                If you have any questions about these Terms, please contact us.
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

export default TermsAndConditions;
