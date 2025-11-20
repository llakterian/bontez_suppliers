import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/common/LoadingSpinner'
import { queryClient } from './lib/queryClient'

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Clients = lazy(() => import('./pages/Clients'))
const Suppliers = lazy(() => import('./pages/Suppliers'))
const Sales = lazy(() => import('./pages/Sales'))
const Reports = lazy(() => import('./pages/ReportsEnhanced'))
const ClientForm = lazy(() => import('./pages/ClientForm'))
const SupplierForm = lazy(() => import('./pages/SupplierForm'))
const SaleForm = lazy(() => import('./pages/SaleForm'))

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <NavBar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/:id" element={<ClientForm />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/suppliers/new" element={<SupplierForm />} />
              <Route path="/suppliers/:id" element={<SupplierForm />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/sales/new" element={<SaleForm />} />
              <Route path="/sales/:id" element={<SaleForm />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  )
}

export default App
