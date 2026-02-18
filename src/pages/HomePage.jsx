import { useState, useEffect } from 'react';
import WeeklyGrid from '../components/Grid/WeeklyGrid';
import MealSelector from '../components/Grid/MealSelector';
import ShoppingList from '../components/ShoppingList/ShoppingList';
import { getDiaSemanaNumber, getTipoComidaNumber, DiaSemana, TipoComida } from '../utils/enums';
import { menuService } from '../services/menuService';
import { comidaService } from '../services/comidaService';
import html2pdf from 'html2pdf.js';
import PDFGrid from '../components/Grid/PDFGrid';
import toast from 'react-hot-toast';

function HomePage() {
  const [vistaActual, setVistaActual] = useState('grid');
  const [menuComidas, setMenuComidas] = useState([]);
  const [menuGuardadoId, setMenuGuardadoId] = useState(null);
  const [menuGuardadoNombre, setMenuGuardadoNombre] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalGuardarAbierto, setModalGuardarAbierto] = useState(false);
  const [nombreMenu, setNombreMenu] = useState('');
  const [celdaSeleccionada, setCeldaSeleccionada] = useState({ dia: null, tipo: null });
  const [loadingRandom, setLoadingRandom] = useState(false);
  
// NUEVO: Cargar grid desde localStorage al iniciar
  useEffect(() => {
    const gridGuardado = localStorage.getItem('comidify_grid_borrador');
    
    if (gridGuardado) {
      try {
        const datosParseados = JSON.parse(gridGuardado);
        setMenuComidas(datosParseados);
        console.log('✅ Grid cargado desde localStorage:', datosParseados);
      } catch (error) {
        console.error('Error al cargar grid desde localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (menuComidas.length > 0) {
      const jsonString = JSON.stringify(menuComidas);
      localStorage.setItem('comidify_grid_borrador', jsonString);
      console.log('Grid guardado automáticamente en localStorage');
    }
  }, [menuComidas]);

  useEffect(() => {
    const menuGuardado = localStorage.getItem('menuACagar');
    if (menuGuardado) {
      try {
        const menu = JSON.parse(menuGuardado);
        setMenuComidas(menu.comidas || []);
        setMenuGuardadoId(menu.id);
        localStorage.removeItem('menuACagar');
        toast.success(`Menú "${menu.nombre}" cargado correctamente`);
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
    toast.error('El grid está vacío. Agrega comidas primero.');
    return;
  }

  const element = document.getElementById('weekly-grid-pdf');
  
  if (!element) {
    toast.error('No se pudo encontrar el grid');
    return;
  }

  const opt = {
    margin: [5, 5, 5, 5],
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
      toast.error('Primero agrega comidas al menú');
      return;
    }
    setModalGuardarAbierto(true);
  };

  const guardarMenu = async () => {
    if (!nombreMenu.trim()) {
      toast.error('El nombre del menú es obligatorio');
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
      toast.success('¡Menú guardado correctamente! Ahora puedes ver la lista de compras.');
      setVistaActual('lista');

      localStorage.removeItem('comidify_grid_borrador');
      console.log('🗑️ Borrador eliminado de localStorage (menú guardado)');
      
    } catch (error) {
      console.error('Error al guardar menú:', error);
      toast.error('Error al guardar el menú');
    }
  };

  const llenarGridRandomizer = async () => {
  if (menuComidas.length > 0) {
    if (!window.confirm('Esto reemplazará el menú actual. ¿Continuar?')) {
      return;
    }
  }

  setLoadingRandom(true);
  try {
    const response = await comidaService.getAll();
    const todasLasComidas = response.data;

    if (todasLasComidas.length === 0) {
      toast.error('No hay comidas en el catálogo. Crea algunas primero.');
      return;
    }

    const nuevasComidas = [];
    const dias = Object.keys(DiaSemana);
    const tipos = Object.keys(TipoComida);

    for (const dia of dias) {
      for (const tipo of tipos) {
        const comidasDelTipo = todasLasComidas.filter(
          c => c.tipoComida === parseInt(tipo)
        );

        if (comidasDelTipo.length > 0) {
          const comidasDisponibles = comidasDelTipo.filter(
            comida => !nuevasComidas.some(nc => nc.comidaId === comida.id)
          );

          const poolComidas = comidasDisponibles.length > 0 
            ? comidasDisponibles 
            : comidasDelTipo;

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
    toast.success(`¡Grid llenado con ${nuevasComidas.length} comidas aleatorias!`);
  } catch (error) {
    console.error('Error al randomizar:', error);
    toast.error('Error al generar el menú aleatorio');
  } finally {
    setLoadingRandom(false);
  }
};

  const limpiarGrid = () => {
      if (!window.confirm('¿Estás seguro de limpiar todo el menú?')) return;
      setMenuComidas([]);
      setMenuGuardadoId(null);

      localStorage.removeItem('comidify_grid_borrador');
      console.log('Borrador eliminado de localStorage (grid limpiado)');
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
        <div className="px-3 md:px-6">
          <div className="flex space-x-2 md:space-x-4">
            <button
              onClick={() => setVistaActual('grid')}
              className={`py-2 md:py-3 px-3 md:px-6 font-medium border-b-2 transition-colors text-sm md:text-base ${
                vistaActual === 'grid'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <span className="hidden sm:inline">📅 Menú Semanal</span>
              <span className="sm:hidden">📅 Menú</span>
            </button>
            <button
              onClick={() => setVistaActual('lista')}
              className={`py-2 md:py-3 px-3 md:px-6 font-medium border-b-2 transition-colors text-sm md:text-base ${
                vistaActual === 'lista'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <span className="hidden sm:inline">🛒 Lista de Compras</span>
              <span className="sm:hidden">🛒 Lista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-3 md:p-6">
        {vistaActual === 'grid' ? (
          <>
            <WeeklyGrid 
              menuComidas={menuComidas}
              onCellClick={handleCellClick}
              onDeleteCell={eliminarComidaDelGrid}
            />
            <div className="mt-6 px-2 md:px-0">
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                <button 
                  onClick={llenarGridRandomizer}
                  disabled={loadingRandom}
                  className="flex-1 min-w-[140px] md:min-w-0 md:flex-none bg-purple-600 text-white px-3 md:px-8 py-2 md:py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {loadingRandom ? '⏳ ...' : '🎲 Randomizer'}
                </button>

                <button 
                  onClick={exportarPDF}
                  className="flex-1 min-w-[140px] md:min-w-0 md:flex-none bg-orange-600 text-white px-3 md:px-8 py-2 md:py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg text-sm md:text-base"
                >
                  📄 PDF
                </button>

                <button 
                  onClick={limpiarGrid}
                  className="flex-1 min-w-[140px] md:min-w-0 md:flex-none bg-red-600 text-white px-3 md:px-8 py-2 md:py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg text-sm md:text-base"
                >
                  🗑️ Limpiar
                </button>
                          
                <button 
                  onClick={abrirModalGuardar}
                  className="flex-1 min-w-[140px] md:min-w-0 md:flex-none bg-green-600 text-white px-3 md:px-8 py-2 md:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg text-sm md:text-base"
                >
                  💾 Guardar
                </button>
                
                {menuGuardadoId && (
                  <button 
                    onClick={() => setVistaActual('lista')}
                    className="flex-1 min-w-[140px] md:min-w-0 md:flex-none bg-blue-600 text-white px-3 md:px-8 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg text-sm md:text-base"
                  >
                    <span className="hidden md:inline">👀 Ver Lista</span>
                    <span className="md:hidden">👀 Lista</span>
                  </button>
                )}
              </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-green-600 text-white p-3 md:p-4 rounded-t-lg">
              <h2 className="text-lg md:text-xl font-bold">💾 Guardar Menú Semanal</h2>
            </div>

            <div className="p-4 md:p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del menú:
              </label>
              <input
                type="text"
                value={nombreMenu}
                onChange={(e) => setNombreMenu(e.target.value)}
                placeholder="Ej: Menú Semana 1"
                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                autoFocus
              />

              <div className="mt-4 md:mt-6 flex space-x-3">
                <button
                  onClick={() => setModalGuardarAbierto(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarMenu}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
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