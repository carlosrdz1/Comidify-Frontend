import { useState, useEffect } from 'react';
import WeeklyGrid from '../components/Grid/WeeklyGrid';
import MealSelector from '../components/Grid/MealSelector';
import ShoppingList from '../components/ShoppingList/ShoppingList';
import { getDiaSemanaNumber, getTipoComidaNumber, DiaSemana, TipoComida } from '../utils/enums';
import { menuService } from '../services/menuService';
import { comidaService } from '../services/comidaService';
import html2pdf from 'html2pdf.js';
import PDFGrid from '../components/Grid/PDFGrid';



function HomePage() {
  const [vistaActual, setVistaActual] = useState('grid');
  const [menuComidas, setMenuComidas] = useState([]);
  const [menuGuardadoId, setMenuGuardadoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalGuardarAbierto, setModalGuardarAbierto] = useState(false);
  const [nombreMenu, setNombreMenu] = useState('');
  const [celdaSeleccionada, setCeldaSeleccionada] = useState({ dia: null, tipo: null });
  const [loadingRandom, setLoadingRandom] = useState(false);

  // NUEVO: Cargar menú desde localStorage
  useEffect(() => {
    const menuGuardado = localStorage.getItem('menuACagar');
    if (menuGuardado) {
      try {
        const menu = JSON.parse(menuGuardado);
        setMenuComidas(menu.comidas || []);
        setMenuGuardadoId(menu.id);
        localStorage.removeItem('menuACagar'); // Limpiar después de cargar
        alert(`Menú "${menu.nombre}" cargado correctamente`);
      } catch (error) {
        console.error('Error al cargar menú:', error);
      }
    }
  }, []);

  const handleCellClick = (dia, tipo) => {
    setCeldaSeleccionada({ dia, tipo });
    setModalAbierto(true);
  };

const exportarPDF = () => {
  if (menuComidas.length === 0) {
    alert('El grid está vacío. Agrega comidas primero.');
    return;
  }

  const element = document.getElementById('weekly-grid-pdf');
  
  if (!element) {
    alert('No se pudo encontrar el grid');
    return;
  }

  const opt = {
    margin: [5, 5, 5, 5], // top, right, bottom, left en mm
    filename: `menu-semanal-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'landscape',
      compress: true
    },
    pagebreak: { mode: 'avoid-all' }
  };

  html2pdf().set(opt).from(element).save();
};

  const handleSelectComida = (comida) => {
    const diaNum = parseInt(getDiaSemanaNumber(celdaSeleccionada.dia));
    const tipoNum = parseInt(getTipoComidaNumber(celdaSeleccionada.tipo));

    const index = menuComidas.findIndex(
      mc => mc.diaSemana === diaNum && mc.tipoComida === tipoNum
    );

    const nuevaMenuComida = {
      comidaId: comida.id,
      nombreComida: comida.nombre,
      diaSemana: diaNum,
      tipoComida: tipoNum,
    };

    if (index >= 0) {
      const nuevasComidas = [...menuComidas];
      nuevasComidas[index] = nuevaMenuComida;
      setMenuComidas(nuevasComidas);
    } else {
      setMenuComidas([...menuComidas, nuevaMenuComida]);
    }
  };

  const abrirModalGuardar = () => {
    if (menuComidas.length === 0) {
      alert('Primero agrega comidas al menú');
      return;
    }
    setModalGuardarAbierto(true);
  };

  const guardarMenu = async () => {
    if (!nombreMenu.trim()) {
      alert('El nombre del menú es obligatorio');
      return;
    }

    try {
      const data = {
        nombre: nombreMenu,
        comidas: menuComidas.map(mc => ({
          comidaId: mc.comidaId,
          diaSemana: mc.diaSemana,
          tipoComida: mc.tipoComida,
        })),
      };

      const response = await menuService.create(data);
      setMenuGuardadoId(response.data.id);
      setModalGuardarAbierto(false);
      setNombreMenu('');
      alert('¡Menú guardado correctamente! Ahora puedes ver la lista de compras.');
      setVistaActual('lista');
    } catch (error) {
      console.error('Error al guardar menú:', error);
      alert('Error al guardar el menú');
    }
  };

  const llenarGridRandomizer = async () => {
  if (menuComidas.length > 0) {
    if (!confirm('Esto reemplazará el menú actual. ¿Continuar?')) {
      return;
    }
  }

  setLoadingRandom(true);
  try {
    // Obtener todas las comidas del backend
    const response = await comidaService.getAll();
    const todasLasComidas = response.data;

    if (todasLasComidas.length === 0) {
      alert('No hay comidas en el catálogo. Crea algunas primero.');
      return;
    }

    const nuevasComidas = [];
    const dias = Object.keys(DiaSemana);
    const tipos = Object.keys(TipoComida);

    // Para cada día de la semana
    for (const dia of dias) {
      // Para cada tipo de comida
      for (const tipo of tipos) {
        // Filtrar comidas que correspondan a este tipo
        const comidasDelTipo = todasLasComidas.filter(
          c => c.tipoComida === parseInt(tipo)
        );

        if (comidasDelTipo.length > 0) {
          // Excluir comidas que ya se usaron (para evitar repetir)
          const comidasDisponibles = comidasDelTipo.filter(
            comida => !nuevasComidas.some(nc => nc.comidaId === comida.id)
          );

          // Si no hay disponibles sin repetir, usar todas del tipo
          const poolComidas = comidasDisponibles.length > 0 
            ? comidasDisponibles 
            : comidasDelTipo;

          // Seleccionar una comida aleatoria
          const comidaRandom = poolComidas[
            Math.floor(Math.random() * poolComidas.length)
          ];

          nuevasComidas.push({
            comidaId: comidaRandom.id,
            nombreComida: comidaRandom.nombre,
            diaSemana: parseInt(dia),
            tipoComida: parseInt(tipo),
          });
        }
      }
    }

    setMenuComidas(nuevasComidas);
    alert(`¡Grid llenado con ${nuevasComidas.length} comidas aleatorias!`);
  } catch (error) {
    console.error('Error al randomizar:', error);
    alert('Error al generar el menú aleatorio');
  } finally {
    setLoadingRandom(false);
  }
};

  const limpiarGrid = () => {
      if (!confirm('¿Estás seguro de limpiar todo el menú?')) return;
      setMenuComidas([]);
      setMenuGuardadoId(null);
    };

    const eliminarComidaDelGrid = (dia, tipo) => {
      const diaNum = parseInt(getDiaSemanaNumber(dia));
      const tipoNum = parseInt(getTipoComidaNumber(tipo));
      
      const nuevasComidas = menuComidas.filter(
        mc => !(mc.diaSemana === diaNum && mc.tipoComida === tipoNum)
      );
      
      setMenuComidas(nuevasComidas);
    };

  return (
    <div>
      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setVistaActual('grid')}
              className={`py-3 px-6 font-medium border-b-2 transition-colors ${
                vistaActual === 'grid'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              📅 Menú Semanal
            </button>
            <button
              onClick={() => setVistaActual('lista')}
              className={`py-3 px-6 font-medium border-b-2 transition-colors ${
                vistaActual === 'lista'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              🛒 Lista de Compras
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {vistaActual === 'grid' ? (
          <>
            <WeeklyGrid 
              menuComidas={menuComidas}
              onCellClick={handleCellClick}
              onDeleteCell={eliminarComidaDelGrid}
            />
            <div className="mt-6 text-center space-x-4 flex flex-wrap justify-center gap-4">
              <button 
                onClick={llenarGridRandomizer}
                disabled={loadingRandom}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingRandom ? '🎲 Generando...' : '🎲 Randomizer'}
              </button>

              <button 
                onClick={limpiarGrid}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg"
              >
                🗑️ Limpiar Grid
              </button>

              <button 
                onClick={exportarPDF}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg"
              >
                📄 Exportar PDF
              </button>
                          
              <button 
                onClick={abrirModalGuardar}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
              >
                💾 Guardar Menú Semanal
              </button>
              
              {menuGuardadoId && (
                <button 
                  onClick={() => setVistaActual('lista')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                >
                  👀 Ver Lista de Compras
                </button>
              )}
            </div>
          </>
        ) : (
          <ShoppingList menuId={menuGuardadoId} />
        )}
      </div>

      {/* Modal de Selección de Comida */}
      <MealSelector
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSelect={handleSelectComida}
        diaSeleccionado={celdaSeleccionada.dia}
        tipoSeleccionado={celdaSeleccionada.tipo}
      />

      {/* Modal de Guardar Menú */}
      {modalGuardarAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-green-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">💾 Guardar Menú Semanal</h2>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del menú:
              </label>
              <input
                type="text"
                value={nombreMenu}
                onChange={(e) => setNombreMenu(e.target.value)}
                placeholder="Ej: Menú Semana 1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setModalGuardarAbierto(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarMenu}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="hidden">
        <PDFGrid menuComidas={menuComidas} />
      </div>
    </div>
  );
}

export default HomePage;