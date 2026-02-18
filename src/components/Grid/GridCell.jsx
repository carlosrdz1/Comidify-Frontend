function GridCell({ dia, tipo, comida, onClick, onDelete }) {
  const handleRightClick = (e) => {
    e.preventDefault();
    if (comida && onDelete) {
      if (confirm(`¿Eliminar "${comida.nombreComida}"?`)) {
        onDelete(dia, tipo);
      }
    }
  };

  return (
    <td 
      className="border border-gray-300 p-1 md:p-3 cursor-pointer hover:bg-blue-50 transition-colors min-w-[80px] md:min-w-[120px] h-16 md:h-20 relative group"
      onClick={onClick}
      onContextMenu={handleRightClick}
    >
      {comida ? (
        <div className="text-xs md:text-sm">
          <p className="font-medium text-gray-800 line-clamp-2">
            {comida.nombreComida}
          </p>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`¿Eliminar "${comida.nombreComida}"?`)) {
                  onDelete(dia, tipo);
                }
              }}
              className="absolute top-0.5 right-0.5 md:top-1 md:right-1 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          )}
        </div>
      ) : (
        <div className="text-gray-400 text-center text-xs">
          <span className="hidden sm:inline">Click para agregar</span>
          <span className="sm:hidden">+</span>
        </div>
      )}
    </td>
  );
}

export default GridCell;