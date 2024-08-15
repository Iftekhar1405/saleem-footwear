import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AcceptedOrders.css';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";

function AcceptedOrders() {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all orders and filter by status 'accepted'
    const fetchAcceptedOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status >= 200 && response.status < 300) {
          // Filter orders with status 'accepted'
          const filteredOrders = response.data.data.filter(order => order.status === 'accepted');
          setAcceptedOrders(filteredOrders);
        } else {
          console.error('Unexpected response status:', response.status);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching accepted orders', error);
        setLoading(false);
      }
    };

    fetchAcceptedOrders();
    
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
      
      // Check if the response status indicates success
      if (response.status >= 200 && response.status < 300) {
        console.log('Order status updated successfully:', response.data);
  
        // Optionally, display a success message to the user
        alert('Order status updated successfully');
        
        // Update the state to remove the rejected order from the accepted list
        if (status === 'rejected') {
          setAcceptedOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        }
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error(`Error updating order status to ${status}`, error);
    }
  };

  if (loading) {
    return <h2>Loading .....</h2>;
  }

  return (
    <div className="accepted-orders">
      <h2>Accepted Orders</h2>
      {acceptedOrders.length === 0 ? (
        <p>No accepted orders</p>
      ) : (
        acceptedOrders.map(order => (
          <div key={order._id} className="order">
            <h3>Order ID: {order._id}</h3>
            <p>Total Price: {order.totalPrice}</p>
            <p>Total Items: {order.totalItems}</p>
            {order.items.map(item => (
              <div key={item.productId._id} className="order-item">
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
              </div>
            ))}
            <button onClick={() => updateOrderStatus(order._id, 'rejected')}>Reject Order</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AcceptedOrders;
