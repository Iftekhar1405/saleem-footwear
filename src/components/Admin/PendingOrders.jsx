import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Spinner, 
  Card, 
  CardHeader, 
  CardBody, 
  Heading, 
  Tag, 
  useColorModeValue,
  Tooltip,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion";
import { CheckIcon, CloseIcon, ViewIcon } from "@chakra-ui/icons";
import { useReactToPrint } from "react-to-print";
import { URL } from "../../context/url";

const MotionCard = motion(Card);

function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);
  const printRef = useRef(null);
  const toast = useToast();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Pending Orders - ${new Date().toLocaleDateString()}`,
    onAfterPrint: () => {
      toast({
        title: "Order Printed",
        description: "The pending orders have been printed successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setPrintOrder(null);
    },
    onPrintError: (error) => {
      console.error("Print error:", error);
      toast({
        title: "Print Error",
        description: "Failed to print the order.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  useEffect(() => {
    if (printOrder && handlePrint) {
      handlePrint();
    }
  }, [printOrder, handlePrint]);

  const triggerPrintForOrder = (order) => {
    setPrintOrder(order);
  };

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${URL}/order`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          const filteredOrders = response.data.data.filter(
            (order) => order.status === "pending"
          );
          setPendingOrders(filteredOrders);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch pending orders",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, [toast]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/order/status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      toast({
        title: "Order Updated",
        description: `Order ${status} successfully`,
        status: status === "accepted" ? "success" : "warning",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: `Failed to update order status to ${status}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateItemStatus = async (orderId, itemId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/order/item/${orderId}/status`,
        { itemId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedOrders = pendingOrders.map((order) => {
        if (order._id === orderId) {
          return {
            ...order,
            items: order.items.filter((item) => item._id !== itemId),
          };
        }
        return order;
      });
      
      setPendingOrders(updatedOrders);

      toast({
        title: "Item Updated",
        description: `Item ${status} successfully`,
        status: status === "accepted" ? "success" : "warning",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: `Failed to update item status`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box 
      p={6} 
      bg={bgColor} 
      minHeight="100vh"
    >
      <VStack spacing={6} align="stretch">
        <Heading 
          as="h1" 
          size="xl" 
          textAlign="center" 
          mb={4}
        >
          Pending Orders
        </Heading>

        {/* Print Area - Hidden from view */}
        {printOrder && (
          <div style={{ display: 'none' }}>
            <div ref={printRef}>
              <h1>Order Details</h1>
              <p>Order ID: {printOrder._id}</p>
              <p>Customer: {printOrder.userId?.name}</p>
              <p>Shop: {printOrder.userId?.shopName}</p>
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Color</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {printOrder.items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.productId?.article || "N/A"}</td>
                      <td>{item.productId?.brand || "N/A"}</td>
                      <td>₹{item.price}</td>
                      <td>{item.color}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AnimatePresence>
          {pendingOrders.length === 0 ? (
            <Box
              textAlign="center"
              py={10}
            >
              <Text fontSize="xl" color="gray.500">
                No pending orders at the moment
              </Text>
            </Box>
          ) : (
            pendingOrders.map((order) => (
              <MotionCard
                key={order._id}
                variant="elevated"
                bg={cardBgColor}
                initial="hidden"
                animate="visible"
                exit="exit"
                boxShadow="lg"
                borderRadius="xl"
              >
                <CardHeader>
                  <HStack justifyContent="space-between">
                    <VStack align="start" spacing={2}>
                      <Heading size="md">
                        Order ID: {order._id}
                      </Heading>
                      <HStack>
                        <Tag colorScheme="blue">
                          {order.userId?.name || 'Unknown Customer'}
                        </Tag>
                        <Tag colorScheme="green">
                          {order.userId?.shopName || 'Unknown Shop'}
                        </Tag>
                      </HStack>
                      <Text color="gray.500">
                        Phone: {order.userId?.phone || 'N/A'}
                      </Text>
                    </VStack>
                    <Tooltip label="Print Order">
                      <IconButton
                        icon={<ViewIcon />}
                        onClick={() => triggerPrintForOrder(order)}
                        variant="outline"
                        colorScheme="blue"
                        aria-label="Print Order"
                      />
                    </Tooltip>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Article</Th>
                          <Th>Brand</Th>
                          <Th>Price</Th>
                          <Th>Color</Th>
                          <Th>Item Set</Th>
                          <Th>Quantity</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {order.items.map((item) => (
                          <Tr key={item._id}>
                            <Td>{item.productId?.article || "N/A"}</Td>
                            <Td>{item.productId?.brand || "N/A"}</Td>
                            <Td>₹{item.price}</Td>
                            <Td>{item.color}</Td>
                            <Td>
                              {item.itemSet && item.itemSet.length > 0
                                ? item.itemSet
                                    .map((i) => `${i.size} (Pcs: ${i.lengths})`)
                                    .join(", ")
                                : "N/A"}
                            </Td>
                            <Td>{item.quantity}</Td>
                            <Td>
                              <HStack>
                                <Tooltip label="Accept Item">
                                  <IconButton
                                    icon={<CheckIcon />}
                                    colorScheme="green"
                                    size="sm"
                                    aria-label="Accept Item"
                                    onClick={() =>
                                      updateItemStatus(
                                        order._id,
                                        item._id,
                                        "accepted"
                                      )
                                    }
                               
                                  />
                                </Tooltip>
                                <Tooltip label="Reject Item">
                                  <IconButton
                                    icon={<CloseIcon />}
                                    colorScheme="red"
                                    size="sm"
                                    aria-label="Reject Item"
                                    onClick={() =>
                                      updateItemStatus(
                                        order._id,
                                        item._id,
                                        "rejected"
                                      )
                                    }
                                  />
                                </Tooltip>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                  <HStack mt={4} justifyContent="flex-end">
                    <Button
                      leftIcon={<CheckIcon />}
                      colorScheme="green"
                      onClick={() => updateOrderStatus(order._id, "accepted")}
                    >
                      Accept All
                    </Button>
                    <Button
                      leftIcon={<CloseIcon />}
                      colorScheme="red"
                      onClick={() => updateOrderStatus(order._id, "rejected")}
                    >
                      Reject All
                    </Button>
                  </HStack>
                </CardBody>
              </MotionCard>
            ))
          )}
        </AnimatePresence>
      </VStack>
    </Box>
  );
}

export default PendingOrders;