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
import { CloseIcon } from "@chakra-ui/icons";
import { URL } from "../../context/url";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import OrderCard from "./OrderCard";
import { ConfirmDialog } from "../common";

function AcceptedOrders() {
  const { orders, setOrders, loading, error } = useAdminOrders("accepted");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  const rejectOrder = async () => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${URL}/order/status/${rejectTarget._id}`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) => prev.filter((o) => o._id !== rejectTarget._id));
      toast({ title: "Order moved to rejected", status: "warning", duration: 2000, isClosable: true });
      setRejectTarget(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update order status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="green.500" thickness="3px" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" color="gray.800">Accepted Orders</Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            Orders confirmed and ready for fulfillment
          </Text>
        </Box>

        {error ? (
          <Card>
            <CardBody>
              <Text color="red.500" textAlign="center" py={8}>
                Failed to load accepted orders. Please refresh.
              </Text>
            </CardBody>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardBody>
              <Text color="gray.500" textAlign="center" py={8}>
                No accepted orders at the moment.
              </Text>
            </CardBody>
          </Card>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              statusColorScheme="green"
              actions={
                <Button
                  leftIcon={<CloseIcon boxSize={3} />}
                  colorScheme="red"
                  size="sm"
                  variant="outline"
                  onClick={() => setRejectTarget(order)}
                >
                  Reject order
                </Button>
              }
            />
          ))
        )}
      </VStack>

      <ConfirmDialog
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={rejectOrder}
        isLoading={actionLoading}
        title="Reject order"
        confirmLabel="Reject"
        body={`Reject the accepted order from ${rejectTarget?.userId?.name || "this dealer"}? It will move to rejected.`}
      />
    </Box>
  );
}

export default AcceptedOrders;
