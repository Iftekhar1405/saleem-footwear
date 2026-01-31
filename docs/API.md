# API Documentation

## 🌐 Base URL

```
Production: https://saleem-footwear-api.vercel.app/api/v1
Development: http://localhost:8080/api/v1
```

Configuration: `src/context/url.jsx`

## 🔐 Authentication

All authenticated requests require a JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

Token is stored in `localStorage` after successful login.

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "address": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user"
  },
  "token": "jwt_token"
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user|employee|admin"
  },
  "token": "jwt_token"
}
```

---

### Products

#### Get All Products
```http
GET /products?page=1&limit=20
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of products per page
- `category` (optional): Filter by category
- `gender` (optional): Filter by gender (male, female, unisex, kids)
- `brand` (optional): Filter by brand

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "string",
      "article": "string",
      "brand": "string",
      "description": "string",
      "price": number,
      "category": "string",
      "gender": "string",
      "material": "string",
      "inStock": boolean,
      "images": ["url1", "url2"],
      "colors": {
        "black": ["url1", "url2"],
        "white": ["url1", "url2"]
      },
      "colorsStock": [
        {
          "color": "black",
          "inStock": true
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalProducts": 200
  }
}
```

#### Get Product by ID
```http
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "product": {
    // Product object
  }
}
```

#### Create Product (Admin/Employee)
```http
POST /products
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "article": "string",
  "brand": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "gender": "string",
  "material": "string",
  "inStock": boolean,
  "images": ["url1", "url2"],
  "colors": {
    "black": ["url1", "url2"]
  },
  "colorsStock": [
    {
      "color": "black",
      "inStock": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    // Created product object
  }
}
```

#### Update Product (Admin/Employee)
```http
PATCH /products/:id
Authorization: Bearer {token}
```

**Request Body:** Same as Create Product

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    // Updated product object
  }
}
```

#### Delete Product (Admin/Employee)
```http
DELETE /products/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Orders

#### Get User Orders
```http
GET /orders
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "string",
      "user": "user_id",
      "items": [
        {
          "product": "product_id",
          "quantity": number,
          "price": number,
          "color": "string"
        }
      ],
      "totalAmount": number,
      "status": "pending|accepted|rejected",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### Create Order
```http
POST /orders
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": number,
      "price": number,
      "color": "string"
    }
  ],
  "totalAmount": number,
  "shippingAddress": {
    "address": "string",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "phone": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    // Order object
  }
}
```

#### Get All Orders (Admin)
```http
GET /admin/orders?status=pending
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, accepted, rejected)

**Response:**
```json
{
  "success": true,
  "orders": [
    // Array of order objects with user details
  ]
}
```

#### Update Order Status (Admin)
```http
PATCH /admin/orders/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "accepted|rejected"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated",
  "order": {
    // Updated order object
  }
}
```

---

### User Profile

#### Get User Profile
```http
GET /user/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "role": "string",
    "createdAt": "date"
  }
}
```

#### Update User Profile
```http
PATCH /user/profile
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "address": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    // Updated user object
  }
}
```

---

### Admin - Customers

#### Get All Customers (Admin)
```http
GET /admin/customers
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "customers": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "totalOrders": number,
      "totalSpent": number,
      "createdAt": "date"
    }
  ]
}
```

---

## 🔧 API Integration Examples

### Using Axios

#### Basic GET Request
```javascript
import axios from 'axios';
import { URL } from '../context/url';

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${URL}/products`);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
```

#### Authenticated POST Request
```javascript
const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${URL}/orders`,
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
```

#### With Pagination
```javascript
const fetchProductsPaginated = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${URL}/products`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

### Error Handling Example
```javascript
try {
  const response = await axios.get(`${URL}/products`);
  return response.data;
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.data.message);
    if (error.response.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } else if (error.request) {
    // Request made but no response
    console.error('Network error');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

---

## 🔄 API Best Practices

1. **Always handle errors**: Use try-catch blocks
2. **Check token expiry**: Redirect to login on 401 errors
3. **Use loading states**: Show loading indicators during API calls
4. **Implement retry logic**: For failed requests
5. **Cache responses**: Where appropriate to reduce API calls
6. **Validate data**: Before sending to API
7. **Use environment variables**: For API URLs in production

---

## 📝 Notes

- All dates are in ISO 8601 format
- Pagination starts at page 1
- Default limit is 20 items per page
- Maximum limit is 100 items per page
- Token expires after 7 days (check with backend team)
- File uploads use multipart/form-data (if implemented)
