# admin-san-martin-porres

Sistema de Administración de cursos y personal para el Centro de Capacitación San Martín de Porres.
Servicio Comunitario

## Configurar la base de datos

1. Crea el archivo de la base de datos `<nombre>.db` en la raíz del proyecto

2. Crea un archivo `.env` en la raíz del proyecto con las variables de entorno:
- `DATABASE_URL` que contenga la URL de conexión a la base de datos. El formato es `file:<nombre>.db`
- `AUTH_SECRET` que contenga una cadena secreta para la autenticación.
- `ADMIN_PASS` que contenga la contraseña del administrador del sistema.

3. Crea el esquema de la base de datos ejecutando
   `npx drizzle-kit push`

## Comenzar con el desarrollo

1. Instala las dependencias:

```sh
npm install
```

2. Inicia el servidor de desarrollo:

```sh
npm run dev
```

3. Abre tu navegador en `http://localhost:5173/`.

## Conexión LAN

El sistema se estará ejecutando en una máquina principal pero también es posible acceder al sistema desde cualquier computadora conectada a la misma red.

Para ello colocar en el naveador `http://<tu-direccion-ip>:5173/`
