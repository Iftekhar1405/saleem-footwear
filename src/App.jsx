
import Carts from './components/Cart'
import {BrowserRouter,Route,Router} from 'react-router-dom'
import { useState } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import Scroll from './components/Scroll';
import ProductGrid from './components/ProductGrid';
import CategoryGrid from './components/Category';
import SearchBar from './components/SearchBar';
import BrandScroller from './components/BrandScroller';



function App() {



  
 

  
  return (
    <>
      <Header />
        <Nav/>
        <SearchBar/>
        <Scroll/>
        <BrandScroller/>
        <CategoryGrid/>
        <ProductGrid />
    </>
      
  )
}

export default App

