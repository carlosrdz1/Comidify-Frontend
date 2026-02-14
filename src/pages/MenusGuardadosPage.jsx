import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuService } from '../services/menuService';
import { TipoComida, DiaSemana } from '../utils/enums';
import toast from 'react-hot-toast';

function MenusGuardadosPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuSeleccionado, setMenuSeleccionado] = useState(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarMenus();
  }, []);

  const cargarMenus = async () => {
    setLoading(true);
    try {
      const response = await menuService.getAll();
      setMenus(response.data);
    } catch (error) {
      console.error('Error al cargar menús:', error);
      toast.error('Error al cargar los menús guardados');
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = async (menu) => {
    try {
      const response = await menuService.getById(menu.id);
      setMenuSeleccionado(response.data);
      setModalDetalleAbierto(true);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      toast.error('Error al cargar los detalles del menú');
    }
  };

  const cargarMenu = (menu) => {
    // Guardamos el menú en localStorage para que HomePage lo cargue
    localStorage.setItem('menuACagar', JSON.stringify(menu));
    navigate('/');
  };

  const eliminarMenu = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este menú?')) return;

    try {
      await menuService.delete(id);
      toast.success('Menú eliminado correctamente');
      cargarMenus();
    } catch (error) {
      console.error('Error al eliminar menú:', error);
      toast.error('Error al eliminar el menú');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            💾 Menús Guardados
          </h1>
          <p className="text-gray-600 mt-1">
            Carga menús anteriores o crea uno nuevo
          </p>
        </div>

        {/* Lista de menús */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Cargando menús...
          </div>
        ) : menus.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              No hay menús guardados
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Crear Primer Menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {menu.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Creado: {new Date(menu.fechaCreacion).toLocaleDateString('es-MX')}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {menu.comidas?.length || 0} comidas planeadas
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => cargarMenu(menu)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      📥 Cargar Menú
                    </button>
                    <button
                      onClick={() => verDetalle(menu)}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      👁️ Ver Detalle
                    </button>
                    <button
                      onClick={() => eliminarMenu(menu.id)}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {modalDetalleAbierto && menuSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  📋 {menuSeleccionado.nombre}
                </h2>
                <button
                  onClick={() => setModalDetalleAbierto(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Creado el {new Date(menuSeleccionado.fechaCreacion).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              {menuSeleccionado.comidas && menuSeleccionado.comidas.length > 0 ? (
                <div className="space-y-3">
                  {menuSeleccionado.comidas
                    .sort((a, b) => a.diaSemana - b.diaSemana || a.tipoComida - b.tipoComida)
                    .map((comida, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {comida.nombreComida}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {DiaSemana[comida.diaSemana]} - {TipoComida[comida.tipoComida]}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Este menú no tiene comidas
                </p>
              )}

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setModalDetalleAbierto(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    cargarMenu(menuSeleccionado);
                    setModalDetalleAbierto(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Cargar este Menú
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenusGuardadosPage;