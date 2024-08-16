import RoleBasedComponent from './RoleBasedComponents';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';
import Scroll from './components/Scroll';
import ProductGrid from './components/ProductGrid';
import CategoryGrid from './components/Category';
import SearchBar from './components/SearchBar';
import BrandScroller from './components/BrandScroller';
import './components/Style.css'



function App() {







  return (
    <>
      <Header />
      <Nav />
      <Scroll />
      <div className="fixed-buttons">
        <RoleBasedComponent allowedRoles={['admin', 'employee']}>
          <Link to='/addproduct'>
            <button className="addproduct">+ Add Products</button>
          </Link>
        </RoleBasedComponent>
        <RoleBasedComponent allowedRoles={['admin']}>
          <Link to='/admin-dashboard'>
            <button className="admin-tools">Admin Tools</button>
          </Link>
        </RoleBasedComponent>
      </div>
      <BrandScroller />
      <CategoryGrid />
      <ProductGrid />
     
    </>

  )
}

export default App

