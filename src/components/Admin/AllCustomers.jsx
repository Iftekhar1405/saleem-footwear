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
  useColorModeValue,
  useToast,
  Badge,
  Input,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { 
  Trash2, 
  Edit3, 
  UserX, 
  UserCheck,
  Search
} from "lucide-react";
import { URL } from "../../context/url";

// Framer Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

function AllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const shadowColor = useColorModeValue("md", "dark-lg");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedCustomers = response.data.users;
        setCustomers(fetchedCustomers);
        setOriginalCustomers(fetchedCustomers);
      } catch (error) {
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

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      // If search is empty, show all customers
      setCustomers(originalCustomers);
      return;
    }

    // Filter customers by phone number
    const filteredCustomers = originalCustomers.filter(customer => 
      customer.phone.toLowerCase().includes(value.toLowerCase())
    );

    setCustomers(filteredCustomers);

    // Show toast if no results found
    if (filteredCustomers.length === 0) {
      toast({
        title: "No Results",
        description: "No customers found matching the search",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    toast({
      title: "Edit Customer",
      description: `Preparing to edit ${customer.name}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleBlockCustomer = async (customerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${URL}/customers/${customerId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const updatedCustomers = customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, isBlocked: !customer.isBlocked } 
          : customer
      );

      setCustomers(updatedCustomers);
      setOriginalCustomers(updatedCustomers);

      toast({
        title: "Customer Status Updated",
        description: "Customer block status changed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
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
      
      const updatedCustomers = customers.filter((cust) => cust.id !== customerId);
      setCustomers(updatedCustomers);
      setOriginalCustomers(updatedCustomers);

      toast({
        title: "Customer Deleted",
        description: "Customer has been removed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
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
    <Box p={8}>
      <VStack spacing={6} mb={6}>
        <Heading 
          textAlign="center" 
          color={useColorModeValue("gray.700", "gray.200")}
        >
          Customer Management
        </Heading>

        {/* Search Input */}
        <InputGroup maxW="600px" w="full">
          <InputLeftElement pointerEvents="none">
            <Search color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search by phone number" 
            value={searchTerm}
            onChange={handleSearch}
            variant="filled"
          />
        </InputGroup>
      </VStack>

      {customers.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No customers found
        </Text>
      ) : (
        <Grid 
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          templateColumns={{
            base: "repeat(1, 1fr)", 
            md: "repeat(2, 1fr)", 
            lg: "repeat(3, 1fr)"
          }}
          gap={6}
        >
          {customers.map((customer) => (
            <GridItem 
              as={motion.div}
              variants={itemVariants}
              key={customer._id}
            >
              <Box
                bg={bgColor}
                shadow={shadowColor}
                p={6}
                borderRadius="lg"
                transition="all 0.3s"
                _hover={{
                  transform: "scale(1.05)",
                  shadow: "xl"
                }}
              >
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Heading size="md" color={textColor}>
                      {customer.name}
                    </Heading>
                    {customer.isBlocked && (
                      <Badge colorScheme="red">Blocked</Badge>
                    )}
                  </HStack>

                  <VStack align="stretch" spacing={2} color={textColor}>
                    <Text><strong>Email:</strong> {customer.email}</Text>
                    <Text><strong>Phone:</strong> {customer.phone}</Text>
                    <Text><strong>Address:</strong> {customer.address}</Text>
                  </VStack>

                  <HStack justify="flex-end" spacing={2}>
                    <Button 
                      variant="ghost" 
                      colorScheme="blue"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <Edit3 size={20} />
                    </Button>

                    <Button 
                      variant="ghost" 
                      colorScheme={customer.isBlocked ? "green" : "yellow"}
                      onClick={() => handleBlockCustomer(customer.id)}
                    >
                      {customer.isBlocked ? <UserCheck size={20} /> : <UserX size={20} />}
                    </Button>

                    <Button 
                      variant="ghost" 
                      colorScheme="red"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default AllCustomers;