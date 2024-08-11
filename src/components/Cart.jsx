import React, { useState, useEffect } from 'react';
import './Cart.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const URL = "http://localhost:7000/api/v1";
const token = localStorage.getItem('token');

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`${URL}/cart`, { headers });
        setCart(response.data.data.items || []); // Ensure cart is an array
        console.log(response)
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setCart([]); // Ensure cart is an array on error
      }
    };

    fetchCart();
  }, []);

  const removeItem = async (CartItemId) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      await axios.delete(`${URL}/cart/${CartItemId}`, { headers });
      // Remove item from the local state
      setCart(cart.filter(item => item.id !== CartItemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handlePdfDownload = () => {
    if (cart.length > 0) {
      const input = document.querySelector('.cart');
  
      // Change text color to black
      const originalColor = input.style.color;
      input.style.color = 'black';
  
      html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('Cart.pdf');
  
        // Revert text color back to original
        input.style.color = originalColor;
      });
    }
  };

  const deleteCart = async () => {
    if (cart.length > 0) {
      const confirmDeletion = window.confirm('Are you sure you want to delete your cart?');
  
      if (confirmDeletion) {
        try {
          const headers = {
            'Authorization': `Bearer ${token}`
          };
          await axios.delete(`${URL}/cart`, { headers });
          setCart([]);
        } catch (error) {
          console.error('Error deleting cart:', error);
        }
      }
    }
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      <button onClick={handlePdfDownload}>Download your Cart</button>
      <button onClick={deleteCart}>Delete your Cart</button>
      {Array.isArray(cart) && cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
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
        </ul>
      )}
    </div>
  );
};

export default Cart;
