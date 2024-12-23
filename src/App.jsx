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
            <button className="addproduct" style={{margin:'10px'}}>+ Add Products</button>
          </Link>
        </RoleBasedComponent>
        <RoleBasedComponent allowedRoles={['admin']}>
          <Link to='/admin-dashboard'>
            <button className="admin-tools" style={{margin:'10px'}}>Admin Tools</button>
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

