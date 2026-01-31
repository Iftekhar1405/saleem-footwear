/**
 * App Component - Main Application Home Page
 * 
 * @description
 * The main landing page component that displays the home page with navigation,
 * product categories, product grid, and brand scroller. Also includes role-based
 * floating action buttons for admin and employee users.
 * 
 * @returns {JSX.Element} The rendered home page
 */

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Link } from "react-router-dom";

// Layout Components
import { Nav } from "./components/layout";

// Common Components
import { BrandScroller, Scroll } from "./components/common";

// Product Components
import { Category, ProductGrid } from "./components/product";

// Styles
import "./styles/components/style.css";

// Route Guards
import RoleBasedComponent from "./RoleBasedComponents";

function App() {
  return (
    <ChakraProvider>
      <Nav />
      <Scroll />
      <div className="fixed-buttons">
        <RoleBasedComponent allowedRoles={["admin", "employee"]}>
          <Link to="/addproduct">
            <button className="futuristic-button add-product">
              <span className="button-content">
                <span className="button-icon">+</span>
                <span className="button-text">Add Products</span>
              </span>
            </button>
          </Link>
        </RoleBasedComponent>
        <RoleBasedComponent allowedRoles={["admin"]}>
          <Link to="/admin-dashboard">
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
      <Category />
      <ProductGrid />
    </ChakraProvider>
  );
}

export default App;
