import React, { useEffect, useState } from 'react';
import axios from 'axios';

// const getOrderHistory = () => {
//   try {
//     const token = localStorage.getItem('token');
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   } catch (error) {
    
//   }
// }

// const axios = require('axios');
let data = JSON.stringify({
  "userId": ""
});

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://saleem-footwear-api.vercel.app/api/v1/order/history',
  headers: { 
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9obiIsInVzZXJJZCI6IjY2YmRhNWQyOWU5MjdjN2Y3YThkYzFiMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI0MTc4NDM0LCJleHAiOjE3MjY3NzA0MzR9.4_ouk6bMv07xgn2P5k-4F5rLzbzCeu9RO-HxmOlrTPY', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log((response.data));
})
.catch((error) => {
  console.log(error);
});





















const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const response = await axios.get('https://saleem-footwear-api.vercel.app/api/v1/order/history', { headers });
        console.log(response.data.data.items)
        setOrders(response.data.data.items || []);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: No recent order found</div>;
  }

  return (
    <div>
      <h2>Your Past Orders</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="orders-container">
          {orders.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.productId.images[0]} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.productId.name}</h3>
                <p>Brand: {item.productId.brand}</p>
                <p>Price: ₹{item.productId.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
