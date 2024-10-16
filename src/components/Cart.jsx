import React, { useState, useEffect } from 'react';
import './Cart.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL = "https://saleem-footwear-api.vercel.app/api/v1";
const token = localStorage.getItem('token');

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantityChanges, setQuantityChanges] = useState({}); // Track quantity changes

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`${URL}/cart`, { headers });
        const cartData = response.data.data.items || [];
        console.log(response)

        // Calculate total price based on itemSet lengths
        const calculatedTotalPrice = cartData.reduce((acc, item) => {
          const fullQuantity = item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);
          return acc + (fullQuantity * item.productId.price);
        }, 0);

        setUserId(response.data.data.userId);
        setTotalItems(response.data.data.totalItems);
        setTotalPrice(calculatedTotalPrice);
        setCart(cartData);
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
      window.dispatchEvent(new Event('cart-updated'));

    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleQuantityChange = (CartItemId, increment) => {
    const cartItem = cart.find(item => item._id === CartItemId);
    const itemSetLength = cartItem.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);

    const newQuantity = (quantityChanges[CartItemId] ?? itemSetLength) + increment * itemSetLength;

    if (newQuantity < itemSetLength) return; // Prevent going below the total length of the itemSet

    // Update the local state to track quantity changes
    setQuantityChanges(prev => ({
      ...prev,
      [CartItemId]: newQuantity
    }));
  };
  const updateCartSummary = (updatedCart) => {
    const calculatedTotalPrice = updatedCart.reduce((acc, item) => {
      const fullQuantity = item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);
      return acc + (fullQuantity * item.productId.price);
    }, 0);
  
    const calculatedTotalItems = updatedCart.reduce((acc, item) => {
      const fullQuantity = item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);
      return acc + fullQuantity;
    }, 0);
  
    // Update total price and total items
    setTotalPrice(calculatedTotalPrice);
    setTotalItems(calculatedTotalItems);
  };
  const updateQuantity = async (CartItemId) => {
    const newQuantity = quantityChanges[CartItemId];
  
    if (!newQuantity) return;
  
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      await axios.patch(
        `${URL}/cart/${CartItemId}`,
        { quantity: newQuantity }, 
        { headers }
      );
  
      const updatedCart = cart.map(item =>
        item._id === CartItemId ? { ...item, quantity: newQuantity } : item
      );
  
      // Setting cart with a new array reference
      setCart([...updatedCart]);
  
      // Recalculate total price and items
      updateCartSummary(updatedCart);
      
  
      // Clear tracked change for this CartItemId
      setQuantityChanges(prev => {
        const updatedChanges = { ...prev };
        delete updatedChanges[CartItemId];
        return updatedChanges;
      });
  
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };
  useEffect(() => {
    console.log('Cart updated:', cart);
  }, [cart]);
    
  
  
  

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

  const handleOrderNow = async () => {
    let confirm = window.confirm(`Are you sure to place this order worth of ₹${totalPrice}`);
    if (confirm) {
      if (cart.length > 0) {
        try {
          const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          };

          const orderData = {
            userId: userId,
            items: cart.map(item => ({
              productId: item.productId._id,
              quantity: item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0),
              price: item.productId.price,
              itemSet: item.itemSet, // Including itemSet details
              color: item.color, // Including color if needed
            })),
            totalPrice: totalPrice,
            totalItems: totalItems,
          };

          const response = await axios.post(`${URL}/order`, orderData, { headers });
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
    }
  };
  let quantity = function(item,fullQuantity){
    let quantity
    if(item.quantity === 1) quantity =  fullQuantity
    else{
      quantity =  item.quantity - 1  
    }
    
    
    return quantity
  } 
  

  return (
    <div className="cart">
      <h2>Cart</h2>
      <h2>Total Cost: ₹{totalPrice}</h2>
      <button onClick={handlePdfDownload}>Download your Cart</button>
      <button onClick={handleOrderNow} style={{ width: '100%' }}>Order Now</button>
      {Array.isArray(cart) && cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item, index) => {
            const fullQuantity = item.itemSet.reduce((sum, setItem) => sum + setItem.lengths, 0);
            const itemTotalPrice = fullQuantity * item.productId.price;

            return (
              <div key={index} className="cart-item">
                <div className="cart-item-details">
                  <div>
                    <img src={item.productId.images[0]} alt={item.name} style={{ verticalAlign: 'middle' }} />
                  </div>
                  <div>
                    <h3>{item.productId.name}</h3>
                    <p>Brand: {item.productId.brand}</p>
                    <p style={{ color: "rgb(221, 32, 44)" }}>Price per Unit: ₹{item.productId.price}</p>
                  </div>
                </div>
                <div className='rest-details'>
                  <div>
                    <span>Item set: {item.itemSet && item.itemSet.length > 0
                      ? item.itemSet.map(setItem => `${setItem.size} (Pcs: ${setItem.lengths})`).join(', ')
                      : "N/A"}</span><br />
                    <span>Quantity: {quantity(item,fullQuantity)}</span><br />
                    <span style={{ color: "rgb(221, 32, 44)" }}>Total Price: ₹{itemTotalPrice}</span>
                  </div>

                  {/* Quantity Control Buttons */}
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                    <span>{quantityChanges[item._id] ?? fullQuantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, 1)} style={{ marginLeft: '10px' }}>+</button>
                    <button onClick={() => updateQuantity(item._id)}>Confirm</button>
                  </div>


                  <button className="remove-button" onClick={() => removeItem(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;
