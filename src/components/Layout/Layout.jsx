import { useState } from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-main)' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <header 
          className={`shadow-lg sticky top-0 z-30 ${theme === 'rustico' ? 'header-rustico' : 'bg-blue-600'}`}
          style={{ backgroundColor: theme === 'default' ? 'var(--bg-header)' : undefined }}
        >
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden hover:opacity-80"
                style={{ color: 'var(--text-white)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 
                  className={`text-2xl md:text-3xl font-bold ${theme === 'rustico' ? 'logo-rustico' : 'text-white'}`}
                  style={{ color: theme === 'default' ? 'var(--text-white)' : undefined }}
                >
                  {theme === 'rustico' ? '🍳 Comidify' : '🍕 Comidify'}
                </h1>
                <p 
                  className={`text-sm mt-1 ${theme === 'rustico' ? 'text-yellow-100' : 'text-blue-100'}`}
                  style={{ color: theme === 'default' ? 'rgba(255,255,255,0.8)' : undefined }}
                >
                  Planifica tus comidas
                </p>
              </div>
            </div>

            {/* Botón cambiar tema */}
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                theme === 'rustico' 
                  ? 'btn-rustico' 
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
              title={theme === 'rustico' ? 'Cambiar a tema moderno' : 'Cambiar a tema rústico'}
            >
              {theme === 'rustico' ? '🎨 Moderno' : '🏡 Rústico'}
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;