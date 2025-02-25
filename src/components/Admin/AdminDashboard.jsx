import React from "react";
import { Link } from "react-router-dom";
import './AdminDashboard.css';

function AdminDashboard(){
    return(
        
        <div className="admin-card-cont">
        <Link to='/pending-orders'>
        <div className="admin-card"> <h2 style={{color:'whitesmoke'}}>Pending Orders</h2></div>
        </Link>
        <Link to='/accepted-orders'>
        <div className="admin-card"> <h2 style={{color:'whitesmoke'}}>Accepted Orders</h2></div>
        </Link>
        <Link to='/rejected-orders'>
        <div className="admin-card"><h2 style={{color:'whitesmoke'}}>Rejected Orders</h2></div>
        </Link>
        
        <Link to='/customers'>
        <div className="admin-card"><h2 style={{color:'whitesmoke'}}> All Customers</h2></div>
        </Link>
        <Link to='/edit-products'>
        <div className="admin-card"><h2 style={{color:'whitesmoke'}}>Edit Products</h2></div>
        </Link>
        </div>
    )
}
export default AdminDashboard