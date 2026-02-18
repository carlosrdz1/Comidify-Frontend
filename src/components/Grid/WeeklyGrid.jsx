import { useState } from 'react';
import GridCell from './GridCell';
import { TipoComida, DiaSemana } from '../../utils/enums';
import { useTheme } from '../../context/ThemeContext';

function WeeklyGrid({ menuComidas, onCellClick, onDeleteCell }) {
  const { theme } = useTheme();
  const dias = Object.values(DiaSemana);
  const tipos = Object.values(TipoComida);

  const getComidaForCell = (dia, tipo) => {
    if (!menuComidas) return null;
    
    const diaNum = Object.keys(DiaSemana).find(key => DiaSemana[key] === dia);
    const tipoNum = Object.keys(TipoComida).find(key => TipoComida[key] === tipo);
    
    return menuComidas.find(
      mc => mc.diaSemana === parseInt(diaNum) && mc.tipoComida === parseInt(tipoNum)
    );
  };

  return (
    <div className="p-2 md:p-4">
      <div className="overflow-x-auto -mx-2 md:mx-0">
        <div className="inline-block min-w-full align-middle px-2 md:px-0">
          <table 
            className={`w-full border-collapse shadow-lg rounded-lg ${theme === 'rustico' ? 'grid-rustico' : 'bg-white'}`}
            style={{ minWidth: '640px' }}
          >
            <thead>
              <tr className={theme === 'rustico' ? '' : 'bg-blue-600 text-white'}>
                <th 
                  className="border p-2 md:p-3 text-left font-semibold text-xs md:text-base sticky left-0 z-10"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: theme === 'default' ? 'var(--color-primary)' : theme === 'rustico' ? undefined : '#2563eb',
                    color: theme === 'default' ? 'var(--text-white)' : undefined
                  }}
                >
                  <span className="hidden sm:inline">Tipo de Comida</span>
                  <span className="sm:hidden">Tipo</span>
                </th>
                {dias.map((dia) => (
                  <th 
                    key={dia} 
                    className="border p-2 md:p-3 text-center font-semibold text-xs md:text-base"
                    style={{
                      borderColor: 'var(--border-color)',
                      backgroundColor: theme === 'default' ? 'var(--color-primary)' : undefined,
                      color: theme === 'default' ? 'var(--text-white)' : undefined
                    }}
                  >
                    <span className="hidden sm:inline">{dia}</span>
                    <span className="sm:hidden">{dia.substring(0, 3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => (
                <tr key={tipo} className={theme === 'rustico' ? '' : 'hover:bg-gray-50'}>
                  <td 
                    className="border p-2 md:p-3 font-medium text-xs md:text-base sticky left-0 z-10"
                    style={{
                      borderColor: 'var(--border-color)',
                      backgroundColor: theme === 'rustico' ? undefined : '#f3f4f6',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span className="hidden sm:inline">{tipo}</span>
                    <span className="sm:hidden">{tipo.substring(0, 6)}</span>
                  </td>
                  {dias.map((dia) => {
                    const comida = getComidaForCell(dia, tipo);
                    return (
                      <GridCell
                        key={`${dia}-${tipo}`}
                        dia={dia}
                        tipo={tipo}
                        comida={comida}
                        onClick={() => onCellClick(dia, tipo)}
                        onDelete={onDeleteCell}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div 
        className="mt-4 text-xs md:text-sm text-center"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="hidden md:inline">
          💡 Tip: Click derecho o el botón × para eliminar una comida individual
        </span>
        <span className="md:hidden">
          💡 Desliza horizontalmente para ver todo el menú
        </span>
      </div>
    </div>
  );
}

export default WeeklyGrid;