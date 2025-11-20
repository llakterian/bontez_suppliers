# Bontez Suppliers - Modern React Frontend

A beautiful, responsive, and feature-rich React frontend for the Bontez Suppliers gas sales management system.

##  Design Features

### Kenyan-Inspired Theme
- **Earth Tones**: Warm browns and tans representing reliability and trust
- **Vibrant Accents**: Supplier-specific colors (red for Top Gas, orange for Total Gas, etc.)
- **Modern Typography**: Clean Inter font family for excellent readability
- **Dark/Light Mode**: Seamless theme switching with smooth transitions

### User Experience
- **Mobile-First Design**: Fully responsive across all devices
- **Intuitive Navigation**: Clear routing with visual feedback
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Real-time Feedback**: Toast notifications for all user actions
- **Accessible**: ARIA labels and keyboard navigation support

##  Tech Stack

- **React 19.2** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling with custom Kenyan theme
- **React Router 7** - Client-side routing
- **Framer Motion** - Smooth animations
- **Chart.js** - Interactive charts for reports
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library
- **Date-fns** - Date formatting utilities

##  Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── StatCard.tsx
│   │   │   └── RecentSales.tsx
│   │   └── layout/          # Layout components
│   │       └── NavBar.tsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Clients.tsx
│   │   ├── ClientForm.tsx
│   │   ├── Suppliers.tsx
│   │   ├── SupplierForm.tsx
│   │   ├── Sales.tsx
│   │   ├── SaleForm.tsx
│   │   └── Reports.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useTheme.tsx
│   ├── App.tsx            # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── tailwind.config.js    # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

##  Key Features

### 1. Dashboard
- **Hero Section**: Welcome message with quick action button
- **KPI Cards**: Total sales, clients, paid amounts, pending balances
- **Quick Actions**: Fast access to add clients, create sales, view reports
- **Recent Sales Feed**: Latest transactions with color-coded suppliers

### 2. Client Management
- **Grid View**: Beautiful card layout for clients
- **Search**: Filter by name, phone, or email
- **CRUD Operations**: Create, read, update, delete clients
- **Validation**: Real-time form validation with error messages

### 3. Supplier Management
- **Color-Coded Cards**: Each supplier with brand color
- **Visual Identity**: Flame icons styled with supplier colors
- **Color Guide**: Reference for all Kenyan gas supplier colors
- **Brand Colors**:
  - Top Gas: Red (#dc2626)
  - K-Gas: Black (#000000)
  - Total Gas: Orange (#ea580c)
  - Rubis Gas: Green (#16a34a)
  - OiLibya Gas: Brown (#92400e)
  - Men Gas: Maroon (#881337)
  - Hashi Gas: Yellow (#eab308)
  - Hass Gas: Blue (#2563eb)
  - Mixed Gas: Purple (#9333ea)

### 4. Sales Transactions
- **Multi-Step Form**: Customer selection → Product selection → Payment method
- **Dynamic Product Cart**: Add/remove items with live total calculation
- **Payment Methods**: Cash, M-Pesa (with transaction code), Installments (2-6 payments)
- **Real-time Totals**: Instant calculation in Kenyan Shillings (KES)
- **Payment Progress**: Visual progress bars for installment payments

### 5. Reports & Analytics
- **Interactive Charts**: Bar charts for supplier breakdown, pie charts for payment methods
- **Date Filters**: Daily and monthly report views
- **KPI Metrics**: Total sales count, revenue, average sale value
- **Detailed Breakdown**: Revenue by supplier with color coding
- **Export Ready**: Export button for future PDF/CSV functionality

##  Design System

### Colors
```javascript
// Primary (Orange - Kenyan warmth)
primary-500: #f59e0b

// Accents
accent-red: #dc2626    // For Top Gas
accent-orange: #ea580c // For Total Gas
accent-blue: #2563eb   // For Hass Gas
accent-green: #16a34a  // For Rubis Gas

// Earth Tones
earth-brown: #a16207
earth-tan: #d97706
earth-clay: #b45309
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, clear hierarchy
- **Body**: Regular weight for readability
- **Monospace**: For codes and IDs

### Spacing
- Consistent 4/8/12/16/24px grid system
- Generous whitespace for breathing room
- Responsive padding/margins

##  Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Flask backend running on `http://localhost:5000`

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

##  API Integration

The frontend connects to the Flask backend via RESTful API endpoints:

- **Dashboard**: `GET /api/dashboard`
- **Clients**: `GET/POST/PUT/DELETE /api/clients`
- **Suppliers**: `GET/POST/PUT/DELETE /api/suppliers`
- **Products**: `GET /api/products`
- **Sales**: `GET/POST/PUT/DELETE /api/sales`
- **Reports**: `GET /api/reports/daily`, `GET /api/reports/monthly`

### API Configuration

Update `src/services/api.ts` to change the base URL:

```typescript
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:5000/api',
});
```

##  Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

### Mobile Optimizations
- Stacked layouts on small screens
- Touch-friendly button sizes (min 44x44px)
- Hamburger menu for navigation
- Bottom-aligned action buttons
- Simplified data tables

## ♿ Accessibility

- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Clear focus states
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Semantic HTML structure

## 🎭 Theme System

### Dark Mode Implementation

```typescript
// Toggle theme
const { theme, toggleTheme } = useTheme();

// Theme automatically saves to localStorage
// Applies to entire app via Tailwind dark: classes
```

### Customizing Themes

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      // Add custom color schemes
    }
  }
}
```

##  Security Best Practices

- **No Hard-Coded Credentials**: All sensitive data in environment variables
- **XSS Protection**: React's built-in escaping
- **CSRF Tokens**: Ready for implementation
- **Input Validation**: Client-side + server-side validation
- **Secure HTTP**: HTTPS recommended for production

## 🚢 Deployment Options

### Option 1: Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: Set `VITE_API_URL`

### Option 2: Vercel
1. Import project from GitHub
2. Framework preset: Vite
3. Environment variables: Add `VITE_API_URL`

### Option 3: Nginx (Self-Hosted)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/bontez-frontend/dist;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

##  Development Tips

### Hot Module Replacement
Vite provides instant HMR - changes reflect immediately without full page reload.

### TypeScript Strict Mode
All components are fully typed. Enable strict mode in `tsconfig.json` for maximum type safety.

### Component Development
Use the component pattern:
```typescript
// 1. Define types
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

// 2. Create component
export default function MyComponent({ title, onClick }: MyComponentProps) {
  return <button onClick={onClick}>{title}</button>
}
```

### Styling Guidelines
- Use Tailwind utility classes
- Extract common patterns to components
- Use `@apply` for repeated patterns in CSS
- Prefer composition over large components

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts
export default defineConfig({
  server: { port: 3000 }
})
```

### API Connection Failed
1. Ensure Flask backend is running
2. Check `VITE_API_URL` environment variable
3. Verify CORS is enabled on backend

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

##  Performance Optimizations

- **Lazy Loading**: Pages loaded on demand
- **Code Splitting**: Automatic chunk splitting
- **Image Optimization**: Use WebP format
- **Caching**: Service worker ready
- **Tree Shaking**: Unused code removed in production

## 🤝 Contributing

### Code Style
- Follow existing patterns
- Use TypeScript for new components
- Write meaningful commit messages
- Test on mobile devices

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with description

##  License

All rights reserved. Bontez Suppliers Management System - Author: Llakterian

##  Future Enhancements

- [ ] PWA support for offline functionality
- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and sorting
- [ ] Batch operations
- [ ] PDF/Excel export
- [ ] Multi-language support (Swahili)
- [ ] Print-friendly layouts
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Inventory management module

---

Built by Llakterian for the gas distribution industry.
