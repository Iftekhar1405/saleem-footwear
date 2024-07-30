import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import Cart from './components/Cart.jsx'
import Liked from './components/Liked.jsx'
import Login from './components/Login.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element ={<Layout/>}>
      <Route path='' element={<App/>}/>
      <Route path='cart' element={<Cart/>}/>
      <Route path='liked' element={<Liked/>}/>
      <Route path='login' element={<Login/>}/>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router}/>
  // </React.StrictMode>,
)
