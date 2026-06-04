import React from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Heading, Text, Flex } from "@chakra-ui/react";
import { Package, CheckCircle, XCircle, Users, ShoppingBag, Megaphone } from "lucide-react";

const CARDS = [
  { to: "/pending-orders",  Icon: Package,     label: "Pending Orders",  iconColor: "orange.500", iconBg: "orange.50"  },
  { to: "/accepted-orders", Icon: CheckCircle, label: "Accepted Orders", iconColor: "green.500",  iconBg: "green.50"   },
  { to: "/rejected-orders", Icon: XCircle,     label: "Rejected Orders", iconColor: "red.500",    iconBg: "red.50"     },
  { to: "/customers",       Icon: Users,       label: "All Customers",   iconColor: "purple.500", iconBg: "purple.50"  },
  { to: "/edit-products",   Icon: ShoppingBag, label: "Edit Products",   iconColor: "blue.500",   iconBg: "blue.50"    },
  { to: "/promotions",      Icon: Megaphone,   label: "Promotions",      iconColor: "pink.500",   iconBg: "pink.50"    },
];

function AdminDashboard() {
  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Box mb={8}>
        <Heading size="xl" color="gray.800" fontWeight="700" letterSpacing="-0.5px">
          Admin Portal
        </Heading>
        <Text color="gray.500" mt={1} fontSize="sm">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </Box>

      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
        gap={5}
      >
        {CARDS.map(({ to, Icon, label, iconColor, iconBg }) => (
          <Link to={to} key={to} style={{ textDecoration: "none" }}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="16px"
              p={6}
              display="flex"
              flexDir="column"
              alignItems="flex-start"
              boxShadow="0 1px 4px rgba(0,0,0,0.04)"
              transition="all 0.2s ease"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                borderColor: "gray.200",
              }}
              cursor="pointer"
              minH="120px"
              justifyContent="space-between"
            >
              <Flex
                bg={iconBg}
                color={iconColor}
                borderRadius="12px"
                p={3}
                mb={4}
                align="center"
                justify="center"
              >
                <Icon size={22} />
              </Flex>
              <Text fontWeight="600" color="gray.700" fontSize="sm" lineHeight="1.3">
                {label}
              </Text>
            </Box>
          </Link>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
