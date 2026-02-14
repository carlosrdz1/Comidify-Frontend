import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';  // ← NUEVO
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CatalogoPage from './pages/CatalogoPage';
import MenusGuardadosPage from './pages/MenusGuardadosPage';
import IngredientesPage from './pages/IngredientesPage';
import CustomToast from './components/CustomToast';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* AGREGAR EL TOASTER */}
      <CustomToast 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Estilos por defecto
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          // Estilos para success
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          // Estilos para error
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/catalogo" element={
          <ProtectedRoute>
            <Layout>
              <CatalogoPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/menus-guardados" element={
          <ProtectedRoute>
            <Layout>
              <MenusGuardadosPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/ingredientes" element={
          <ProtectedRoute>
            <Layout>
              <IngredientesPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;