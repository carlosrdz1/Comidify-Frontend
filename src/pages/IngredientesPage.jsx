import { useState, useEffect, useRef } from 'react';
import { ingredienteService } from '../services/ingredienteService';
import toast from 'react-hot-toast';

function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [listaIngredientes, setListaIngredientes] = useState(['']); 
  const [ingredientesInvalidos, setIngredientesInvalidos] = useState(new Set()); 
  const inputRefs = useRef([]);

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
      toast.error('Error al cargar los ingredientes');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setIngredienteSeleccionado(null);
    setNombre('');
    setListaIngredientes(['']);
    setIngredientesInvalidos(new Set());
    setModalAbierto(true);
  };

  const abrirModalEditar = (ingrediente) => {
    setModoEdicion(true);
    setIngredienteSeleccionado(ingrediente);
    setNombre(ingrediente.nombre);
    setModalAbierto(true);
  };

  const actualizarIngredienteEnLista = (index, valor) => {
    const nuevaLista = [...listaIngredientes];
    nuevaLista[index] = valor;
    setListaIngredientes(nuevaLista);
    
    const nuevosInvalidos = new Set(ingredientesInvalidos);
    nuevosInvalidos.delete(index);
    setIngredientesInvalidos(nuevosInvalidos);
  };

  const agregarNuevaLinea = (index) => {
    const nuevaLista = [...listaIngredientes];
    nuevaLista.splice(index + 1, 0, '');
    setListaIngredientes(nuevaLista);
    setTimeout(() => {
      inputRefs.current[index + 1]?.focus();
    }, 50);
  };

  const eliminarLinea = (index) => {
    if (listaIngredientes.length === 1) return;
    
    const nuevaLista = listaIngredientes.filter((_, i) => i !== index);
    setListaIngredientes(nuevaLista);
    
    const nuevosInvalidos = new Set();
    ingredientesInvalidos.forEach(i => {
      if (i < index) nuevosInvalidos.add(i);
      else if (i > index) nuevosInvalidos.add(i - 1);
    });
    setIngredientesInvalidos(nuevosInvalidos);
  };    

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modoEdicion) {
      if (!nombre.trim()) {
        toast.error('El nombre es obligatorio');
        return;
      }

      try {
        await ingredienteService.update(ingredienteSeleccionado.id, { nombre });
        toast.success('Ingrediente actualizado correctamente');
        setModalAbierto(false);
        cargarIngredientes();
      } catch (error) {
        console.error('Error al guardar ingrediente:', error);
        if (error.response?.status === 409) {
          toast.error('Ya existe un ingrediente con ese nombre');
        } else {
          toast.error('Error al guardar el ingrediente');
        }
      }
    } else {
      const ingredientesLimpios = listaIngredientes
        .map(ing => ing.trim())
        .filter(ing => ing !== '');

      if (ingredientesLimpios.length === 0) {
        toast.error('Agrega al menos un ingrediente');
        return;
      }

      const duplicadosInternos = new Set();
      const vistos = new Set();
      ingredientesLimpios.forEach((ing, index) => {
        const nombreLower = ing.toLowerCase();
        if (vistos.has(nombreLower)) {
          duplicadosInternos.add(index);
        } else {
          vistos.add(nombreLower);
        }
      });

      const duplicadosDB = new Set();
      for (let i = 0; i < ingredientesLimpios.length; i++) {
        const nombreLower = ingredientesLimpios[i].toLowerCase();
        const existe = ingredientes.some(
          ing => ing.nombre.toLowerCase() === nombreLower
        );
        if (existe) {
          duplicadosDB.add(i);
        }
      }

      const todosInvalidos = new Set([...duplicadosInternos, ...duplicadosDB]);

      if (todosInvalidos.size > 0) {
        setIngredientesInvalidos(todosInvalidos);
        toast.error('Algunos ingredientes están duplicados o ya existen');
        return;
      }

      try {
        let creados = 0;
        let errores = 0;

        for (const nombreIng of ingredientesLimpios) {
          try {
            await ingredienteService.create({ nombre: nombreIng });
            creados++;
          } catch (error) {
            console.error(`Error al crear ${nombreIng}:`, error);
            errores++;
          }
        }

        if (creados > 0) {
          toast.success(`${creados} ingrediente${creados > 1 ? 's' : ''} creado${creados > 1 ? 's' : ''}`);
        }
        
        if (errores > 0) {
          toast.error(`${errores} ingrediente${errores > 1 ? 's' : ''} no se pudo${errores > 1 ? 'ieron' : ''} crear`);
        }

        setModalAbierto(false);
        cargarIngredientes();
      } catch (error) {
        console.error('Error al guardar ingredientes:', error);
        toast.error('Error al guardar los ingredientes');
      }
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este ingrediente?')) return;

    try {
      await ingredienteService.delete(id);
      toast.success('Ingrediente eliminado correctamente');
      cargarIngredientes();
    } catch (error) {
      console.error('Error al eliminar ingrediente:', error);
      if (error.response?.status === 400) {
        toast.error('No se puede eliminar el ingrediente porque está siendo usado en una o más comidas');
      } else {
        toast.error('Error al eliminar el ingrediente');
      }
    }
  };

  return (
    <div className="p-3 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                🥕 Ingredientes
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Administra tus ingredientes
              </p>
            </div>
            <button
              onClick={abrirModalNuevo}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg text-sm md:text-base"
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
              className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            />
          </div>
        </div>

        {/* Lista de ingredientes */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm md:text-base">
            Cargando ingredientes...
          </div>
        ) : ingredientes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
            <p className="text-gray-500 text-base md:text-lg">
              {busqueda
                ? 'No se encontraron ingredientes con ese nombre'
                : 'No hay ingredientes registrados. ¡Crea tu primer ingrediente!'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Nombre</th>
                    <th className="px-3 md:px-6 py-3 text-right font-semibold text-sm md:text-base">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ingredientes.map((ingrediente) => (
                    <tr key={ingrediente.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-3 md:py-4 text-gray-800 font-medium text-sm md:text-base">
                        {ingrediente.nombre}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-right space-x-1 md:space-x-2">
                        <button
                          onClick={() => abrirModalEditar(ingrediente)}
                          className="bg-yellow-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-yellow-600 transition-colors text-xs md:text-sm font-medium"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(ingrediente.id)}
                          className="bg-red-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm font-medium"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] md:max-h-auto overflow-y-auto">
            <div className="bg-blue-600 text-white p-3 md:p-4 rounded-t-lg">
              <h2 className="text-lg md:text-xl font-bold">
                {modoEdicion ? '✏️ Editar Ingrediente' : '➕ Nuevo Ingrediente'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              {modoEdicion ? (
                <div className="mb-4">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Nombre del ingrediente *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Ej: Tomate"
                    autoFocus
                    required
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Ingredientes (uno por línea, presiona Enter para agregar más)
                  </label>
                  <div className="space-y-2 max-h-80 md:max-h-96 overflow-y-auto">
                    {listaIngredientes.map((ingrediente, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          value={ingrediente}
                          onChange={(e) => actualizarIngredienteEnLista(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              agregarNuevaLinea(index);
                            }
                          }}
                          className={`flex-1 border rounded-lg px-3 md:px-4 py-2 focus:ring-2 focus:border-transparent text-sm md:text-base ${
                            ingredientesInvalidos.has(index)
                              ? 'border-red-500 bg-red-50 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder={`Ingrediente ${index + 1}`}
                          autoFocus={index === 0}
                        />
                        {listaIngredientes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarLinea(index)}
                            className="bg-red-500 text-white px-2 md:px-3 py-2 rounded-lg hover:bg-red-600 text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {ingredientesInvalidos.size > 0 && (
                    <p className="text-red-600 text-xs md:text-sm mt-2">
                      Los ingredientes en rojo están duplicados o ya existen
                    </p>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
                >
                  {modoEdicion ? 'Actualizar' : `Crear ${listaIngredientes.filter(i => i.trim()).length || 0}`}
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