import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Flame } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Clients', path: '/clients' },
  { name: 'Suppliers', path: '/suppliers' },
  { name: 'Sales', path: '/sales' },
  { name: 'Reports', path: '/reports' },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 border-b-4 border-primary-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="bg-gradient-to-br from-primary-500 to-accent-red p-2 rounded-lg"
            >
              <Flame className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-red bg-clip-text text-transparent">
                Bontez Suppliers
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Gas Sales Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
