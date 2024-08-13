import React, { useState, useEffect } from 'react';
import './Cart.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:7000/api/v1";
const token = localStorage.getItem('token');

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

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
      setCart(cart.filter(item => item._id !== CartItemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handlePdfDownload = () => {
    if (cart.length > 0) {
      const input = document.querySelector('.cart');
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

  const handleOrderNow = async () => {
    if (cart.length > 0) {
      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const orderData = {
          items: cart.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
          }))
        };

        const response = await axios.post(`${URL}/orders`, orderData, { headers });
        alert('Order placed successfully!');
        setCart([]); // Clear the cart after successful order
        navigate('/order-summary', { state: { order: response.data.data } }); // Navigate to Order Summary
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      }
    } else {
      alert('Your cart is empty.');
    }
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      <button onClick={handlePdfDownload}>Download your Cart</button>
      <button onClick={deleteCart}>Delete your Cart</button>
      <button onClick={handleOrderNow} style={{width:'100%'}}>Order Now</button>
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
                <button className="remove-button" onClick={() => removeItem(item._id)}>
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
