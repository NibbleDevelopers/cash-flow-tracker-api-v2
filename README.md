# 💰 Cash Flow Tracker API

Backend API para la aplicación de seguimiento de flujo de efectivo con integración de Google Sheets.

## 🚀 Características

- **API RESTful** con Express.js
- **Integración con Google Sheets** usando Service Account para autenticación
- **Autenticación JWT** para seguridad
- **Validación de datos** con express-validator
- **Logging estructurado** con Winston
- **Manejo de errores centralizado**
- **Rate limiting** para protección contra abuso
- **Linting y formateo** con ESLint y Prettier

## 🏗️ Arquitectura

```
src/
├── config/          # Configuración de la aplicación
├── controllers/     # Controladores de la API
├── middleware/      # Middleware personalizado
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── validators/      # Validadores de datos
```

## 📋 Prerrequisitos

- Node.js 18+ 
- npm 8+
- Cuenta de Google Cloud Platform
- Google Sheets API habilitada
- **Service Account** de Google (solo 3 variables de configuración)

## ⚙️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/cash-flow-tracker-api.git
   cd cash-flow-tracker-api
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales (solo 3 variables requeridas para Google Sheets):
   ```env
   # Google Sheets Configuration (REQUIRED)
   GOOGLE_SHEET_ID=tu_sheet_id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=tu_email@proyecto.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_clave_privada\n-----END PRIVATE KEY-----\n"
   
   # Server Configuration (Optional - defaults provided)
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=tu_secreto_jwt
   ```

4. **Configurar Google Sheets Service Account**
   
   Para usar la API de Google Sheets, necesitas crear una **Service Account**:
   
   a. Ve a [Google Cloud Console](https://console.cloud.google.com/)
   b. Crea un nuevo proyecto o selecciona uno existente
   c. Habilita la **Google Sheets API**
   d. Ve a **IAM & Admin > Service Accounts**
   e. Crea una nueva service account
   f. Genera una clave JSON y descárgala
   g. Comparte tu Google Sheet con el email de la service account
   h. Extrae los valores del JSON y configúralos en tu `.env`:
      - `GOOGLE_SHEET_ID`: ID de tu hoja de cálculo (de la URL)
      - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Email de la service account
      - `GOOGLE_PRIVATE_KEY`: Clave privada del JSON (con saltos de línea)

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🚀 Scripts Disponibles

- `npm start` - Iniciar en producción
- `npm run dev` - Iniciar en desarrollo con nodemon
- `npm run lint` - Verificar código con ESLint
- `npm run lint:fix` - Corregir errores de ESLint
- `npm run format` - Formatear código con Prettier
- `npm run validate` - Validar código

## 📚 API Endpoints

### Gastos
- `GET /api/expenses` - Obtener todos los gastos
- `POST /api/expenses` - Crear nuevo gasto

### Categorías
- `GET /api/categories` - Obtener todas las categorías

### Presupuesto
- `GET /api/budget` - Obtener presupuesto
- `PUT /api/budget` - Actualizar presupuesto

### Gastos Fijos
- `GET /api/fixed-expenses` - Obtener gastos fijos
- `POST /api/fixed-expenses` - Crear gasto fijo
- `PUT /api/fixed-expenses` - Actualizar gasto fijo

### Utilidades
- `GET /` - Información de la API
- `GET /health` - Estado de salud de la API

## 🔒 Seguridad

- **Helmet.js** para headers de seguridad
- **CORS** configurado para orígenes específicos
- **Rate limiting** para prevenir abuso
- **Validación de entrada** con express-validator
- **Sanitización de datos** automática


## 📊 Logging

La aplicación utiliza Winston para logging estructurado:

- **Console**: Para desarrollo
- **Archivos**: Para producción (`logs/app.log`, `logs/error.log`)
- **Niveles**: error, warn, info, debug

## ⚙️ Configuración

### Variables de Entorno

#### **🔑 Google Sheets (REQUERIDAS)**
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GOOGLE_SHEET_ID` | ID de Google Sheet (de la URL) | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email de la service account | `mi-app@proyecto.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Clave privada del JSON (con `\n`) | `"-----BEGIN PRIVATE KEY-----\n..."` |

#### **⚙️ Configuración del Servidor (OPCIONALES)**
| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 3001 |
| `NODE_ENV` | Ambiente de ejecución | development |
| `JWT_SECRET` | Secreto para JWT | - |
| `LOG_LEVEL` | Nivel de logging | info |
| `CORS_ORIGIN` | Origen permitido para CORS | http://localhost:3000 |

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en issues existentes
3. Crea un nuevo issue

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/) - Framework web
- [Google Sheets API](https://developers.google.com/sheets/api) - Integración de datos
- [Winston](https://github.com/winstonjs/winston) - Sistema de logging

---

⭐ Si te gusta este proyecto, ¡dale una estrella!