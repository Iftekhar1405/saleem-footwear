// src/Cart.js
import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(() => {
    // Get cart data from local storage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Notify subscribers (e.g., Header) about the change
    window.dispatchEvent(new Event('cart-updated'));
}, [cart]);

  const removeFromCart = (index) => {
    // Create a new cart array excluding the item at the specified index
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Brand: {item.brand}</p>
                <p>Price: ₹{item.discountedPrice}</p>
                <p>Sizes: {item.sizes.join(', ')}</p>
                <button className="remove-button" onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
