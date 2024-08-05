import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import RoleBasedComponent from "../RoleBasedComponents";


export function Layout(){
    const location = useLocation()
    const hideNavbarRoutes = ['/login','/register','/prelogin']
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

return(
<>
{!shouldHideNavbar && <Header />}
<Outlet/>
<RoleBasedComponent allowedRoles={['admin', 'employee']}>
    <Link to='/addproduct'><div className="addproduct"> + Add Products</div></Link>
</RoleBasedComponent>
<RoleBasedComponent allowedRoles={['admin']}>
    <Link to='/admin-dashboard'> <div className="admin-tools"> Admin Tools</div></Link>
</RoleBasedComponent>
</>
)
}