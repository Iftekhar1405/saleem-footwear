import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {}; // Access the passed order data

  if (!order) {
    return <p>No order details found. Please go back and try again.</p>;
    
  }

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://your-backend-url/api/v1/orders/${order._id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert('Order has been canceled.');
        navigate('/orders'); // Redirect to the orders page or another appropriate page
      } else {
        alert('Failed to cancel order.');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('An error occurred while canceling the order.');
    }
  };
  console.log(order)
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <p>Order ID: {order._id}</p>
      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      <div>
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="order-item-details">
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
              <p>Color: {item.color}</p>
              <span>
                Item set:{' '}
                {item.itemSet && item.itemSet.length > 0
                  ? item.itemSet
                      .map(
                        (setItem) =>
                          `${setItem.size} (Pcs: ${setItem.lengths})`
                      )
                      .join(', ')
                  : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
      <h3>Total Amount: ₹{order.totalPrice}</h3>
      <h3>Total Items: {order.totalItems}</h3>
      <button onClick={() => window.print()}>Print Summary</button>
      <button onClick={handleCancelOrder} className="cancel-button">
        Cancel Order
      </button>
    </div>
  );
};

export default OrderSummary;
