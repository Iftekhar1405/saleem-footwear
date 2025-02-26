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
import { URL } from "../../context/url";

function RejectedOrders() {
  const [rejectedOrders, setRejectedOrders] = useState([]);
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
    const fetchRejectedOrders = async () => {
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
            (order) => order.status === "rejected"
          );
          setRejectedOrders(filteredOrders);
        } else {
          alert("Unexpected response status: " + response.status);
        }

        setLoading(false);
      } catch (error) {
        alert("Error fetching rejected orders: " + error.message);
        setLoading(false);
      }
    };

    fetchRejectedOrders();
  }, []);

  const handleReinstateOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${URL}/order/status/${orderId}`,
        { status: "pending" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert("Order status updated to pending");
        setRejectedOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } else {
        alert("Unexpected response status: " + response.status);
      }
    } catch (error) {
      alert("Error updating order status to pending: " + error.message);
    }
  };

  const handleReinstateItem = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${URL}/order/item/${orderId}/status`,
        {
          itemId,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const updatedOrders = rejectedOrders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              items: order.items.filter((item) => item._id !== itemId),
            };
          }
          return order;
        });
        setRejectedOrders(updatedOrders);
        alert("Item reinstated successfully");
      } else {
        alert("Unexpected response status: " + response.status);
      }
    } catch (error) {
      alert(`Error reinstating item: ${error.message}`);
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={4} >
      <Text fontSize="2xl" mb={4}>
        Rejected Orders
      </Text>
      {rejectedOrders.length === 0 ? (
        <Text>No rejected orders</Text>
      ) : (
        rejectedOrders.map((order) => (
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
                        {item.productId._id}
                      </Td>
                      <Td>{item.productId.article}</Td>
                      <Td>{item.productId.brand}</Td>
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
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() =>
                            handleReinstateItem(order._id, item._id)
                          }
                          sx={{
                            "@media print": {
                              display: "none",
                            },
                          }}
                        >
                          Reinstate Item
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Order Actions */}
            <Box mt={4}>
              <Button
                colorScheme="blue"
                onClick={() => handleReinstateOrder(order._id)}
                sx={{
                  "@media print": {
                    display: "none",
                  },
                }}
              >
                Reinstate Entire Order
              </Button>
            </Box>
            <Divider my={4} />
          </Box>
        ))
      )}
    </Box>
  );
}

export default RejectedOrders;
