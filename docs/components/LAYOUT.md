# Layout Components

Layout components provide the application shell, navigation, and page structure.

## Components

### Header
**Location**: `src/components/layout/Header.jsx`

**Purpose**: Main header component with logo, navigation, search, and user menu.

**Features**:
- Responsive navigation
- Search functionality with autocomplete
- User menu with profile and logout
- Cart icon with item count
- Role-based menu items (Admin/Employee links)
- Mobile-responsive hamburger menu
- Animated transitions with Framer Motion

**Props**: None (uses context and localStorage)

**Usage**:
```jsx
import { Header } from './components/layout';

<Header />
```

**Key Functionality**:
- **Search**: Real-time product search with debouncing
- **Authentication**: Displays user name when logged in
- **Cart Badge**: Shows number of items in cart
- **Role-Based UI**: Different menu items for admin/employee/user

---

### Nav
**Location**: `src/components/layout/Nav.jsx`

**Purpose**: Secondary navigation bar with category links and additional navigation.

**Features**:
- Category navigation
- Search bar integration
- Terms & Conditions / Privacy Policy links
- Responsive design
- Smooth animations

**Props**: None

**Usage**:
```jsx
import { Nav } from './components/layout';

<Nav />
```

**Key Functionality**:
- **Category Links**: Quick access to product categories
- **Search Integration**: Embedded search functionality
- **Legal Links**: Access to T&C and Privacy Policy

---

### Layout
**Location**: `src/components/layout/Layout.jsx`

**Purpose**: Main layout wrapper that conditionally renders Header based on route.

**Features**:
- Conditional header rendering
- Outlet for nested routes
- Route-based layout variations

**Props**: None (uses React Router's useLocation)

**Usage**:
```jsx
import { Layout } from './components/layout';

<Route element={<Layout />}>
  <Route path="/" element={<Home />} />
  {/* Other routes */}
</Route>
```

**Routes Without Header**:
- `/login`
- `/register`
- `/prelogin`

**Key Functionality**:
- **Conditional Rendering**: Hides header on auth pages
- **Nested Routing**: Provides outlet for child routes
- **Layout Classes**: Different CSS classes based on header visibility

---

## Styling

**CSS Files**:
- `src/styles/components/layout.css`

**Key Styles**:
- `.layout`: Main layout container with header
- `.no-header-layout`: Layout without header
- Responsive breakpoints for mobile/tablet/desktop

---

## State Management

### Header Component
- **Local State**:
  - `isOpen`: Mobile menu state
  - `searchQuery`: Search input value
  - `searchResults`: Product search results
  - `user`: Current user data (from localStorage)
  - `cartItemCount`: Number of items in cart

### Nav Component
- **Local State**:
  - `searchQuery`: Search input value
  - `isSearchOpen`: Search bar visibility

### Layout Component
- **Router State**:
  - `location`: Current route location

---

## Integration Points

### Header
- **API Calls**:
  - Product search: `GET /products?search={query}`
- **LocalStorage**:
  - `token`: Authentication token
  - `user`: User data
  - `cart`: Cart items
- **Navigation**:
  - React Router's `useNavigate` for programmatic navigation

### Nav
- **API Calls**: None directly
- **Navigation**: Links to various routes

### Layout
- **Router**: Uses `<Outlet />` for nested routes
- **Location**: Checks current path to determine layout

---

## Best Practices

1. **Header Component**:
   - Keep search debounced to avoid excessive API calls
   - Update cart count when cart changes
   - Handle logout properly (clear localStorage, redirect)

2. **Nav Component**:
   - Keep category links updated with actual categories
   - Ensure search is synchronized with Header if both are visible

3. **Layout Component**:
   - Add new routes to `hideNavbarRoutes` array if header should be hidden
   - Maintain consistent layout classes

---

## Common Issues & Solutions

### Issue: Cart count not updating
**Solution**: Ensure cart state is updated in localStorage and component re-renders

### Issue: Search not working
**Solution**: Check API endpoint, ensure debouncing is working, verify search query formatting

### Issue: Header showing on login page
**Solution**: Add route to `hideNavbarRoutes` array in Layout component

---

## Future Enhancements

1. **Sticky Header**: Make header sticky on scroll
2. **Search History**: Store and display recent searches
3. **Notifications**: Add notification bell with count
4. **Theme Toggle**: Add dark/light mode toggle
5. **Breadcrumbs**: Add breadcrumb navigation
