import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PendingOrders.css';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";

function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    // Fetch pending orders from backend
    const fetchPendingOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await axios.get(`${URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPendingOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching pending orders', error);
      }
    };

    fetchPendingOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${URL}/order/${orderId}`, 
      { status }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the processed order from the list
      setPendingOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error(`Error updating order status to ${status}`, error);
    }
  };

  return (
    <div className="pending-orders">
      <h2>Pending Orders</h2>
      {pendingOrders.length === 0 ? (
        <p>No pending orders</p>
      ) : (
        pendingOrders.map(order => (
          <div key={order._id} className="order">
            <h3>Order ID: {order._id}</h3>
            <p>User ID: {order.userId}</p>
            <p>Total Price: {order.totalPrice}</p>
            <p>Total Items: {order.totalItems}</p>
            <ul>
              {order.items.map(item => (
                <li key={item._id} className="order-item">
                  <div className="order-item-details" style={{color:'black'}}>
                    <h3>{item.productId.article}</h3>
                    <p>Brand: {item.productId.brand}</p>
                    <p>Price: ₹{item.price}</p>
                    <p>Color: {item.color}</p>
                    <span>Item set: {item.itemSet && item.itemSet.length > 0 
                      ? item.itemSet.map(item => `${item.size} (Pcs: ${item.lengths})`).join(', ') 
                      : "N/A"}</span><br />
                    <span>Quantity: {item.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={() => updateOrderStatus(order._id, 'accepted')}>Accept</button>
            <button onClick={() => updateOrderStatus(order._id, 'rejected')}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}

export default PendingOrders;
