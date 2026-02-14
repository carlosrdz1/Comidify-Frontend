import { useState, useEffect } from 'react';
import { comidaService } from '../services/comidaService';
import { ingredienteService } from '../services/ingredienteService';
import { TipoComida } from '../utils/enums';
import toast from 'react-hot-toast';

function CatalogoPage() {
  const [comidas, setComidas] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [comidaSeleccionada, setComidaSeleccionada] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipoComida: 1,
    ingredientes: [],
  });

  useEffect(() => {
    cargarComidas();
    cargarIngredientes();
  }, []);

  const cargarComidas = async () => {
    setLoading(true);
    try {
      const response = await comidaService.getAll();
      setComidas(response.data);
    } catch (error) {
      console.error('Error al cargar comidas:', error);
      toast.error('Error al cargar las comidas');
    } finally {
      setLoading(false);
    }
  };

  const cargarIngredientes = async () => {
    try {
      const response = await ingredienteService.getAll();
      setIngredientes(response.data);
    } catch (error) {
      console.error('Error al cargar ingredientes:', error);
    }
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setComidaSeleccionada(null);
    setFormData({
      nombre: '',
      tipoComida: 1,
      ingredientes: [],
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = async (comida) => {
    setModoEdicion(true);
    setComidaSeleccionada(comida);
    
    // Cargar detalles completos de la comida
    try {
      const response = await comidaService.getById(comida.id);
      const comidaCompleta = response.data;
      
      setFormData({
        nombre: comidaCompleta.nombre,
        tipoComida: comidaCompleta.tipoComida,
        ingredientes: comidaCompleta.ingredientes.map(ing => ({
          ingredienteId: ing.ingredienteId,
          cantidad: ing.cantidad || '',
          unidad: ing.unidad || '',
        })),
      });
      setModalAbierto(true);
    } catch (error) {
      console.error('Error al cargar comida:', error);
      toast.error('Error al cargar los detalles de la comida');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    try {
      const data = {
        nombre: formData.nombre,
        tipoComida: parseInt(formData.tipoComida),
        ingredientes: formData.ingredientes,
      };

      if (modoEdicion) {
        await comidaService.update(comidaSeleccionada.id, data);
        toast.success('Comida actualizada correctamente');
      } else {
        await comidaService.create(data);
        toast.success('Comida creada correctamente');
      }

      setModalAbierto(false);
      cargarComidas();
    } catch (error) {
      console.error('Error al guardar comida:', error);
      toast.error('Error al guardar la comida');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta comida?')) return;

    try {
      await comidaService.delete(id);
      toast.success('Comida eliminada correctamente');
      cargarComidas();
    } catch (error) {
      console.error('Error al eliminar comida:', error);
      toast.error('Error al eliminar la comida');
    }
  };

  const agregarIngrediente = () => {
    setFormData({
      ...formData,
      ingredientes: [
        ...formData.ingredientes,
        { ingredienteId: ingredientes[0]?.id || 0, cantidad: '', unidad: '' },
      ],
    });
  };

  const actualizarIngrediente = (index, campo, valor) => {
    const nuevosIngredientes = [...formData.ingredientes];
    nuevosIngredientes[index][campo] = valor;
    setFormData({ ...formData, ingredientes: nuevosIngredientes });
  };

  const eliminarIngrediente = (index) => {
    const nuevosIngredientes = formData.ingredientes.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredientes: nuevosIngredientes });
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🍽️ Catálogo de Comidas
              </h1>
              <p className="text-gray-600 mt-1">
                Administra tus comidas y recetas
              </p>
            </div>
            <button
              onClick={abrirModalNuevo}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
            >
              ➕ Nueva Comida
            </button>
          </div>
        </div>

        {/* Lista de comidas */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Cargando comidas...
          </div>
        ) : comidas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              No hay comidas registradas. ¡Crea tu primera comida!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comidas.map((comida) => (
              <div
                key={comida.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {comida.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {TipoComida[comida.tipoComida]}
                  </p>

                  {comida.ingredientes && comida.ingredientes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Ingredientes:
                      </p>
                      <p className="text-sm text-gray-700">
                        {comida.ingredientes
                          .map((i) => i.nombreIngrediente)
                          .join(', ')}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => abrirModalEditar(comida)}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(comida.id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
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

      {/* Modal de Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {modoEdicion ? '✏️ Editar Comida' : '➕ Nueva Comida'}
                </h2>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la comida *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Huevos revueltos"
                  required
                />
              </div>

              {/* Tipo de Comida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de comida *
                </label>
                <select
                  value={formData.tipoComida}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoComida: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(TipoComida).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ingredientes */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ingredientes
                  </label>
                  <button
                    type="button"
                    onClick={agregarIngrediente}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    ➕ Agregar
                  </button>
                </div>

                {formData.ingredientes.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No hay ingredientes. Click en "Agregar" para empezar.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {formData.ingredientes.map((ing, index) => (
                      <div
                        key={index}
                        className="flex space-x-2 items-center bg-gray-50 p-2 rounded"
                      >
                        <select
                          value={ing.ingredienteId}
                          onChange={(e) =>
                            actualizarIngrediente(
                              index,
                              'ingredienteId',
                              parseInt(e.target.value)
                            )
                          }
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          {ingredientes.map((ingrediente) => (
                            <option key={ingrediente.id} value={ingrediente.id}>
                              {ingrediente.nombre}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={ing.cantidad}
                          onChange={(e) =>
                            actualizarIngrediente(index, 'cantidad', e.target.value)
                          }
                          placeholder="Cantidad"
                          className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                        />

                        <input
                          type="text"
                          value={ing.unidad}
                          onChange={(e) =>
                            actualizarIngrediente(index, 'unidad', e.target.value)
                          }
                          placeholder="Unidad"
                          className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                        />

                        <button
                          type="button"
                          onClick={() => eliminarIngrediente(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex space-x-3 pt-4">
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

export default CatalogoPage;