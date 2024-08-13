import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/v1/orders'); // Replace with your actual backend endpoint
        setOrders(response.data.data.items||[]);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Your Past Orders</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="orders-container">
          {orders.map((item) => (
            <li key={index} className="cart-item">
            <img src={item.productId.images[0]} alt={item.name} />
            <div className="cart-item-details">
              <h3>{item.productId.name}</h3>
              <p>Brand: {item.productId.brand}</p>
              <p>Price: ₹{item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button className="remove-button" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
