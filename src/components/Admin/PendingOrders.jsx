import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PendingOrders.css';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";

function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        
        if (response.status >= 200 && response.status < 300) {
          const filteredOrders = response.data.data.filter(order => order.status === 'pending');
          setPendingOrders(filteredOrders);
        } else {
          console.error('Unexpected response status:', response.status);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pending orders', error);
        setLoading(false);
      }
    };

    fetchPendingOrders();
    
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${URL}/order/status/${orderId}`, 
      { status }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status >= 200 && response.status < 300) {
        console.log('Order status updated successfully:', response.data);
        alert('Order status updated successfully');
        
        setPendingOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      } else {
        alert('Unexpected response status:', response.status);
      }
    } catch (error) {
      alert(`Error updating order status to ${status}`, error);
    }
  };

  if (loading) {
    return <h2>Loading .....</h2>;
  }

  return (
    <div className="pending-orders">
      <h2>Pending Orders</h2>
      {pendingOrders.length === 0 ? (
        <p>No pending orders</p>
      ) : (
        pendingOrders.map(order => (
          <div key={order._id} className="order">
            <h3>Order ID: {order._id}</h3>
            <p>Total Price: {order.totalPrice}</p>
            <p>Total Items: {order.totalItems}</p>

            {/* Displaying User Info */}
            <div className="customer-info" style={{color: 'black'}}>
              <h4>Customer Info:</h4>
              <p>User ID: {order.userId?._id || 'null'}</p>
              <p>Name: {order.userId?.name || 'null'}</p>
              <p>Address: {order.userId?.address || 'null'}</p>
            </div>

            {order.items.map(item => (
              <div key={item.productId?item.productId._id:""} className="order-item">
                <div className="order-item-details" style={{color:'black'}}>
                  {item.productId?(<><h3>{item.productId.article}</h3>
                  <p>Brand: {item.productId.brand}</p></>):"N/A"}
                  <p>Price: ₹{item.price}</p>
                  <p>Color: {item.color}</p>
                  <span>Item set: {item.itemSet && item.itemSet.length > 0 
                    ? item.itemSet.map(item => `${item.size} (Pcs: ${item.lengths})`).join(', ') 
                    : "N/A"}</span><br />
                  <span>Quantity: {item.quantity}</span>
                </div>
              </div>
            ))}
            <button onClick={() => updateOrderStatus(order._id, 'accepted')}>Accept - All</button>
            <button onClick={() => updateOrderStatus(order._id, 'rejected')}>Reject - All</button>
          </div>
        ))
      )}
    </div>
  );
}

export default PendingOrders;
