// src/Liked.js
import React, { useState, useEffect } from 'react';
import './Cart.css';

const Liked = () => {
  const [Liked, setLiked] = useState(() => {
    // Get cart data from local storage
    const savedLiked = localStorage.getItem('Liked');
    return savedLiked ? JSON.parse(savedLiked) : [];
  });

  useEffect(() => {
    localStorage.setItem('Liked', JSON.stringify(Liked));
    // Notify subscribers (e.g., Header) about the change
    window.dispatchEvent(new Event('Liked-updated'));
}, [Liked]);

  const removeFromLiked = (index) => {
    // Create a new cart array excluding the item at the specified index
    const updatedLiked = Liked.filter((_, i) => i !== index);
    setLiked(updatedLiked);
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      {Liked.length === 0 ? (
        <p>No liked product</p>
      ) : (
        <ul>
          {Liked.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Brand: {item.brand}</p>
                <p>Price: ₹{item.discountedPrice}</p>
                <p>Sizes: {item.sizes.join(', ')}</p>
                <button className="remove-button" onClick={() => removeFromLiked(index)}>
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

export default Liked;
