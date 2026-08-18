import { useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  IconButton,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { BiPrinter } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";

const shortOrderCode = (id = "") =>
  `#${String(id).slice(-6).toUpperCase()}`;

const formatMoney = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

const formatItemSet = (itemSet) =>
  itemSet && itemSet.length > 0
    ? itemSet.map((i) => `${i.size} (${i.lengths})`).join(", ")
    : "N/A";

/**
 * Shared admin order card used by pending / accepted / rejected screens so the
 * same order always renders identically: short code, date, total, delivery
 * address, items, and a print action. `actions` is the per-screen footer
 * (accept/reject/reinstate). Printing is self-contained.
 */
const OrderCard = ({ order, statusColorScheme = "gray", actions }) => {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Order ${shortOrderCode(order._id)}`,
  });

  const customer = order.userId || {};
  const deliveryAddress = order.deliveryAddress || customer.address || "";
  const itemCount = order.totalItems ?? order.items?.length ?? 0;

  return (
    <Card shadow="sm" borderRadius="xl" bg="white">
      <CardHeader pb={2}>
        <HStack justify="space-between" align="flex-start">
          <VStack align="start" spacing={1}>
            <HStack>
              <Tooltip label={order._id} placement="top">
                <Text fontSize="sm" fontWeight="800" fontFamily="mono" color="gray.700">
                  {shortOrderCode(order._id)}
                </Text>
              </Tooltip>
              <Tag size="sm" colorScheme={statusColorScheme} textTransform="capitalize">
                {order.status}
              </Tag>
            </HStack>
            <Heading size="sm" color="gray.800">
              {customer.name || "Unknown Customer"}
            </Heading>
            <HStack spacing={2} flexWrap="wrap">
              <Tag size="sm" colorScheme="green">
                {customer.shopName || "Unknown Shop"}
              </Tag>
              <Tag size="sm" colorScheme="gray">
                {customer.phone || "N/A"}
              </Tag>
            </HStack>
          </VStack>
          <Tooltip label="Print order">
            <IconButton
              icon={<BiPrinter />}
              variant="outline"
              size="sm"
              colorScheme="gray"
              onClick={handlePrint}
              aria-label="Print order"
            />
          </Tooltip>
        </HStack>
      </CardHeader>

      <CardBody pt={0}>
        <HStack
          spacing={6}
          mb={3}
          flexWrap="wrap"
          fontSize="sm"
          color="gray.600"
        >
          <Box>
            <Text fontSize="xs" color="gray.400">Placed</Text>
            <Text fontWeight="600">{formatDateTime(order.createdAt)}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.400">Items</Text>
            <Text fontWeight="600">{itemCount}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.400">Order total</Text>
            <Text fontWeight="800" color="green.600">{formatMoney(order.totalPrice)}</Text>
          </Box>
        </HStack>

        {deliveryAddress ? (
          <Box mb={3} fontSize="sm">
            <Text fontSize="xs" color="gray.400">Deliver to</Text>
            <Text color="gray.700">
              {deliveryAddress}
              {order.pincode ? ` - ${order.pincode}` : ""}
            </Text>
            {order.landmark ? (
              <Text color="gray.500" fontSize="xs">
                Landmark: {order.landmark}
              </Text>
            ) : null}
          </Box>
        ) : null}

        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Article</Th>
                <Th>Brand</Th>
                <Th>Price</Th>
                <Th>Color</Th>
                <Th>Item Set</Th>
                <Th>Qty</Th>
              </Tr>
            </Thead>
            <Tbody>
              {order.items?.map((item) => (
                <Tr key={item._id}>
                  <Td fontWeight="500">{item.productId?.article || "N/A"}</Td>
                  <Td>{item.productId?.brand || "N/A"}</Td>
                  <Td>{formatMoney(item.price)}</Td>
                  <Td>{item.color}</Td>
                  <Td fontSize="xs">{formatItemSet(item.itemSet)}</Td>
                  <Td>{item.quantity}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {actions ? (
          <>
            <Divider my={4} />
            <HStack justify="flex-end">{actions}</HStack>
          </>
        ) : null}

        {/* Hidden branded invoice for printing */}
        <Box display="none">
          <Box ref={printRef} p="24px" fontFamily="Inter, sans-serif">
            <Text fontSize="22px" fontWeight="800" color="#E8193C">
              SALIM FOOTWEAR
            </Text>
            <Text fontSize="12px" color="#666" mb="12px">
              Order {shortOrderCode(order._id)} · {formatDateTime(order.createdAt)}
            </Text>
            <Text fontSize="13px">
              <strong>Customer:</strong> {customer.name || "N/A"}
              {customer.shopName ? ` (${customer.shopName})` : ""}
            </Text>
            <Text fontSize="13px">
              <strong>Phone:</strong> {customer.phone || "N/A"}
            </Text>
            {deliveryAddress ? (
              <Text fontSize="13px">
                <strong>Deliver to:</strong> {deliveryAddress}
                {order.pincode ? ` - ${order.pincode}` : ""}
              </Text>
            ) : null}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "12px",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr>
                  {["Article", "Brand", "Color", "Item Set", "Qty", "Price"].map((h) => (
                    <th
                      key={h}
                      style={{
                        borderBottom: "1px solid #ccc",
                        textAlign: "left",
                        padding: "4px 6px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item._id}>
                    <td style={{ padding: "4px 6px" }}>{item.productId?.article || "N/A"}</td>
                    <td style={{ padding: "4px 6px" }}>{item.productId?.brand || "N/A"}</td>
                    <td style={{ padding: "4px 6px" }}>{item.color}</td>
                    <td style={{ padding: "4px 6px" }}>{formatItemSet(item.itemSet)}</td>
                    <td style={{ padding: "4px 6px" }}>{item.quantity}</td>
                    <td style={{ padding: "4px 6px" }}>{formatMoney(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Text fontSize="14px" fontWeight="800" mt="12px" textAlign="right">
              Total: {formatMoney(order.totalPrice)} &nbsp;
              <span style={{ fontSize: "11px", fontWeight: 400, color: "#666" }}>
                ({itemCount} items)
              </span>
            </Text>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  statusColorScheme: PropTypes.string,
  actions: PropTypes.node,
};

export default OrderCard;
