import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { Box, Grid, Heading, Text, Flex, Skeleton } from "@chakra-ui/react";
import {
  Package,
  CheckCircle,
  XCircle,
  Users,
  ShoppingBag,
  Megaphone,
  IndianRupee,
  CalendarClock,
} from "lucide-react";
import { URL } from "../../context/url";

const CARDS = [
  { to: "/pending-orders",  Icon: Package,     label: "Pending Orders",  iconColor: "orange.500", iconBg: "orange.50", countKey: "pending"  },
  { to: "/accepted-orders", Icon: CheckCircle, label: "Accepted Orders", iconColor: "green.500",  iconBg: "green.50",  countKey: "accepted" },
  { to: "/rejected-orders", Icon: XCircle,     label: "Rejected Orders", iconColor: "red.500",    iconBg: "red.50",    countKey: "rejected" },
  { to: "/customers",       Icon: Users,       label: "All Customers",   iconColor: "purple.500", iconBg: "purple.50", countKey: "totalDealers" },
  { to: "/edit-products",   Icon: ShoppingBag, label: "Edit Products",   iconColor: "blue.500",   iconBg: "blue.50"    },
  { to: "/promotions",      Icon: Megaphone,   label: "Promotions",      iconColor: "pink.500",   iconBg: "pink.50"    },
];

const formatMoney = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function KpiCard({ Icon, label, value, iconColor, iconBg, loading }) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="16px"
      p={5}
      boxShadow="0 1px 4px rgba(0,0,0,0.04)"
    >
      <Flex bg={iconBg} color={iconColor} borderRadius="12px" p={2.5} w="fit-content" mb={3}>
        <Icon size={20} />
      </Flex>
      {loading ? (
        <Skeleton height="28px" width="60%" borderRadius="md" />
      ) : (
        <Text fontSize="2xl" fontWeight="800" color="gray.800" lineHeight="1.1">
          {value}
        </Text>
      )}
      <Text color="gray.500" fontSize="xs" mt={1} fontWeight="600">
        {label}
      </Text>
    </Box>
  );
}

KpiCard.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconColor: PropTypes.string,
  iconBg: PropTypes.string,
  loading: PropTypes.bool,
};

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${URL}/order/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Box mb={6}>
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

      {/* KPIs */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={5}
        mb={8}
      >
        <KpiCard
          Icon={Package}
          label="Pending orders"
          value={stats?.pending ?? 0}
          iconColor="orange.500"
          iconBg="orange.50"
          loading={loading}
        />
        <KpiCard
          Icon={CalendarClock}
          label="Orders today"
          value={stats?.todayOrders ?? 0}
          iconColor="blue.500"
          iconBg="blue.50"
          loading={loading}
        />
        <KpiCard
          Icon={IndianRupee}
          label="Confirmed revenue"
          value={formatMoney(stats?.revenue)}
          iconColor="green.500"
          iconBg="green.50"
          loading={loading}
        />
        <KpiCard
          Icon={Users}
          label="Registered dealers"
          value={stats?.totalDealers ?? 0}
          iconColor="purple.500"
          iconBg="purple.50"
          loading={loading}
        />
      </Grid>

      {/* Navigation */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={5}>
        {CARDS.map(({ to, Icon, label, iconColor, iconBg, countKey }) => {
          const count = countKey && stats ? stats[countKey] : undefined;
          return (
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
                <Flex w="100%" justify="space-between" align="flex-start">
                  <Flex bg={iconBg} color={iconColor} borderRadius="12px" p={3} align="center" justify="center">
                    <Icon size={22} />
                  </Flex>
                  {count !== undefined && (
                    <Text fontSize="lg" fontWeight="800" color={iconColor}>
                      {count}
                    </Text>
                  )}
                </Flex>
                <Text fontWeight="600" color="gray.700" fontSize="sm" lineHeight="1.3" mt={4}>
                  {label}
                </Text>
              </Box>
            </Link>
          );
        })}
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
