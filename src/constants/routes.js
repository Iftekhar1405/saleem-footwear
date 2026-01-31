/**
 * Route Constants
 * 
 * Centralized route paths for the application.
 * Using constants prevents typos and makes route management easier.
 */

export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRELOGIN: '/prelogin',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
  PRIVACY_POLICY: '/privacy-policy',
  CONTACT_US: '/contact-us',
  CATALOG: '/catelog',
  
  // Product Routes
  PRODUCT_DETAIL: '/product/:id',
  CATEGORY_GRID: '/category-grid/:category',
  SEARCH: '/search',
  
  // Protected User Routes
  PROFILE: '/profile',
  CART: '/cart',
  ORDERS: '/orders',
  ORDER_SUMMARY: '/order-summary',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin-dashboard',
  CUSTOMERS: '/customers',
  ACCEPTED_ORDERS: '/accepted-orders',
  PENDING_ORDERS: '/pending-orders',
  REJECTED_ORDERS: '/rejected-orders',
  EDIT_PRODUCTS: '/edit-products',
  
  // Authority/Employee Routes
  ADD_PRODUCT: '/addproduct',
};

/**
 * User Roles
 */
export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  USER: 'user',
};

/**
 * API Endpoints (if needed in the future)
 */
export const API_ENDPOINTS = {
  // Add your API endpoints here
};
