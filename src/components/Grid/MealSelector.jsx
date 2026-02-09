import { useState, useEffect } from 'react';
import { comidaService } from '../../services/comidaService';
import { TipoComida } from '../../utils/enums';

function MealSelector({ isOpen, onClose, onSelect, diaSeleccionado, tipoSeleccionado }) {
  const [comidas, setComidas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarComidas();
    }
  }, [isOpen, filtroNombre, filtroTipo]);

  const cargarComidas = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtroNombre) params.nombre = filtroNombre;
      if (filtroTipo) params.tipoComida = filtroTipo;

      const response = await comidaService.getAll(params);
      setComidas(response.data);
    } catch (error) {
      console.error('Error al cargar comidas:', error);
      alert('Error al cargar las comidas');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (comida) => {
    onSelect(comida);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Seleccionar Comida - {diaSeleccionado} / {tipoSeleccionado}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por nombre:
            </label>
            <input
              type="text"
              placeholder="Escribe el nombre de la comida..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por tipo:
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {Object.entries(TipoComida).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de comidas */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Cargando comidas...
            </div>
          ) : comidas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron comidas
            </div>
          ) : (
            <div className="space-y-2">
              {comidas.map((comida) => (
                <div
                  key={comida.id}
                  onClick={() => handleSelect(comida)}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {comida.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {TipoComida[comida.tipoComida]}
                      </p>
                      {comida.ingredientes && comida.ingredientes.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ingredientes: {comida.ingredientes.map(i => i.nombreIngrediente).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MealSelector;