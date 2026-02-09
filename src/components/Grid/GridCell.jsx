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
      className="border border-gray-300 p-3 cursor-pointer hover:bg-blue-50 transition-colors min-w-[120px] h-20 relative group"
      onClick={onClick}
      onContextMenu={handleRightClick}
    >
      {comida ? (
        <div className="text-sm">
          <p className="font-medium text-gray-800 truncate">
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
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      ) : (
        <div className="text-gray-400 text-center text-xs">
          Click para agregar
        </div>
      )}
    </td>
  );
}

export default GridCell;