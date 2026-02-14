import { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

function CustomToast() {
  const { theme } = useTheme();

  return (
    <Toaster 
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: theme === 'rustico' ? '#8b5e3c' : '#363636',
          color: '#fff',
          padding: '16px',
          borderRadius: theme === 'rustico' ? '12px' : '8px',
          border: theme === 'rustico' ? '2px solid #6d4c2f' : 'none',
          fontFamily: theme === 'rustico' ? 'Caveat, cursive' : 'Inter, sans-serif',
        },
        success: {
          duration: 3000,
          style: {
            background: theme === 'rustico' ? '#c07855' : '#10b981',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: theme === 'rustico' ? '#b8534b' : '#ef4444',
          },
        },
      }}
    />
  );
}

export default CustomToast;