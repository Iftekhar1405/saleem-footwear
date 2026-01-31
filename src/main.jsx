/**
 * Main Entry Point
 * 
 * @description
 * Application entry point that sets up routing and renders the root component.
 * Uses React Router for client-side routing and Chakra UI for component library.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Main App Component
import App from "./App.jsx";

// Styles
import "./index.css";

// Layout Components
import { Layout } from "./components/layout";

// Auth Components
import { Login, Register, Prelogin } from "./components/auth";

// Product Components
import { ProductCard, Cart } from "./components/product";

// User Components
import { Profile, Orders, OrderSummary } from "./components/user";

// Common Components
import { SearchBar } from "./components/common";

// Admin Components
import {
  AllCustomers,
  AcceptedOrders,
  PendingOrders,
  RejectedOrders,
  AdminDashboard,
} from "./components/Admin";

// Authority Components
import { AddProduct, ProductGridAuth } from "./components/Authority";

// Page Components
import {
  ContactUs,
  PDFViewer,
  TermsAndConditions,
  PrivacyPolicy,
  Explore,
} from "./pages";

// Other Components
import CategorizedProducts from "./components/product/CategorizedProducts.jsx";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoutes.jsx";

/**
 * Router Configuration
 * Defines all application routes with their corresponding components and protection levels
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="product/:id" element={<ProductCard />} />
      <Route
        path="profile"
        element={<ProtectedRoute element={<Profile />} />}
      />
      <Route path="" element={<App />} />
      <Route path="cart" element={<ProtectedRoute element={<Cart />} />} />
      <Route path="catelog" element={<PDFViewer />} />
      <Route path="orders" element={<ProtectedRoute element={<Orders />} />} />
      <Route
        path="profile"
        element={<ProtectedRoute element={<Profile />} />}
      />
      <Route
        path="order-summary"
        element={<ProtectedRoute element={<OrderSummary />} />}
      />
      <Route path="search" element={<SearchBar />} />
      <Route path="explore" element={<Explore />} />
      <Route path="category-grid/:category" element={<CategorizedProducts />} />
      <Route path="login" element={<Login />} />
      <Route path="contact-us" element={<ContactUs />} />
      <Route path="terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="register" element={<Register />} />
      <Route path="prelogin" element={<Prelogin />} />
      <Route
        path="admin-dashboard"
        element={
          <RoleBasedRoute allowedRoles={"admin"}>
            <AdminDashboard /> {/* This route is only accessible by admins */}
          </RoleBasedRoute>
        }
      />

      <Route
        path="customers"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AllCustomers /> {/* This route is only accessible by admins */}
          </RoleBasedRoute>
        }
      />
      <Route
        path="accepted-orders"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AcceptedOrders /> {/* This route is only accessible by admins */}
          </RoleBasedRoute>
        }
      />
      <Route
        path="edit-products"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ProductGridAuth /> {/* This route is only accessible by admins */}
          </RoleBasedRoute>
        }
      />

      <Route
        path="pending-orders"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <PendingOrders /> {/* This route is only accessible by admins */}
          </RoleBasedRoute>
        }
      />
      <Route
        path="rejected-orders"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <RejectedOrders /> {/* This route is only accessible by admins */}
          </RoleBasedRoute>
        }
      />

      <Route
        path="addproduct"
        element={
          <RoleBasedRoute allowedRoles={["admin", "employee"]}>
            <AddProduct />
          </RoleBasedRoute>
        }
      />
    </Route>
  )
);

/**
 * Render Application
 * Wraps the router in ChakraProvider for UI components
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);

