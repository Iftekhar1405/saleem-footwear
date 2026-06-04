import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Grid,
  GridItem,
  useToast,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Trash2, Edit3, UserX, UserCheck, Search, Phone, MapPin } from "lucide-react";
import { URL } from "../../context/url";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.35 } },
};

function AllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data.users);
        setOriginalCustomers(response.data.users);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchCustomers();
  }, [toast]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setCustomers(originalCustomers);
      return;
    }

    const filtered = originalCustomers.filter((c) =>
      c.phone?.toLowerCase().includes(value.toLowerCase())
    );
    setCustomers(filtered);
  };

  const handleBlockCustomer = async (customerId, isBlocked) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/customers/${customerId}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = customers.map((c) =>
        c._id === customerId ? { ...c, isBlocked: !isBlocked } : c
      );
      setCustomers(updated);
      setOriginalCustomers(updated);
      toast({
        title: isBlocked ? "Customer Unblocked" : "Customer Blocked",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update customer status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL}/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = customers.filter((c) => c._id !== customerId);
      setCustomers(updated);
      setOriginalCustomers(updated);
      toast({
        title: "Customer Deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" color="gray.800">
            Customer Management
          </Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            {customers.length} registered dealer{customers.length !== 1 ? "s" : ""}
          </Text>
        </Box>

        <InputGroup maxW="420px">
          <InputLeftElement pointerEvents="none" color="gray.400">
            <Search size={16} />
          </InputLeftElement>
          <Input
            placeholder="Search by phone number"
            value={searchTerm}
            onChange={handleSearch}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
          />
        </InputGroup>

        {customers.length === 0 ? (
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="xl"
            p={10}
            textAlign="center"
          >
            <Text color="gray.400" fontSize="sm">
              {searchTerm ? "No customers match your search." : "No customers yet."}
            </Text>
          </Box>
        ) : (
          <Grid
            as={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={5}
          >
            {customers.map((customer) => (
              <GridItem as={motion.div} variants={itemVariants} key={customer._id}>
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="16px"
                  p={5}
                  boxShadow="0 1px 4px rgba(0,0,0,0.04)"
                  transition="box-shadow 0.2s"
                  _hover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  h="100%"
                >
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between" align="flex-start">
                      <Box>
                        <Heading size="sm" color="gray.800" lineHeight="1.3">
                          {customer.name}
                        </Heading>
                        {customer.shopName && (
                          <Text fontSize="xs" color="gray.500" mt={0.5}>
                            {customer.shopName}
                          </Text>
                        )}
                      </Box>
                      {customer.isBlocked && (
                        <Badge colorScheme="red" fontSize="10px">Blocked</Badge>
                      )}
                    </HStack>

                    <Divider borderColor="gray.100" />

                    <VStack align="stretch" spacing={1.5}>
                      <HStack spacing={2} color="gray.500">
                        <Phone size={13} />
                        <Text fontSize="sm">{customer.phone}</Text>
                      </HStack>
                      {customer.address && (
                        <HStack spacing={2} color="gray.500" align="flex-start">
                          <MapPin size={13} style={{ marginTop: 3, flexShrink: 0 }} />
                          <Text fontSize="sm" noOfLines={1}>{customer.address}</Text>
                        </HStack>
                      )}
                    </VStack>

                    <Flex justify="flex-end" gap={1} pt={1}>
                      <Button
                        variant="ghost"
                        size="sm"
                        colorScheme={customer.isBlocked ? "green" : "orange"}
                        onClick={() => handleBlockCustomer(customer._id, customer.isBlocked)}
                        px={2}
                      >
                        {customer.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteCustomer(customer._id)}
                        px={2}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
              </GridItem>
            ))}
          </Grid>
        )}
      </VStack>
    </Box>
  );
}

export default AllCustomers;
