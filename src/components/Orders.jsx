import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductCard.css'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.get(
          'https://saleem-footwear-api.vercel.app/api/v1/order/history',
          { headers }
        );
        console.log(response);
        setOrders(response.data.data || []); // Set orders directly from response
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post(
        `https://saleem-footwear-api.vercel.app/api/v1/order/cancel/${orderId}`,
        {},
        { headers }
      );
      // Update the orders list after cancellation
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      alert('Order canceled successfully');
    } catch (err) {
      console.error('Error canceling order:', err);
      alert('Failed to cancel the order');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || orders.length === 0) {
    return <div>Error: No recent orders found</div>;
  }

  return (
    <div>
      <h2>Your Past Orders</h2>
      <div className="orders-container">
        {orders.map((order) => (
          <div key={order._id} className="order-card" style={{padding:'20px'}}>
            <h3>Order ID: {order._id}</h3>
            <p>Status: {order.status}</p>
            <p>Total Price: ₹{order.totalPrice}</p>
            <p>Total Items: {order.totalItems}</p>
            <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Customer: {order.userId.name}</p>
            <div className="order-items">
              <h4>Items:</h4>
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className="order-item-image"
                      style={{height:'180px'}}
                    />
                    <div className="order-item-details">
                      <p>Product: {item.productId.name}</p>
                      <p>Brand: {item.productId.brand}</p>
                      <p>Color: {item.color}</p>
                      <p>Price: ₹{item.productId.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Cancel Order Section */}
            {order.status === 'pending' ? (
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="cancel-button"
              >
                Cancel Order
              </button>
            ) : (
              <p className="non-cancellable">Can't cancel, order already accepted</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
