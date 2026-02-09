import { DiaSemana, TipoComida } from '../../utils/enums';

function PDFGrid({ menuComidas }) {
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
    <div 
      id="weekly-grid-pdf" 
      style={{
        width: '277mm',
        padding: '10mm',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Header del PDF */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          🍕 Comidify - Menú Semanal
        </h1>
        <p style={{ 
          fontSize: '14px',
          color: '#6b7280',
          margin: '0'
        }}>
          Generado el {new Date().toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Grid - Tabla más compacta */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '2px solid #1f2937',
        fontSize: '11px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#2563eb' }}>
            <th style={{
              border: '2px solid #1f2937',
              padding: '8px 4px',
              textAlign: 'left',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
              width: '80px'
            }}>
              Tipo
            </th>
            {dias.map((dia) => (
              <th key={dia} style={{
                border: '2px solid #1f2937',
                padding: '8px 4px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tipos.map((tipo, tipoIndex) => (
            <tr key={tipo} style={{
              backgroundColor: tipoIndex % 2 === 0 ? '#f3f4f6' : 'white'
            }}>
              <td style={{
                border: '2px solid #1f2937',
                padding: '8px 4px',
                fontWeight: 'bold',
                backgroundColor: '#e5e7eb',
                fontSize: '11px',
                verticalAlign: 'top'
              }}>
                {tipo}
              </td>
              {dias.map((dia) => {
                const comida = getComidaForCell(dia, tipo);
                return (
                  <td 
                    key={`${dia}-${tipo}`}
                    style={{
                      border: '2px solid #1f2937',
                      padding: '6px 4px',
                      verticalAlign: 'top',
                      minHeight: '40px',
                      fontSize: '10px'
                    }}
                  >
                    {comida ? (
                      <div>
                        <strong style={{ 
                          color: '#1f2937',
                          fontSize: '10px',
                          display: 'block',
                          wordWrap: 'break-word'
                        }}>
                          {comida.nombreComida}
                        </strong>
                      </div>
                    ) : (
                      <span style={{ 
                        color: '#9ca3af', 
                        fontSize: '9px',
                        fontStyle: 'italic'
                      }}>
                        -
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        fontSize: '11px',
        color: '#6b7280'
      }}>
        <p style={{ margin: 0 }}>Creado con ❤️ por Comidify</p>
      </div>
    </div>
  );
}

export default PDFGrid;