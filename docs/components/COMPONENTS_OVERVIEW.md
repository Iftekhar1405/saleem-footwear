# Components Overview

This document provides an overview of all major components in the Saleem Footwear application.

## 📂 Component Categories

### 1. Layout Components (`components/layout/`)
- **Header**: Main navigation header with search and user menu
- **Nav**: Secondary navigation with category links
- **Layout**: Main layout wrapper with conditional header

[Full Documentation](./LAYOUT.md)

---

### 2. Authentication Components (`components/auth/`)

#### Login (`Login.jsx`)
**Purpose**: User login form

**Features**:
- Email/password authentication
- Form validation
- Remember me functionality
- Redirect after login
- Error handling

**API**: `POST /auth/login`

**Usage**:
```jsx
<Route path="/login" element={<Login />} />
```

#### Register (`Register.jsx`)
**Purpose**: New user registration form

**Features**:
- Multi-field registration (name, email, password, phone, address)
- Password confirmation
- Form validation
- Auto-login after registration

**API**: `POST /auth/register`

#### Prelogin (`Prelogin.jsx`)
**Purpose**: Landing page for non-authenticated users

**Features**:
- Company information
- Benefits showcase
- Call-to-action buttons
- Animated sections with Framer Motion

---

### 3. Product Components (`components/product/`)

#### ProductCard (`ProductCard.jsx`)
**Purpose**: Individual product display card

**Features**:
- Product image with fallback
- Price, brand, category display
- Color variants
- Stock status
- Add to cart button
- Wishlist toggle
- Quick view modal

**Props**:
```javascript
{
  product: {
    _id: string,
    article: string,
    brand: string,
    price: number,
    images: array,
    colors: object,
    inStock: boolean,
    // ... more fields
  }
}
```

#### ProductGrid (`ProductGrid.jsx`)
**Purpose**: Grid display of products with infinite scroll

**Features**:
- Infinite scroll pagination
- Loading states
- Empty state handling
- Responsive grid layout
- Filter integration

**API**: `GET /products?page={page}&limit={limit}`

#### Category (`Category.jsx`)
**Purpose**: Category filter/navigation component

**Features**:
- Category cards with images
- Click to filter products
- Responsive grid
- Category icons

#### Cart (`Cart.jsx`)
**Purpose**: Shopping cart management

**Features**:
- Cart item list
- Quantity adjustment
- Remove items
- Price calculation
- Checkout button
- Empty cart state

**LocalStorage**: Stores cart data

#### CategorizedProducts (`CategorizedProducts.jsx`)
**Purpose**: Display products filtered by category

**Features**:
- Category-based filtering
- Product grid display
- Back to all products

---

### 4. User Components (`components/user/`)

#### Profile (`Profile.jsx`)
**Purpose**: User profile management

**Features**:
- View profile information
- Edit profile
- Update password
- Order history link

**API**: 
- `GET /user/profile`
- `PATCH /user/profile`

#### Orders (`Orders.jsx`)
**Purpose**: User order history

**Features**:
- List of all orders
- Order status display
- Order details view
- Filter by status

**API**: `GET /orders`

#### OrderSummary (`OrderSummary.jsx`)
**Purpose**: Detailed order information

**Features**:
- Order items list
- Total calculation
- Shipping address
- Order status
- Order date

---

### 5. Admin Components (`components/admin/`)

#### AdminDashboard (`AdminDashboard.jsx`)
**Purpose**: Admin dashboard overview

**Features**:
- Statistics cards
- Quick links to management pages
- Recent orders
- Customer count

#### PendingOrders (`PendingOrders.jsx`)
**Purpose**: Manage pending orders

**Features**:
- List of pending orders
- Accept/Reject actions
- Order details view
- Customer information

**API**: 
- `GET /admin/orders?status=pending`
- `PATCH /admin/orders/:id`

#### AcceptedOrders (`AcceptedOrders.jsx`)
**Purpose**: View accepted orders

**Features**:
- List of accepted orders
- Order details
- Customer information
- Print invoice

#### RejectedOrders (`RejectedOrders.jsx`)
**Purpose**: View rejected orders

**Features**:
- List of rejected orders
- Rejection reason
- Customer information

#### AllCustomers (`AllCustomers.jsx`)
**Purpose**: Customer management

**Features**:
- Customer list
- Search customers
- Customer details
- Order history per customer

**API**: `GET /admin/customers`

---

### 6. Authority/Employee Components (`components/authority/`)

#### AddProduct (`AddProduct.jsx`)
**Purpose**: Create new products

**Features**:
- Multi-step form
- Image upload
- Color variants
- Stock management
- Form validation

**API**: `POST /products`

#### ProductGridAuth (`ProductGridAuth.jsx`)
**Purpose**: Product management grid for employees

**Features**:
- Product list with edit/delete
- Inline editing
- Delete confirmation
- Stock status toggle
- Color stock management

**API**: 
- `GET /products`
- `PATCH /products/:id`
- `DELETE /products/:id`

---

### 7. Common/Shared Components (`components/common/`)

#### BrandScroller (`BrandScroller.jsx`)
**Purpose**: Horizontal scrolling brand showcase

**Features**:
- Auto-scroll animation
- Brand logos
- Infinite loop effect
- Pause on hover

#### SearchBar (`SearchBar.jsx`)
**Purpose**: Reusable search input

**Features**:
- Debounced search
- Clear button
- Loading state
- Autocomplete suggestions

#### Scroll (`Scroll.jsx`)
**Purpose**: Scroll-to-top button

**Features**:
- Appears on scroll
- Smooth scroll to top
- Animated entrance/exit

#### Borders (`Borders.jsx`)
**Purpose**: Decorative border components

**Features**:
- Gradient borders
- Pulsing borders
- Shimmer effects
- Neon borders
- Dashed animated borders

---

### 8. Page Components (`pages/`)

#### PrivacyPolicy (`PrivacyPolicy.jsx`)
**Purpose**: Privacy policy page

**Features**:
- Static content
- Formatted text
- Back to home link

#### TermsAndConditions (`TermsAndConditions.jsx`)
**Purpose**: Terms and conditions page

**Features**:
- Static content
- Formatted text
- Back to home link

#### ContactUs (`ContactUs.jsx`)
**Purpose**: Contact information and form

**Features**:
- Contact form
- Company information
- Map integration (if implemented)
- Social media links

#### PDFViewer (`PDFViewer.jsx`)
**Purpose**: View product catalog PDF

**Features**:
- Embedded PDF viewer
- Full-screen display
- Download option

---

## 🎨 Component Patterns

### 1. Container/Presentational Pattern
- **Container**: Handles logic, API calls, state
- **Presentational**: Receives props, renders UI

### 2. Compound Components
- Components that work together (e.g., ProductCard + ProductGrid)

### 3. Higher-Order Components (HOC)
- `ProtectedRoute`: Wraps routes requiring authentication
- `RoleBasedRoute`: Wraps routes requiring specific roles

### 4. Custom Hooks
- `useLocalStorage`: Persistent state management
- Used across multiple components

---

## 🔧 Common Props Patterns

### Product Object
```javascript
{
  _id: string,
  article: string,
  brand: string,
  description: string,
  price: number,
  category: string,
  gender: string,
  material: string,
  inStock: boolean,
  images: string[],
  colors: {
    [colorName]: string[]  // URLs
  },
  colorsStock: [
    {
      color: string,
      inStock: boolean
    }
  ]
}
```

### User Object
```javascript
{
  _id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  role: 'user' | 'employee' | 'admin',
  createdAt: date
}
```

### Order Object
```javascript
{
  _id: string,
  user: string | User,
  items: [
    {
      product: string | Product,
      quantity: number,
      price: number,
      color: string
    }
  ],
  totalAmount: number,
  status: 'pending' | 'accepted' | 'rejected',
  shippingAddress: object,
  createdAt: date,
  updatedAt: date
}
```

---

## 📱 Responsive Design

All components are responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

**Chakra UI Breakpoints**:
```javascript
{
  base: '0px',    // Mobile
  sm: '480px',
  md: '768px',    // Tablet
  lg: '992px',
  xl: '1280px',   // Desktop
  '2xl': '1536px'
}
```

---

## 🎭 Animation Libraries

### Framer Motion
Used for:
- Page transitions
- Component entrance/exit
- Hover effects
- Scroll animations

**Example**:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

### Chakra UI Animations
Built-in animations for:
- Modals
- Drawers
- Tooltips
- Transitions

---

## 🔄 State Management Patterns

### Local State (useState)
For component-specific, temporary data

### LocalStorage
For persistent data across sessions:
- User authentication
- Cart data
- User preferences

### Context API
For global configuration:
- API URL
- Theme settings (if implemented)

---

## 🚀 Performance Tips

1. **Lazy Loading**: Use React.lazy() for route-based code splitting
2. **Memoization**: Use React.memo() for expensive components
3. **Debouncing**: Debounce search inputs and API calls
4. **Pagination**: Implement infinite scroll or pagination for large lists
5. **Image Optimization**: Use appropriate image sizes and lazy loading

---

## 🧪 Testing Recommendations

1. **Unit Tests**: Test individual component logic
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows
4. **Accessibility Tests**: Ensure WCAG compliance

**Suggested Tools**:
- Jest + React Testing Library
- Cypress for E2E
- axe-core for accessibility

---

## 📚 Further Reading

- [Chakra UI Documentation](https://chakra-ui.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
