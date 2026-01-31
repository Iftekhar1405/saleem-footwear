# Project Architecture

## 📁 Folder Structure

```
saleem-footwear/
├── src/
│   ├── components/          # React components organized by feature
│   │   ├── layout/         # Layout components (Header, Nav, Layout)
│   │   ├── auth/           # Authentication (Login, Register, Prelogin)
│   │   ├── product/        # Product-related components
│   │   ├── common/         # Reusable UI components
│   │   ├── user/           # User-specific components
│   │   ├── admin/          # Admin dashboard components
│   │   └── authority/      # Employee/Authority components
│   ├── pages/              # Page-level components
│   ├── styles/             # CSS files organized by category
│   │   ├── admin/
│   │   ├── authority/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── variables.css   # CSS custom properties
│   │   ├── common.css      # Shared utility styles
│   │   └── index.js        # CSS exports
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── constants/          # Application constants
│   ├── context/            # React Context providers
│   ├── assets/             # Static assets (images, fonts)
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── docs/                   # Documentation
├── public/                 # Public assets
├── dist/                   # Production build output
└── package.json            # Dependencies and scripts
```

## 🏗️ Architecture Overview

### Component Organization

Components are organized by **feature and responsibility**:

#### 1. **Layout Components** (`components/layout/`)
- **Purpose**: Provide the application shell and navigation
- **Components**: Header, Nav, Layout
- **Responsibility**: Page structure, navigation, responsive layout

#### 2. **Authentication Components** (`components/auth/`)
- **Purpose**: Handle user authentication flows
- **Components**: Login, Register, Prelogin
- **Responsibility**: User login, registration, pre-login landing page

#### 3. **Product Components** (`components/product/`)
- **Purpose**: Display and manage products
- **Components**: ProductCard, ProductGrid, Category, Cart, CategorizedProducts
- **Responsibility**: Product display, filtering, cart management

#### 4. **Common Components** (`components/common/`)
- **Purpose**: Reusable UI components
- **Components**: Borders, BrandScroller, SearchBar, Scroll
- **Responsibility**: Shared UI elements used across the app

#### 5. **User Components** (`components/user/`)
- **Purpose**: User-specific functionality
- **Components**: Profile, Orders, OrderSummary
- **Responsibility**: User profile, order history, order details

#### 6. **Admin Components** (`components/admin/`)
- **Purpose**: Admin dashboard and management
- **Components**: AdminDashboard, PendingOrders, AcceptedOrders, RejectedOrders, AllCustomers
- **Responsibility**: Order management, customer management

#### 7. **Authority Components** (`components/authority/`)
- **Purpose**: Employee/Authority product management
- **Components**: AddProduct, ProductGridAuth
- **Responsibility**: Product creation, editing, deletion

### Styling Architecture

#### CSS Organization
- **Modular CSS**: Each component category has its own CSS folder
- **CSS Variables**: Defined in `styles/variables.css` for consistent theming
- **Common Styles**: Shared utilities and animations in `styles/common.css`
- **Component-Specific**: Individual CSS files for each component

#### Theming
```css
/* styles/variables.css */
:root {
  --primary-color: #e53e3e;
  --secondary-color: #2d3748;
  --spacing-unit: 8px;
  /* ... more variables */
}
```

### State Management

#### 1. **Local Storage**
- Custom hook: `useLocalStorage` in `hooks/useLocalStorage.js`
- Used for: User authentication tokens, cart data, user preferences
- Persists data across sessions

#### 2. **React Context**
- **URL Context**: API base URL configuration
- Centralized in `context/url.jsx`

#### 3. **Component State**
- Local state with `useState` for component-specific data
- Form state, UI toggles, temporary data

### Routing Architecture

#### Route Structure
```javascript
/ (Home)
├── /login
├── /register
├── /prelogin
├── /cart
├── /profile
├── /orders
├── /contact-us
├── /privacy-policy
├── /terms-and-conditions
├── /pdf-viewer
├── /admin/
│   ├── /dashboard
│   ├── /pending-orders
│   ├── /accepted-orders
│   ├── /rejected-orders
│   └── /all-customers
└── /authority/
    ├── /add-product
    └── /product-grid-auth
```

#### Protected Routes
- **User Routes**: Require authentication
- **Admin Routes**: Require admin role
- **Authority Routes**: Require employee/authority role

Implementation: `ProtectedRoute.jsx`, `RoleBasedRoutes.jsx`, `RoleBasedComponents.jsx`

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Call (Axios)
    ↓
Backend API (Vercel)
    ↓
Response Processing
    ↓
State Update
    ↓
UI Re-render
```

### API Integration

- **HTTP Client**: Axios
- **Base URL**: Configured in `context/url.jsx`
- **Authentication**: JWT tokens stored in localStorage
- **Headers**: Authorization header with Bearer token

### Build & Deployment

#### Development
```bash
npm run dev  # Vite dev server
```

#### Production
```bash
npm run build  # Creates optimized dist/ folder
npm run preview  # Preview production build
```

#### Build Output
- **Bundler**: Vite
- **Output**: `dist/` folder
- **Assets**: Hashed filenames for cache busting
- **Optimization**: Code splitting, minification, tree shaking

## 🎨 Design Patterns

### 1. **Component Composition**
- Small, focused components
- Reusable through props
- Composition over inheritance

### 2. **Custom Hooks**
- Encapsulate reusable logic
- Example: `useLocalStorage` for persistent state

### 3. **Index Files**
- Clean imports with barrel exports
- Example: `import { Header, Nav } from './components/layout'`

### 4. **CSS Modules Pattern**
- Scoped styles per component
- Organized in dedicated styles folder

### 5. **Protected Routes**
- HOC pattern for route protection
- Role-based access control

## 🔒 Security Considerations

1. **Authentication**: JWT tokens for API requests
2. **Protected Routes**: Client-side route guards
3. **Role-Based Access**: Different UI/routes for different user roles
4. **Input Validation**: Form validation before submission
5. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

## 📊 Performance Optimizations

1. **Code Splitting**: Dynamic imports for routes
2. **Lazy Loading**: Images and components loaded on demand
3. **Memoization**: React.memo for expensive components
4. **Optimized Builds**: Vite's fast build process
5. **Asset Optimization**: Image compression, font subsetting

## 🚀 Scalability

The architecture supports growth through:

1. **Modular Structure**: Easy to add new features
2. **Clear Separation**: Components, styles, logic separated
3. **Reusable Components**: DRY principle applied
4. **Consistent Patterns**: Easy for new developers to follow
5. **Documentation**: Well-documented codebase

## 🔄 Future Improvements

1. **State Management**: Consider Redux/Zustand for complex state
2. **Testing**: Add unit and integration tests
3. **TypeScript**: Migrate to TypeScript for type safety
4. **PWA**: Add service workers for offline support
5. **Performance Monitoring**: Add analytics and error tracking
