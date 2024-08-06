import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import Cart from './components/Cart.jsx';
import Liked from './components/Liked.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Prelogin from './components/Prelogin.jsx';
import ProductCard from './components/ProductCard.jsx';
import Profile from './components/Profile.jsx';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoutes.jsx';
import AllEmployees from './components/Admin/AllEmployees.jsx'
import AllCustomers from './components/Admin/AllCustomers.jsx'
import AcceptedOrders from './components/Admin/AcceptedOrders.jsx'
import PendingOrders from './components/Admin/PendingOrders.jsx'
import RejectedOrders from './components/Admin/RejectedOrders.jsx'
import AddProduct from './components/Authority/AddProduct.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="product/:id" element={<ProtectedRoute element={<ProductCard />} />} />
      <Route path="profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="" element={<ProtectedRoute element={<App />} />} />
      <Route path="cart" element={<ProtectedRoute element={<Cart />} />} />
      <Route path="liked" element={<ProtectedRoute element={<Liked />} />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="prelogin" element={<Prelogin />} />
      <Route path="admin-dashboard" element={
      <RoleBasedRoute allowedRoles={'admin'}>
        < AdminDashboard/> {/* This route is only accessible by admins */}
      </RoleBasedRoute>
      } />
      <Route path="employees" element={
      <RoleBasedRoute allowedRoles={['admin']}>
        <AllEmployees /> {/* This route is only accessible by admins */}
      </RoleBasedRoute>
      } />
      <Route path="customers" element={
      <RoleBasedRoute allowedRoles={['admin']}>
        <AllCustomers /> {/* This route is only accessible by admins */}
      </RoleBasedRoute>
      } />
      <Route path="accepted-orders" element={
      <RoleBasedRoute allowedRoles={['admin']}>
        <AcceptedOrders /> {/* This route is only accessible by admins */}
      </RoleBasedRoute>
      } />
      <Route path="pending-orders" element={
      <RoleBasedRoute allowedRoles={['admin']}>
        <PendingOrders /> {/* This route is only accessible by admins */}
      </RoleBasedRoute>
      } />
       <Route path="rejected-orders" element={
      <RoleBasedRoute allowedRoles={['admin']}>
        <RejectedOrders /> {/* This route is only accessible by admins */}
      </RoleBasedRoute>
      } />
      

    <Route path="addproduct" element={
      <RoleBasedRoute allowedRoles={['admin', 'employee']}>
      <AddProduct /> 
    </RoleBasedRoute>
    } />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>,
);
