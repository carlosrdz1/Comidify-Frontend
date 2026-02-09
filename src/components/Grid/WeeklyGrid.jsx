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
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse shadow-lg rounded-lg ${theme === 'rustico' ? 'grid-rustico' : 'bg-white'}`}>
          <thead>
            <tr className={theme === 'rustico' ? '' : 'bg-blue-600 text-white'}>
              <th 
                className="border p-3 text-left font-semibold"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: theme === 'default' ? 'var(--color-primary)' : undefined,
                  color: theme === 'default' ? 'var(--text-white)' : undefined
                }}
              >
                Tipo de Comida
              </th>
              {dias.map((dia) => (
                <th 
                  key={dia} 
                  className="border p-3 text-center font-semibold"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: theme === 'default' ? 'var(--color-primary)' : undefined,
                    color: theme === 'default' ? 'var(--text-white)' : undefined
                  }}
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo) => (
              <tr key={tipo} className={theme === 'rustico' ? '' : 'hover:bg-gray-50'}>
                <td 
                  className="border p-3 font-medium"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: theme === 'rustico' ? undefined : '#f3f4f6',
                    color: 'var(--text-primary)'
                  }}
                >
                  {tipo}
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
      
      <div 
        className="mt-4 text-sm text-center"
        style={{ color: 'var(--text-secondary)' }}
      >
        💡 Tip: Click derecho o el botón × para eliminar una comida individual
      </div>
    </div>
  );
}

export default WeeklyGrid;