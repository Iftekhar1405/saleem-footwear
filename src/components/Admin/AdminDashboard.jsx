import { Link } from "react-router-dom";

function AdminDashboard(){
    return(
        
        <div className="admin-card-cont">
        <Link to='/pending-orders'>
        <div className="admin-card"> <h3>Pending Orders</h3></div>
        </Link>
        <Link to='/accepted-orders'>
        <div className="admin-card"> <h3>Accepted Orders</h3></div>
        </Link>
        <Link to='/rejected-orders'>
        <div className="admin-card"><h3>Rejected Orders</h3></div>
        </Link>
        <Link to='/employees'>
        <div className="admin-card"><h3>All Employees</h3></div>
        </Link>
        <Link to='/customers'>
        <div className="admin-card"><h3> All Customers</h3></div>
        </Link>
        </div>
    )
}
export default AdminDashboard