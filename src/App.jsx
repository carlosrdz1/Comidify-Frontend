import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import CatalogoPage from './pages/CatalogoPage';
import MenusGuardadosPage from './pages/MenusGuardadosPage';
import IngredientesPage from './pages/IngredientesPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/menus-guardados" element={<MenusGuardadosPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;