import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RejectedOrders.css';

function RejectedOrders() {
  const [rejectedOrders, setRejectedOrders] = useState({});

  useEffect(() => {
    // Fetch rejected orders from backend
    const fetchRejectedOrders = async () => {
      try {
        const response = await axios.get('https://your-backend-url.com/api/rejected-orders');
        const groupedOrders = groupByCustomer(response.data);
        setRejectedOrders(groupedOrders);
      } catch (error) {
        console.error('Error fetching rejected orders', error);
      }
    };

    fetchRejectedOrders();
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

  const handleReviewOrder = (orderId) => {
    // Logic to review or manage the rejected order
    console.log(`Review rejected order ${orderId}`);
    // You can navigate to a review page or open a modal with order details
  };

  return (
    <div className="rejected-orders">
      <h2>Rejected Orders</h2>
      {Object.keys(rejectedOrders).length === 0 ? (
        <p>No rejected orders</p>
      ) : (
        Object.keys(rejectedOrders).map(customerId => (
          <div key={customerId} className="customer-orders">
            <h3>Customer ID: {customerId}</h3>
            <ul>
              {rejectedOrders[customerId].map(order => (
                <li key={order.id} className="order-item">
                  <p>Order ID: {order.id}</p>
                  <p>Product: {order.productName}</p>
                  <p>Quantity: {order.quantity}</p>
                  <button onClick={() => handleReviewOrder(order.id)}>Review</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default RejectedOrders;
