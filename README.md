# Saleem Footwear - React Application

A modern, full-featured e-commerce platform for footwear wholesale business built with React, Chakra UI, and Framer Motion.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.23.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### For Customers
- 🛍️ Browse extensive product catalog
- 🔍 Advanced search and filtering
- 🛒 Shopping cart management
- 📦 Order tracking
- 👤 User profile management
- 📱 Fully responsive design

### For Employees
- ➕ Add new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 📊 Manage product inventory
- 🎨 Handle color variants and stock

### For Admins
- 📊 Dashboard with statistics
- 📋 Order management (Accept/Reject)
- 👥 Customer management
- 📈 Business analytics
- 🔐 User role management

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.11
- **UI Library**: Chakra UI 2.10.4
- **Animation**: Framer Motion 11.15.0
- **Routing**: React Router DOM 7.1.1
- **HTTP Client**: Axios 1.7.7
- **Styling**: CSS3 + Chakra UI + TailwindCSS
- **Icons**: Chakra UI Icons + Lucide React
- **State Management**: React Context + LocalStorage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

Check your versions:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Iftekhar1405/saleem-footwear.git
cd saleem-footwear
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Environment Configuration

The API URL is configured in `src/context/url.jsx`. By default, it points to the production API:

```javascript
export const URL = "https://saleem-footwear-api.vercel.app/api/v1";
```

For local development, you can uncomment the development URL:

```javascript
// export const URL = "http://localhost:8080/api/v1";
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is busy).

### 5. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 6. Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## 📁 Project Structure

```
saleem-footwear/
├── src/
│   ├── components/          # React components
│   │   ├── layout/         # Header, Nav, Layout
│   │   ├── auth/           # Login, Register, Prelogin
│   │   ├── product/        # Product-related components
│   │   ├── common/         # Reusable components
│   │   ├── user/           # User profile, orders
│   │   ├── admin/          # Admin dashboard
│   │   └── authority/      # Employee product management
│   ├── pages/              # Page components
│   ├── styles/             # CSS files
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── constants/          # App constants
│   ├── context/            # React Context
│   ├── assets/             # Images, fonts
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── docs/                   # Documentation
├── public/                 # Public assets
├── dist/                   # Production build (generated)
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Architecture](./docs/ARCHITECTURE.md)**: Project structure and design patterns
- **[API Documentation](./docs/API.md)**: Backend API endpoints and integration
- **[Components](./docs/components/COMPONENTS_OVERVIEW.md)**: Component documentation
- **[Layout Components](./docs/components/LAYOUT.md)**: Header, Nav, Layout details

## 🔑 User Roles

The application supports three user roles:

1. **User/Customer**: Browse products, place orders, manage profile
2. **Employee/Authority**: Manage products (add, edit, delete)
3. **Admin**: Full access including order management and customer management

## 🌐 API Integration

The application integrates with a backend API hosted on Vercel:

**Base URL**: `https://saleem-footwear-api.vercel.app/api/v1`

### Key Endpoints:
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /products` - Fetch products
- `POST /orders` - Create order
- `GET /admin/orders` - Admin order management

See [API Documentation](./docs/API.md) for complete endpoint details.

## 🎨 Styling

The application uses a combination of:

1. **Chakra UI**: Component library for consistent UI
2. **Custom CSS**: Organized in `src/styles/` folder
3. **CSS Variables**: Defined in `src/styles/variables.css`
4. **Framer Motion**: For animations and transitions

### CSS Organization:
```
styles/
├── admin/              # Admin component styles
├── authority/          # Employee component styles
├── auth/               # Authentication styles
├── components/         # Component-specific styles
├── variables.css       # CSS custom properties
├── common.css          # Shared utilities
└── index.js            # CSS exports
```

## 🔐 Authentication

Authentication is handled using JWT tokens:

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in `localStorage`
4. Token sent in `Authorization` header for protected routes
5. Token expires after 7 days (configurable on backend)

## 🛒 Cart Management

Cart data is stored in `localStorage`:

```javascript
// Cart structure
{
  items: [
    {
      product: productObject,
      quantity: number,
      selectedColor: string
    }
  ]
}
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
# Vite will automatically use the next available port
# Or specify a custom port in vite.config.js
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
- Check if backend API is accessible
- Verify API URL in `src/context/url.jsx`
- Check browser console for CORS errors

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

### Netlify
1. Connect GitHub repository
2. Build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Add `_redirects` file for SPA routing

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Managed by**: Iftekhar Ahmad & Amaan Ahmad
- **Location**: Ambikapur, Surguja, Chhattisgarh, 497001

## 📞 Contact

For support or queries:
- **Email**: contact@saleemfootwear.com
- **Phone**: +91-XXXXXXXXXX
- **Website**: [saleemfootwear.com](https://saleemfootwear.com)

## 🙏 Acknowledgments

- Chakra UI team for the amazing component library
- Framer Motion for smooth animations
- Vite for the blazing-fast build tool
- All contributors and users of this application

---

**Built with ❤️ for Saleem Footwear**
