# 🍕 Comidify

Aplicación para planificar menús semanales con lista de compras automática.

## 🚀 Características

- 📅 Grid semanal 7x5 (7 días × 5 tipos de comida)
- 🍽️ Catálogo de comidas con ingredientes
- 🛒 Lista de compras automática
- 💾 Guardar y cargar menús
- 🎲 Randomizer (llenar grid automáticamente)
- 📄 Exportar menú a PDF
- 🎨 Dos temas (Moderno y Rústico)

## 🛠️ Tecnologías

### Backend
- .NET 9.0
- Entity Framework Core
- SQLite / PostgreSQL (Supabase)
- ASP.NET Core Web API

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios
- React Router

## 🏃‍♂️ Ejecutar en Desarrollo

### Backend
```bash
cd Comidify.Backend/Comidify.API
dotnet restore
dotnet run
```

Backend disponible en: `https://localhost:5001`

### Frontend
```bash
cd Comidify.Frontend
npm install
npm run dev
```

Frontend disponible en: `http://localhost:5173`

## 📦 Compilar para Producción

### Backend
```bash
dotnet publish -c Release
```

### Frontend
```bash
npm run build
```

## 📄 Licencia

MIT

## 👨‍💻 Autor

Carlos Rodríguez
