import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import RoleBasedComponent from "../RoleBasedComponents";

export function Layout() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/prelogin','/contact-us'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Header />}
      <Outlet />
      
    </>
  );
}
