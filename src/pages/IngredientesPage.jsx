import { useState, useEffect } from 'react';
import { ingredienteService } from '../services/ingredienteService';

function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarIngredientes();
  }, [busqueda]);

  const cargarIngredientes = async () => {
    setLoading(true);
    try {
      const params = busqueda ? { nombre: busqueda } : {};
      const response = await ingredienteService.getAll(params);
      setIngredientes(response.data);
    } catch (error) {
      console.error('Error al cargar ingredientes:', error);
      alert('Error al cargar los ingredientes');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setIngredienteSeleccionado(null);
    setNombre('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (ingrediente) => {
    setModoEdicion(true);
    setIngredienteSeleccionado(ingrediente);
    setNombre(ingrediente.nombre);
    setModalAbierto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      if (modoEdicion) {
        await ingredienteService.update(ingredienteSeleccionado.id, { nombre });
        alert('Ingrediente actualizado correctamente');
      } else {
        await ingredienteService.create({ nombre });
        alert('Ingrediente creado correctamente');
      }

      setModalAbierto(false);
      cargarIngredientes();
    } catch (error) {
      console.error('Error al guardar ingrediente:', error);
      if (error.response?.status === 409) {
        alert('Ya existe un ingrediente con ese nombre');
      } else {
        alert('Error al guardar el ingrediente');
      }
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este ingrediente?')) return;

    try {
      await ingredienteService.delete(id);
      alert('Ingrediente eliminado correctamente');
      cargarIngredientes();
    } catch (error) {
      console.error('Error al eliminar ingrediente:', error);
      if (error.response?.status === 400) {
        alert('No se puede eliminar el ingrediente porque está siendo usado en una o más comidas');
      } else {
        alert('Error al eliminar el ingrediente');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🥕 Ingredientes
              </h1>
              <p className="text-gray-600 mt-1">
                Administra tus ingredientes
              </p>
            </div>
            <button
              onClick={abrirModalNuevo}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
            >
              ➕ Nuevo Ingrediente
            </button>
          </div>

          {/* Buscador */}
          <div>
            <input
              type="text"
              placeholder="Buscar ingrediente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de ingredientes */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Cargando ingredientes...
          </div>
        ) : ingredientes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              {busqueda
                ? 'No se encontraron ingredientes con ese nombre'
                : 'No hay ingredientes registrados. ¡Crea tu primer ingrediente!'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-6 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ingredientes.map((ingrediente) => (
                  <tr key={ingrediente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {ingrediente.nombre}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => abrirModalEditar(ingrediente)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(ingrediente.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">
                {modoEdicion ? '✏️ Editar Ingrediente' : '➕ Nuevo Ingrediente'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del ingrediente *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Tomate"
                  autoFocus
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {modoEdicion ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default IngredientesPage;