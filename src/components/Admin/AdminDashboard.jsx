import React from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle, XCircle, Users, ShoppingBag } from "lucide-react";
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <p className="dashboard-title">Admin</p>
      
      <div className="admin-card-container">
        <Link to='/pending-orders' className="card-link">
          <div className="admin-card">
            <Package size={24} />
            <h2>Pending Orders</h2>
          </div>
        </Link>
        
        <Link to='/accepted-orders' className="card-link">
          <div className="admin-card">
            <CheckCircle size={24} />
            <h2>Accepted Orders</h2>
          </div>
        </Link>
        
        <Link to='/rejected-orders' className="card-link">
          <div className="admin-card">
            <XCircle size={24} />
            <h2>Rejected Orders</h2>
          </div>
        </Link>
        
        <Link to='/customers' className="card-link">
          <div className="admin-card">
            <Users size={24} />
            <h2>All Customers</h2>
          </div>
        </Link>
        
        <Link to='/edit-products' className="card-link">
          <div className="admin-card">
            <ShoppingBag size={24} />
            <h2>Edit Products</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;