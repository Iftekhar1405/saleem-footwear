import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderSummary = () => {
  const location = useLocation();
  const { order } = location.state || {}; // Access the passed order data
  console.log(order)
  if (!order) {
    return <p>No order details found. Please go back and try again.</p>;
  }

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <p>Order ID: {order._id}</p>
      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index} className="order-item">
            {/* <img src={item.productId.images[0]} alt={item.productId.name} /> */}
            <div className="order-item-details">
              {/* <h3>{item.productId.name}</h3> */}
              {/* <p>Brand: {item.productId.brand}</p> */}
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
              <p>Color: {item.color}</p>
              <span>Item set: {item.itemSet && item.itemSet.length > 0 
                ? item.itemSet.map(setItem => `${setItem.size} (Pcs: ${setItem.lengths})`).join(', ') 
                : "N/A"}</span>
            </div>
          </li>
        ))}
      </ul>
      <h3>Total Amount: ₹{order.totalPrice}</h3>
      <h3>Total Items: {order.totalItems}</h3>
      <button onClick={() => window.print()}>Print Summary</button>
    </div>
  );
};

export default OrderSummary;
