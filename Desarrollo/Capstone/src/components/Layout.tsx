import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function Layout() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/setralog-logo.png" 
                  alt="SetraLog" 
                  className="h-10"
                />
              </Link>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Bienvenido, {user.name}</span>
                <Link 
                  to="/profile"
                  className="inline-flex items-center text-gray-700 hover:text-primary-600"
                >
                  <UserCircle className="h-5 w-5 mr-1" />
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}