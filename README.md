# API de Boleteria - Festival Picnic 2026

Backend REST del modulo de boleteria para el Festival Picnic 2026. La API permite consultar, vender, actualizar y eliminar logicamente boletas, ademas de consultar la disponibilidad por dia.

## Equipo y aportes

Los siguientes integrantes aparecen registrados en el historial de Git del repositorio:

| Integrante | Aporte principal |
|---|---|
| Tomás Buriticá Jaramillo | Estructura inicial, configuracion de TypeScript/Prisma, sincronizacion del esquema, modelos, casos de uso, utilidades y servidor Express. |
| Juan Sebastian Pinilla Giraldo | Rutas, repositorio Prisma, separacion del controlador en la capa `interface` y correcciones de pruebas publicas. |
| Heiver David Ruales Luna | Validaciones, reglas de negocio, pruebas y configuracion de variables de entorno. |

## Tecnologias y arquitectura

- Node.js, Express y TypeScript.
- Prisma Client con PostgreSQL.
- Arquitectura en cuatro capas:
  - `src/domain`: modelos y contratos de repositorio.
  - `src/application`: casos de uso y reglas de negocio.
  - `src/infrastructure`: Prisma y acceso a PostgreSQL.
  - `src/interface`: controladores y rutas HTTP.

Los casos de uso dependen de `IBoletaRepository`, por lo que no conocen Prisma. El acceso a datos esta concentrado en `PrismaBoletaRepository`.

## Instalacion

Requisitos: Node.js 18 o superior y acceso a la base PostgreSQL compartida.

```bash
npm install
```

Crea un archivo `.env` a partir de `.env.example` y agrega las credenciales entregadas por el docente:

```env
DATABASE_URL="postgresql://usuario:CONTRASENA@host:5432/base_de_datos"
PORT=3000
```

Sincroniza el esquema existente y genera Prisma:

```bash
npm run sync
```

La base de datos es compartida. No ejecutes `prisma migrate` ni `prisma db push`.

## Ejecutar la API

```bash
npm run dev
```

La API queda disponible en `http://localhost:3000` o en el puerto definido por `PORT`.

## Endpoints principales

Base: `/api/boletas`

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/api/boletas` | Lista boletas activas con paginacion y filtros. |
| `GET` | `/api/boletas/:id` | Consulta una boleta activa. |
| `POST` | `/api/boletas` | Vende una boleta. |
| `PATCH` | `/api/boletas/:id` | Cambia el tipo y recalcula el precio. |
| `DELETE` | `/api/boletas/:id` | Realiza borrado logico. |
| `GET` | `/api/boletas/dia/:diaId/disponibilidad` | Consulta aforo, ventas y cupos disponibles. |

## Regla de negocio principal

Un asistente solo puede tener una boleta activa para el mismo dia y nunca se puede superar el aforo del dia.

Estas reglas estan implementadas en `src/application/createBoleta.use-case.ts`:

1. Se valida la existencia del asistente y del dia.
2. Se cuentan las boletas activas del dia y se rechaza la venta con `409` si el aforo esta lleno.
3. Se verifica si el asistente ya tiene una boleta activa para ese dia y se rechaza con `409` si existe.
4. El precio se calcula en el servidor segun el tipo: `GENERAL`, `VIP` o `PLATINO`.

Tambien se prueban estas reglas en `pruebas/boleteria/boletas.mjs`.

## Pruebas

Las pruebas publicas pertenecen al kit oficial de la maraton. Con `pruebas/correr.mjs` y `pruebas/lib.mjs` disponibles, ejecuta:

```bash
node pruebas/correr.mjs boleteria http://localhost:3000
```

El archivo especifico del modulo es `pruebas/boleteria/boletas.mjs`. En este repositorio debe estar presente el runner oficial del kit para ejecutar la suite HTTP completa.

La suite de pruebas ocultas es ejecutada por el docente contra la API y cubre validaciones, reglas de negocio y casos limite.

## Variables y seguridad

- `.env` contiene credenciales locales y no debe subirse a GitHub.
- `.env.example` documenta las variables necesarias sin incluir la contrasena real.
- El modulo solo escribe en la tabla `boletas` y lee las tablas relacionadas necesarias para validar asistentes y dias.
