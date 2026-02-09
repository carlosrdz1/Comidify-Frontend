export const TipoComida = {
  1: 'Desayuno',
  2: 'Almuerzo',
  3: 'Comida',
  4: 'Merienda',
  5: 'Cena'
};

export const DiaSemana = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo'
};

export const getTipoComidaNumber = (nombre) => {
  return Object.keys(TipoComida).find(key => TipoComida[key] === nombre);
};

export const getDiaSemanaNumber = (nombre) => {
  return Object.keys(DiaSemana).find(key => DiaSemana[key] === nombre);
};