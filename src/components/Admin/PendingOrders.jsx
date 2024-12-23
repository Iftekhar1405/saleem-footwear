import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BiPrinter } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";

const URL = "https://saleem-footwear-api.vercel.app/api/v1";

function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onBeforeGetContent: () => {
      const element = document.querySelectorAll(".overflow");
      const originalOverflow = element.style.overflowX;

      element.style.overflowX = "visible";
      return () => {
        element.style.overflow = originalOverflow;
      };
    },
  });

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status >= 200 && response.status < 300) {
          const filteredOrders = response.data.data.filter(
            (order) => order.status === "pending"
          );
          setPendingOrders(filteredOrders);
        } else {
          console.error("Unexpected response status:", response.status);
        }
        console.log(response);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending orders", error);
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${URL}/order/status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert("Order status updated successfully");
        setPendingOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } else {
        alert("Unexpected response status:", response.status);
      }
    } catch (error) {
      alert(`Error updating order status to ${status}`, error);
    }
  };

  const updateItemStatus = async (orderId, itemId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${URL}/order/item/${orderId}/status`,
        {
          itemId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
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
        alert("Item status updated successfully");
      } else {
        alert("Unexpected response status:", response.status);
      }
    } catch (error) {
      alert(`Error updating item status for ${itemId} to ${status}`, error);
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Pending Orders
      </Text>
      {pendingOrders.length === 0 ? (
        <Text>No pending orders</Text>
      ) : (
        pendingOrders.map((order) => (
          <Box key={order._id} mb={8} ref={printRef}>
            <HStack justifyContent={"space-between"}>
              <Text fontSize="xl" fontWeight="bold">
                Order ID: {order._id}
                <br />
                Customer : {order.userId.name}
                <br />
                Shop : {order.userId.shopName}
                <br />
                Phone : {order.userId.phone}
              </Text>
              <IconButton icon={<BiPrinter />} onClick={handlePrint} />
            </HStack>
            <Box overflowX="auto" className="overflow">
              {" "}
              {/* Enable horizontal scrolling */}
              <Table variant="striped" mt={4}>
                <Thead>
                  <Tr>
                    <Th
                      sx={{
                        "@media print": {
                          display: "none",
                        },
                      }}
                    >
                      Product ID
                    </Th>
                    <Th>Article</Th>
                    <Th>Brand</Th>
                    <Th>Price</Th>
                    <Th>Color</Th>
                    <Th>Item Set</Th>
                    <Th>Quantity</Th>
                    <Th
                      sx={{
                        "@media print": {
                          display: "none",
                        },
                      }}
                    >
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {order.items.map((item) => (
                    <Tr key={item._id}>
                      <Td
                        sx={{
                          "@media print": {
                            display: "none",
                          },
                        }}
                      >
                        {item.productId ? item.productId._id : "N/A"}
                      </Td>
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
                      <Td
                        sx={{
                          "@media print": {
                            display: "none",
                          },
                        }}
                      >
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={() =>
                            updateItemStatus(order._id, item._id, "accepted")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          ml={2}
                          onClick={() =>
                            updateItemStatus(order._id, item._id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Box
              mt={4}
              sx={{
                "@media print": {
                  display: "none",
                },
              }}
            >
              <Button
                colorScheme="green"
                onClick={() => updateOrderStatus(order._id, "accepted")}
              >
                Accept All
              </Button>
              <Button
                colorScheme="red"
                ml={2}
                onClick={() => updateOrderStatus(order._id, "rejected")}
              >
                Reject All
              </Button>
            </Box>
            <Divider my={4} />
          </Box>
        ))
      )}
    </Box>
  );
}

export default PendingOrders;
