import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
  VStack,
  Tag,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BiPrinter } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";
import { URL } from "../../context/url";

function RejectedOrders() {
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);
  const printRef = useRef(null);
  const toast = useToast();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Rejected Orders - ${new Date().toLocaleDateString()}`,
    onAfterPrint: () => setPrintOrder(null),
  });

  useEffect(() => {
    if (printOrder) handlePrint();
  }, [printOrder]);

  useEffect(() => {
    const fetchRejectedOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${URL}/order`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredOrders = response.data.data.filter(
          (order) => order.status === "rejected"
        );
        setRejectedOrders(filteredOrders);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch rejected orders",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedOrders();
  }, [toast]);

  const handleReinstateOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/order/status/${orderId}`,
        { status: "pending" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "Order Reinstated",
        description: "Order moved back to pending",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setRejectedOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reinstate order",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReinstateItem = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/order/item/${orderId}/status`,
        { itemId, status: "pending" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRejectedOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, items: order.items.filter((item) => item._id !== itemId) }
            : order
        )
      );
      toast({
        title: "Item Reinstated",
        description: "Item moved back to pending",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reinstate item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="blue.500" thickness="3px" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      {printOrder && (
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <h2>Order ID: {printOrder._id}</h2>
            <p>Customer: {printOrder.userId?.name}</p>
            <p>Shop: {printOrder.userId?.shopName}</p>
            <p>Phone: {printOrder.userId?.phone}</p>
            <table>
              <thead>
                <tr>
                  <th>Article</th><th>Brand</th><th>Price</th>
                  <th>Color</th><th>Item Set</th><th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {printOrder.items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.productId?.article || "N/A"}</td>
                    <td>{item.productId?.brand || "N/A"}</td>
                    <td>₹{item.price}</td>
                    <td>{item.color}</td>
                    <td>
                      {item.itemSet?.map((i) => `${i.size} (${i.lengths})`).join(", ") || "N/A"}
                    </td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" color="gray.800">Rejected Orders</Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            Declined orders — reinstate to move back to pending
          </Text>
        </Box>

        {rejectedOrders.length === 0 ? (
          <Card>
            <CardBody>
              <Text color="gray.500" textAlign="center" py={8}>
                No rejected orders.
              </Text>
            </CardBody>
          </Card>
        ) : (
          rejectedOrders.map((order) => (
            <Card key={order._id} shadow="sm" borderRadius="xl" bg="white">
              <CardHeader pb={2}>
                <HStack justify="space-between" align="flex-start">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" color="gray.400" fontFamily="mono">
                      #{order._id}
                    </Text>
                    <Heading size="sm" color="gray.800">
                      {order.userId?.name || "Unknown Customer"}
                    </Heading>
                    <HStack spacing={2} flexWrap="wrap">
                      <Tag size="sm" colorScheme="red">
                        {order.userId?.shopName || "Unknown Shop"}
                      </Tag>
                      <Tag size="sm" colorScheme="gray">
                        {order.userId?.phone || "N/A"}
                      </Tag>
                    </HStack>
                  </VStack>
                  <Tooltip label="Print Order">
                    <IconButton
                      icon={<BiPrinter />}
                      variant="outline"
                      size="sm"
                      colorScheme="gray"
                      onClick={() => setPrintOrder(order)}
                      aria-label="Print order"
                    />
                  </Tooltip>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <Box overflowX="auto" className="overflow">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Article</Th>
                        <Th>Brand</Th>
                        <Th>Price</Th>
                        <Th>Color</Th>
                        <Th>Item Set</Th>
                        <Th>Qty</Th>
                        <Th sx={{ "@media print": { display: "none" } }}>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {order.items.map((item) => (
                        <Tr key={item._id}>
                          <Td fontWeight="500">{item.productId?.article || "N/A"}</Td>
                          <Td>{item.productId?.brand || "N/A"}</Td>
                          <Td>₹{item.price}</Td>
                          <Td>{item.color}</Td>
                          <Td fontSize="xs">
                            {item.itemSet?.length > 0
                              ? item.itemSet.map((i) => `${i.size} (${i.lengths})`).join(", ")
                              : "N/A"}
                          </Td>
                          <Td>{item.quantity}</Td>
                          <Td sx={{ "@media print": { display: "none" } }}>
                            <Button
                              size="xs"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => handleReinstateItem(order._id, item._id)}
                            >
                              Reinstate
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                <HStack mt={4}>
                  <Button
                    leftIcon={<RepeatIcon />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleReinstateOrder(order._id)}
                  >
                    Reinstate Entire Order
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          ))
        )}
      </VStack>
    </Box>
  );
}

export default RejectedOrders;
