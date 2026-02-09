import { useState, useEffect } from 'react';
import { menuService } from '../../services/menuService';

function ShoppingList({ menuId }) {
  const [listaCompras, setListaCompras] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (menuId) {
      cargarListaCompras();
    }
  }, [menuId]);

  const cargarListaCompras = async () => {
    setLoading(true);
    try {
      const response = await menuService.getListaCompras(menuId);
      setListaCompras(response.data);
    } catch (error) {
      console.error('Error al cargar lista de compras:', error);
      alert('Error al cargar la lista de compras');
    } finally {
      setLoading(false);
    }
  };

  const imprimirLista = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-500">Cargando lista de compras...</p>
      </div>
    );
  }

  if (!listaCompras || !menuId) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg mb-4">
          📝 Primero debes guardar tu menú semanal para generar la lista de compras
        </p>
        <p className="text-gray-400 text-sm">
          Agrega comidas al grid y guarda el menú para ver los ingredientes aquí
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            🛒 Lista de Compras
          </h2>
          <p className="text-gray-600 mt-1">
            Ingredientes para tu menú semanal
          </p>
        </div>
        <button
          onClick={imprimirLista}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg print:hidden"
        >
          🖨️ Imprimir
        </button>
      </div>

      {listaCompras.ingredientes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No hay ingredientes en este menú
        </p>
      ) : (
        <div className="space-y-3">
          {listaCompras.ingredientes.map((ingrediente, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-3 hover:bg-gray-50 px-4 py-2 rounded transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded flex-shrink-0 print:border-black" />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {ingrediente.nombre}
                    </h3>
                    {ingrediente.cantidades && ingrediente.cantidades.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        {ingrediente.cantidades.map((cantidad, idx) => (
                          <span key={idx} className="mr-3">
                            • {cantidad}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Total de ingredientes: <span className="font-bold">{listaCompras.ingredientes.length}</span>
        </p>
      </div>
    </div>
  );
}

export default ShoppingList;