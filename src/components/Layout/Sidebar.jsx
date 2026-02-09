import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { theme } = useTheme();

  const menuItems = [
    { path: '/', icon: '📅', label: 'Menú Semanal' },
    { path: '/catalogo', icon: '🍽️', label: 'Catálogo de Comidas' },
    { path: '/menus-guardados', icon: '💾', label: 'Cargar Menú' },
    { path: '/ingredientes', icon: '🥕', label: 'Ingredientes' },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${theme === 'rustico' ? 'sidebar-rustico' : 'bg-white'}`}
        style={{ backgroundColor: theme === 'default' ? 'var(--bg-sidebar)' : undefined }}
      >
        <div className="h-full flex flex-col">
          {/* Header del Sidebar */}
          <div 
            className={`p-4 flex justify-between items-center ${
              theme === 'rustico' ? 'bg-opacity-50' : 'bg-blue-600'
            }`}
            style={{ 
              backgroundColor: theme === 'default' ? 'var(--color-primary)' : 'rgba(139, 94, 60, 0.2)',
              borderBottom: theme === 'rustico' ? '3px solid var(--color-primary)' : undefined
            }}
          >
            <h2 
              className={`text-xl font-bold ${theme === 'rustico' ? 'text-brown-800' : 'text-white'}`}
              style={{ color: theme === 'default' ? 'var(--text-white)' : 'var(--text-primary)' }}
            >
              Menú
            </h2>
            <button
              onClick={onToggle}
              className={`lg:hidden ${theme === 'rustico' ? 'text-brown-800' : 'text-white'} hover:opacity-80`}
              style={{ color: theme === 'default' ? 'var(--text-white)' : 'var(--text-primary)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        theme === 'rustico'
                          ? `sidebar-item ${isActive ? 'bg-opacity-60' : ''}`
                          : `${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
                      }`}
                      style={theme === 'default' ? {
                        backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : undefined,
                        color: isActive ? 'var(--color-primary)' : 'var(--text-primary)'
                      } : undefined}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer del Sidebar */}
          <div 
            className="p-4"
            style={{ 
              borderTop: `1px solid var(--border-color)`,
              backgroundColor: theme === 'rustico' ? 'rgba(139, 94, 60, 0.1)' : undefined
            }}
          >
            <p 
              className="text-xs text-center"
              style={{ color: 'var(--text-secondary)' }}
            >
              Comidify v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;