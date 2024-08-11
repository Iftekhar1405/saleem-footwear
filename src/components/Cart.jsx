// src/Cart.js
import React, { useState, useEffect } from 'react';
import './Cart.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios'

const URL = "http://localhost:7000/api/v1";
const token = localStorage.getItem('token')
const addTOCart = async (body) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(`${URL}/cart/add-to-cart`, body, {headers} )
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log(error)
  }
}


const cartBody =
  {   productId: "66ae03b57fe12df8e998e449",
    quantity: 3,
    itemSet: [{
        size:"UK-12",
        lengths: 4
    }],
    color : "red"
    }

// addTOCart(cartBody)

const getCart = async () => {
  try {
    const URL = "http://localhost:7000/api/v1";
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${URL}/cart`, {headers})
    console.log(response.data);
    
  } catch (error) {
    console.log(error)
  }
}
getCart()

  const removeItem = async(CartItemId) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      const response = await axios.delete(`${URL}/cart/${CartItemId}`, {headers})
      if(response){
        console.log(response.data);
      }else{
        console.log(response);
        
      }
      
    } catch (error) {
    console.log(error);
    
  }
}
// removeItem("66b7d58ee4bd0de2d6f0d88b")

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
  const handlePdfDownload = () => {
    if(cart.length >0){
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
  }};
  const deleteCart = () => {
    if(cart.length > 0){
    const confirmDeletion = window.confirm('Are you sure you want to delete your cart?');
  
    if (confirmDeletion) {
      localStorage.removeItem('cart');
      setCart([]); 
    }}
  };
  

  return (
    <div className="cart">
      <h2>Cart</h2>
      <button onClick={handlePdfDownload}>Download your Cart</button>
      <button onClick={deleteCart}>Delete your Cart</button>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.images} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Brand: {item.brand}</p>
                <p>Price: ₹{item.price - item.discount * (item.price / 100)}</p>
                <p>Quantity: {item.quantity}</p>
                {/* <p>Sizes: {item.sizes.join(', ')}</p> */}
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
