import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../context/url";

/**
 * Fetches admin orders filtered by status from the server (GET /order?status=).
 * Replaces the old pattern of downloading every order and filtering in the
 * browser. Returns the list plus a setter for optimistic updates.
 */
export function useAdminOrders(status) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${URL}/order`, {
        params: { status, limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, setOrders, loading, error, refetch: fetchOrders };
}

export default useAdminOrders;
