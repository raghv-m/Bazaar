import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Settings, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Search,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/20 dark:border-white/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gradient">Bazaar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                'nav-link',
                location.pathname === '/' && 'nav-link-active'
              )}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={cn(
                'nav-link',
                location.pathname === '/products' && 'nav-link-active'
              )}
            >
              Products
            </Link>
            {user && (
              <>
                <Link 
                  to="/orders" 
                  className={cn(
                    'nav-link',
                    location.pathname === '/orders' && 'nav-link-active'
                  )}
                >
                  Orders
                </Link>
                {user.role === 'vendor' && (
                  <Link 
                    to="/dashboard" 
                    className={cn(
                      'nav-link',
                      location.pathname.startsWith('/dashboard') && 'nav-link-active'
                    )}
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={cn(
                      'nav-link',
                      location.pathname.startsWith('/admin') && 'nav-link-active'
                    )}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
              <Search className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              ) : (
                <Moon className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              )}
            </button>

            {/* Cart */}
            {user && (
              <Link 
                to="/cart" 
                className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                <Bell className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass-card border border-white/20 dark:border-white/10"
                    >
                      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          {user.name}
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {user.email}
                        </p>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-secondary-200 dark:border-secondary-700"
            >
              <div className="py-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2 rounded-lg transition-colors',
                    location.pathname === '/' 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-secondary-100 dark:hover:bg-secondary-800'
                  )}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2 rounded-lg transition-colors',
                    location.pathname === '/products'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-secondary-100 dark:hover:bg-secondary-800'
                  )}
                >
                  Products
                </Link>
                {user && (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'block px-4 py-2 rounded-lg transition-colors',
                        location.pathname === '/orders'
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-secondary-100 dark:hover:bg-secondary-800'
                      )}
                    >
                      Orders
                    </Link>
                    {user.role === 'vendor' && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          'block px-4 py-2 rounded-lg transition-colors',
                          location.pathname.startsWith('/dashboard')
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'hover:bg-secondary-100 dark:hover:bg-secondary-800'
                        )}
                      >
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          'block px-4 py-2 rounded-lg transition-colors',
                          location.pathname.startsWith('/admin')
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'hover:bg-secondary-100 dark:hover:bg-secondary-800'
                        )}
                      >
                        Admin
                      </Link>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar; 