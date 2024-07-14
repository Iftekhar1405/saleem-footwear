import React from 'react';

function Carts({ cart, removeFromCart }) {
  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.length === 0 ? (
          <li>Cart is empty</li>
        ) : (
          cart.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
             <button onClick={() => removeFromCart(product.id)}>Remove</button>
             </li>
           
          ))
        )}
      </ul>
    </div>
  );
}

export default Carts;
