/**
 * Layout Component - Main Application Layout Wrapper
 * 
 * @description
 * Provides the main layout structure for the application.
 * Conditionally renders the Header based on the current route.
 * Routes like login, register, and prelogin hide the header.
 * 
 * @returns {JSX.Element} The layout wrapper with optional header
 */

import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../../styles/components/layout.css";

export function Layout() {
  const location = useLocation();

  // Reset scroll to the top whenever the route changes so a new page never
  // opens scrolled down to a position carried over from the previous page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Routes where the header should be hidden
  const hideNavbarRoutes = ["/login", "/register", "/prelogin"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className={shouldHideNavbar ? "no-header-layout" : "layout"}>
      {!shouldHideNavbar && <Header />}
      <main className="layout-main">
        <Outlet />
      </main>
      {!shouldHideNavbar && <Footer />}
    </div>
  );
}
