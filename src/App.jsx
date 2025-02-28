import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import BrandScroller from './components/BrandScroller';
import CategoryGrid from './components/Category';
import Header from './components/Header';
import Nav from './components/Nav';
import ProductGrid from './components/ProductGrid';
import Scroll from './components/Scroll';
import './components/Style.css';
import RoleBasedComponent from './RoleBasedComponents';

function App() {
  return (
    <ChakraProvider>
      <Header />
      <Nav />
      <Scroll />
      <div className="fixed-buttons">
        <RoleBasedComponent allowedRoles={['admin', 'employee']}>
          <Link to='/addproduct'>
            <button className="futuristic-button add-product">
              <span className="button-content">
                <span className="button-icon">+</span>
                <span className="button-text">Add Products</span>
              </span>
            </button>
          </Link>
        </RoleBasedComponent>
        <RoleBasedComponent allowedRoles={['admin']}>
          <Link to='/admin-dashboard'>
            <button className="futuristic-button admin-tools">
              <span className="button-content">
                <span className="button-icon">⚙</span>
                <span className="button-text">Admin Tools</span>
              </span>
            </button>
          </Link>
        </RoleBasedComponent>
      </div>
      <BrandScroller />
      <CategoryGrid />
      <ProductGrid />
    </ChakraProvider>
  )
}

export default App