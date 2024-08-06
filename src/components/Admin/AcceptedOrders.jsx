import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AcceptedOrders.css';

function AcceptedOrders() {
  const [acceptedOrders, setAcceptedOrders] = useState({});

  useEffect(() => {
    // Fetch accepted orders from backend
    const fetchAcceptedOrders = async () => {
      try {
        const response = await axios.get('https://your-backend-url.com/api/accepted-orders');
        const groupedOrders = groupByCustomer(response.data);
        setAcceptedOrders(groupedOrders);
      } catch (error) {
        console.error('Error fetching accepted orders', error);
      }
    };

    fetchAcceptedOrders();
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

  const handleViewOrderDetails = (orderId) => {
    // Logic to view order details
    console.log(`View details for order ${orderId}`);
    // You can navigate to a details page or open a modal with order details
  };

  return (
    <div className="accepted-orders">
      <h2>Accepted Orders</h2>
      {Object.keys(acceptedOrders).length === 0 ? (
        <p>No accepted orders</p>
      ) : (
        Object.keys(acceptedOrders).map(customerId => (
          <div key={customerId} className="customer-orders">
            <h3>Customer ID: {customerId}</h3>
            <ul>
              {acceptedOrders[customerId].map(order => (
                <li key={order.id} className="order-item">
                  <p>Order ID: {order.id}</p>
                  <p>Product: {order.productName}</p>
                  <p>Quantity: {order.quantity}</p>
                  <button onClick={() => handleViewOrderDetails(order.id)}>View Details</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default AcceptedOrders;
