
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
  const products = [
    {
        id: 1,
        image: 'https://paragonfootwear.com/cdn/shop/products/K1221G_BLK_1.jpg?crop=center&height=1200&v=1697017828&width=1000',
        name: 'Product 1',
        brand: 'Brand A',
        gender: 'Unisex',
        mrp: 1000,
        discountPercentage: 20,
        discountedPrice: 800,
        sizes: [6, 7, 8, 9, 10],
    },
    {
        id: 2,
        image: 'https://paragonfootwear.com/cdn/shop/products/K1221G_BLK_1.jpg?crop=center&height=1200&v=1697017828&width=1000',
        name: 'Product 2',
        brand: 'Brand B',
        gender: 'Female',
        mrp: 1200,
        discountPercentage: 15,
        discountedPrice: 1020,
        sizes: [6, 7, 8, 9, 10],
    },
    {
        id: 3,
        image: 'https://paragonfootwear.com/cdn/shop/products/K1221G_BLK_1.jpg?crop=center&height=1200&v=1697017828&width=1000',
        name: 'Product 3',
        brand: 'Brand C',
        gender: 'Male',
        mrp: 800,
        discountPercentage: 10,
        discountedPrice: 720,
        sizes: [6, 7, 8, 9, 10],
    },
    {
        id: 4,
        image: 'https://paragonfootwear.com/cdn/shop/products/K1221G_BLK_1.jpg?crop=center&height=1200&v=1697017828&width=1000',
        name: 'Product 4',
        brand: 'Brand D',
        gender: 'Female',
        mrp: 1500,
        discountPercentage: 25,
        discountedPrice: 1125,
        sizes: [6, 7, 8, 9, 10],
    },
    {
        id: 5,
        image: 'https://paragonfootwear.com/cdn/shop/products/K1221G_BLK_1.jpg?crop=center&height=1200&v=1697017828&width=1000',
        name: 'Product 5',
        brand: 'Brand E',
        gender: 'Unisex',
        mrp: 900,
        discountPercentage: 30,
        discountedPrice: 630,
        sizes: [6, 7, 8, 9, 10],
    },
    {
        id: 6,
        image: 'https://paragonfootwear.com/cdn/shop/products/K1221G_BLK_1.jpg?crop=center&height=1200&v=1697017828&width=1000',
        name: 'Product 6',
        brand: 'Brand F',
        gender: 'Male',
        mrp: 1100,
        discountPercentage: 18,
        discountedPrice: 902,
        sizes: [6, 7, 8, 9, 10],
    },
  ];
  return (
    <>
      <Header cart={cart} toggleCartVisibility={toggleCartVisibility}/>
        <Nav/>
        <Scroll/>
        <ProductGrid products={products}  addToCart={addToCart} />
        {isCartVisible && <Carts cart={cart} removeFromCart={removeFromCart}/>}
    </>
      
  )
}

export default App

