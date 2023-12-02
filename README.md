# Tienda

Se desarrollo una aplicación web del lado del cliente y otra del lado del servidor en relación a un sistema de gestión de usuarios, productos y ventas. 
La aplicación consta de la creación de un cliente en React el cual se conecta a una API REST (Express y Mysql)  que permita a los usuarios crear, consultar, actualizar y eliminar usuarios/productos (usuario administrador) y productos (usuario asesor). para ello se tuvo en cuenta:

Se construyo un servidor http con express.

Usando el gestor de base de datos MYSQL y configurando la conexión con Node importando el módulo mysql2.
La base de datos esta constituida por dos tablas:
Tabla de Productos:
   - codigo (clave primaria)
   - nombre
   - descripción
   - precio
   - stock

Tabla de Ventas:
   - codigo (clave primaria)
   - codigo_producto (clave foranea)
   - codigo_cliente (clave foranea)
   - fecha_venta
   - cantidad_vendida
   - total_venta

Tabla de Usuarios:
   - codigo (clave primaria)
   - usuario
   - password
   - rol
     
Rutas para Productos:
   - GET /products: Consulta todos los productos.
   - GET /products/:codigo: Consulta el producto correspondiente al código.
   - POST /products: Crea un nuevo producto.
   - PATCH /products/:codigo: Actualiza el producto correspondiente al código.
   - DELETE /products/:codigo: Elimina el producto correspondiente al código.

Rutas para Ventas:
   - GET /sales: Consulta todas las ventas.
   - GET /sales/:codigo: Consulta la venta correspondiente al código.
   - POST /sales: Crea una nueva venta.
   - PATCH /sales/:codigo: Actualiza la venta correspondiente al código.
   - DELETE /sales/:codigo: Elimina la venta correspondiente al código.

Rutas para Usuario:
   - GET /usuarios: Consulta todos los usuarios.
   - GET /usuarios/:codigo: Consulta el usuario correspondiente al código.
   - POST /usuarios: Crea un nuevo usuario
   - PATCH /usuarios/:codigo: Actualiza el usuario correspondiente al código.
   - DELETE /usuarios/:codigo: Elimina el usuario correspondiente al código.

Incluyendo manejo de errores de conexión y gestión de base de datos.

Configuración del frontend en React:
  - Implementando un componente que permita gestionar los productos (Crud de productos) - usuario administrador
  - Implementando un componente que permita gestionar las ventas (Crud de ventas) - usuario cliente
  - Implemente modulos de React para manejar la navegación del sitio entre rutas autenticadas y no autenticadas tales como react-router-dom.
  - Para la integración del frontend con el backend realice solicitudes HTTP al backend, implemente axios.

Autenticación:
  - Implementando la autenticación y autorización utilizando JSON Web Tokens (JWT) en tu backend Node para generar y verificar tokens JWT.
  - Implementando el inicio de sesión, renovación de tokens y cierre de sesión en tu frontend React.
  - Almacenar el token JWT en las Cookies para mantener la sesión del usuario.
