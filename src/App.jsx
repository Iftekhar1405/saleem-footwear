
import Carts from './components/Cart'
import {BrowserRouter,Route,Router} from 'react-router-dom'
import { useState } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import Scroll from './components/Scroll';
import ProductGrid from './components/ProductGrid';



function App() {



  
  const removeFromCart = (productId) => {
    setCart(cart.filter(product => product.id !== productId));
  };

  
  return (
    <>
      <Header />
        <Nav/>
        <Scroll/>
        <ProductGrid />
    </>
      
  )
}

export default App

