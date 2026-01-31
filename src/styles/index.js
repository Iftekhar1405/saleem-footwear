/**
 * Styles Index - Central Export for All CSS Files
 * 
 * This file imports all CSS files from the styles directory,
 * allowing components to import styles from a single location.
 * 
 * Usage in components:
 * import '../styles' or import '../../styles' depending on component location
 */

// CSS Variables
import './variables.css';

// Admin Styles
import './admin/acceptedOrders.css';
import './admin/adminDashboard.css';
import './admin/allCustomers.css';
import './admin/pendingOrders.css';
import './admin/rejectedOrders.css';

// Authority Styles
import './authority/addProduct.css';
import './authority/productCardAuth.css';
import './authority/productGridAuth.css';

// Component Styles
import './components/brandScroller.css';
import './components/cart.css';
import './components/category.css';
import './components/layout.css';
import './components/productCard.css';
import './components/productGrid.css';
import './components/profile.css';

// Auth Styles
import './auth/login.css';
import './auth/prelogin.css';

// Common Styles
import './common.css';
