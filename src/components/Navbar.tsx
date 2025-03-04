
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Map, BarChart2, Plus, Search, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { session } = useAuth();
  const { toast } = useToast();

  const routes = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Properties', path: '/properties', icon: Search },
    { name: 'Map View', path: '/map', icon: Map },
    { name: 'Comparison', path: '/comparison', icon: BarChart2 },
    ...(session ? [{ name: 'Add Property', path: '/add-property', icon: Plus }] : []),
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-medium">RentTracker</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all relative group",
                isActive(route.path)
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              )}
            >
              <route.icon className="w-4 h-4 mr-2" />
              <span>{route.name}</span>
              {isActive(route.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </Link>
          ))}
          
          {session ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="ml-4 flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all relative group ml-4",
                isActive('/auth')
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              )}
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span>Sign In</span>
              {isActive('/auth') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
          >
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="px-4 py-3 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors",
                isActive(route.path)
                  ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
              onClick={closeMenu}
            >
              <route.icon className="w-5 h-5 mr-3" />
              {route.name}
            </Link>
          ))}
          
          {session ? (
            <button
              onClick={() => {
                handleSignOut();
                closeMenu();
              }}
              className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium transition-colors text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors",
                isActive('/auth')
                  ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
              onClick={closeMenu}
            >
              <LogIn className="w-5 h-5 mr-3" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
