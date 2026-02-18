import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-main)' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <header 
          className={`shadow-lg sticky top-0 z-30 ${theme === 'rustico' ? 'header-rustico' : 'bg-blue-600'}`}
          style={{ backgroundColor: theme === 'default' ? 'var(--bg-header)' : undefined }}
        >
          <div className="px-2 md:px-4 py-2 md:py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden hover:opacity-80 p-2"
                style={{ color: 'var(--text-white)' }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 
                  className={`text-lg md:text-2xl lg:text-3xl font-bold ${theme === 'rustico' ? 'logo-rustico' : 'text-white'}`}
                  style={{ color: theme === 'default' ? 'var(--text-white)' : undefined }}
                >
                  <span className="hidden md:inline">
                    {theme === 'rustico' ? '🍳 Mi Menú Familiar - Comidify' : '🍕 Comidify'}
                  </span>
                  <span className="md:hidden">🍕 Comidify</span>
                </h1>
                <p 
                  className={`text-xs md:text-sm mt-1 ${theme === 'rustico' ? 'text-yellow-100' : 'text-blue-100'}`}
                  style={{ color: theme === 'default' ? 'rgba(255,255,255,0.8)' : undefined }}
                >
                  Hola, {user?.nombre}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 md:space-x-2">
              <button
                onClick={toggleTheme}
                className={`px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                  theme === 'rustico' 
                    ? 'btn-rustico' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
                title={theme === 'rustico' ? 'Cambiar a tema moderno' : 'Cambiar a tema rústico'}
              >
                {theme === 'rustico' ? '🎨' : '🏡'}
              </button>

              <button
                onClick={handleLogout}
                className={`px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                  theme === 'rustico' 
                    ? 'btn-rustico' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <span className="hidden sm:inline">Salir</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;