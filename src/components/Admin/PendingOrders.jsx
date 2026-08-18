import { useEffect, useState } from "react";
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
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useSearchParams } from "react-router-dom";
import { URL } from "../../context/url";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import OrderCard from "./OrderCard";
import { ConfirmDialog } from "../common";

function PendingOrders() {
  const [searchParams] = useSearchParams();
  const highlightOrderId = searchParams.get("orderId");
  const { orders, setOrders, loading, error } = useAdminOrders("pending");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!highlightOrderId || loading || orders.length === 0) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`pending-order-${highlightOrderId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => clearTimeout(timer);
  }, [highlightOrderId, loading, orders]);

  const updateOrderStatus = async (orderId, status) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/order/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast({
        title: `Order ${status}`,
        status: status === "accepted" ? "success" : "warning",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${status === "accepted" ? "accept" : "reject"} order`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
      setRejectTarget(null);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="orange.400" thickness="3px" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" color="gray.800">Pending Orders</Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            Review and action incoming customer orders
          </Text>
        </Box>

        {error ? (
          <Card>
            <CardBody>
              <Text color="red.500" textAlign="center" py={8}>
                Failed to load pending orders. Please refresh.
              </Text>
            </CardBody>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardBody>
              <Text color="gray.500" textAlign="center" py={8}>
                No pending orders at the moment.
              </Text>
            </CardBody>
          </Card>
        ) : (
          orders.map((order) => (
            <Box
              key={order._id}
              id={`pending-order-${order._id}`}
              borderRadius="xl"
              boxShadow={
                order._id === highlightOrderId
                  ? "0 0 0 2px var(--chakra-colors-orange-400)"
                  : undefined
              }
            >
              <OrderCard
                order={order}
                statusColorScheme="orange"
                actions={
                  <>
                    <Button
                      leftIcon={<CheckIcon />}
                      colorScheme="green"
                      size="sm"
                      isLoading={actionLoading}
                      onClick={() => updateOrderStatus(order._id, "accepted")}
                    >
                      Accept order
                    </Button>
                    <Button
                      leftIcon={<CloseIcon boxSize={3} />}
                      colorScheme="red"
                      size="sm"
                      variant="outline"
                      onClick={() => setRejectTarget(order)}
                    >
                      Reject order
                    </Button>
                  </>
                }
              />
            </Box>
          ))
        )}
      </VStack>

      <ConfirmDialog
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={() => updateOrderStatus(rejectTarget._id, "rejected")}
        isLoading={actionLoading}
        title="Reject order"
        confirmLabel="Reject"
        body={`Reject the order from ${rejectTarget?.userId?.name || "this dealer"}? They will see it as rejected.`}
      />
    </Box>
  );
}

export default PendingOrders;
