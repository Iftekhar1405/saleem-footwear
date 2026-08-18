import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { URL } from "../../context/url";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import OrderCard from "./OrderCard";

function RejectedOrders() {
  const { orders, setOrders, loading, error } = useAdminOrders("rejected");
  const [busyId, setBusyId] = useState(null);
  const toast = useToast();

  const reinstateOrder = async (orderId) => {
    setBusyId(orderId);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/order/status/${orderId}`,
        { status: "pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast({
        title: "Order reinstated",
        description: "Moved back to pending",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to reinstate order",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="red.400" thickness="3px" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" color="gray.800">Rejected Orders</Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            Declined orders — reinstate to move back to pending
          </Text>
        </Box>

        {error ? (
          <Card>
            <CardBody>
              <Text color="red.500" textAlign="center" py={8}>
                Failed to load rejected orders. Please refresh.
              </Text>
            </CardBody>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardBody>
              <Text color="gray.500" textAlign="center" py={8}>
                No rejected orders.
              </Text>
            </CardBody>
          </Card>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              statusColorScheme="red"
              actions={
                <Button
                  leftIcon={<RepeatIcon />}
                  colorScheme="blue"
                  size="sm"
                  isLoading={busyId === order._id}
                  onClick={() => reinstateOrder(order._id)}
                >
                  Reinstate order
                </Button>
              }
            />
          ))
        )}
      </VStack>
    </Box>
  );
}

export default RejectedOrders;
