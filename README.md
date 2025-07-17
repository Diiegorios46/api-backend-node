# Backend Node API

Este proyecto es una API RESTful desarrollada con **Node.js**, **Express** y **MongoDB**. Permite la gestión de usuarios y artículos, ideal para blogs, foros o cualquier aplicación que requiera autenticación y publicación de contenido.

## Características

- **Usuarios**
  - Registro y login con validación de datos
  - Perfil de usuario
  - Actualización de datos y avatar
  - Autenticación JWT

- **Artículos**
  - Crear, leer, actualizar y eliminar artículos
  - Listar artículos por usuario
  - Búsqueda de artículos por título o contenido
  - Paginación de resultados

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/backend-node.git
   cd backend-node
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Descarga PostMan para ver las url . 

4. Descarga MongoDB Compass para ver la base de datos .

5. Inicia el servidor con nodemon para la actualizacion constante.
   npm start

## Endpoints principales

### Usuarios

- `POST /api/register` — Registrar usuario
- `POST /api/login` — Login de usuario
- `GET /api/profile/:id` — Ver perfil de usuario
- `PUT /api/user/update` — Actualizar datos de usuario
- `POST /api/user/upload` — Subir avatar

### Artículos

- `POST /api/article` — Crear artículo
- `GET /api/article/:id` — Ver detalle de artículo
- `PUT /api/article/update` — Actualizar artículo
- `DELETE /api/article/:id` — Eliminar artículo
- `GET /api/articles/user/:userId` — Listar artículos de un usuario
- `GET /api/articles/search/:search` — Buscar artículos

## Tecnologías usadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework minimalista para crear APIs y manejar rutas HTTP.
- **MongoDB + Mongoose**: Base de datos NoSQL y ODM para modelar datos y realizar consultas.
- **JWT (JSON Web Token)**: Sistema de autenticación basado en tokens seguros.
- **Multer**: Middleware para gestionar la subida de archivos (como imágenes de usuario).
- **Validator**: Librería para validar y sanear datos de entrada.
- **mongoose-paginate-v2**: Plugin para paginación eficiente de resultados en consultas MongoDB.
- **nodemon**: Herramienta que reinicia automáticamente el servidor al detectar cambios en el servdor
- **cors**: Middleware para habilitar el intercambio de recursos entre diferentes dominios (CORS) en las peticiones HTTP.
- **bcryptjs**: Librería para cifrar y comparar contraseñas de forma segura.

## Notas

- Asegúrate de tener MongoDB corriendo localmente o usa un servicio en la nube.
- Los endpoints protegidos requieren autenticación mediante token JWT.

---

Desarrollado por Diego Rios .