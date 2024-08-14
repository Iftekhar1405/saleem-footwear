import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PendingOrders.css';
const URL = "http://localhost:7000/api/v1";

function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState({});

  useEffect(() => {
    // Fetch pending orders from backend
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get(`${URL}/orders`);
        const groupedOrders = groupByCustomer(response.data);
        setPendingOrders(groupedOrders);
        console.log(response)
      } catch (error) {
        console.error('Error fetching pending orders', error);
      }
    };

    fetchPendingOrders();
  }, []);

  const groupByCustomer = (orders) => {
    return orders.reduce((grouped, order) => {
      const customerId = order.customerId;
      if (!grouped[customerId]) {
        grouped[customerId] = [];
      }
      grouped[customerId].push(order);
      return grouped;
    }, {});
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.post(`https://your-backend-url.com/api/accept-order/${orderId}`);
      // Remove the accepted order from the list
      setPendingOrders(prevOrders => {
        const updatedOrders = { ...prevOrders };
        for (const customerId in updatedOrders) {
          updatedOrders[customerId] = updatedOrders[customerId].filter(order => order.id !== orderId);
          if (updatedOrders[customerId].length === 0) {
            delete updatedOrders[customerId];
          }
        }
        return updatedOrders;
      });
    } catch (error) {
      console.error('Error accepting order', error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await axios.post(`https://your-backend-url.com/api/reject-order/${orderId}`);
      // Remove the rejected order from the list
      setPendingOrders(prevOrders => {
        const updatedOrders = { ...prevOrders };
        for (const customerId in updatedOrders) {
          updatedOrders[customerId] = updatedOrders[customerId].filter(order => order.id !== orderId);
          if (updatedOrders[customerId].length === 0) {
            delete updatedOrders[customerId];
          }
        }
        return updatedOrders;
      });
    } catch (error) {
      console.error('Error rejecting order', error);
    }
  };

  return (
    <div className="pending-orders">
      <h2>Pending Orders</h2>
      {Object.keys(pendingOrders).length === 0 ? (
        <p>No pending orders</p>
      ) : (
        Object.keys(pendingOrders).map(customerId => (
          <div key={customerId} className="customer-orders">
            <h3>Customer ID: {customerId}</h3>
            <ul>
              {pendingOrders[customerId].map(order => (
                <li key={order.id} className="order-item">
                  <p>Order ID: {order.id}</p>
                  <p>Product: {order.productName}</p>
                  <p>Quantity: {order.quantity}</p>
                  <button onClick={() => handleAcceptOrder(order.id)}>Accept</button>
                  <button onClick={() => handleRejectOrder(order.id)}>Reject</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default PendingOrders;
