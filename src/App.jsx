
import Carts from './components/Cart'
import {BrowserRouter,Route,Router} from 'react-router-dom'
import { useState } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import Scroll from './components/Scroll';
import ProductGrid from './components/ProductGrid';


function App() {

  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(true);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(product => product.id !== productId));
  };

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };
  
  return (
    <>
      <Header cart={cart} toggleCartVisibility={toggleCartVisibility}/>
        <Nav/>
        <Scroll/>
        <ProductGrid />
        {isCartVisible && <Carts cart={cart} removeFromCart={removeFromCart}/>}
    </>
      
  )
}

export default App

