import React from 'react';

const OrderSummary = ({ order }) => {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <p>Order ID: {order._id}</p>
      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index} className="order-item">
            <img src={item.productId.images[0]} alt={item.productId.name} />
            <div className="order-item-details">
              <h3>{item.productId.name}</h3>
              <p>Brand: {item.productId.brand}</p>
              <p>Price: ₹{item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ₹{item.productId.price * item.quantity}</p>
            </div>
          </li>
        ))}
      </ul>
      <h3>Total Amount: ₹{order.totalAmount}</h3>
      <button onClick={() => window.print()}>Print Summary</button>
    </div>
  );
};

export default OrderSummary;
